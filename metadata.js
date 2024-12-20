let lyricsButton = document.getElementById('lyrics-button');
let metaData = document.getElementById('metadata');
let lyrics = document.getElementById('lyrics');

async function query(type = 'artist', q, limit = 3) {
    const request = await fetch(`https://api.spotify.com/v1/search?type=${type}&q=${q}&limit=${limit}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    
    if (!request.ok) {
        console.error("Erreur dans la requête :", request.statusText);
        return "Erreur lors de la récupération des données.";
    }
    
    const response = await request.json();
    
    if (type === 'artist' && response.artists.items.length > 0) {
        return `Artiste : ${response.artists.items[0].name}`;
    } else if (type === 'track' && response.tracks.items.length > 0) {
        return `Titre : ${response.tracks.items[0].name}`;
    }
    
    return "Aucun résultat trouvé.";
}

async function test() {
    const lyricsText = await query('artist', 'GIMS', 3); 
    lyrics.innerHTML = `
    <h4>Lyrics</h4>
    <div>
        <pre>${lyricsText}</pre>
    </div>
    `;
}

lyricsButton.addEventListener('click', async () => {
    await test(); 
    lyrics.classList.toggle('visible');
});

