import React, { useReducer,useRef, useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { FaSearch } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

// Define initial state
const initialState = {
  loading: false,
  error: null,
  results: [],
};

// Define reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, results: action.payload };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Search() {
  const [{ token }] = useStateProvider();
  const [query, setQuery] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
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

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    // Trigger search on every change in the input field
    fetchResults(inputValue);
  };

  const fetchResults = async (searchQuery) => {
    dispatch({ type: "FETCH_REQUEST" });

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=album,artist,playlist,track,show,episode,audiobook`,
        {
          headers: {
            Authorization: "Bearer" + token, // Replace with your actual access token
          },
        }
      );
      const data = await response.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_FAILURE", payload: error.message });
    }
  };

  return (
    <Container>
      <div className="spotify__body">
        <Sidebar />
        <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackground={navBackground} />
          <div className="body__contents">
            <Container headerBackground={headerBackground}>
              <div className="search__bar">
                <FaSearch />
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Enter search query"
                />
                {state.loading && <p>Loading...</p>}
                {state.error && <p>Error: {state.error}</p>}
                <ul>
                  {state.results.map((result) => (
                    <li key={result.id}>{result.name}</li>
                  ))}
                </ul>
              </div>
            </Container>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .avatar {
    background-color: black;
    padding: 0.3rem 0.4rem;
    padding-right: 1rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
      svg {
        font-size: 1.3rem;
        background-color: #282828;
        padding: 0.2rem;
        border-radius: 1rem;
        color: #c7c5c5;
      }
    }
  }
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
