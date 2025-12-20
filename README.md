# 🌍 E-Waste Detection AI

> **📚 Academic Project**
> Final Project for Artificial Intelligence Course - 3rd Semester
> BINUS University

An AI-powered application for detecting and classifying electronic waste, providing material analysis, recycling value estimates, and recycling center locations.

**Tech Stack:** Flask + Google Gemini + YOLOv8 (Backend) | React + Vite + Three.js (Frontend)

---

## 📋 Table of Contents

- [How It Works](#-how-it-works)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

---

## 🔄 How It Works

1. **User uploads an image** of electronic waste through the React frontend
2. **Image is sent to Flask backend** via REST API
3. **YOLOv8 model detects** and identifies e-waste items in the image
4. **Google Gemini AI analyzes** the detected items for:
   - Material composition (copper, aluminum, plastics, etc.)
   - Estimated recycling value in IDR
   - Recyclability score
5. **Results are displayed** with annotated images, charts, and Google Maps locations

---

## ✅ Prerequisites

Before you begin, make sure you have:

- **Python 3.8+** installed
- **Node.js 16+** and **npm** installed
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

---

## 🚀 Quick Start

### Step 1: Backend Setup (Python/Flask)

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

**Create a virtual environment (recommended):**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Configure API Key:**

Create a `.env` file in the `backend/` directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Start the server:**

```bash
python main.py
```

✅ Backend should now be running at `http://127.0.0.1:5000`

---

### Step 2: Frontend Setup (React/Vite)

Open a **new terminal** (keep the backend running) and navigate to the frontend folder:

```bash
cd frontend
```

**Install dependencies:**

```bash
npm install
```

**Start the development server:**

```bash
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173`

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Object Detection** | Uses YOLOv8 to detect e-waste items in uploaded images |
| 🧪 **Material Analysis** | AI-powered breakdown of materials (copper, gold, plastics, etc.) |
| 💰 **Value Estimation** | Estimates potential recycling value in Indonesian Rupiah |
| 📊 **Visual Analytics** | Charts showing material composition and recyclability |
| 🗺️ **Recycling Locations** | Google Maps integration to find nearby recycling centers |

---

## 📁 Project Structure

```
.
├── backend/                # Flask Backend (Python)
│   ├── datasets/           # Dataset metadata for training
│   ├── models/             # YOLOv8 model weights (.pt files)
│   ├── routes/             # API endpoints (/detect, /api/*)
│   ├── services/           # Business logic (YOLO, Gemini, Mock)
│   ├── static/             # File storage (uploads & results)
│   ├── main.py             # Flask app entry point
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages (Home, Result, Docs)
│   │   └── api/            # API client helpers
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite build configuration
│
└── README.md               # This file
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| ❌ Backend errors on startup | Check if `GEMINI_API_KEY` is correctly set in `backend/.env` |
| ❌ Frontend can't connect to backend | Ensure backend is running on port `5000` |
| ❌ "Module not found" errors | Run `pip install -r requirements.txt` (backend) or `npm install` (frontend) |
| ❌ YOLO model not loading | Verify that `backend/models/yolo/best_40ep_60map.pt` exists |

---

**Made with ❤️ for a sustainable future**
