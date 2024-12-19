import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3001;

// Middleware
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
); // Autoriser le frontend à accéder au backend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Spotify API credentials
const CLIENT_ID = "20501cd4492c46d8b1e87c3b27d4822d"; // Ajoutez ces valeurs dans .env
const CLIENT_SECRET = "54b3e851104342368449b310c9a66e37";
const REDIRECT_URI = "http://localhost:5000"; // URL vers laquelle Spotify redirige

app.get("/", (req, res) => {
    res.send("<h1>test</h1>");
});
// Étape 1 : Rediriger vers Spotify pour obtenir le code d'autorisation
app.get("/login", (req, res) => {
    const scopes = "user-read-private user-read-email";
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
    res.redirect(spotifyAuthUrl); // Redirige l'utilisateur vers Spotify
});

// Étape 2 : Recevoir le code et échanger contre un access token
app.get("/callback", async (req, res) => {
    const code = req.query.code;

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
        }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
        res.send({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
        });
    } else {
        res.status(400).send("Error fetching token");
    }
});
// Étape 3 : API Proxy pour le client (obtenir des données Spotify)
app.get("/spotify/me", async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).send("Unauthorized");
    }

    const spotifyResponse = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await spotifyResponse.json();
    res.json(data); // Renvoyer les données Spotify au client
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
