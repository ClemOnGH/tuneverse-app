async function requestUserId() {
    const req = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    });
    const res = await req.json();
    return res.id;
}
const id = await requestUserId();

async function getPlaylists(id) {
    const req = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    });
    const res = await req.json();
    return res.items
        .filter((playlist) => playlist.owner.id === id)
        .sort((a, b) => b.tracks.total - a.tracks.total)
        .slice(0, 5);
}

async function getPlaylistItems(playlistId) {
    const req = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(added_at)`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    });
    const res = await req.json();
    return res;
}

let playlists = await getPlaylists(id);

let addedAt = [];
for (let e of playlists) {
    let res = await getPlaylistItems(e.id);
    addedAt.push(res.items[0]);
}

function formatDate(d) {
    const months = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ];
    let date = new Date(d);
    const day = date.getDay();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
}

const lb = document.getElementById('leaderboard-results');
const table = document.createElement('table');
lb.appendChild(table);

function displayLeaderboard() {
    for (let i = 0; i < playlists.length; i++) {
        const wrapper = document.createElement('tr');
        const lbPlace = document.createElement('td');
        const lbAlbumWrapper = document.createElement('td');
        const lbAlbum = document.createElement('img');
        const lbName = document.createElement('td');
        const lbCountAndDuration = document.createElement('td');
        const lbCreationDate = document.createElement('td');
        const lbPlayButton = document.createElement('td');
        const lbMore = document.createElement('td');

        table.style.width = '100%';
        table.style.padding = '0';
        table.style.borderSpacing = 'none';
        table.classList.add('lb-results-table');

        lbPlace.textContent = i + 1;
        lbPlace.style.textAlign = 'center';
        lbPlace.style.width = '50px';
        lbPlace.style.fontSize = '18px';
        lbPlace.style.fontWeight = 'bold';

        lbAlbumWrapper.style.width = '64px';
        lbAlbumWrapper.style.padding = '0';
        lbAlbumWrapper.style.textAlign = 'center';
        lbAlbumWrapper.style.borderRadius = '10px';
        lbAlbum.src = playlists[i].images[0].url;
        lbAlbum.style.height = '48px';

        lbName.textContent = playlists[i].name;
        lbName.style.color = 'white';
        lbName.style.paddingLeft = '2rem';

        lbCountAndDuration.textContent = playlists[i].tracks.total + ' tracks';
        lbCountAndDuration.style.textAlign = 'center';

        lbCreationDate.textContent = formatDate(addedAt[i].added_at);
        lbCreationDate.style.textAlign = 'center';

        lbPlayButton.innerHTML = `<svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
        lbPlayButton.style.width = '48px';
        lbPlayButton.style.textAlign = 'center';

        lbMore.innerHTML = `<svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>`;
        lbMore.style.width = '48px';
        lbMore.style.textAlign = 'center';

        table.appendChild(wrapper);
        wrapper.appendChild(lbPlace);
        wrapper.appendChild(lbAlbumWrapper);
        lbAlbumWrapper.appendChild(lbAlbum);
        wrapper.appendChild(lbName);
        wrapper.appendChild(lbCountAndDuration);
        wrapper.appendChild(lbCreationDate);
        wrapper.appendChild(lbPlayButton);
        wrapper.appendChild(lbMore);
    }
}

displayLeaderboard();
