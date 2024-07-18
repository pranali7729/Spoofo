// Define and export the variable
let searched = false;
let homeClicked = false;
let songData = null;
let homeData = null;
let selectedPlaylist = null;

// Define and export the variables
let tracks = [];
let currentTrack = {};
let currentIndex = 0;

export const setSelectedPlaylist = (featuredSong) => {
  selectedPlaylist = featuredSong;
};

export const getSelectedPlaylist = () => {
  return selectedPlaylist;
};

export const setTracks = (newTracks) => {
  tracks = newTracks;
};

export const getTracks = () => {
  return tracks;
};

export const setCurrentTrack = (newCurrentTrack) => {
  currentTrack = newCurrentTrack;
};

export const getCurrentTrack = () => {
  return currentTrack;
};

export const setCurrentIndex = (newCurrentIndex) => {
  currentIndex = newCurrentIndex;
};

export const getCurrentIndex = () => {
  return currentIndex;
};

export const setSongData = (newValue) => {
  songData = newValue;
};

export const getSongData = () => {
  return songData;
};

export const setHomeData = (newValue) => {
  homeData = newValue;
};

export const getHomeData = () => {
  return homeData;
};

export const setSearched = (newValue) => {
  searched = newValue;
};

export const getSearched = () => {
  return searched;
};

export const setHomeClicked = (newValue) => {
    homeClicked = newValue;
  };
  
  export const getHomeClicked = () => {
    return homeClicked;
  };