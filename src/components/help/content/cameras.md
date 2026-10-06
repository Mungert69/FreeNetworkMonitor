## Ask about a still image

The Camera expert can capture a still from a reachable RTSP stream or ONVIF camera and send the image with an analysis instruction. This is snapshot analysis, not continuous recording or a guaranteed event-detection system.

Choose an agent on a network that can reach the camera. Provide the protocol, address and port. If authentication is required, the Camera expert asks for the missing credential fields. Review [assistant privacy](/docs/account/) before supplying sensitive information.

## A practical request

“Using my home agent, capture one image from my camera at its local address and describe whether the entrance is obstructed. Tell me if capture fails.” Check that a captured image and completed result are returned before relying on the interpretation.

RTSP capture can require native media tooling such as FFmpeg. ONVIF behaviour depends on the camera’s implementation and access settings. ESP32 does not provide this command; support on other agents depends on installed tools and the deployed build.

## Interpret with care

A single image only shows that moment and viewpoint. Lighting, occlusion and image quality affect analysis. Ask for observable details and uncertainty rather than an unsupported conclusion about everything that happened.

References: [ONVIF specifications](https://www.onvif.org/profiles/specifications/), [FFmpeg documentation](https://ffmpeg.org/documentation.html). Next: [assistant guidance](/docs/assistant/), [agent comparison](/docs/platforms/) and [privacy](/docs/account/).
