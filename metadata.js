let spotifyQuery = document.getElementById('spotify-query');
let mdButton = document.getElementById('md-button');
let lyricsButton = document.getElementById('lyrics-button');
let cdButton = document.getElementById('devices-button');

let lyrics = document.getElementById('lyrics');
let divMD = document.getElementById('divMD');
let CD = document.getElementById('CD');

async function query(type = 'track', q, limit = 3) {
    const request = await fetch(`https://api.spotify.com/v1/search?type=${type}&q=${q}&limit=${limit}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const response = await request.json();
    console.log(response);

    if (type === 'track' && response.tracks.items.length > 0) {
        const track = response.tracks.items[0];
        return {
            title: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            tracks: track.album.total_tracks,
            img: track.album.images[0].url,
        };
    }
}

async function showMD() {
    const song = await query('track', 'francegall', 3);

    const { title, artist, album, tracks, img } = song;

    divMD.innerHTML = `
                        <div>
                            <h3>${artist}</h3>
                            <div id="title">
                                <div>
                                    <p>
                                        <img src="${img}" alt="" id="imgMD">
                                        (if liked)
                                    </p>
                                    <p>Titre : ${title}</p>
                                    <p>Album : ${album} (${tracks} pistes)</p>
                                </div>
                                <p>(number)</p>
                                <p>(song)</p>
                            </div>
                        </div>
                      `;

    if (divMD.classList.contains('hidden')) {
        divMD.classList.remove('hidden');
        divMD.classList.add('visible');
    } else {
        divMD.classList.remove('visible');
        divMD.classList.add('hidden');
    }

    lyrics.classList.remove('visible');
    lyrics.classList.add('hidden');
    CD.classList.remove('visible');
    CD.classList.add('hidden');
}

async function showLyrics() {
    lyrics.innerHTML = `
                        <h4>Paroles de chanson</h4>
                        <div>
                            <pre>lorem*10</pre>
                        </div>
                      `;

    if (lyrics.classList.contains('hidden')) {
        lyrics.classList.remove('hidden');
        lyrics.classList.add('visible');
    } else {
        lyrics.classList.remove('visible');
        lyrics.classList.add('hidden');
    }

    divMD.classList.remove('visible');
    divMD.classList.add('hidden');
    CD.classList.remove('visible');
    CD.classList.add('hidden');
}

async function showCD() {
    CD.innerHTML = `
                    <div class="bulle">
                        <h4>Se connecter à un appareil :</h4>
                        <div>
                            <p>Appareil actuel :</p>
                            <br />
                            <p>Périphérique High Definition Audio à partir de ce "PC"</p>
                        </div>
                        <div>
                            <p>Sélectionnez un autre appareil</p>
                        </div>
                        <div>
                            <p>Vous ne voyez pas votre appareil ?</p>
                        </div>
                    </div>
                  `;

    if (CD.classList.contains('hidden')) {
        CD.classList.remove('hidden');
        CD.classList.add('visible');
    } else {
        CD.classList.remove('visible');
        CD.classList.add('hidden');
    }

    divMD.classList.remove('visible');
    divMD.classList.add('hidden');
    lyrics.classList.remove('visible');
    lyrics.classList.add('hidden');
}

mdButton.addEventListener('click', async () => {
    await showMD();
});

lyricsButton.addEventListener('click', async () => {
    await showLyrics();
});

cdButton.addEventListener('click', async () => {
    await showCD();
});

spotifyQuery.addEventListener('focus', () => {
    if (CD.classList.contains('visible')) {
        CD.style.right = '-15%';
    }
    if (divMD.classList.contains('visible')) {
        divMD.style.right = '-15%';
    }
    if (lyrics.classList.contains('visible')) {
        lyrics.style.right = '-35%';
    }
});

spotifyQuery.addEventListener('blur', () => {
    if (CD.classList.contains('visible')) {
        CD.style.right = '';
    }
    if (divMD.classList.contains('visible')) {
        divMD.style.right = '';
    }
    if (lyrics.classList.contains('visible')) {
        lyrics.style.right = '';
    }
});

//

// spotifyQuery.addEventListener("focus", () => {
//     if(CD.classList.contains("visible")) {
//         CD.style.right = "-15%"
//     }
//     if(divMD.classList.contains("visible")) {
//         divMD.style.right = "-5%"
//     } else {
//         divMD.style.right = "0%"
//     }
//     if(lyrics.classList.contains("visible")) {
//         lyrics.style.right = "-15%"
//     }
// })
