const BASE_URL = 'http://localhost:3000/playlists';
const navbarPlaylists = document.getElementById('navbar-playlists');

(async () => {
    try {
        const req = await getAllPlaylists();
        req.forEach((playlist) => {
            const p = document.createElement('p');
            p.textContent = playlist.name;
            p.style.fontSize = '14px';
            navbarPlaylists.appendChild(p);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();

async function doesPlaylistExist(playlistName) {
    try {
        const req = await fetch(BASE_URL);
        const playlists = await req.json();

        const exists = playlists.some((playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase());
        console.log(`Playlist ${playlistName} exists:`, exists);
        return exists;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function createPlaylist(name) {
    try {
        const exists = await doesPlaylistExist(name);

        if (exists) {
            console.log(`A playlist named ${name} already exists.`);
            return;
        }

        const req = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name, songs: [] }),
        });
        const res = await req.json();
        console.log(`Playlist created succesfully:`, res);
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function addSongToPlaylist(playlistId, song) {
    try {
        const req = await fetch(`${BASE_URL}/${playlistId}`);
        const playlist = await req.json();

        playlist.songs.push(song);

        const res = await fetch(`${BASE_URL}/${playlistId}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(playlist),
        });
        const rep = await res.json();
        console.log('Song added to playlist: ', rep);
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function removeSongFromPlaylist(playlistId, songId) {
    try {
        const req = await fetch(`${BASE_URL}/${playlistId}`);
        const playlist = await req.json();

        playlist.songs.filter((song) => song.id !== songId);

        const res = await fetch(`${BASE_URL}/${playlistId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(playlist),
        });
        const rep = await res.json();
        console.log('Song removed from playlist: ', rep);
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function renamePlaylist(playlistId, rename) {
    try {
        const req = await fetch(`${BASE_URL}/${playlistId}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: rename }),
        });
        const res = await res.json();
        console.log('Playlist renamed: ', res);
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getAllPlaylists() {
    const req = await fetch(BASE_URL);
    const res = await req.json();
    // console.log('All playlists: ', res);
    return res;
}
