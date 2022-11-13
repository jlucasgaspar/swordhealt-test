## What you'll need to run this API
 - NodeJS (version >= 16)
 - Docker

## Step by step guide
 1. `npm install`
 2. `cp .env.example .env`
 2. `docker-compose up -d`
 3. Wait docker goes up completely, then run `npx knex migrate:latest`
 4. To create 1 manager and 3 technicians, run `npx knex seed:run`
 5. `npm run start:dev`
 6. Wait the terminal show the log message **"Nest application successfully started"** and access the url `http://localhost:3000/docs` to see swagger documentation

## Postman docs to download
 - [Postman Environment](https://drive.google.com/file/d/1QKiPojjnnekzTNxXHI5IDSvFbtI01Juf/view?usp=share_link)
 - [Postman Requests Collection](https://drive.google.com/file/d/1uyjGSaKRaC0-qwZDkKUxOwQmwb__L1al/view?usp=share_link)