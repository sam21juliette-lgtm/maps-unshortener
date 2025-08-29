const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/unshorten", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const response = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    });

    const redirectUrl = response.headers.location;
    if (!redirectUrl) return res.status(400).json({ error: "Pas de redirection trouvée" });

    return res.json({ longUrl: redirectUrl });
  } catch (err) {
    console.error("Erreur :", err.message);
    return res.status(500).json({ error: "Erreur lors du traitement du lien" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
