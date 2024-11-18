# Wolf Share - File Sharing App

**Tech Stack**: EJS, Tailwind CSS, Express.js, Node.js, MongoDB

---

## About

### How to Upload a File?
📂 **Steps**:
- Go to the **Home Page**.
- Click the **Browse File** option to select a file.
- Hit the **Upload Button** to upload the file.
- After uploading, you can choose to share the file via email. Alternatively, visit the **Account Page** to manage or share files later.

### What is the Account Page?
👤 **Overview**:
The **Account Page** allows you to:
- Perform **CRUD operations** on uploaded files.
- Share files or preview them.
- Access details of all your files and user info for efficient file management.

### What is the Pricing Page?
💳 **Details**:
The **Pricing Page** outlines the **Free** and **Premium Plans**, along with their benefits and advantages.

---

## Deployment

This application is deployed on **Vercel** for easy and fast accessibility.

---

## Running the Application

### install packages
```
yarn
```
### Development Command
To start both the **Tailwind CSS** and **Node.js server**, run:
```bash
yarn dev
```

---
## env
```PORT=your_port | 3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret_key
APP_BASE_URL=http://localhost:3000
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
MAIL_USER=your_smtp_user_id
MAIL_PASS=your_smtp_password
DROPBOX_ACCESS_TOKEN=your_dropbox_access_token
DROPBOX_CLIENT_ID=your_dropbox_client_id
DROPBOX_CLIENT_SECRET=your_dropbox_client_secret
DROPBOX_REFRESH_TOKEN=your_dropbox_refresh_token
```


</br>

## Icon source
 here in wolf share we used svg icon from [hugeIcons]("https://hugeicons.com/")


## Font
here i used tailwind default font and IBM plex mono from google fonts

## Email Services
for smtp server i use `gmail`

``
 the api/index.js is a main file , in this project we are going to share any file to any person using email services , for this we need to first upload the file to the cloud then it send to the receiver (a person who will receive this file) , for this we need to specify the sender and receiver email
 ``
## For cloud storage

for cloud i used dropbox cloud for storing the files there [dropbox](https://www.dropbox.com/developers) you can create your account here also
"# wolf-share"
