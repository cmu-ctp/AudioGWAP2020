# Dataset Interface

An interface for the AudioGWAP dataset.

## Setting Up

First, run `npm i` in this folder (`interface`) and the `admin-panel` folder.
Then, in the `interface` folder, copy `.env.example` to `.env`, and edit the
`.env` file to match the database details.

### Admin Panel

To run this, first the api server must be running. You can set up nginx to manage these.

#### Local Machine

Follow these instructions to setup a development environment on your machine.
First, you must create a twitch account, and setup the api server with the twitch API.
To do so, go to [dev.twitch.tv](https://dev.twitch.tv), log in, and go to 'Your Console'
on the upper right corner. From there, go to applications, and click 'Register Your Application'.

Name the application whatever you want (this is for development), and set the OAuth Redirect URL
to https://localhost/api/connect/twitch/callback. Set the category to 'Game Integration'.

Then, make sure to keep track of both the Client ID, and the Client Secret. The Client ID
should be logged in `/project/server/.env` as `TWITCH_APP_KEY`, and the Client Secret should
be logged as `TWITCH_APP_SECRET`. When you first setup the app, click 'New Secret' to generate
a secret, and keep track of it, as you won't be able to find it again without having to reset the secret.

Also make sure that the variables for MongoDB in `/project/server/.env` match the settings of your local
installation.

With the twitch keys set up, go to [this link](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/),
and follow the instructions to get an ssl cert and key for your localhost.

Next, install nginx and navigate to where the nginx folder is on your OS.
Add the following block to `nginx.conf`, within the http block.

    server {
        listen 443 ssl http2 default_server;
        listen [::]:443 ssl http2 default_server;
    
        server_name localhost; # Change to your domain
    
        root /path/to/repo/interface/admin-panel/build; # Change with the path on your local machine
    
        ssl_certificate "/etc/ssl/server.crt";          # Change with path to the .crt file you just made
        ssl_certificate_key "/etc/ssl/server.key";      # Change with path to the .key file you just made
        ssl_session_cache shared:SSL:512k;
        ssl_session_timeout  5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers HIGH:3DES:!aNULL:!MD5:!SEED:!IDEA;
        ssl_prefer_server_ciphers off;

        client_max_body_size 100M;
                                        
        location /api {
            proxy_pass http://localhost:3000;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Server $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /upload {
            alias /Users/Andrew/Documents/Programming/AudioGWAP2020/project/server/upload; # Change to with your path
        }
    
        location / {
            #try_files $uri /index.html =404;               # uncomment this line if using static build
            proxy_pass http://localhost:4000;               # uncomment these 4 lines if using development build
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Server $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
This will allow you to run the admin panel and the api server on the same url.
To test, run `nginx -t`, and to start nginx, run `nginx`. Ensure it works by navigating
to https://localhost.

## Running the Interface

The interface app can be started by running `npm run start` in the `interface` directory.
This uses node, express, and pug. The default port used for the app is port 5000.

## Running the Admin Panel

The admin-panel app can be started on port 4000 by running `npm run start` in the `admin-panel`
directory, or you can create a static build with `npm run build`, which can be found in
`admin-panel/build`. Also ensure that the api server is running as well. On a local machine,
you can find the app at https://localhost with the nginx configuration above.

## Current Features

- Search
- Audio Playback in Browser
- Audio Download (individual and zip)
- Admin system (React app in admin-panel folder)
