import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { AiFillClockCircle } from "react-icons/ai";
import { reducerCases } from "../utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { getSearched, setSearched, getSongData, setTracks, setCurrentTrack, setCurrentIndex,getTracks, getCurrentTrack, getCurrentIndex} from "../utils/sharedVariables";
import PlayerDevices from "./PlayerDevices";
import { getHomeClicked } from "../utils/sharedVariables";
import Home from "./Home";

export default function Body({ headerBackground }) {
  const [{ token, selectedPlaylist, selectedPlaylistId }, dispatch] = useStateProvider();
  const [hoveredTrack, setHoveredTrack] = useState(null);
  // const location = useLocation();
  // const [tracks, setTracks] = useState([]);
  // const [currentTrack, setCurrentTrack] = useState({});
  // const [currentIndex, setCurrentIndex] = useState(0);
  const tracks = getTracks();
  const currentIndex = getCurrentIndex();
  const isHomeClicked = getHomeClicked();
  // const changeCurrentPlaylist = (selectedPlaylistId) => {
    
    
  //   dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
  // };

  // for media player
  useEffect(() => {
    if (selectedPlaylistId) {
      const fetchPlaylistTracks = async () => {
        try {
          const res = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          setTracks(res.data.items);
          setCurrentTrack(res.data?.items[0]?.track);
          console.log("Playlist: ", res.data.items);
        } catch (error) {
          console.error("Error fetching playlist tracks:", error);
        }
      };
      fetchPlaylistTracks();
    }
  }, [selectedPlaylistId, token]);
  
  // async function searchAlbumTrack(albumId,songId){
  //   try {
  //     const res = await axios.get(
  //       `https://api.spotify.com/v1/albums/${albumId}/tracks`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("PLay Searched: ", res.data)
  //   } catch (error) {
  //     console.error("Error fetching playlist tracks:", error);
  //   }
  // };


  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track || tracks[currentIndex]);
  }, [currentIndex, tracks]);

  const _device_id = PlayerDevices();
  // console.log("Device:  ",_device_id);

  const itemSearched = getSearched();

  const songData = getSongData();

  useEffect(() => {
    const getInitialPlaylist = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      const selectedPlaylist = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description.startsWith("<a")
          ? ""
          : response.data.description,
        image: response.data.images[0].url,
        tracks: response.data.tracks.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name).join(" | "),
          image: track.album.images[2].url,
          duration: track.duration_ms,
          album: track.album.name,
          context_uri: track.uri,
          track_number: track.track_number,
          external_link: track.external_urls.spotify,
        })),
      };
      console.log(response);
      dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
    };
    getInitialPlaylist();
  }, [token, dispatch, selectedPlaylistId]);

  

  // const playTrack = async (
  //   id,
  //   name,
  //   artists,
  //   image,
  //   context_uri,
  //   track_number
  // ) => {
  //   const response = await axios.put(
  //     "https://api.spotify.com/v1/me/player/play?device_id="+_device_id,
  //     {
  //       uris:`[${context_uri}]`,
  //       offset: {
  //         position: track_number,
  //       },
  //       position_ms: 0,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     }
  //   );
  //   if (response.status === 204) {
  //     const currentPlaying = {
  //       id,
  //       name,
  //       artists,
  //       image,
  //     };
  //     dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
  //     dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
  //   } else {
  //     dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
  //   }
  // };

  // const msToMinutesAndSeconds = (ms) => {
  //   var minutes = Math.floor(ms / 60000);
  //   var seconds = ((ms % 60000) / 1000).toFixed(0);
  //   return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  // };

  const handleDownloadClick = async (playlistName, songName) => {
    try {
      // Send a POST request to your backend
      const response = await axios.get("http://localhost:3001/download", {
        params: {
          playlistName: playlistName,
          songName: songName,
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
    <Container headerBackground={headerBackground}>
      {isHomeClicked && (
        <Home />
      )}
      {!isHomeClicked && itemSearched && (
        <div>
          {songData ? (
            <div className="list">
              <div className="header-row">
                <div className="col">
                  <span>#</span>
                </div>
                <div className="col">
                  <span>TITLE</span>
                </div>
                <div className="col">
                  <span>ALBUM</span>
                </div>
                <div className="col">
                  <span>
                    <AiFillClockCircle />
                  </span>
                </div>
              </div>
              <div className="tracks">
                {songData.map((song, index) => {
                  const isTrackHovered = index === hoveredTrack;

                  return (
                    <div
                      className={`row ${isTrackHovered ? "hovered" : ""}`}
                      key={song.id}
                      onMouseEnter={() => setHoveredTrack(index)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        // changeCurrentPlaylist(song.album.id);
                        setCurrentIndex(index);
                        setCurrentTrack(song[index]);
                        // searchAlbumTrack(song.album.id,song.id);
                        // playTrack(
                        //   song.id,
                        //   song.name,
                        //   song.artists.map((artist) => artist.name),
                        //   song.images[2].url,
                        //   song.album.uri,
                        //   song.track_number
                        // );
                        // console.log(playTrack.album.uri);
                      }}
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail">
                        <div className="image">
                          <img src={song.album.images[2].url} alt="track" />
                        </div>
                        <div className="info">
                          <a className="name" href={song.external_urls.spotify}>{song.name}</a>
                          <span>{song.artists[0].name}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{song.album.name}</span>
                      </div>
                      <div className="col">
                        {/* <span>{msToMinutesAndSeconds(song.duration_ms)}</span> */}
                        {isTrackHovered && (
                          <FontAwesomeIcon
                            icon={faDownload}
                            style={{ paddingLeft: "10px", cursor: "pointer" }}
                            onClick={() => {
                              handleDownloadClick("Searched", song.name);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>Start Searching...</p>
          )}
        </div>
      )}

      {!isHomeClicked && !itemSearched && selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.image} alt="selected playlist" />
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col">
                <span>#</span>
              </div>
              <div className="col">
                <span>TITLE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                    image,
                    duration,
                    album,
                    context_uri,
                    track_number,
                    external_link,
                  },
                  index
                ) => {
                  const isTrackHovered = index === hoveredTrack;

                  return (
                    <div
                      className={`row ${isTrackHovered ? "hovered" : ""}`}
                      key={id}
                      onMouseEnter={() => setHoveredTrack(index)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      onClick={() => {
                        setCurrentIndex(index)
                        // playTrack(
                        //   id,
                        //   name,
                        //   artists,
                        //   image,
                        //   context_uri,
                        //   track_number
                        // );
                        // console.log(playTrack.context_uri)
                      }}
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail">
                        <div className="image">
                          <img src={image} alt="track" />
                        </div>
                        <div className="info">
                          <a className="name" href={external_link}>{name}</a>
                          <span>{artists}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{album}</span>
                      </div>
                      <div className="col">
                        {/* <span>{msToMinutesAndSeconds(duration)}</span> */}
                        {isTrackHovered && (
                          <FontAwesomeIcon
                            icon={faDownload}
                            style={{ paddingLeft: "10px", cursor: "pointer" }}
                            onClick={() => {
                              handleDownloadClick(selectedPlaylist.name, name);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      margin: 1rem 0 0 0;
      color: #dddcdc;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
        headerBackground ? "#000000dc" : "none"};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        &.hovered {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          img {
            height: 40px;
            width: 40px;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
`;