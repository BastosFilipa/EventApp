const Spotify = ( () => {
  const login = "3f7cadce4dee4c179497d08b1cdcbc9f";
  const password = "84def880b7f4444b8b8261385699e293";
  const url = "https://accounts.spotify.com/api/token";
  let token;

  async function getToken() {
    let response = await fetch(url, {
      headers: new Headers({
        Authorization: "Basic " + btoa(login + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      }),

      body: "grant_type=client_credentials",
      method: "POST",
    });

    let token = await response.json();
    return token;
  }

 async function getArtist(name) {
    if (!token) {
      token = await getToken();
    }

    let response = await fetch(
      `https://api.spotify.com/v1/search?q=${name}&type=artist`,
      {
        headers: new Headers({
          Authorization: "Bearer " + token.access_token,
          "Content-Type": "application/json",
        }),
      }
    );

    let artist = await response.json();
    //console.log(artist);
    return artist["artists"]["items"][0];
    //.then(res => res.json()).then(data => {console.log(data)}).catch(err => console.log(err));
  }


  async function getPlaylist(id) {
    if (!token) {
      token = await getToken();
    }

    let response = await fetch(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=ES`,
      {
        headers: new Headers({
          Authorization: "Bearer " + token.access_token,
          "Content-Type": "application/json",
        }),
      }
    );

    let playlist = await response.json();
    let tracks = Object.entries(playlist)[0][1];
    //console.log(tracks);
    return tracks; 
  }

  async function getArtistTracks(name) {
    let artist  = await getArtist(name);
    let topTracks  = await getPlaylist(artist.id);

    console.log(topTracks)
    let player = topTracks.map((track, index) => {
        return {
          id:index+1,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          imageUrl: track.album.images[0].url,
          preview: track.preview_url,
          duration: 30,
        };
    })

    return player;   
  }

  
  return {
    getArtistTracks,
    
  };
})();

export { Spotify };
