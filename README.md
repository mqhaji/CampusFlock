# CampusFlock Plan

CampusFlock is a web-based event management platform designed to recommend events to users with AI. 

The platform is being developed with Vue.js for the frontend and MongoDB Atlas for the backend. It aims to provide a seamless user experience, offering features like event discovery, AI-generated event suggestions, and a user profile page. 

## Pages
- Home Page: Displays a list of upcoming events. Uses a card-based layout to showcase events. 
- Suggested Page: Provides AI-driven event recommendations based on the user's preferences. 
- Profile Page: Displays user information and their avatar. Allows the user to manage their profile details. 
- Search Page: Allows users to search for specific events. 

## Technology used 
Frontend:
- TypeScript/JavaScript
- Vue.js
- Vuetify
- Vue Router

Backend:
- MongoDB
- Node.js

## Running locally
Install dependencies:
```bash
npm install
cd server && npm install
```

Run both frontend and backend together:
```bash
npm run dev:all
```

Or run them separately:
```bash
cd server && npm run dev
```
```bash
npm run dev
```

## Current progress
- General page layout and design
- Search functionality
- API Communication
- MongoDB basic setup and schema

## Plans for the future
- Implement MongoDB Atlas
- AI recommendation algorithm
- User accounts and verified org accounts

## Acknowledgements
Icons used from [Material Design Icons]([https://materialdesignicons.com](https://pictogrammers.com/library/mdi/)) under the [Open Font License (OFL)](https://openfontlicense.org/open-font-license-official-text/).

