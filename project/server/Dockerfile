FROM node:10-alpine
WORKDIR /polyphonic
COPY . .
RUN ["npm", "config", "set", "proxy", "http://proxy.andrew.cmu.edu:3128"]
RUN ["npm", "config", "set", "https-proxy", "http://proxy.andrew.cmu.edu:3128"]
RUN npm install
EXPOSE 3500
CMD ["npm","start"]



