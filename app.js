// // Last.FM API : https://www.last.fm/api/intro
// // Spotify API : https://developer.spotify.com/documentation/web-api
// // Koel API : https://docs.koel.dev/guide/what-is-koel#installation

const loginButton = document.getElementById("spotify-auth");
const trackTitle = document.getElementById("track-title");
const album = document.getElementById("album-image");

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
    fetch(`http://localhost:3001/callback?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
            accessToken = data.access_token;
            localStorage.setItem("token", accessToken);
        })
        .catch((err) => {
            console.error(err);
        });
}

document.getElementById("spotify-auth").onclick = () => {
    if (!localStorage.getItem("hasToken")) {
        setTimeout(() => {
            window.location.href = "http://localhost:3001/login";
        }, 1000);
        localStorage.setItem("hasToken", true);
    } else {
        localStorage.clear();
        return;
    }
};

window.onload = async () => {
    const request = await fetch("https://api.spotify.com/v1/search?type=track&q=jme%20tire%20maitre%20gims&limit=1", {
        method: "GET",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const res = await request.json();
    let artists = [];

    for (artist of res.tracks.items[0].artists) {
        artists.push(artist.name);
    }

    trackTitle.innerHTML = `${res.tracks.items[0].name}<br><span style="color: rgba(255,255,255,0.4)">${artists.join(", ")}</span>`;
    album.src = res.tracks.items[0].album.images[0].url;
};
