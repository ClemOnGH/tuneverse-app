export async function searchQuery(type = 'track', q, limit = 0) {
    try {
        const query = await fetch(`https://api.spotify.com/v1/search?type=${type}&limit=${limit}&q=${q}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const res = await query.json();
        return res;
    } catch (e) {
        console.error(e);
    }
}

export async function getArtist(artistId) {
    try {
        const query = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const res = await query.json();
        return res;
    } catch (e) {
        console.error(e);
    }
}
