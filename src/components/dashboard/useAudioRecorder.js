import { useState, useRef } from 'react';
import toWav from 'audiobuffer-to-wav';

const useAudioRecorder = (processAudioBlob) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    console.log('Starting recording...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted.');

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        console.log('Audio chunk received:', event.data);
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped.');
        console.log('Final audio chunks:', chunks);

        const audioBlob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });
        const wavBlob = await convertOggToWav(audioBlob);
        console.log('Converted WAV Blob:', wavBlob);

        // Call the provided processAudioBlob function
        if (processAudioBlob) {
          console.log('Calling processAudioBlob...');
          processAudioBlob(wavBlob);
        } else {
          console.warn('processAudioBlob function is not provided.');
        }
      };

      mediaRecorder.start();
      console.log('MediaRecorder started.');
      setAudioChunks([]); // Clear previous chunks
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone.');
    }
  };

  const stopRecording = () => {
    console.log('Stopping MediaRecorder...');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.warn('No active MediaRecorder instance to stop.');
    }
  };

  const getAudioBlob = () => {
    console.log('Fetching audio blob...');
    if (audioChunks.length > 0) {
      const audioBlob = audioChunks[0];
      console.log('Audio blob ready:', audioBlob);
      return audioBlob;
    }
    console.warn('No audio chunks available for blob creation.');
    return null;
  };
  const convertOggToWav = async (oggBlob) => {
    console.log("Converting OGG to WAV with improved normalization...");

    // Read the OGG blob as an ArrayBuffer
    const arrayBuffer = await oggBlob.arrayBuffer();

    // Create an AudioContext for decoding and resampling
    const audioContext = new AudioContext();
    const originalAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Resample to 16 kHz with an OfflineAudioContext
    const targetSampleRate = 16000;
    const offlineAudioContext = new OfflineAudioContext(
      1, // Mono channel
      Math.ceil(originalAudioBuffer.duration * targetSampleRate), // Total frame count
      targetSampleRate // Target sample rate
    );

    // Normalize the audio dynamically
    const normalizedBuffer = normalizeAudio(originalAudioBuffer);

    // Create a source for the normalized audio
    const source = offlineAudioContext.createBufferSource();
    source.buffer = normalizedBuffer;

    // Add a high-pass filter to remove DC offset
    const highPassFilter = offlineAudioContext.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.value = 20; // Cut frequencies below 20 Hz

    // Add a low-pass filter for basic noise reduction
    const lowPassFilter = offlineAudioContext.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.value = 8000; // Cut frequencies above 8 kHz

    // Connect the audio graph
    source.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(offlineAudioContext.destination);

    // Start playback for resampling
    source.start(0);

    // Render the cleaned and normalized audio
    const cleanedAudioBuffer = await offlineAudioContext.startRendering();

    // Convert the cleaned audio buffer to WAV format
    const wavBuffer = toWav(cleanedAudioBuffer);
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

    console.log("Conversion with improved normalization complete. WAV Blob:", wavBlob);

    return wavBlob;
  };

  const normalizeAudio = (audioBuffer, targetRMS = 0.1) => {
    const rawData = audioBuffer.getChannelData(0); // Mono channel
    const rms = calculateRMS(rawData);
    console.log(`Current RMS: ${rms}`);

    // Calculate the scaling factor
    const scale = targetRMS / rms;
    console.log(`Scaling factor: ${scale}`);

    // Create a new buffer and apply normalization
    const normalizedData = rawData.map((sample) => Math.max(-1, Math.min(1, sample * scale)));

    // Create a new AudioBuffer with the normalized data
    const normalizedBuffer = new AudioContext().createBuffer(
      1, // Mono channel
      normalizedData.length,
      audioBuffer.sampleRate
    );
    normalizedBuffer.copyToChannel(normalizedData, 0);

    return normalizedBuffer;
  };

  const calculateRMS = (samples) => {
    // Calculate the RMS value of the audio samples
    const sumSquares = samples.reduce((sum, sample) => sum + sample ** 2, 0);
    return Math.sqrt(sumSquares / samples.length);
  };  

  return { isRecording, startRecording, stopRecording, getAudioBlob };
};

export default useAudioRecorder;
