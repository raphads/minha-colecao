import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url, 'from', req.ip);
  next();
});



// rota raiz
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// rota token
app.get("/token", async (req, res) => {
  try {
    const resp = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }).toString(),
    });

    const data = await resp.json();
    res.json({ access_token: data.access_token, expires_in: data.expires_in });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar token", details: err.message });
  }
});

// rota games
app.get("/games", async (req, res) => {
  try {
    const { search, platform } = req.query;

    // gera token
    const tokenResp = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }).toString(),
    });
    const { access_token } = await tokenResp.json();

    // consulta IGDB
    const resp = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        "Authorization": `Bearer ${access_token}`,
        "Accept": "application/json",
      },
 body: `fields id, name, first_release_date, cover.url, artworks.url, release_dates.region, involved_companies.company.name, summary;
       search "${search}";
       where platforms = (${platform});
       limit 10;`,


    });

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar jogos", details: err.message });
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
});
