export async function getIGDBToken() {
  const CLIENT_ID = "4abem2xoy7iyo07s9s0qu1m9m8jyw5";
  const CLIENT_SECRET = "tr6gq5i8orslr6iznhm60qr4xwac7x";

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
  return data.access_token;
  
  
}
