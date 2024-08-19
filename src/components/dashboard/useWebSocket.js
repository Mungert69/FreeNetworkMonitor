import { useEffect, useRef, useState } from 'react';

function useWebSocket(url, siteId, sessionId, llmRunnerType, callbacks) {
    const webSocketRef = useRef(null);
    const [shouldReconnect, setShouldReconnect] = useState(true);

    useEffect(() => {
        let reconnectTimeout;
        let pingInterval;

        const connectWebSocket = () => {
            if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
                console.log('WebSocket is already connected.');
                return;
            }

            console.log('Connecting to WebSocket at ' + getLLMServerUrl(siteId));
            const socket = new WebSocket(getLLMServerUrl(siteId));

            socket.onopen = () => {
                console.log('WebSocket connection established to ' + getLLMServerUrl(siteId));
                socket.send(`${Intl.DateTimeFormat().resolvedOptions().timeZone},${llmRunnerType},${sessionId}`);
                setShouldReconnect(true);

                // Start ping interval to keep the connection alive
                pingInterval = setInterval(() => {
                    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
                        webSocketRef.current.send('');
                    }
                }, 60000); // Ping every 60 seconds
            };

            socket.onmessage = (event) => {
                const newWord = event.data;
                handleMessage(newWord);
            };

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                if (shouldReconnect) {
                    attemptReconnect();
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (shouldReconnect) {
                    attemptReconnect();
                }
            };

            webSocketRef.current = socket;
        };

        const attemptReconnect = () => {
            const reconnectDelay = calculateReconnectDelay();
            console.log(`Attempting to reconnect in ${reconnectDelay / 1000} seconds...`);

            reconnectTimeout = setTimeout(() => {
                connectWebSocket();
            }, reconnectDelay);
        };

        const calculateReconnectDelay = () => {
            // Implement an exponential backoff algorithm for reconnection
            return Math.min(10000, 1000 * Math.pow(2, webSocketRef.current?.reconnectAttempts || 0)); // Max delay 10 seconds
        };

        const handleMessage = (newWord) => {
            // Execute the callback functions passed in the "callbacks" object
            //TODO implement this if condition looking to match newWord is <function-data>SOME TEXT</function-data>
            if (newWord.startsWith('<function-data>') && newWord.endsWith('</function-data>')) {
                // Extract the function data
                const functionData = newWord.slice(15, -16); // Remove the tags
                console.log('Found function data :' + functionData);
                const generatedLinkData = callbacks.processFunctionData(functionData);
                if (generatedLinkData !== null) {
                    callbacks.setLinkData(generatedLinkData);
                    callbacks.setIsDrawerOpen(true);
                }

            }
            else if (newWord.startsWith('</llm-error>')) {
                // Pass only the part of newWord after '</llm-error>'
                var message = {
                    persist: true,
                    text: newWord.substring('</llm-error>'.length),
                    success: false
                };
                callbacks.setMessage(message);
            }
            else if (newWord.startsWith('</llm-info>')) {
                // Pass only the part of newWord after '</llm-error>'
                var message = {
                    info: '',
                    text: newWord.substring('</llm-info>'.length),
                };
                callbacks.setMessage(message);
            }
            else if (newWord.startsWith('</llm-warning>')) {
                // Pass only the part of newWord after '</llm-error>'
                var message = {
                    warning: '',
                    text: newWord.substring('</llm-warning>'.length),
                };
                callbacks.setMessage(message);
            }
            else if (newWord.startsWith('</llm-success>')) {
                // Pass only the part of newWord after '</llm-error>'
                var message = {
                    success: true,
                    text: newWord.substring('</llm-success>'.length),
                };
                callbacks.setMessage(message);
            }
            else if (newWord === '</llm-ready>') {
                callbacks.setIsReady(true);
                callbacks.setLlmFeedback('');
            }
            else if (newWord === '</functioncall>') {
                callbacks.setIsCallingFunction(true);
            }
            else if (newWord === '</functioncall-complete>') {
                callbacks.setIsCallingFunction(false);
            }
            else if (newWord === '<end-of-line>') {
                //setLlmFeedback((prevFeedback) => prevFeedback );

                callbacks.setIsProcessing(false);
            } else {
                callbacks.setSpeechText((prev) => prev + newWord);
                callbacks.setLlmFeedback((prevFeedback) => {
                    // Combine the new word with previous feedback before filtering
                    const combinedFeedback = prevFeedback + newWord;
                    // Now apply the filter on the combined feedback

                    return callbacks.filterLlmOutput(combinedFeedback);
                });


            }
        };

        connectWebSocket();

        return () => {
            setShouldReconnect(false); // Disable reconnection attempts on cleanup
            clearInterval(pingInterval); // Clear ping interval
            clearTimeout(reconnectTimeout); // Clear reconnection timeout

            if (webSocketRef.current) {
                webSocketRef.current.close(); // Close the WebSocket connection
            }
        };
    }, [siteId, sessionId, llmRunnerType, callbacks]);

    return webSocketRef;
}

export default useWebSocket;
