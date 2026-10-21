# Chat setup and WebSocket protocol

This documents the existing `useWebSocket.jsx`, `Chat.jsx`, `useChatState.jsx`,
and `ChatContent.jsx` behaviour.

## Connect and initialize

On WebSocket open, the chat sends:

```text
timeZone,runnerType,requestSessionId
```

The backend also accepts optional fourth/fifth location and encoded-device
context fields. Empty subsequent messages are keepalives.

`isReady` starts as `false`. Normal prompt sending in `sendMessageCheck` waits
for readiness and an open socket, and the send button is disabled while not
ready. Not every outbound path uses that helper: keepalives and the existing
audio-control effect wait only for an open transport.

Initialization queues `<|REPLAY_HISTORY|>` in `openMessage`. A complete message
exactly equal to `</llm-ready>` sets readiness. The effect in `Chat.jsx` sends
and clears that queued request when ready and connected.

## Classify each complete WebSocket message

The browser delivers complete messages through `onmessage`. Classify
`event.data` before accumulating conversation text. Do not concatenate every
payload into one string and then search it for control tags.

| Payload | Existing handling |
| --- | --- |
| Exactly `</llm-ready>` | Set `isReady`; do not append to conversation text. |
| Prefix `</llm-success>`, `</llm-info>`, `</llm-warning>`, or `</llm-error>` | Set notification state; `Message` displays a snackbar separately from chat content. |
| Exactly `<end-of-line>` | Clear `isProcessing`. |
| `<history-display-name>...</history-display-name>` | Update saved-history metadata. |
| `<function-data>...</function-data>` | Process structured function/link data. |
| Ordinary conversation text/chunks | Filter and append to `llmFeedback`. |

These are literal protocol markers, not balanced XML/HTML. The startup greeting
is wrapped in `</llm-success>` and is therefore a notification, even though it
sounds like assistant conversation text.

## Readiness and ordering

`llm-ready` means the primary has acknowledged startup and the backend has
registered its session. It does not mean every expert is ready, all startup
notifications have arrived, or history replay is finished.

The backend consumes startup notifications and readiness acknowledgements from
different queues. A delayed success notification can arrive after readiness.
This works because notification state is separate from `llmFeedback`, and
notifications do not set readiness back to false. Conversation output after
readiness is also expected: readiness releases the queued history request.

Repeated readiness is not a reset or an instruction to replay again. The
queued request has already been cleared, and the normal ready effect depends
on a change to `isReady`.

Automatic reconnect retains the chat state and does not explicitly queue
another history replay or set `isReady` to false. An explicit `resetLLM`
operation does clear readiness, conversation output, draft, and other UI state.
The current implementation's retained readiness does not guarantee that a
replacement socket has completed backend revalidation.

There is no setup sequence number, universal 20-second setup timeout, or
`socket-ready` message. Startup errors can occur without readiness. Missed
response chunks are not automatically recovered.
