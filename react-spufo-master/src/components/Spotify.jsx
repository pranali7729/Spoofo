import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import Body from "./Body";
import { reducerCases } from "../utils/Constants";

export default function Spotify() {
  const [{ token }, dispatch] = useStateProvider();
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const bodyRef = useRef();
  const bodyScrolled = () => {
    bodyRef.current.scrollTop >= 30
      ? setNavBackground(true)
      : setNavBackground(false);
    bodyRef.current.scrollTop >= 268
      ? setHeaderBackground(true)
      : setHeaderBackground(false);
  };

  const axios = require('axios');

// Function to add user to Spotify app's user management
// async function addUserToSpotify(email) {
//     try {
//         // const accessToken = 'YOUR_SPOTIFY_API_ACCESS_TOKEN';
//         const url = 'https://api.spotify.com/v1/apps/9424d54fe5fb44b3b02c5b0790335fa3/users';
//         const payload = {
//             email: email,
//             // Add any other required parameters here
//         };
//         const headers = {
//             'Authorization': "Bearer " + token,
//             'Content-Type': 'application/json'
//         };
//         const response = await axios.post(url, payload, { headers: headers });
//         console.log('User added to Spotify app:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error adding user to Spotify app:', error.response.data);
//         throw error;
//     }
// }

// Call the function when a user logs in
// const userEmail = 'user@example.com'; // Replace this with the user's email
// addUserToSpotify(userEmail);



  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const userInfo = {
        userId: data.id,
        userUrl: data.external_urls.spotify,
        name: data.display_name,
      };
      dispatch({ type: reducerCases.SET_USER, userInfo });
    };
    getUserInfo();
  }, [dispatch, token]);
  // useEffect(() => {
  //   const getPlaybackState = async () => {
  //     const { data } = await axios.get("https://api.spotify.com/v1/me/player", {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     dispatch({
  //       type: reducerCases.SET_PLAYER_STATE,
  //       playerState: data.is_playing,
  //     });
  //   };
  //   getPlaybackState();
  // }, [dispatch, token]);
  return (
    <Container>
      <div className="spotify__body">
        <Sidebar />
        <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackground={navBackground} />
          <div className="body__contents">
            <Body headerBackground={headerBackground} />
          </div>
        </div>
      </div>
      <div className="spotify__footer">
        <Footer />
      </div>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;
  .spotify__body {
    display: grid;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        max-height: 2rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;
