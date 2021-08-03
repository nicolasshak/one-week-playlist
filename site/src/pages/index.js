import * as React from "react";
import { useState } from "react";

const params = new URLSearchParams();
params.append("client_id", "c3afb837e40041e9ad1e7a35d200f0b1");
params.append("response_type", "code");
params.append("redirect_uri", "http://localhost:8000/submit");
const loginLink = "https://accounts.spotify.com/authorize?" + params.toString();

const IndexPage = () => {

  const [playlistName, setPlaylistName] = useState("");
  const [wantsOverflow, setWantsOverflow] = useState(false);
  const [overflowName, setOverflowName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.append("client_id", "c3afb837e40041e9ad1e7a35d200f0b1");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", "http://localhost:8000/submit");
    url.searchParams.append("scope", "playlist-modify-public playlist-modify-private user-read-private");
    url.searchParams.append("state", JSON.stringify({playlistName, wantsOverflow, overflowName}));
    window.location = url.href;
  }

  return (
    <main>
      <title>One Week Playlist</title>
      <h1>One Week Playlist</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris luctus felis quis diam interdum, sed egestas velit placerat. Cras elementum elementum turpis, ut vehicula nibh posuere a. Duis eget mattis magna.</p>
      <form onSubmit={e => handleSubmit(e)}>
        <label>Playlist Name:
          <input name="playlist-name" placeholder="I'll be here all week" onChange={e => setPlaylistName(e.target.value)}></input>
        </label>
        <label>I want an overflow playlist:
          <input type="checkbox" onChange={e => setWantsOverflow(e.target.checked)}></input>
        </label>
        <label style={wantsOverflow ? {} : {display: "none"}}>Overflow Name:
          <input name="overflow-name" placeholder="Last week's catch" onChange={e => setOverflowName(e.target.value)}></input>
        </label>
        <button type="submit">Create</button>
      </form>
    </main>
  )
}

export default IndexPage
