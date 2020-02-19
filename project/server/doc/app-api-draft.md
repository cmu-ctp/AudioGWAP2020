# Mobile App API

## Auth

- GET `/api/auth/app/login`: Twitch Login (Redirect)
- GET `/api/users/info`: Get current user info

## Events

- GET `/api/viewer/events`: Get/Search/Query event list
- GET `/api/viewer/events/joined`: Get joined event list of the current user
- GET `/api/viewer/events/:id`: Get event detail (w/ categories)
- POST `/api/viewer/events/:id/join`: Join an event
- POST `/api/viewer/events/:id/exit`: Exit an event

## Sound

- GET `/api/viewer/events/:id/sound`: Get sound list of the current user in the current event
- GET `/api/viewer/sound`: Get sound list of the current user
- POST `/api/viewer/events/:id/sound`: Submit and upload sound
- DELETE `/api/viewer/events/:id/sound/:soundid`: Delete (Fake) a sound clip

## Fake

- POST `/api/viewer/events/fake/sound`: Upload sound for playtesting
