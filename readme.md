# File Sharing App

**Tech Stack**: EJS, Tailwind CSS, Express.js, Node.js, MongoDB

## deployment
we are going to deploy this code on vercel platform

## Running the Application

### Development Command

To run both the Tailwind CSS and Node.js server simultaneously, use:

```bash
yarn dev
```

main file location is `api/index.js`

# .env file

```
PORT = your port | 3000
MONGO_URI = your mongodb url
JWT_SECRET = your jwt secret key
APP_BASE_URL = http://localhost:3000
SMTP_HOST = you smtp host
SMTP_PORT = your smtp port
MAIL_USER = your smtp user id
MAIL_PASS = smtp password
DROPBOX_ACCESS_TOKEN = your dropbox access token
DROPBOX_CLIENT_ID= your dropbox client Id
DROPBOX_CLIENT_SECRET = your dropbox client secret
DROPBOX_REFRESH_TOKEN= your dropbox refresh token

```

# icon source

for svg icons i used [hugeicons](https://hugeicons.com/) this website

# font source

font i used in wolf share is `sans` from tailwind default and [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono), for some modern feel

# email services

https://app.brevo.com/ - we used as SMTP server , you can use any services based on your preference ,if you ever wanted to use this app

`whats happening here .. ?`
->
the api/index.js is a main file , in this project we are going to share any file to any person using email services , for this we need to first upload the file to the cloud then it send to the receiver (a person who will receive this file) , for this we need to specify the sender and receiver email

# for cloud

for cloud i used dropbox cloud for storing the files there [dropbox](https://www.dropbox.com/developers) you can create your account here also
"# wolf-share"

<!-- thanks god all code  -->
