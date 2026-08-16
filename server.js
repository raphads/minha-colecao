import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('Aviso: TWITCH_CLIENT_ID ou TWITCH_CLIENT_SECRET não definidos. Configure via .env ou variáveis de ambiente.');
}
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json());
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url, 'from', req.ip);
  next();
});

/**
 * Token cache simples em memória
 * { token: string, expiresAt: number (ms since epoch) }
 */
let tokenCache = null;

async function fetchTwitchToken() {
  // Retorna token do cache se válido
  if (tokenCache && tokenCache.expiresAt > Date.now() + 5000) {
    return tokenCache.token;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Twitch client id/secret não configurados');
  }

  const resp = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    }).toString()
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Erro ao obter token Twitch: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  if (!data.access_token) throw new Error('Resposta Twitch sem access_token');

  // cacheia token com margem de segurança (expires_in em segundos)
  const expiresIn = Number(data.expires_in) || 3600;
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (expiresIn * 1000)
  };

  return tokenCache.token;
}

// rota raiz
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// rota token (opcional, útil para debug)
app.get('/token', async (req, res) => {
  try {
    const token = await fetchTwitchToken();
    res.json({ access_token: token });
  } catch (err) {
    console.error('/token error:', err);
    res.status(500).json({ error: 'Erro ao gerar token', details: err.message });
  }
});

// rota games
app.get('/games', async (req, res) => {
  try {
    const rawSearch = req.query.search;
    const rawPlatform = req.query.platform;

    if (!rawSearch || String(rawSearch).trim() === '') {
      return res.status(400).json({ error: "Parâmetro 'search' é obrigatório" });
    }

    // sanitize básico
    const search = String(rawSearch).trim().replace(/["\\]/g, '');
    let platformClause = '';
    if (rawPlatform) {
      // aceita "6" ou "6,48" etc.
      const sanitized = String(rawPlatform)
        .split(',')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => p.replace(/[^\d]/g, '')) // só números
        .filter(Boolean)
        .join(',');
      if (sanitized) platformClause = `where platforms = (${sanitized});`;
    }

    const access_token = await fetchTwitchToken();

    const body = [
      'fields id, name, first_release_date, cover.url, artworks.url, release_dates.region, involved_companies.company.name, summary;',
      `search "${search}";`,
      platformClause,
      'limit 10;'
    ].filter(Boolean).join('\n');

    const resp = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      },
      body
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('IGDB error:', resp.status, text);
      return res.status(502).json({ error: 'Erro na API IGDB', status: resp.status, details: text });
    }

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error('/games error:', err);
    res.status(500).json({ error: 'Erro ao buscar jogos', details: err.message });
  }
});

/**
 * Servir frontend estático se existir (build do Expo/React web em 'dist')
 * Gere o build localmente com: npx expo export  (gera dist/)
 * Ou ajuste para 'web-build' se for o seu caso.
 */
const staticDir = path.join(__dirname, 'dist');
import fs from 'fs';
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
} else {
  console.log('Pasta de build estática não encontrada em /dist — o servidor continuará servindo apenas a API.');
}

// Graceful shutdown
function shutdown() {
  console.log('Shutting down server...');
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
