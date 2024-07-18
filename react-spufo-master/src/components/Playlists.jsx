import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { setSearched,setHomeClicked } from "../utils/sharedVariables";

export default function Playlists() {
  const [{ token, playlists, selectedPlaylist }, dispatch] = useStateProvider();

  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);

  useEffect(() => {
    const getPlaylistData = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      const { items } = response.data;
      const playlists = items.map(({ name, id }) => {
        return { name, id };
      });
      dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
    };
    getPlaylistData();
  }, [token, dispatch]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
  };

  const handleDownloadClick = async (playlistName,playlistId,token) => {
    try {
      // Send a GET request to your backend
      const response = await axios.get("http://localhost:3001/download/wholePlaylist", {
        params: {
          playlistName: playlistName,
          playlistId: playlistId,
          access_token: token
        },
      });

      // Handle the response if needed
      console.log("Download request sent successfully", response.data);
    } catch (error) {
      // Handle errors
      console.error("Error sending download request", error);
    }
  };

  return (
    <Container>
      <ul>
        {playlists.map(({ name, id }) => {
          const isPlaylistHovered = hoveredPlaylist === name;
          return (
            <li
              key={id}
              onMouseEnter={() => setHoveredPlaylist(name)}
              onMouseLeave={() => setHoveredPlaylist(null)}
              onClick={() => {
                changeCurrentPlaylist(id);
                setSearched(false);
                setHomeClicked(false);
              }}
            >
              {name}
              {isPlaylistHovered && (
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ paddingLeft: "30%", cursor: "pointer" }}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent li click event from firing
                    handleDownloadClick(name,id,token);
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  color: #b3b3b3;
  height: 100%;
  overflow: hidden;
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 55vh;
    max-height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    li {
      transition: 0.3s ease-in-out;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
`;
