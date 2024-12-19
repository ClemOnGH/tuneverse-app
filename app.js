// // Last.FM API : https://www.last.fm/api/intro
// // Spotify API : https://developer.spotify.com/documentation/web-api
// // Koel API : https://docs.koel.dev/guide/what-is-koel#installation

const loginButton = document.getElementById("spotify-auth");
const trackTitle = document.getElementById("track-title");
const album = document.getElementById("album-image");
let trackInfo;

loginButton.addEventListener("click", () => {
    window.location.href = "http://localhost:3001/login";
});

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
    fetch(`http://localhost:3001/callback?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            accessToken = data.access_token;
            output.textContent = "Access Token obtenu !";
            localStorage.setItem("token", accessToken);
        })
        .catch((err) => {
            output.textContent = "Erreur lors de l'obtention de l'access token.";
            console.error(err);
        });
}

window.onload = async () => {
    const request = await fetch("https://api.spotify.com/v1/search?type=track&q=jme%20tire%20maitre%20gims&limit=1", {
        method: "GET",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const res = await request.json();
    trackInfo = {
        title: "",
        artist: [],
        album: "",
    };

    console.log(res.tracks.items[0]);

    trackInfo.title = res.tracks.items[0].name;
    trackInfo.album = res.tracks.items[0].album.images[0].url;
    for (artist of res.tracks.items[0].artists) {
        trackInfo.artist.push(artist.name);
    }

    console.log(trackInfo);
    trackTitle.innerHTML = `${trackInfo.title}<br><span style="color: rgba(255,255,255,0.4)">${trackInfo.artist}</span>`;
    album.src = trackInfo.album;
};
