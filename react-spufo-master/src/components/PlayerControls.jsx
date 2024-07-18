import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import {
  setTracks,
  setCurrentTrack,
  setCurrentIndex,
  getTracks,
  getCurrentTrack,
  getCurrentIndex,
} from "../utils/sharedVariables";

export default function PlayerControls() {
  const [{ token, playerState }, dispatch] = useStateProvider();
  const total = getTracks();
  const currentIndex = getCurrentIndex();
  const currentTrack = getCurrentTrack();

  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const audioRef = useRef(new Audio(total[0]?.track ? total[0]?.track.preview_url : total[0]?.preview_url));
  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration } = audioRef.current;
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  useEffect(() => {
    if (audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.play();
        startTimer();
      } else {
        clearInterval(intervalRef.current);
        audioRef.current.pause();
      }
    } else {
      if (isPlaying) {
        audioRef.current = new Audio(total[currentIndex]?.track?.preview_url || total[currentIndex]?.preview_url);
        audioRef.current.play();
        startTimer();
      } else {
        clearInterval(intervalRef.current);
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(total[currentIndex]?.track?.preview_url || total[currentIndex]?.preview_url);

    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      isReady.current = true;
    }
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < total.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else setCurrentIndex(0);
  };

  const handlePrev = () => {
    if (currentIndex - 1 < 0) setCurrentIndex(total.length - 1);
    else setCurrentIndex(currentIndex - 1);
  };

  const addZero = (n) => {
    return n > 9 ? "" + n : "0" + n;
  };

  const TrackTime = ({ currentTime, duration }) => {
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
      <TimeText>
        <span>0:{formatTime(currentTime)}</span>
        <span>0:{formatTime(duration)}</span>
      </TimeText>
    );
  };

  return (
    <Container>
      <ProgressBar>
        <ProgressFill style={{ width: `${currentPercentage}%` }} />
      </ProgressBar>
      <TrackTime currentTime={Math.round(trackProgress)} duration={30} />
      <ControlButton onClick={() => handlePrev()}>
        <CgPlayTrackPrev />
      </ControlButton>
      <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
      </ControlButton>
      <ControlButton onClick={() => handleNext()}>
        <CgPlayTrackNext />
      </ControlButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: relative;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: -8px;
  left: 10px;
  right: 10px;
  width: calc(100% - 20px);
  height: 4px;
  background-color: #b3b3b3;
  border-radius: 2px;
`;

const TimeText = styled.div`
  position: absolute;
  top: -28px; /* Adjust the top position */
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
  color: #b3b3b3;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: white;
  border-radius: 2px;
`;

const ControlButton = styled.div`
  font-size: 2rem;
  cursor: pointer;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
  }
  &:hover svg {
    color: white;
  }
`;
