# JobSprint 🚀

JobSprint is a personal career command center built with React and Vite. It helps track job applications, DSA preparation, development work, CS fundamentals, daily progress, analytics, salary/offer information, and follow-ups in one place.

## Features

- 📊 Dashboard and daily targets
- 📋 Job application tracking with search, filters, follow-ups, and application intelligence
- 🧠 DSA tracker with topics, difficulty, status, revision, and progress
- 💻 Development/project tracker with tasks and activity hours
- 📚 CS Fundamentals preparation tracker
- 📅 Daily progress and streak tracking
- 📈 Analytics for job search and preparation
- 💰 Salary and offer tracking
- 💾 Backup and restore using JSON
- ⚙️ Personal job-search settings
- 🖥️ Electron desktop development mode
- 💾 LocalStorage-based persistence

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Electron
- LocalStorage

## Run locally

```bash
npm install
npm run dev
```

## Run as an Electron desktop app

```bash
npm run electron
```

## Build

```bash
npm run build
```

## Data

Application and tracker data is currently stored in the browser/Electron renderer using LocalStorage. Backup/restore is available from the Backup page.

## Goal

JobSprint is designed as a practical personal system for consistently managing applications, interview preparation, coding practice, development work, and career progress.
