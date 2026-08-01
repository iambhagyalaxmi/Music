async function searchTMDB(name) {
  try {
    const res = await fetch('https://www.themoviedb.org/search/person?query=' + encodeURIComponent(name), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const text = await res.text();
    const match = text.match(/src="([^"]*image\.tmdb\.org\/t\/p\/w90_and_h90_face[^"]*)"/);
    if (match) {
      console.log(name, match[1].replace('w90_and_h90_face', 'w500'));
    } else {
      console.log(name, 'not found');
    }
  } catch (e) {
    console.error(e);
  }
}

(async () => {
  await searchTMDB('Arijit Singh');
  await searchTMDB('Bad Bunny');
  await searchTMDB('Drake');
  await searchTMDB('Taylor Swift');
  await searchTMDB('The Weeknd');
})();
