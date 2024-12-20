let devicesButton = document.getElementById('devices-button');
let metaData = document.getElementById('metadata');
let lyrics = document.getElementById('lyrics');

async function query() {
    const request = await fetch('https://api.spotify.com/v1/search?type=track&q=gims%20bella&limit=3', {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    const response = await request.json();
    return (lyrics.innerHTML = `
    <h4>Lyrics</h4>
    <div>
    <pre>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, atque blanditiis quidem veniam exercitationem facilis ex quos quae officia eius dicta nostrum quod eaque reprehenderit, temporibus voluptate magni laboriosam nobis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, atque blanditiis quidem veniam exercitationem facilis ex quos quae officia eius dicta nostrum quod eaque reprehenderit, temporibus voluptate magni laboriosam nobis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, atque blanditiis quidem veniam exercitationem facilis ex quos quae officia eius dicta nostrum quod eaque reprehenderit, temporibus voluptate magni laboriosam nobis.</pre>
    </div>
    `);
}

devicesButton.addEventListener('click', () => {
    query();
    lyrics.classList.toggle('visible');
});
