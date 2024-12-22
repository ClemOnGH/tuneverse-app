const feed = document.getElementById('feed');
const searchBar = document.getElementById('spotify-query');

let timeoutSearch;

function skeletonLoaderFeed() {
    const feedLeaderboard = document.createElement('div');
    feedLeaderboard.id = 'feed-leaderboard';
    feedLeaderboard.innerHTML = `<div id="leaderboard-links"><div id="feed-lb-link-playlists">Playlists</div><div id="feed-lb-link-artists">Artists</div><div id="feed-lb-link-songs">Songs</div></div><div id="leaderboard-results"></div>`;
    feed.appendChild(feedLeaderboard);

    const leaderboardResults = document.getElementById('leaderboard-results');
    leaderboardResults.classList.add('skeleton-results');
    feedLeaderboard.appendChild(leaderboardResults);

    const div = document.createElement('div');
    div.id = 'feed-stats';
    div.classList.add('skeleton-stats');
    feed.appendChild(div);
}

skeletonLoaderFeed();

window.onclick = (e) => {
    switch (e.target.id) {
        case 'feed-lb-link-playlists':
            displayLeaderboard('playlist');

            break;
        case 'feed-lb-link-artists':
            displayLeaderboard('artist');
            break;
        case 'feed-lb-link-songs':
            displayLeaderboard('track');
            break;
    }
};

searchBar.onkeyup = (e) => {
    const feedLeaderboard = document.getElementById('feed-leaderboard');
    const feedStats = document.getElementById('feed-stats');
    if (e.target.value) {
        if (feedLeaderboard !== null || feedStats !== null) {
            feedLeaderboard.remove();
            feedStats.remove();
        }

        if (document.getElementById('result-wrapper')) {
            feed.removeChild(document.getElementById('result-wrapper'));
        }

        const resultWrapper = document.createElement('div');
        resultWrapper.style.width = '100%';
        resultWrapper.style.height = '93%';
        resultWrapper.style.display = 'flex';
        resultWrapper.style.flexDirection = 'column';
        resultWrapper.style.justifyContent = 'space-between';
        resultWrapper.style.gap = '1rem';
        resultWrapper.style.paddingTop = '1rem';
        resultWrapper.id = 'result-wrapper';
        feed.appendChild(resultWrapper);

        resultWrapper.innerHTML = `<div id="artistsDiv"></div><div id="tracksDiv"></div>`;

        clearTimeout(timeoutSearch);
        timeoutSearch = setTimeout(async () => {
            const res = await fetchSongs(e.target.value);
            const artistsDiv = document.getElementById('artistsDiv');
            const tracksDiv = document.getElementById('tracksDiv');

            artistsDiv.innerHTML = `<div class="artistDiv-flex"><p>${res.artists.items[0].name}</p><p>${res.artists.items[0].followers.total} followers</p></div>`;
            artistsDiv.style.backgroundImage = `url('${res.artists.items[0].images[0].url}')`;

            res.tracks.items.forEach((track) => {
                const div = document.createElement('div');
                div.innerHTML = `<img src="${track.album.images[0].url}"/><p>${track.name}</p><p>${track.artists[0].name}</p><p>${new Date(
                    track.duration_ms
                )
                    .toISOString()
                    .slice(14, 19)}</p>`;
                tracksDiv.appendChild(div);
            });

            console.log(res);
        }, 1000);
    } else {
        const resultWrapper = document.getElementById('result-wrapper');
        resultWrapper.remove();
        skeletonLoaderFeed();
        displayLeaderboard();
        initFeedStats();
    }
};

async function fetchSongs(q) {
    try {
        const req = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track,artist&limit=10`, {
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

async function getUserPlaylists() {
    try {
        const userId = await requestUserId();
        const req = await fetch(`https://api.spotify.com/v1/users/${userId.id}/playlists?limit=50`, {
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

async function getArtists() {
    try {
        const req = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
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

async function getTracks() {
    try {
        const req = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
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

async function getArtistTrackCount(id) {
    try {
        const req = await fetch(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=single,appears_on&limit=1`, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const res = await req.json();
        return res.total;
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
        return { addedAt: res.items[0].added_at, duration: duration };
    } catch (e) {
        console.error(e);
        return null;
    }
}

function formatTime(d) {
    const time = d.duration;
    const hours = Math.floor(time / 3600000);
    return hours + 'h';
}

async function displayLeaderboard(type = 'playlist') {
    const leaderboardResults = document.getElementById('leaderboard-results');
    leaderboardResults.classList.remove('skeleton-results');

    const lb = document.getElementById('leaderboard-results');
    lb.innerHTML = '<table ><tbody class="lb-results-table"></tbody></table>';
    const tbody = document.getElementsByTagName('tbody')[0];

    switch (type) {
        case 'playlist':
            const p = await getPlaylists();
            let durations = [];
            for (const e of p.data) {
                durations.push(await getPlaylistDurationAndCreationDate(e.id));
            }
            durations.sort((a, b) => b.duration - a.duration);

            for (let i = 0; i < p.data.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-album" style="background-image: url('${
                    p.data[i].url
                }'"></div></td><td class="lb-title">${p.data[i].title}</td><td class="lb-count-and-duration">${
                    p.data[i].total + ' songs - ' + formatTime(durations[i])
                }</td><td class="lb-creation-date">${formatDate(
                    durations[i].addedAt
                )}</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
        case 'artist':
            const ar = await getArtists();
            const trackCounts = [];
            for (const tc of ar.items) {
                trackCounts.push(await getArtistTrackCount(tc.id));
            }
            trackCounts.sort((a, b) => b - a);

            for (let i = 0; i < ar.items.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-cover" style="background-image: url('${
                    ar.items[i].images[0].url
                }'"></div></td><td class="lb-name">${ar.items[i].name}</td><td class="lb-count-and-duration">${
                    trackCounts[i] + ' songs'
                }</td><td class="lb-popularity">${ar.items[i].popularity}%</td><td class="lb-followers">${
                    ar.items[i].followers.total + ' followers'
                }</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
        case 'track':
            const s = await getTracks();
            for (let i = 0; i < s.items.length; i++) {
                tbody.innerHTML += `<tr><td class="lb-place">${i + 1}</td><td><div class="lb-album" style="background-image: url('${
                    s.items[i].album.images[0].url
                }'"></div></td><td class="lb-title">${"<a href='" + s.items[i] + "'>" + s.items[i].name + '</a>'}</td><td id="lb-artist">${
                    s.items[i].artists[0].name
                }</td><td class="lb-count-and-duration">${new Date(s.items[i].duration_ms)
                    .toISOString()
                    .slice(14, 19)}</td><td class="lb-creation-date">${
                    s.items[i].popularity
                }%</td><td><svg class="play-button" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></td><td><svg class="kebab-button" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg></td></tr>`;
            }
            break;
    }
}

displayLeaderboard();

async function initFeedStats() {
    const artistsTop = await getArtists();
    const tracksTop = await getTracks();
    const userPlaylists = await getUserPlaylists();
    console.log(userPlaylists.items.length);
    const div = document.getElementById('feed-stats');
    div.innerHTML = `<p>En 2024 vous avez...</p><div class="flex-stats"><div><p>(re)écouté <span>${tracksTop.total}</span> chansons</p></div><div><p>(re)découvert <span>${artistsTop.total}</span> artistes</p></div><div><p>crée <span>${userPlaylists.items.length}</span> playlists</p></div></div>`;
}

initFeedStats();
