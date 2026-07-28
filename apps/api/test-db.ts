import { db } from './src/db';

async function main() {
  const playlists = await db.playlist.findMany({
    include: {
      _count: { select: { songs: true } },
      songs: true
    }
  });

  console.dir(playlists, { depth: null });
}

main()
  .catch(e => console.error(e))
  .finally(() => db.$disconnect());
