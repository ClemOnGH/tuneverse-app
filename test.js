import { searchQuery, getArtist } from "./spotify.js";

const result = await searchQuery("artist", "gims", 3);
// console.log(result);
// console.log(await getArtist(result.artists.items[0].id));
