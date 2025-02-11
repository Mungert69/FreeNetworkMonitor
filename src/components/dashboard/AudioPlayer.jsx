import React, { useRef } from 'react';

const AudioPlayer = () => {
  const audioQueueRef = useRef([]); // Queue of audio files
  const isPlayingRef = useRef(false); // Tracks if audio is currently playing
  const audioRef = useRef(null); // Holds the current Audio object
  const isPausedRef = useRef(false);

  const playAudioSequentially = (audioFile) => {
    // Add the new file to the queue
    audioQueueRef.current.push(audioFile);
    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      isPausedRef.current = true;
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && isPausedRef.current) {
      audioRef.current.play().catch((err) => {
        console.error('Error resuming audio playback:', err);
      });
      isPausedRef.current = false;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeEventListener('ended', onAudioEnd);
      audioRef.current.removeEventListener('error', onAudioError);
      audioRef.current = null;
    }
    isPlayingRef.current = false;
  };

  const clearQueue = () => {
    stopAudio();
    audioQueueRef.current = [];
  };

  const onAudioEnd = () => {
    console.log('Audio playback ended.');
    // Remove the played file and play the next in the queue
    audioQueueRef.current.shift();
    isPlayingRef.current = false;
    if (audioQueueRef.current.length > 0) {
      playNextInQueue();
    }
  };

  const onAudioError = (error) => {
    console.error('Audio playback error:', error);
    // Remove the errored file and play the next in the queue
    audioQueueRef.current.shift();
    isPlayingRef.current = false;
    if (audioQueueRef.current.length > 0) {
      playNextInQueue();
    }
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const nextFile = audioQueueRef.current[0];
    console.log(`Playing audio: ${nextFile}`);
    isPlayingRef.current = true;

    const audio = new Audio(nextFile);
    audioRef.current = audio;

    audio.addEventListener('ended', onAudioEnd);
    audio.addEventListener('error', onAudioError);

    audio.play().catch((err) => {
      console.error('Audio playback failed:', err);
      onAudioError(err);
    });
  };

  return {
    playAudioSequentially,
    stopAudio,
    clearQueue,
    pauseAudio,
    resumeAudio,
  };
};

export default AudioPlayer;
