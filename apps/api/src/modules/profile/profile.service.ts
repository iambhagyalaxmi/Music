import { db } from '../../db';

export async function getProfileStatistics(userId: string) {
  const [user, videosWatchedCount, listeningHistoryAggregate, listeningDates] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      include: {
        userStatistics: true,
        userPreferences: true,
        _count: {
          select: {
            playlists: true,
            friends: {
              where: {
                friend: {
                  blockedBy: { none: { blockerId: userId } },
                  blockedUsers: { none: { blockedId: userId } }
                }
              }
            },
            conversationMembers: {
              where: {
                conversation: {
                  isGroup: true
                }
              }
            },
            likedSongs: true,
            downloadedSongs: true,
            searchHistory: true,
            listeningHistory: true,
          }
        }
      }
    }),
    db.userActivity.count({
      where: {
        userId,
        activityType: 'VIDEO_WATCHED'
      }
    }),
    db.listeningHistory.aggregate({
      where: { userId },
      _sum: { durationMs: true }
    }),
    db.listeningHistory.findMany({
      where: { userId },
      select: {
        listenedAt: true,
        song: {
          select: {
            artist: {
              select: { name: true }
            },
            songGenres: {
              select: {
                genre: {
                  select: { name: true }
                }
              }
            }
          }
        }
      },
      orderBy: { listenedAt: 'desc' }
    })
  ]);

  if (!user) {
    return null;
  }

  const stats = user.userStatistics as any;
  const totalListeningMs = listeningHistoryAggregate._sum.durationMs || 0;
  const totalListeningSecs = Math.floor(totalListeningMs / 1000);

  let streak = 0;
  let averageDailyListeningSecs = 0;
  let favoriteGenre = user.userPreferences?.favoriteGenres?.[0] || null;
  let favoriteArtist = user.userPreferences?.favoriteArtists?.[0] || null;

  if (listeningDates.length > 0) {
    const dates = [...new Set(listeningDates.map((h: any) => h.listenedAt.toISOString().split('T')[0]))];
    
    averageDailyListeningSecs = Math.floor(totalListeningSecs / dates.length);
    
    const genreCounts: Record<string, number> = {};
    const artistCounts: Record<string, number> = {};
    
    for (const h of listeningDates as any[]) {
      if (h.song?.songGenres) {
        for (const sg of h.song.songGenres) {
          const genreName = sg.genre?.name;
          if (genreName) {
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
          }
        }
      }
      
      const artistName = h.song?.artist?.name;
      if (artistName) {
        artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
      }
    }

    let maxGenreCount = 0;
    for (const [genre, count] of Object.entries(genreCounts)) {
      if (count > maxGenreCount) {
        maxGenreCount = count;
        favoriteGenre = genre;
      }
    }
    
    let maxArtistCount = 0;
    for (const [artist, count] of Object.entries(artistCounts)) {
      if (count > maxArtistCount) {
        maxArtistCount = count;
        favoriteArtist = artist;
      }
    }
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dates[0] === todayStr || dates[0] === yesterdayStr) {
      streak = 1;
      let currentDate = new Date(dates[0]);
      for (let i = 1; i < dates.length; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        const expectedStr = currentDate.toISOString().split('T')[0];
        if (dates[i] === expectedStr) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    songsPlayed: user._count?.listeningHistory || 0,
    videosWatched: videosWatchedCount || 0,
    listeningTime: totalListeningSecs,
    playlistCount: user._count?.playlists || 0,
    friends: user._count?.friends || 0,
    roomsJoined: user._count?.conversationMembers || 0,
    songsLiked: user._count?.likedSongs || 0,
    downloads: user._count?.downloadedSongs || 0,
    searches: user._count?.searchHistory || 0,
    streak: streak,
    averageDailyListening: averageDailyListeningSecs,
    favoriteGenre: favoriteGenre,
    favoriteArtist: favoriteArtist,
  };
}
