import fetch from "node-fetch"; // se estiver usando Node 18+, pode usar global fetch

const CLIENT_ID = "SEU_CLIENT_ID";
const CLIENT_SECRET = "SEU_CLIENT_SECRET";

async function getToken() {
  const resp = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  const data = await resp.json();
  console.log("Access Token:", data.access_token);
  console.log("Expira em (segundos):", data.expires_in);
}

getToken();
