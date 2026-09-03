module.exports = async (request, response) => {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método não permitido.' });

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'A chave do YouTube não foi configurada.' });

  try {
    const query = new URLSearchParams({
      part: 'statistics',
      forHandle: '@Yuuketts',
      key: apiKey
    });
    const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?${query}`);
    if (!youtubeResponse.ok) throw new Error('Não foi possível consultar o canal.');

    const { items } = await youtubeResponse.json();
    const subscriberCount = Number(items?.[0]?.statistics?.subscriberCount);
    if (!Number.isFinite(subscriberCount)) throw new Error('Contagem indisponível.');

    response.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=180');
    return response.status(200).json({ subscriberCount });
  } catch (error) {
    return response.status(503).json({ error: 'Contagem indisponível.' });
  }
};
