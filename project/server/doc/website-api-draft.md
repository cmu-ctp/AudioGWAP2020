# Website API

## Auth

- GET `/api/auth/login`: Twitch Login (Redirect)
- GET `/api/auth/logout`: Twitch Logout (Redirect)
- GET `/api/users/info`: Get current user info

## Events

- GET `/api/streamer/events/upcoming`: Get upcoming events of the current user
- GET `/api/streamer/events/past`: Get past events of the current user
- GET `/api/streamer/events/{id}`: Get the specified event info
- POST `/api/streamer/events`: Create a new event
- PUT `/api/streamer/events/{id}`: Update an existing event
- GET `/api/streamer/events/{id}/token`: Get game starting token of the event

