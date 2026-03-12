# Video Player — Google Drive

React and Next.js app to play videos from a folder in your Google Drive, with a Loom-like interface.

## Features

- No user login required
- The app uses a **Google service account** to read the folder
- Video listing from one or more Drive folders (organized in the sidebar)
- Playback in a modal with HTML5 player
- Clean Loom-style interface: sidebar, card grid, player in modal

## Setup

### 1. Environment variables

Copy the example file and fill in the values:

```bash
cp .env.local.example .env.local
```

- **GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL** and **GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY**: service account credentials (see below).
- **GOOGLE_DRIVE_FOLDER_ID**: ID of a single Drive folder (classic option). You can see it in the URL when you open the folder: `https://drive.google.com/drive/folders/THIS_IS_THE_ID`
- **GOOGLE_DRIVE_FOLDERS** (optional): Multiple named folders for the UI. JSON format: `[{"id":"folder-id-1","name":"Tutorials"},{"id":"folder-id-2","name":"Recordings"}]`. If you set this, `GOOGLE_DRIVE_FOLDER_ID` is ignored and the sidebar will show the folders in order (including an "All" option).

### 2. Google Cloud Console (service account)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a project (or use an existing one).
2. Enable **Google Drive API**: in "APIs & services" → "Library" → search for "Google Drive API" → Enable.
3. Go to "IAM & Admin" → "Service accounts" → "Create service account".
4. Create the account (minimum role "Reader" is usually enough) and, in the "Keys" tab, create a **JSON key**.
5. Copy the `client_email` and `private_key` from the JSON to:
   - `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (replace newlines with `\n` as in `.env.local.example`).

### 3. Drive folder(s)

- Create one or more folders in Google Drive and upload your videos there.
- Share each folder with the **service account email** as "Viewer".
- Open each folder in the browser and copy the ID from the URL into `GOOGLE_DRIVE_FOLDER_ID` (single folder) or into `GOOGLE_DRIVE_FOLDERS` as JSON with `id` and `name` for multiple (the array order is the order shown in the sidebar).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Anyone who visits will see the videos from the configured folder (no login required).

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **googleapis** (Drive API with service account)
- **Tailwind CSS 4**
