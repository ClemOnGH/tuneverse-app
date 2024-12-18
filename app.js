// Last.FM API : https://www.last.fm/api/intro
// Spotify API : https://developer.spotify.com/documentation/web-api
// Koel API : https://docs.koel.dev/guide/what-is-koel#installation

const spotify = {
    clientID: '20501cd4492c46d8b1e87c3b27d4822d',
    clientSecret: '54b3e851104342368449b310c9a66e37',
};

const actionButtons = document.querySelectorAll('#action-buttons button');
console.log(actionButtons);

for (l of actionButtons) {
    l.addEventListener('mouseover', () => {
        l.style.backgroundColor = 'red';
        l.style.cursor = 'pointer';
    });
    l.addEventListener('mouseout', () => {
        l.style.backgroundColor = 'blue';
    });
}
