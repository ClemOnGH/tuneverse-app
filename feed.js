async function searchQuery(q) {
    try {
        const req = await fetch(`https://api.spotify.com/v1/search?type=track&q=${q}`, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const res = await req.json();
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const feed = document.getElementById('feed');

(() => {
    const feedLeaderboard = document.createElement('div');
    feedLeaderboard.id = 'feed-leaderboard';
    feedLeaderboard.innerHTML = `<div id="leaderboard-links"><div>Playlists</div><div>Artists</div><div>Songs</div><div>Albums</div></div><div id="leaderboard-results"></div>`;
    feed.appendChild(feedLeaderboard);

    const leaderboardResults = document.getElementById('leaderboard-results');
    const skeletonLeaderboard = document.createElement('div');
    skeletonLeaderboard.style.borderRadius = '15px';
    skeletonLeaderboard.style.height = '260px';
    skeletonLeaderboard.style.width = '100%';
    skeletonLeaderboard.style.background = 'linear-gradient(135deg, #151515 0%, #222 50%, #151515 100%)';
    leaderboardResults.appendChild(skeletonLeaderboard);
})();

const lbLinks = document.getElementById('leaderboard-links');
const lbPlaylist = lbLinks.children[0];
const lbArtist = lbLinks.children[1];
const lbSong = lbLinks.children[2];
const lbAlbum = lbLinks.children[3];

lbPlaylist.onclick = () => {
    console.log('Setting leaderboard to show top playlists');
};
lbArtist.onclick = () => {
    console.log('Setting leaderboard to show top artists');
};
lbSong.onclick = () => {
    console.log('Setting leaderboard to show top songs');
};
lbAlbum.onclick = () => {
    console.log('Setting leaderboard to show top albums');
};

async function requestUserId() {
    try {
        const req = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const res = await req.json();
        return res;
    } catch (e) {
        console.error('Error fetching data:', e);
        return null;
    }
}

async function getPlaylists() {
    try {
        const userId = await requestUserId();
        const req = await fetch(`https://api.spotify.com/v1/users/${userId.id}/playlists`, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const ret = {
            type: 'playlist',
            data: [],
        };
        const res = await req.json();
        res.items
            .filter((playlist) => playlist.owner.id === userId.id)
            .sort((a, b) => b.tracks.total - a.tracks.total)
            .slice(0, 5)
            .forEach((playlist) => {
                ret.data.push({
                    title: playlist.name,
                    url: playlist.images[0].url,
                    total: playlist.tracks.total,
                    id: playlist.id,
                });
            });
        return ret;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getPlaylistItems(playlistId) {
    try {
        const req = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const res = await req.json();
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getArtistTrackCount() {
    try {
        const userId = await requestUserId();
        const req = await fetch(`https://api.spotify.com/v1/artists/${userId.id}/albums?include_groups=single,appears_on`, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const res = await req.json();
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
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
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
}

async function getPlaylistDurationAndCreationDate(id) {
    try {
        const req = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const res = await req.json();
        const duration = res.items.reduce((total, item) => total + item.track.duration_ms, 0);
        return res.items[0].added_at, duration;
    } catch (e) {
        console.error(e);
        return null;
    }
}
async function displayLeaderboard() {
    const d = await getPlaylists();

    const lb = document.getElementById('leaderboard-results');
    lb.innerHTML = '<table ><tbody class="lb-results-table"></tbody></table>';
    const tbody = document.getElementsByTagName('tbody')[0];

    switch (d.type) {
        case 'playlist':
            for (let i = 0; i < d.data.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-album" style="background-image: url('${
                    d.data[i].url
                }'"></div></td><td class="lb-title">${d.data[i].title}</td><td class="lb-count-and-duration">${
                    d.data[i].total + ' songs - ' + undefined
                }</td><td class="lb-creation-date">undefined</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
        case 'artist':
            for (let i = 0; i < d.data.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-album" style="background-image: url('${
                    d.data[i].url
                }'"></div></td><td class="lb-name">${d.data[i].title}</td><td class="lb-count-and-duration">${
                    d.data[i].total + ' songs'
                }</td><td class="lb-popularity">${
                    d.data.popularity
                }%</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
        case 'track':
            for (let i = 0; i < d.data.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-album" style="background-image: url('${
                    d.data[i].url
                }'"></div></td><td class="lb-title">${d.data[i].title}</td><td class="lb-count-and-duration">${
                    d.data[i].total + ' song - ' + d.data[i].duration
                }</td><td class="lb-creation-date">${
                    d.data[i].creationDate
                }</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
        case 'album':
            for (let i = 0; i < d.data.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-album" style="background-image: url('${
                    d.data[i].url
                }'"></div></td><td class="lb-title">${d.data[i].title}</td><td class="lb-count-and-duration">${
                    d.data[i].total + ' song - ' + d.data[i].duration
                }</td><td class="lb-creation-date">${
                    d.data[i].creationDate
                }</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
    }
}

displayLeaderboard();
function initFeedStats() {}
