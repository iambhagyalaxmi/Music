const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const account = await prisma.streamingAccount.findFirst({ where: { provider: 'spotify' } });
  if (!account) { console.log('No spotify account found in DB'); return; }
  console.log('Token expires at:', account.expiresAt);
  const res = await fetch('https://api.spotify.com/v1/search?q=soniyo&type=track&limit=5', {
    headers: { 'Authorization': 'Bearer ' + account.accessToken }
  });
  if (!res.ok) { console.log('Search failed:', res.status, await res.text()); return; }
  const data = await res.json();
  console.log('Search success. Found', data.tracks?.items?.length, 'tracks.');
}
test().catch(console.error).finally(() => prisma.$disconnect());
