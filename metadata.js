let devicesButton = document.getElementById('devices-button');
let metaData = document.getElementById('metadata');

async function query() {
    const request = await fetch('https://api.spotify.com/v1/search?type=track&q=gims%20bella&limit=3', {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    const response = await request.json();
    return (metaData.innerHTML += 'hey');
}

devicesButton.addEventListener('click', () => {
    query();
});
