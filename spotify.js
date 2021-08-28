const Spotify = (() => {
  const login = "3f7cadce4dee4c179497d08b1cdcbc9f";
  const password = "84def880b7f4444b8b8261385699e293";
  const url = "https://accounts.spotify.com/api/token";
  let token;
  let tries = 0;

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

  function correctName(name) {
    if (tries == 0) {
      if (name.indexOf("-") > -1) {
        name = name.split("-")[0];
      }

      if (name.indexOf(":") > -1) {
        name = name.split(":")[0];
      }
      if (name.indexOf('"') > -1) {
        name = name.split('"')[0];
      }
    }
    if(tries == 1){
     name = name.split(" ").slice(0,3).join(" ");
    }
    if(tries == 2){
      tries = 0;
      throw new Error("Artist not found");
    }

    tries++;
    return name;
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
   

    if (!artist.artists.items[0]) {     
      name = correctName(name);
      return getArtist(name);
    }
    return artist["artists"]["items"][0];
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
   
    return tracks;
  }


  async function getArtistTracks(name) {
    let artist;
    try{
      artist = await getArtist(name);
    } catch(err){ 
      return [];
    }
   
    let topTracks = await getPlaylist(artist.id);

    let player = topTracks
      .filter((track) => track.preview_url != null && track.preview_url)
      .map((track, index) => {
        return {
          id: index + 1,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          imageUrl: track.album.images[0].url,
          preview: track.preview_url,
          duration: 30,
        };
      });

    return player;
  }

  return {
    getArtistTracks,
  };
})();

export { Spotify };
