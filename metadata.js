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
    const song = await query('track', 'hier encore', 3);

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
                                <p>(liste d'attente)</p>
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
                            <pre>Hier encore J'avais vingt ans, je caressais le temps et jouais de la vie comme on joue de l'amour et je vivais la nuit sans compter sur mes jours qui fuyaient dans le temps j'ai fait tant de projets qui sont restés en l'air j'ai fondé tant d'espoirs qui se sont envolés que je reste perdu, ne sachant où aller les yeux cherchant le ciel mais le cœur mis en terre hier encore j'avais vingt ans, je gaspillais le temps en croyant l'arrêter et pour le retenir, même le devancer je n'ai fait que courir et me suis essoufflé ignorant le passé conjuguant au futur je précédais de moi toute conversation et donnais mon avis que je voulais le bon pour critiquer le monde avec désinvolture hier encore j'avais vingt ans mais j'ai perdu mon temps à faire des folies qui ne me laissent au fond rien de vraiment précis que quelques rides au front et la peur de l'ennui car mes amours sont mortes avant que d'exister mes amis sont partis et ne reviendront pas par ma faute, j'ai fait le vide autour de moi et j'ai gâché ma vie et mes jeunes années Du meilleur et du pire en rejetant le meilleur j'ai figé mes sourires et j'ai glacé mes pleurs où sont-ils à présent? à présent Mes vingt ans</pre>
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
