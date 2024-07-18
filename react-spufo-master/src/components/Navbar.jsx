import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { setSearched, setTracks } from "../utils/sharedVariables";
import {
  getSongData,
  setSongData,
  setHomeClicked,
  setCurrentTrack,
} from "../utils/sharedVariables";

// Define initial state
const initialState = {
  loading: false,
  error: null,
  results: {},
};

// Define reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: null }; // Reset error when requesting
    case "FETCH_SUCCESS":
      return { ...state, loading: false, results: action.payload };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Your existing imports and component definition...

export default function Navbar({ navBackground }) {
  const [{ userInfo, token }] = useStateProvider();
  const [query, setQuery] = useState("");
  // const [searchedTracks, setSearchedTracks] = useState("");
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const [songData, setSongData] = useState(null);
  // const songData = getSongData();

  // useEffect(() => {
  //   fetch(
  //     "https://api.spotify.com/v1/search?q=",query,"&type=track&limit=1",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setSongData(data.tracks.items[0]));
  // }, [query,token]);

  // Function to fetch song data
  const fetchSongData = () => {
    fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSongData(data.tracks.items);
        setTracks(data.tracks.items);
        setCurrentTrack(data.tracks.items[0]);
        console.log("Searched: ", data.tracks.items);
      })
      .catch((error) => console.error("Error fetching song data:", error));
  };

  // const fetchResults = async () => {
  //   dispatch({ type: "FETCH_REQUEST" });

  //   try {
  //     const response = await fetch(
  //       `https://api.spotify.com/v1/search?q=${encodeURIComponent(
  //         query.replace(/\s/g, "%20")
  //       )}&type=track`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     // const data = await response.json();
  //     const tracks = await response.tracks.items.map(({ track }) => ({
  //       id: track.id,
  //       name: track.name,
  //       artists: track.artists.map((artist) => artist.name),
  //       image: track.album.images[2].url,
  //       duration: track.duration_ms,
  //       album: track.album.name,
  //       context_uri: track.album.uri,
  //       track_number: track.track_number,
  //     }));
  //     console.log("Tracks", tracks);
  //     dispatch({ type: "FETCH_SUCCESS", payload: response });
  //   } catch (error) {
  //     dispatch({ type: "FETCH_FAILURE", payload: error.message });
  //   }
  // };

  useEffect(() => {
    if (query && token) {
      fetchSongData();
    }
  }, [query, token]);

  // Click event handler for submit button
  const handleClick = () => {
    if (query && token) {
      fetchSongData();
    }

    setSearched(true);
    setHomeClicked(false);
    console.log("Query", encodeURIComponent(query));
  };

  // useEffect(() => {
  //   console.log("Searched", searched);
  // }, [searched]);

  return (
    <Container navBackground={navBackground}>
      <div className="search__bar">
        <FaSearch />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for song, playlists or artists..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleClick();
            }
          }}
        />
        <button onClick={handleClick}>Search</button>

        {/* <div>
          {songData ? (
            <div id="songDiv">
              {songData.map((song, index) => (
                <div key={index}>
                  <h1>{song.name}</h1>
                  <p>{song.artists[0].name}</p>
                  <p>{song.duration_ms}</p>
                  <p>{song.album.name}</p>
                  <img src={song.album.images[2].url} alt="Album Cover" />
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div> */}
        {/* {state.loading && <p>Loading...</p>}
        {state.error && <p>Error: {state.error}</p>}
        <ul>
          {state.results.map((result) => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul> */}
      </div>

      <div className="avatar">
        <a href={userInfo?.userUrl}>
          <CgProfile />
          <span>{userInfo?.name}</span>
        </a>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Changed from row to column */
  padding: 2rem;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 60%;
      &:focus {
        outline: none;
      }
    }
    button {
      border: none;
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 0.5rem;
    }
  }
  .avatar {
    margin-top: 2rem; /* Added margin for spacing */
    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
    }
  }
  #songDiv {
    color: white;
  }
`;
