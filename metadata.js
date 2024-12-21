// let devicesButton = document.getElementById('devices-button');
// let metaData = document.getElementById('metadata');
// let lyrics = document.getElementById('lyrics');

// async function query() {
//     const request = await fetch('https://api.spotify.com/v1/search?type=track&q=gims%20bella&limit=3', {
//         method: 'GET',
//         headers: {
//             authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//     });
//     const response = await request.json();
//     return (lyrics.innerHTML = `
//     <h4>Lyrics</h4>
//     <div>
//     <pre>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, atque blanditiis quidem veniam exercitationem facilis ex quos quae officia eius dicta nostrum quod eaque reprehenderit, temporibus voluptate magni laboriosam nobis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, atque blanditiis quidem veniam exercitationem facilis ex quos quae officia eius dicta nostrum quod eaque reprehenderit, temporibus voluptate magni laboriosam nobis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, atque blanditiis quidem veniam exercitationem facilis ex quos quae officia eius dicta nostrum quod eaque reprehenderit, temporibus voluptate magni laboriosam nobis.</pre>
//     </div>
//     `);
// }

// devicesButton.addEventListener('click', () => {
//     query();
//     lyrics.classList.toggle('visible');
// });

let lyricsButton = document.getElementById('lyrics-button');
let metaData = document.getElementById('metadata');
let lyrics = document.getElementById('lyrics');
import { getArtist } from './spotify.js';

lyricsButton.addEventListener('click', () => {
    // const res = query('Black M', 1);
    // console.log(res);
    lyrics.classList.toggle('visible');
});

// function test() {
//     lyrics.innerHTML = `
//     <h4>Lyrics</h4>
//     <div>
//     <pre> ${getArtist()}</pre>
//     </div>
//     `;
// }

async function query(type = 'artist', q, limit = 1) {
    const request = await fetch(`https://api.spotify.com/v1/search?type=${type}&q=${q}&limit=${limit}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    const response = await request.json();
    displayTrackInfo(response);
}
query('artist', 'GIMS', 1);

function displayTrackInfo(title, artist, album) {}
