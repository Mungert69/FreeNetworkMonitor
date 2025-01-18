import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
  const [audioQueue, setAudioQueue] = useState([]); // Queue of audio files
  const isPlayingRef = useRef(false); // Tracks if audio is currently playing
  const audioRef = useRef(null); // Holds the current Audio object
  const isPausedRef = useRef(false);
  const playAudioSequentially = (audioFile) => {
    // Add the new file to the queue
    setAudioQueue((prevQueue) => [...prevQueue, audioFile]);
  };

  const pauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      isPausedRef.current = true;
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && isPausedRef.current) {
      audioRef.current.play();
      isPausedRef.current = false;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop the current audio
      audioRef.current.currentTime = 0; // Reset playback position
      audioRef.current = null; // Clear the current audio object
    }
    isPlayingRef.current = false;
  };

  const clearQueue = () => {
    stopAudio(); // Stop any currently playing audio
    setAudioQueue([]); // Clear the entire queue
  };

  useEffect(() => {
    // Trigger playback if there are files in the queue and nothing is playing
    if (!isPlayingRef.current && audioQueue.length > 0) {
      playNextInQueue();
    }
  }, [audioQueue]);

  const playNextInQueue = () => {
    if (audioQueue.length === 0) {
      isPlayingRef.current = false; // Mark playback as stopped
      return;
    }

    const nextFile = audioQueue[0];
    console.log(`Playing audio: ${nextFile}`);

    isPlayingRef.current = true;
    const audio = new Audio(nextFile);
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      console.log('Audio playback ended.');
      // Remove the played file and trigger the next playback
      setAudioQueue((q) => {
        const updatedQueue = q.slice(1);
        isPlayingRef.current = false; // Allow the next playback to start
        return updatedQueue;
      });
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      // Remove the errored file and trigger the next playback
      setAudioQueue((q) => {
        const updatedQueue = q.slice(1);
        isPlayingRef.current = false; // Allow the next playback to start
        return updatedQueue;
      });
    });

    audio.play().catch((err) => {
      console.error('Audio playback failed:', err);
      // Skip the failed file and trigger the next playback
      setAudioQueue((q) => {
        const updatedQueue = q.slice(1);
        isPlayingRef.current = false; // Allow the next playback to start
        return updatedQueue;
      });
    });
  };

  return {
    playAudioSequentially, // Expose the function to queue audio files
    stopAudio, // Expose the function to stop playback
    clearQueue, // Expose the function to clear the queue
    pauseAudio, // Expose the pause function
    resumeAudio, // Expose the resume function
  };
};

export default AudioPlayer;
