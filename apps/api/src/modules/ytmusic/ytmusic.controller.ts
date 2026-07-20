import { Router, Request, Response } from 'express';
import YTMusic from 'ytmusic-api';

const router = Router();
const ytmusic = new YTMusic();
let isInitialized = false;

// Initialize YTMusic API
const initializeYTMusic = async () => {
  if (isInitialized) return;
  try {
    await ytmusic.initialize();
    isInitialized = true;
    console.log('YTMusic API Initialized');
  } catch (error) {
    console.error('Failed to initialize YTMusic API:', error);
  }
};

// Start initialization immediately
initializeYTMusic();

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    if (!isInitialized) {
      await initializeYTMusic();
    }
    
    // Search specifically for music videos
    const results = await ytmusic.searchVideos(query);
    
    // Map to our expected standard format
    const formattedResults = results.map(track => ({
      id: track.videoId,
      trackId: track.videoId,
      title: track.name,
      artist: track.artist?.name || (track as any).author?.name || 'Unknown Artist',
      duration: (track.duration || 0) * 1000,
      thumbnail: track.thumbnails[track.thumbnails.length - 1]?.url || ''
    }));

    res.json({ items: formattedResults.slice(0, 5) });
  } catch (error) {
    console.error('YTMusic Search Error:', error);
    res.status(500).json({ error: 'Failed to search YouTube Music' });
  }
});

export const ytmusicRoutes = router;
