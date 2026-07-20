import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding SoundSphere database...');

  // ── Languages ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.language.upsert({ where: { code: 'en' }, update: {}, create: { name: 'English', code: 'en' } }),
    prisma.language.upsert({ where: { code: 'hi' }, update: {}, create: { name: 'Hindi',   code: 'hi' } }),
    prisma.language.upsert({ where: { code: 'es' }, update: {}, create: { name: 'Spanish', code: 'es' } }),
    prisma.language.upsert({ where: { code: 'fr' }, update: {}, create: { name: 'French',  code: 'fr' } }),
  ]);

  // ── Genres ────────────────────────────────────────────────────────────
  const genres = await Promise.all([
    prisma.genre.upsert({ where: { slug: 'pop'       }, update: {}, create: { name: 'Pop',       slug: 'pop'       } }),
    prisma.genre.upsert({ where: { slug: 'hiphop'    }, update: {}, create: { name: 'Hip-Hop',   slug: 'hiphop'    } }),
    prisma.genre.upsert({ where: { slug: 'rock'      }, update: {}, create: { name: 'Rock',      slug: 'rock'      } }),
    prisma.genre.upsert({ where: { slug: 'edm'       }, update: {}, create: { name: 'EDM',       slug: 'edm'       } }),
    prisma.genre.upsert({ where: { slug: 'classical' }, update: {}, create: { name: 'Classical', slug: 'classical' } }),
    prisma.genre.upsert({ where: { slug: 'jazz'      }, update: {}, create: { name: 'Jazz',      slug: 'jazz'      } }),
    prisma.genre.upsert({ where: { slug: 'rnb'       }, update: {}, create: { name: 'R&B',       slug: 'rnb'       } }),
    prisma.genre.upsert({ where: { slug: 'bollywood' }, update: {}, create: { name: 'Bollywood', slug: 'bollywood' } }),
  ]);

  // ── Artists ───────────────────────────────────────────────────────────
  const daftPunk = await prisma.artist.upsert({
    where: { slug: 'daft-punk' }, update: {},
    create: { name: 'Daft Punk', slug: 'daft-punk', bio: 'Legendary French electronic duo.', isVerified: true, country: 'FR' },
  });

  const taylorSwift = await prisma.artist.upsert({
    where: { slug: 'taylor-swift' }, update: {},
    create: { name: 'Taylor Swift', slug: 'taylor-swift', bio: 'American singer-songwriter.', isVerified: true, country: 'US' },
  });

  const hansZimmer = await prisma.artist.upsert({
    where: { slug: 'hans-zimmer' }, update: {},
    create: { name: 'Hans Zimmer', slug: 'hans-zimmer', bio: 'German film score composer.', isVerified: true, country: 'DE' },
  });

  // ── Albums ────────────────────────────────────────────────────────────
  const randomAccess = await prisma.album.upsert({
    where: { spotifyId: 'dp-ram-2013' }, update: {},
    create: {
      artistId: daftPunk.id, title: 'Random Access Memories', slug: 'random-access-memories',
      albumType: 'album', spotifyId: 'dp-ram-2013', releaseDate: new Date('2013-05-17'),
    },
  });

  const midnights = await prisma.album.upsert({
    where: { spotifyId: 'ts-midnights-2022' }, update: {},
    create: {
      artistId: taylorSwift.id, title: 'Midnights', slug: 'midnights',
      albumType: 'album', spotifyId: 'ts-midnights-2022', releaseDate: new Date('2022-10-21'),
    },
  });

  // ── Songs ─────────────────────────────────────────────────────────────
  const getLucky = await prisma.song.upsert({
    where: { isrc: 'USQX91300068' }, update: {},
    create: {
      artistId: daftPunk.id, albumId: randomAccess.id,
      title: 'Get Lucky', slug: 'get-lucky', durationMs: 369000, trackNumber: 8,
      isrc: 'USQX91300068', youtubeId: '5NV6Rdv1h3Q', playCount: 1500000000n,
    },
  });

  const cruelSummer = await prisma.song.upsert({
    where: { isrc: 'USUG11901634' }, update: {},
    create: {
      artistId: taylorSwift.id, albumId: midnights.id,
      title: 'Cruel Summer', slug: 'cruel-summer', durationMs: 178000, trackNumber: 2,
      isrc: 'USUG11901634', youtubeId: 'ic8j13piAhQ', playCount: 3000000000n,
    },
  });

  const time = await prisma.song.upsert({
    where: { isrc: 'GBCEL0900232' }, update: {},
    create: {
      artistId: hansZimmer.id,
      title: 'Time', slug: 'time', durationMs: 268000,
      isrc: 'GBCEL0900232', youtubeId: 'RxabLA7UQ9k', playCount: 500000000n,
    },
  });

  // ── Song Genres ───────────────────────────────────────────────────────
  await Promise.all([
    prisma.songGenre.upsert({ where: { songId_genreId: { songId: getLucky.id,    genreId: genres[3].id } }, update: {}, create: { songId: getLucky.id,    genreId: genres[3].id } }),
    prisma.songGenre.upsert({ where: { songId_genreId: { songId: cruelSummer.id, genreId: genres[0].id } }, update: {}, create: { songId: cruelSummer.id, genreId: genres[0].id } }),
    prisma.songGenre.upsert({ where: { songId_genreId: { songId: time.id,        genreId: genres[4].id } }, update: {}, create: { songId: time.id,        genreId: genres[4].id } }),
  ]);

  // ── Demo Users ────────────────────────────────────────────────────────
  const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@soundsphere.io' }, update: {},
    create: {
      email: 'demo@soundsphere.io', username: 'demo_user',
      role: 'USER', emailVerified: true,
      profile: { create: { displayName: 'Demo User', bio: 'Exploring SoundSphere! 🎵', isPublic: true } },
      subscription: { create: { tier: 'FREE_TRIAL', status: 'TRIAL', trialStartedAt: new Date(), trialEndsAt: trialEnd } },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@soundsphere.io' }, update: {},
    create: {
      email: 'admin@soundsphere.io', username: 'soundsphere_admin',
      role: 'ADMIN', emailVerified: true,
      profile: { create: { displayName: 'SoundSphere Admin', isPublic: false } },
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

  // ── Featured Playlist ─────────────────────────────────────────────────
  const featured = await prisma.playlist.upsert({
    where: { id: 'seed-featured-001' }, update: {},
    create: {
      id: 'seed-featured-001', userId: adminUser.id,
      title: '🔥 SoundSphere Featured', description: 'Handpicked hits by our team.',
      isPublic: true, isOfficial: true,
    },
  });

  await prisma.playlistSong.upsert({ where: { playlistId_songId: { playlistId: featured.id, songId: getLucky.id    } }, update: {}, create: { playlistId: featured.id, songId: getLucky.id,    position: 1, addedById: adminUser.id } });
  await prisma.playlistSong.upsert({ where: { playlistId_songId: { playlistId: featured.id, songId: cruelSummer.id } }, update: {}, create: { playlistId: featured.id, songId: cruelSummer.id, position: 2, addedById: adminUser.id } });
  await prisma.playlistSong.upsert({ where: { playlistId_songId: { playlistId: featured.id, songId: time.id        } }, update: {}, create: { playlistId: featured.id, songId: time.id,        position: 3, addedById: adminUser.id } });

  // ── Recommendation Model ──────────────────────────────────────────────
  await prisma.recommendationModel.upsert({
    where: { name: 'collaborative-filtering-v1' }, update: {},
    create: {
      name: 'collaborative-filtering-v1', version: '1.0.0',
      description: 'Basic collaborative filtering based on listening history.',
      isActive: true,
    },
  });

  // ── System Settings ───────────────────────────────────────────────────
  await Promise.all([
    prisma.systemSetting.upsert({ where: { key: 'trial_duration_days'  }, update: {}, create: { key: 'trial_duration_days',  value: 30 } }),
    prisma.systemSetting.upsert({ where: { key: 'max_free_playlists'   }, update: {}, create: { key: 'max_free_playlists',   value: 5  } }),
    prisma.systemSetting.upsert({ where: { key: 'max_queue_size'       }, update: {}, create: { key: 'max_queue_size',       value: 50 } }),
    prisma.systemSetting.upsert({ where: { key: 'chat_retention_days'  }, update: {}, create: { key: 'chat_retention_days',  value: 7  } }),
  ]);

  console.log('\n✅ Seed complete!');
  console.log(`   🎤 Artists : ${[daftPunk, taylorSwift, hansZimmer].map(a => a.name).join(', ')}`);
  console.log(`   🎵 Songs   : ${[getLucky, cruelSummer, time].map(s => s.title).join(', ')}`);
  console.log(`   🎧 Genres  : ${genres.map(g => g.name).join(', ')}`);
  console.log(`   👤 Users   : ${[demoUser, adminUser].map(u => u.email).join(', ')}`);
  console.log(`   📋 Playlist: ${featured.title}`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
