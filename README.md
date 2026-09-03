# Site pessoal — Yuuketts

Site estático em HTML, CSS e JavaScript, com uma função serverless da Vercel para mostrar o status ao vivo da Twitch.

## Publicar no GitHub e Vercel

1. Crie um repositório no GitHub e envie o conteúdo desta pasta (`site-pessoal`).
2. Na Vercel, importe esse repositório. Se o repositório incluir a pasta `outputs`, defina `outputs/site-pessoal` como **Root Directory**.
3. Crie uma aplicação em [Twitch Developers](https://dev.twitch.tv/console/apps) e uma chave na [Google Cloud Console](https://console.cloud.google.com/apis/credentials). No painel da Vercel, adicione as variáveis de ambiente:
   - `TWITCH_CLIENT_ID`
   - `TWITCH_CLIENT_SECRET`
   - `YOUTUBE_API_KEY`
4. Faça um novo deploy. A função `/api/twitch-status` passa a informar automaticamente se `yuuketts` está ao vivo.

A função `/api/youtube-subscribers` atualiza os inscritos do canal automaticamente a cada cinco minutos.

As variáveis de ambiente não devem ser enviadas ao GitHub.
