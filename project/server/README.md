# Echoes Server

## Getting Started

### Prerequsites

- Node.js 12+
- MongoDB 4.2
- Nginx
- PM2 (install via `npm install -g pm2`)

We highly recommend to install Node.js with [NVM](https://github.com/nvm-sh/nvm) on a separate user's home directory instead of root.

The following instructions take Ubuntu as an example. The steps will vary depending on different Linux distributions.

### MongoDB Setup

Please [check this documentation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) to install MongoDB first.

Create the database and collections:

```bash
mongo             # Connect to MongoDB
> use echoes      # Switch to "echoes" db; The database will be created automatically on use
> db.createCollection('events')
> db.createCollection('sound')
> db.createCollection('users')
> db.createCollection('sound_categories')   # Not used yet
> quit()
```

For a more secure database configuration for production environment, we highly recommend to enable MongoDB's access control feature. Please [check this page](https://docs.mongodb.com/manual/tutorial/enable-authentication/) to learn how to set it up.

### App Setup

```bash
chmod -R 755 upload    # Grant read access to upload directory
npm install
cp .env.example .env
vim .env               # Edit config file
```

__Note:__ You need to create a Twitch application and fill in with keys (Client ID) and secrets (Client Secret) from the [Twitch developer website](https://dev.twitch.tv/). The OAuth Redirect URL should be like`https://hcii-gwap-01.andrew.cmu.edu/api/connect/twitch/callback`.

If you have set username and password for MongoDB, make sure the username and password are configured in `.env` file, and then uncomment the following lines in `config/mongo.js`:

```js
/* ... */
// user: process.env.MONGO_USERNAME || 'admin',
// pass: process.env.MONGO_PASSWORD || '123456',
// authSource: process.env.MONGO_AUTH_SOURCE || 'admin',
/* ... */
```

Then try to run the server locally to see if it works:

```bash
npm run start
# (Use Ctrl-C to kill the server)
```

If the server throws an error, please check all the configurations above before you move on.

### PM2 Setup

Install PM2 first:

```bash
npm install -g pm2
```

Then relocate to the project directory and start the server application with PM2:

```bash
# Under .../Team-Echoes/project/server
pm2 start server.js --name echoes-server
```

If you would like to run multiple Node.js processes to make use of multiprocessors, use the [cluster mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/) instead:

```bash
pm2 start server.js -i max --name echoes-server
```

You should see all the running processes in `pm2 ls`. If you wish to stop the server, run `pm2 stop echoes-server`.

To set up PM2 startup on boot, follow the commands below:

```bash
$ pm2 startup
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=.......
```

Then copy the command appeared above and run it in the terminal. Then the startup script will be ready.

We will also need to save the current running applications:

```bash
pm2 save
```

For detailed instructions on how to use PM2, please visit [the documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).

### Nginx Setup

Install Nginx first:

```bash
sudo apt-get install nginx
```

Create a configuration file with the name `echoes-server` under `/etc/nginx/sites-available`. The following is an example for the file, and you will need to change domain name and path according to your settings.

```
server {
    listen 80;

    server_name echoes.etc.cmu.edu;           # Change to your domain

    root /home/echoes/Team-Echoes/web/build;  # Change to with your path
    index index.html;

    client_max_body_size 100M;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /upload {
        alias /home/echoes/Team-Echoes/project/server/upload;  # Change to with your path
    }

    location / {
        try_files $uri /index.html =404;
    }
}
```

Create a soft link for the configuration file:

```bash
# Under /etc/nginx
cd sites-enabled
sudo ln -s ../sites-available/echoes-server echoes-server
```

Then reload the configurations in Nginx:

```bash
sudo nginx -t         # Test if the configuration works
sudo nginx -s reload  # Reload configurations
```

Before you test everything, make sure you have built the frontend assets as well! (run `yarn build` in `web` directory) Then you are all set and should see the server working!

If you would like to set up SSL for the server, please check [Let's Encrypt](https://letsencrypt.org/) and [Certbot instructions](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx).

## Test in Server Environment

All the files on the server are configured under `echoes` user. To access the files with a proper privilege, you need to use commands like this:

```bash
sudo -u echoes -H mv somefile somewhere
```

Or more simply:

```bash
sudo -u echoes -H bash      # This opens the bash under the user "echoes"
echoes@echoes.etc:~$
```

__Never access the `/home/echoes` with the root permission because the server might have privilege issues later.__

## Test in Local Environment

```bash
npm run start
```

By default, the server will run at http://localhost:3000.

## Command Line Tool

The server comes with a CLI tool for maintanence purpose.

```bash
./echoes-cli command
```

Use `./echoes-cli help` to see all the avilable commands.

## API Documentation

The server comes with a API generation tool that can output a set of documentations for the server APIs.

To generate the API doc, try:

```bash
npm run apidoc
```

Then the doc will be under `doc/api/build` directory.
