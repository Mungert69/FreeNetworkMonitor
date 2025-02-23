import React, { useRef } from 'react';
import { Howl } from 'howler';

const AudioPlayer = () => {
  const audioQueueRef = useRef([]); // Queue of audio files
  const isPlayingRef = useRef(false); // Tracks if audio is currently playing
  const currentSoundRef = useRef(null); // Holds the current Howl instance

  const playAudioSequentially = (audioFile) => {
    // Add the new file to the queue
    audioQueueRef.current.push(audioFile);
    if (!isPlayingRef.current) {
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

    const sound = new Howl({
      src: [nextFile],
      onend: () => {
        console.log('Audio playback ended.');
        audioQueueRef.current.shift(); // Remove the played file
        playNextInQueue(); // Play the next file in the queue
      },
      onerror: (error) => {
        console.error('Audio playback error:', error);
        audioQueueRef.current.shift(); // Remove the errored file
        playNextInQueue(); // Play the next file in the queue
      },
    });

    currentSoundRef.current = sound;
    sound.play();
  };

  const pauseAudio = () => {
    if (currentSoundRef.current && currentSoundRef.current.playing()) {
      currentSoundRef.current.pause();
    }
  };

  const resumeAudio = () => {
    if (currentSoundRef.current && !currentSoundRef.current.playing()) {
      currentSoundRef.current.play();
    }
  };

  const stopAudio = () => {
    if (currentSoundRef.current) {
      currentSoundRef.current.stop();
      currentSoundRef.current = null;
    }
    isPlayingRef.current = false;
  };

  const clearQueue = () => {
    stopAudio();
    audioQueueRef.current = [];
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