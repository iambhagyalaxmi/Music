import { db } from './src/db';

async function main() {
  try {
    const playlist = await db.playlist.findUnique({
      where: { id: 'c361afad-44db-423f-ac30-c5af14617207' },
      include: {
        user: { include: { profile: true } },
        songs: {
          include: { song: { include: { artist: true } } },
          orderBy: { position: 'asc' },
        },
        _count: { select: { followers: true } },
      },
    });
    console.log("SUCCESS");
  } catch (e) {
    console.error("ERROR CAUGHT:");
    console.error(e);
  }
}
main();
