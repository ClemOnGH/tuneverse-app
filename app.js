// Last.FM API : https://www.last.fm/api/intro
// Spotify API : https://developer.spotify.com/documentation/web-api
// Koel API : https://docs.koel.dev/guide/what-is-koel#installation

const spotify = {
    redirectUri: "http://localhost:5000",
    clientID: "20501cd4492c46d8b1e87c3b27d4822d",
    responseType: "code",
    clientSecret: "54b3e851104342368449b310c9a66e37",
    url: `https://accounts.spotify.com/authorize?`,
    scopes: ["user-read-private", "user-read-email"],
};

const songs = [
    { title: "All I Want For Christmas Is You", artist: ["Mariah Carey"], album: "./albums/mariah_carey.jpg" },
    { title: "The Tale Of A Cruel World", artist: ["DM DOKURO"], album: "./albums/dm_dokuro.jpg" },
    { title: "Shine On", artist: ["Kaskade", "Wilkinson", "Paige Cavell"], album: "./albums/kaskade.jpg" },
];

const albumArea = document.getElementById("album");
const songTitle = document.getElementsByClassName("song-title")[0];
const songArtist = document.getElementsByClassName("song-artist")[0];

const authButton = document.getElementById("spotify-auth");

authButton.addEventListener("click", () => {
    const state = generateRandomString(16);
    localStorage.setItem("spotify_auth_state", state);

    window.location = spotify.url + `response_type=${spotify.responseType}&client_id=${spotify.clientID}&redirect_uri=${spotify.redirectUri}&state=${state}`;
});

window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const request = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: {
            code: code,
            redirect_uri: spotify.redirectUri,
            grant_type: "authorization_code",
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "authorization": "Basic " + btoa(spotify.clientID + ":" + spotify.clientSecret),
            "content": {},
        },
    });
    const response = (await request).json();
    console.log(response);
};

function generateRandomString(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
