import React, { useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { MdHomeFilled } from "react-icons/md";
import Playlists from "./Playlists";
import { setHomeClicked, getHomeClicked, setSelectedPlaylist } from "../utils/sharedVariables";
import Login from "./Login";
import { reducerCases } from "../utils/Constants";
// import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const [{ token }, dispatch] = useStateProvider();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Initialize isLoggedIn based on token presence
  const isHomeClicked = getHomeClicked();
  // const history = useHistory();
  // Function to handle click on the Home button
  function handleClick() {
    setHomeClicked(true);
    setSelectedPlaylist(null);
    console.log("Home ", isHomeClicked);
  }

  // Function to handle logout click
  const handleLogoutClick = () => {
    // Clear user authentication token or session
    // For example, if you're using localStorage:
    
    if(token){
      dispatch({ type: reducerCases.SET_TOKEN, token: null });
    }
    localStorage.removeItem("token");
    console.log("Token expired: ",token);
    // Update the isLoggedIn state to indicate the user is logged out
    setIsLoggedIn(false);
    // Reload the page to return to the main page
    window.location.href = window.location.origin;
  };

  return (
    <Container>
      <div className="top__links">
        <div className="logo">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
            alt="Spufo"
          />
        </div>
        <ul>
          <li onClick={handleClick}>
            <MdHomeFilled />
            <span>Home</span>
          </li>
        </ul>
      </div>
      
      <Playlists />
      <div className="log">
        {isLoggedIn ? (
          <a href="#">
            <span className="material-symbols-sharp">
              logout
            </span>
            <h3 onClick={handleLogoutClick}>Log Out</h3>
          </a>
        ) : (
          <Login />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .top__links {
    display: flex;
    flex-direction: column;
    .logo {
      text-align: center;
      margin: 1rem 0;
      img {
        max-inline-size: 80%;
        block-size: auto;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      li {
        display: flex;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: white;
        }
      }
    }
  }
  .log a{
    display: flex;
    margin-left: 1rem;
    margin-bottom: 1rem;
    text-decoration: none;
    color: #b3b3b3;
    gap: 1rem;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    gap: 1rem;
    padding: 1rem;
    &:hover {
    color: white;
    margin-left: 2rem;
    }
  }
  .material-symbols-sharp {
    /* Define styles for your logout icon */
  }
`;
