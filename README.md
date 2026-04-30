# Skynet Infrastructure Deployment Dashboard

A Fullstack Single Page Application (SPA) designed to track, manage, and visualize the daily installation progress of ODP (Optical Distribution Point) and ODC (Optical Distribution Cabinet) for the Skynet network infrastructure project.

This application was specifically built to replace and mirror the data structure of the existing Excel spreadsheet tracking system, providing a robust, centralized web interface while maintaining the ability to generate perfect `.xlsx` reports.

## Features

- 📊 **Multi-View Architecture**: 
  - **Overview**: A high-level visual dashboard with summary cards, progress bars, interactive line charts, and team-specific performance rollups.
  - **Pencatatan Harian**: A dedicated CRUD interface for daily data entry, featuring a smart, context-aware form and a comprehensive data table with sticky columns.
- 👥 **Multi-Team Tracking**: Simultaneously records and tracks performance for 4 distinct installation teams (Ridwan, Daffa, Tyo, Baim) per day.
- 📈 **Dynamic Calculations**: Automatically computes daily totals, cumulative sums (Akumulasi), percentage progress against global targets, and remaining sprint days.
- 📥 **Excel Export (SheetJS)**: One-click export generates a multi-sheet `.xlsx` file perfectly formatted to match the original reporting standards.
- 🗄️ **Centralized Database**: Utilizes an Express.js + SQLite backend to ensure data is permanently stored, persistent across all devices, and safe from browser cache clears.
- 🔒 **Admin PIN Protection**: The data entry page is protected by a 4-digit admin PIN to prevent unauthorized modifications and ensure data integrity.

## Tech Stack

**Frontend:**
- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/) (Build tool)
- [Vue Router](https://router.vuejs.org/) (Client-side routing)
- [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first styling)
- [Chart.js](https://www.chartjs.org/) & [vue-chartjs](https://vue-chartjs.org/) (Data visualization)
- [SheetJS (xlsx)](https://sheetjs.com/) (Excel generation)
- [Lucide Icons](https://lucide.dev/) (Iconography)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/) (API Framework)
- [SQLite3](https://www.sqlite.org/) (Database)

---

## Local Development Setup

To run this project locally on your machine:

### Prerequisites
- Node.js (v18 or newer recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend API
In your first terminal, start the Express server (runs on `localhost:3000`):
```bash
npm start
```
*Note: The SQLite database (`database.sqlite`) will be automatically created in the `server/` directory.*

### 2. Configure Environment (Optional)
Copy the example environment file and customize:
```bash
cp .env.example .env
```
Key configuration:
- `ADMIN_PIN`: Set your desired 4-digit PIN for CRUD access (default: `1234`)

### 3. Start the Frontend Vite Server
In a second terminal, start the Vue development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` and automatically proxy API requests to the backend.

**Note**: The default admin PIN is `1234`. You can change it by setting the `ADMIN_PIN` environment variable.

---

## Deployment (Coolify)

This application is fully containerized and optimized for deployment via [Coolify](https://coolify.io/). The provided `Dockerfile` builds the Vue frontend and serves it through the Node.js Express backend in a single container.

### Step-by-Step Deployment:

1. **Push to Git**: Ensure your latest code is pushed to your GitHub/GitLab repository.
2. **Add Resource in Coolify**:
   - Navigate to your Coolify dashboard.
   - Click **Add New Resource** -> **Application** -> **GitHub / Git Provider**.
   - Select this repository.
3. **Configure Settings**:
   - **Build Pack**: Coolify will auto-detect the `Dockerfile`.
   - **Port**: Ensure the internal port is set to `3000`.
   - **Environment Variables**: Set `ADMIN_PIN` to your desired 4-digit PIN (e.g., `ADMIN_PIN=9876`).
4. **Configure Persistent Storage (CRITICAL)**:
   - To ensure your SQLite database isn't erased during updates or container restarts, you must mount a persistent volume.
   - Go to the **Storages** (or Volumes) tab for your application in Coolify.
   - Add a new mount:
     - **Destination Path**: `/app/server`
   - *This mounts the server directory containing `database.sqlite` to your host machine's persistent storage.*
5. **Deploy**:
   - Click the Deploy button. Coolify will build the Docker image and start the application!
