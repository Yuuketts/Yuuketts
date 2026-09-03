let cachedToken = null;
let tokenExpiresAt = 0;

const getAppAccessToken = async () => {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('As credenciais da Twitch não foram configuradas.');

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    })
  });
  if (!response.ok) throw new Error('Não foi possível autenticar na Twitch.');

  const { access_token: accessToken, expires_in: expiresIn } = await response.json();
  cachedToken = accessToken;
  tokenExpiresAt = Date.now() + Math.max(0, Number(expiresIn) - 120) * 1000;
  return cachedToken;
};

module.exports = async (request, response) => {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método não permitido.' });

  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = await getAppAccessToken();
    const twitchResponse = await fetch('https://api.twitch.tv/helix/streams?user_login=yuuketts', {
      headers: { 'Client-Id': clientId, Authorization: `Bearer ${accessToken}` }
    });
    if (!twitchResponse.ok) throw new Error('Não foi possível consultar o canal.');

    const { data } = await twitchResponse.json();
    const stream = data?.[0];
    response.setHeader('Cache-Control', 's-maxage=45, stale-while-revalidate=60');
    return response.status(200).json({
      live: Boolean(stream),
      viewerCount: stream?.viewer_count ?? 0,
      title: stream?.title ?? null,
      gameName: stream?.game_name ?? null
    });
  } catch (error) {
    return response.status(503).json({ live: false, error: 'Status indisponível.' });
  }
};
