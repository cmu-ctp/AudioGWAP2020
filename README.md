# AudioGWAP2020
A repository for the AudioGWAP2020 Project

# Deployment Guidelines:
(All guidelines mentioned below are mentioned with reference our Linux server (Fedora Distro) as base. Also, if the application is being hosted on CMU servers, enable proxy as mention in https://docs.google.com/document/d/1NjGPYJsT67-I_U6G9u3IEATHdYQM6PzyIi_Pu6kKRgo/edit)

## Creating a Twitch account
* Create a twitch account by logging in at https://www.twitch.tv/ and verify the email associated with the account.
* Once logged in, click on the profile icon on the top right corner and select settings.
* In the Settings page, click on Security and Privacy tab, enable the Two Factor Authentication.
* Go to https://dev.twitch.tv and use the account credentials previously created to log in and click on 'Your Console' on top right corner.
* Select the Application tab and click on Register your application.
* Enter the name as "Polyphonic" and https://hcii-gwap-01.andrew.cmu.edu/api/connect/twitch/callback as OAuth Redirect URL.
* Enter 'Gaming Integration' as category and click on create. This will register a call back from Twitch to our application as we are using Twitch's OAuth Service.
* Clicking on create will route you back to Console page and will display the application as registered under 'Developer Application'.
* Click on 'Manage' for the application created and scroll down. The displayed client ID is the required TWITCH_APP_KEY. Click on new secret and it will display a client secret which is the required TWITCH_APP_SECRET. Keep a note of them as these will be required for setting up the .env file in the source code.

## NPM
* Run 'sudo yum install npm'.
* To add proxy to all packages that npm downloads, follow the documentation present at https://docs.google.com/document/d/1NjGPYJsT67-I_U6G9u3IEATHdYQM6PzyIi_Pu6kKRgo/edit.
(Note: There is a proxy for CMU servers and can vary for different hosting organization. Hence they need to be enabled if the application is being hosted on CMU campus cloud.).



## Cloning the source code

* Clone the source code from the master branch of the repository inside the directory where the project needs to be set up by 'sudo git clone https://github.com/Ludolab/AudioGWAP2020.git'.
* Inside the /project folder create a .env file where a sample .env.example has been shared as:
```
# Application
APP_PROTOCOL=http
APP_HOST=localhost
APP_PUBLIC_HOST=localhost:3500
APP_PORT=3500
APP_SECRET=RandomKeyphrase

# Database
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_DB=echoes
MONGO_USER=admin
MONGO_PASS=123456
MONGO_AUTH_SOURCE=admin

# Twitch API
TWITCH_APP_KEY=
TWITCH_APP_SECRET=

```
* Fill in the twitch app key which is the client id and twitch app secret which is the client secret associated with respective twitch account.
* Update the MONGO_PASS shared with you by the admin and save the file.
**Ensure not to push any .env file into GitHub that has credentials**
* Navigate outside /project folder and open docker-compose file in editor. The mongo service will be present as:
```
mongo:
    build: database/
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME:
      MONGO_INITDB_ROOT_PASSWORD:
    ports:
      - "27018:27017"
    expose:
      - "27017"
    volumes:
      - "/var/lib/mongo:/data/db" 
```
* Enter MONGO_INITDB_ROOT_USERNAME same as MONGO_USER and MONGO_INITDB_ROOT_PASSWORD same as MONGO_PASS as mentioned earlier in the .env file. 
**Before commiting any changes to master brach, remove the credentials mentioned in the docker-compose file**

## Serving the Streamer's UI
* To serve the streamer's UI, navigate  inside /web folder and run 'sudo npm run build'. This will create a web/build. This where the UI is served. Take a note of this absolute path of this static folder as this need to be mentioned in Nginx conf file. 



## Nginx
* To install nginx, run 'sudo yum install nginx'. [ https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/ ].
* Create a config file with the name nginx.conf under /etc/nginx add the following configuration inside http block:
```
    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  hcii-gwap-01.andrew.cmu.edu;
        root 		<<Absolute path to UI static files for eg. /home/aishwary/AudioGWAP/AudioGWAP2020/web/build>>;

        ssl_certificate "/etc/ssl/certs/hcii-gwap.andrew.cmu.edu_new.crt";
        ssl_certificate_key "/etc/ssl/hcii-gwap.andrew.cmu.edu_new.4075.key";
        ssl_session_cache shared:SSL:512k;
        ssl_session_timeout  5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers HIGH:3DES:!aNULL:!MD5:!SEED:!IDEA;
        ssl_prefer_server_ciphers off;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        client_max_body_size 100M;

        location /api {
            proxy_pass http://localhost:3500;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Server $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
	 
        location /upload {
            alias /home/aishwary/AudioGWAP/AudioGWAP2020/project/server/upload;
        }

        location / {
                try_files $uri /index.html =404;
        }
        
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```
* To enable nginx service, run 'sudo systemctl enable nginx'. This ensures that when server is rebooted/restarted, nginx application does not require to be launched manually everytime.
* After enabling, restart docker by 'sudo systemctl restart nginx' for the previous step to take effect.
* Run 'sudo systemctl status nginx' to make sure docker is active and running and no error has occured




## Docker 
The backend server and database are deployed using Docker. Each service has a docker file that mentions the specifications of creating a Docker image.

* To install docker, run 'sudo yum install docker'.  
* Enable the service file for docker by 'sudo systemctl enable docker'. 
* After enabling, restart docker by 'sudo systemctl restart docker' for the previous step to take effect.
* Run 'sudo systemctl status docker' to make sure docker is active and running and no error has occured.
* Navigate inside the folder where docker-compose file is present and run 'sudo docker-compose up --build -d'. This will create the containers from the image specification mentioned in Dockerfile for individual service.
* To check status of all containers, run 'sudo docker container ls'.
* A comprehensive set of all docker commands can be found at https://docs.docker.com/engine/reference/commandline/docker/ 
* Navigate inside /etc/systemd/system/ and run ' sudo mkdir docker-compose.service.d'.
* Go inside this created directory and create a new service file by executing 'sudo vi docker-compose-polyphonic.service'.
* Add the follwing configuration in the service file:
```
[Unit]
Description=Docker Compose Polyphonic Service
Requires=docker.service
After=docker.service

[Service]
WorkingDirectory=/home/aishwary/AudioGWAP/AudioGWAP2020
ExecStart=/usr/bin/docker-compose up
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0
Restart=on-failure
RestartSec=30s
StartLimitIntervalSec=60
StartLimitBurst=3

[Install]
WantedBy=multi-user.target
```
* Save and exit the file and run 'sudo systemctl enable docker-compose-polyphonic'. This will ensure that whenever the server is rebooted/restarted, the application is hosted by default and requires no manual intervention.

