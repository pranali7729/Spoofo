import React, { useEffect,useState,useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { setTracks, setCurrentTrack, setCurrentIndex,getTracks, getCurrentTrack, getCurrentIndex} from "../utils/sharedVariables";


export default function CurrentTrack() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const total = getTracks();
  const currentIndex = getCurrentIndex();
  const currentTrack = getCurrentTrack();
  // var audioSrc = total[currentIndex]?.track.preview_url;

  // const audioRef = useRef(new Audio(total[0]?.track.preview_url));

  // const intervalRef = useRef();

  // const isReady = useRef(false);

  // const { duration } = audioRef.current;

  // const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  // const startTimer = () => {
  //   clearInterval(intervalRef.current);

  //   intervalRef.current = setInterval(() => {
  //     if (audioRef.current.ended) {
  //       handleNext();
  //     } else {
  //       setTrackProgress(audioRef.current.currentTime);
  //     }
  //   }, [1000]);
  // };

  // useEffect(() => {
  //   if (audioRef.current.src) {
  //     if (isPlaying) {
  //       audioRef.current.play();
  //       startTimer();
  //     } else {
  //       clearInterval(intervalRef.current);
  //       audioRef.current.pause();
  //     }
  //   } else {
  //     if (isPlaying) {
  //       audioRef.current = new Audio(audioSrc);
  //       audioRef.current.play();
  //       startTimer();
  //     } else {
  //       clearInterval(intervalRef.current);
  //       audioRef.current.pause();
  //     }
  //   }
  // }, [isPlaying]);

  // useEffect(() => {
  //   audioRef.current.pause();
  //   audioRef.current = new Audio(audioSrc);

  //   setTrackProgress(audioRef.current.currentTime);

  //   if (isReady.current) {
  //     audioRef.current.play();
  //     setIsPlaying(true);
  //     startTimer();
  //   } else {
  //     isReady.current = true;
  //   }
  // }, [currentIndex]);

  // useEffect(() => {
  //   return () => {
  //     audioRef.current.pause();
  //     clearInterval(intervalRef.current);
  //   };
  // }, []);

  // const handleNext = () => {
  //   if (currentIndex < total.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //   } else setCurrentIndex(0);
  // };

  // const handlePrev = () => {
  //   if (currentIndex - 1 < 0) setCurrentIndex(total.length - 1);
  //   else setCurrentIndex(currentIndex - 1);
  // };

  // const addZero = (n) => {
  //   return n > 9 ? "" + n : "0" + n;
  // };
  const artists = [];
  currentTrack?.album?.artists.forEach((artist) => {
    artists.push(artist.name);
  });
  // const [{ token, currentPlaying }, dispatch] = useStateProvider();
  // // useEffect(() => {
  // //   const getCurrentTrack = async () => {
  // //     const response = await axios.get(
  // //       "https://api.spotify.com/v1/me/player/currently-playing",
  // //       {
  // //         headers: {
  // //           "Content-Type": "application/json",
  // //           Authorization: "Bearer " + token,
  // //         },
  // //       }
  // //     );
  // //     if (response.data !== "") {
  // //       const currentPlaying = {
  // //         id: response.data.item.id,
  // //         name: response.data.item.name,
  // //         artists: response.data.item.artists.map((artist) => artist.name),
  // //         image: response.data.item.album.images[2].url,
  // //       };
  // //       dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
  // //     } else {
  // //       dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
  // //     }
  // //   };
  // //   getCurrentTrack();
  // // }, [token, dispatch]);
  return (
    <Container>
      {/* {currentPlaying && ( */}
        <div className="track">
          <div className="track__image">
            <img src={currentTrack?.album?.images[2]?.url} alt="currentPlaying" />
          </div>
          <div className="track__info">
            <h4 className="track__info__track__name">{currentTrack?.name}</h4>
            <h6 className="track__info__track__artists">
              {artists.join(" | ")}
            </h6>
          </div>
          
        </div>
      {/* )} */}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    &__image {
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color: white;
      }
      &__track__artists {
        color: #b3b3b3;
      }
    }
  }
`;
