import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Languages ───────────────────────────────────────────────────────────
  const [english, hindi, spanish] = await Promise.all([
    prisma.language.upsert({ where: { code: 'en' }, update: {}, create: { name: 'English', code: 'en' } }),
    prisma.language.upsert({ where: { code: 'hi' }, update: {}, create: { name: 'Hindi',   code: 'hi' } }),
    prisma.language.upsert({ where: { code: 'es' }, update: {}, create: { name: 'Spanish',  code: 'es' } }),
  ]);

  // ── Genres ──────────────────────────────────────────────────────────────
  const genres = await Promise.all([
    prisma.genre.upsert({ where: { slug: 'pop'      }, update: {}, create: { name: 'Pop',       slug: 'pop'      } }),
    prisma.genre.upsert({ where: { slug: 'hiphop'   }, update: {}, create: { name: 'Hip-Hop',   slug: 'hiphop'   } }),
    prisma.genre.upsert({ where: { slug: 'rock'     }, update: {}, create: { name: 'Rock',      slug: 'rock'     } }),
    prisma.genre.upsert({ where: { slug: 'edm'      }, update: {}, create: { name: 'EDM',       slug: 'edm'      } }),
    prisma.genre.upsert({ where: { slug: 'classical'}, update: {}, create: { name: 'Classical', slug: 'classical'} }),
    prisma.genre.upsert({ where: { slug: 'jazz'     }, update: {}, create: { name: 'Jazz',      slug: 'jazz'     } }),
    prisma.genre.upsert({ where: { slug: 'rnb'      }, update: {}, create: { name: 'R&B',       slug: 'rnb'      } }),
    prisma.genre.upsert({ where: { slug: 'bollywood'}, update: {}, create: { name: 'Bollywood', slug: 'bollywood'} }),
  ]);

  // ── Artists ─────────────────────────────────────────────────────────────
  const daftPunk = await prisma.artist.upsert({
    where: { slug: 'daft-punk' },
    update: {},
    create: {
      name: 'Daft Punk', slug: 'daft-punk',
      bio: 'Legendary French electronic duo.',
      isVerified: true, country: 'FR',
    },
  });

  const taylorSwift = await prisma.artist.upsert({
    where: { slug: 'taylor-swift' },
    update: {},
    create: {
      name: 'Taylor Swift', slug: 'taylor-swift',
      bio: 'American singer-songwriter.',
      isVerified: true, country: 'US',
    },
  });

  const hansZimmer = await prisma.artist.upsert({
    where: { slug: 'hans-zimmer' },
    update: {},
    create: {
      name: 'Hans Zimmer', slug: 'hans-zimmer',
      bio: 'German film score composer.',
      isVerified: true, country: 'DE',
    },
  });

  // ── Albums ──────────────────────────────────────────────────────────────
  const randomAccess = await prisma.album.upsert({
    where: { spotifyId: 'dp-ram-2013' },
    update: {},
    create: {
      artistId: daftPunk.id,
      title: 'Random Access Memories', slug: 'random-access-memories',
      albumType: 'album', spotifyId: 'dp-ram-2013',
      releaseDate: new Date('2013-05-17'),
    },
  });

  const midnights = await prisma.album.upsert({
    where: { spotifyId: 'ts-midnights-2022' },
    update: {},
    create: {
      artistId: taylorSwift.id,
      title: 'Midnights', slug: 'midnights',
      albumType: 'album', spotifyId: 'ts-midnights-2022',
      releaseDate: new Date('2022-10-21'),
    },
  });

  // ── Songs ───────────────────────────────────────────────────────────────
  const getLucky = await prisma.song.upsert({
    where: { isrc: 'USQX91300068' },
    update: {},
    create: {
      artistId: daftPunk.id, albumId: randomAccess.id,
      title: 'Get Lucky', slug: 'get-lucky',
      durationMs: 369000, trackNumber: 8,
      isrc: 'USQX91300068', youtubeId: '5NV6Rdv1h3Q',
      playCount: 1500000000n,
    },
  });

  const cruelSummer = await prisma.song.upsert({
    where: { isrc: 'USUG11901634' },
    update: {},
    create: {
      artistId: taylorSwift.id, albumId: midnights.id,
      title: 'Cruel Summer', slug: 'cruel-summer',
      durationMs: 178000, trackNumber: 2,
      isrc: 'USUG11901634', youtubeId: 'ic8j13piAhQ',
      playCount: 3000000000n,
    },
  });

  // ── Song Genre Tags ──────────────────────────────────────────────────────
  const [edmGenre, popGenre] = [genres[3], genres[0]];

  await Promise.all([
    prisma.songGenre.upsert({
      where: { songId_genreId: { songId: getLucky.id, genreId: edmGenre.id } },
      update: {}, create: { songId: getLucky.id, genreId: edmGenre.id },
    }),
    prisma.songGenre.upsert({
      where: { songId_genreId: { songId: cruelSummer.id, genreId: popGenre.id } },
      update: {}, create: { songId: cruelSummer.id, genreId: popGenre.id },
    }),
  ]);

  // ── Demo Users ──────────────────────────────────────────────────────────
  const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@soundsphere.io' },
    update: {},
    create: {
      email: 'demo@soundsphere.io',
      username: 'demo_user',
      role: 'USER',
      emailVerified: true,
      profile: {
        create: { displayName: 'Demo User', bio: 'Exploring SoundSphere!', isPublic: true },
      },
      subscription: {
        create: {
          tier: 'FREE_TRIAL', status: 'TRIAL',
          trialStartedAt: new Date(), trialEndsAt: trialEnd,
        },
      },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@soundsphere.io' },
    update: {},
    create: {
      email: 'admin@soundsphere.io',
      username: 'soundsphere_admin',
      role: 'ADMIN',
      emailVerified: true,
      profile: {
        create: { displayName: 'SoundSphere Admin', isPublic: false },
      },
      subscription: {
        create: {
          tier: 'PREMIUM', status: 'ACTIVE',
          trialStartedAt: new Date(), trialEndsAt: trialEnd,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  // ── Demo Playlist ────────────────────────────────────────────────────────
  const featuredPlaylist = await prisma.playlist.upsert({
    where: { id: 'seed-featured-playlist' },
    update: {},
    create: {
      id: 'seed-featured-playlist',
      userId: adminUser.id,
      title: 'SoundSphere Featured',
      description: 'The best songs picked by our team.',
      isPublic: true, isOfficial: true,
    },
  });

  await prisma.playlistSong.upsert({
    where: { playlistId_songId: { playlistId: featuredPlaylist.id, songId: getLucky.id } },
    update: {},
    create: { playlistId: featuredPlaylist.id, songId: getLucky.id, position: 1, addedById: adminUser.id },
  });

  await prisma.playlistSong.upsert({
    where: { playlistId_songId: { playlistId: featuredPlaylist.id, songId: cruelSummer.id } },
    update: {},
    create: { playlistId: featuredPlaylist.id, songId: cruelSummer.id, position: 2, addedById: adminUser.id },
  });

  // ── System Settings ──────────────────────────────────────────────────────
  await prisma.systemSetting.upsert({
    where: { key: 'trial_duration_days' },
    update: {},
    create: { key: 'trial_duration_days', value: 30 },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'max_free_playlists' },
    update: {},
    create: { key: 'max_free_playlists', value: 5 },
  });

  console.log('✅ Seed complete!');
  console.log(`   Artists: ${[daftPunk, taylorSwift, hansZimmer].map(a => a.name).join(', ')}`);
  console.log(`   Songs: ${[getLucky, cruelSummer].map(s => s.title).join(', ')}`);
  console.log(`   Users: ${[demoUser, adminUser].map(u => u.email).join(', ')}`);
  console.log(`   Genres: ${genres.map(g => g.name).join(', ')}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
