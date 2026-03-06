import React, { useRef } from 'react';
import { Howl } from 'howler';

const AudioPlayer = () => {
  const audioQueueRef = useRef([]); // Queue of playback URLs
  const isPlayingRef = useRef(false); // Tracks if audio is currently playing
  const currentSoundRef = useRef(null); // Holds the current Howl instance
  const streamStateRef = useRef(new Map()); // streamId -> { expectedSeq, pending: Map, gapTimer }

  const clearGapTimer = (state) => {
    if (state?.gapTimer) {
      clearTimeout(state.gapTimer);
      state.gapTimer = null;
    }
  };

  const queuePlaybackUrl = (url) => {
    if (!url) return;
    audioQueueRef.current.push(url);
    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  };

  const scheduleGapFlush = (streamId, state) => {
    clearGapTimer(state);
    state.gapTimer = setTimeout(() => {
      if (!state.pending || state.pending.size === 0) {
        clearGapTimer(state);
        return;
      }

      const pendingSeqs = Array.from(state.pending.keys()).sort((a, b) => a - b);
      const nextAvailableSeq = pendingSeqs[0];
      const nextUrl = state.pending.get(nextAvailableSeq);
      state.pending.delete(nextAvailableSeq);
      state.expectedSeq = nextAvailableSeq + 1;
      console.warn(`[audio] sequence gap detected for stream=${streamId}, forcing seq=${nextAvailableSeq}`);
      queuePlaybackUrl(nextUrl);
      drainStreamQueue(streamId, state);
    }, 1500);
  };

  const drainStreamQueue = (streamId, state) => {
    if (!state) return;

    let advanced = false;
    while (state.pending.has(state.expectedSeq)) {
      const nextUrl = state.pending.get(state.expectedSeq);
      state.pending.delete(state.expectedSeq);
      state.expectedSeq += 1;
      advanced = true;
      queuePlaybackUrl(nextUrl);
    }

    if (state.pending.size === 0) {
      clearGapTimer(state);
      return;
    }

    if (advanced || !state.gapTimer) {
      scheduleGapFlush(streamId, state);
    }
  };

  const playAudioSequentially = (audioInput) => {
    if (!audioInput) return;

    const { url, streamId, seq } = audioInput;
    if (!url) return;

    if (!streamId || !Number.isInteger(seq) || seq < 0) {
      console.warn('[audio] dropping chunk with invalid metadata');
      return;
    }

    let state = streamStateRef.current.get(streamId);
    if (!state) {
      state = {
        expectedSeq: 0,
        pending: new Map(),
        gapTimer: null,
      };
      streamStateRef.current.set(streamId, state);
    }

    if (seq < state.expectedSeq) {
      return;
    }

    if (!state.pending.has(seq)) {
      state.pending.set(seq, url);
    }

    drainStreamQueue(streamId, state);
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
    streamStateRef.current.forEach((state) => clearGapTimer(state));
    streamStateRef.current.clear();
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
