import YTMusic from 'ytmusic-api';
import fs from 'fs';
import path from 'path';

async function run() {
  const yt = new YTMusic();
  await yt.initialize();
  
  console.log("Searching playlists...");
  const searchResults = await yt.searchPlaylists("Global Top 50");
  const playlistId = searchResults[0].playlistId;
  
  console.log(`Fetching videos for playlist ${playlistId}...`);
  const videos = await yt.getPlaylistVideos(playlistId);
  
  const top50 = videos.slice(0, 50).map(v => ({
    trackId: v.videoId,
    songTitle: v.name,
    artist: v.artist?.name || 'Unknown',
    cover: v.thumbnails[v.thumbnails.length - 1]?.url
  }));
  
  const pagePath = path.resolve(__dirname, '../web/app/dashboard/page.tsx');
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Replace the playlist array for Global Top 50
  const regex = /title:\s*'Global Top 50'[\s\S]*?playlist:\s*\[[\s\S]*?\]\s*\n\s*\}/m;
  const replacement = `title: 'Global Top 50', \n      type: 'Playlist', \n      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',\n      playlist: ${JSON.stringify(top50, null, 8)}\n    }`;
  
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log("Updated Global Top 50 in page.tsx successfully!");
  } else {
    console.error("Could not find the target string in page.tsx");
  }
}

run().catch(console.error);
