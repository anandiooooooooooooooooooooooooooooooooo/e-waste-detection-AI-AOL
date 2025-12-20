# Artificial Intelligence E-Waste Detection

This project is an AI-powered application for detecting and classifying e-waste items, providing recycling information and estimated value. It consists of a Flask backend (using Google Gemini and YOLO) and a React frontend.

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** and **npm**
- **Google Gemini API Key** (Get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

---

## Quick Start Guide

You need to run both the backend and frontend terminals simultaneously.

### 1. Backend Setup (Flask API)

Navigate to the backend directory and set up the environment:

1.  **Open a terminal** and move to the backend folder:
    ```bash
    cd backend
    ```

2.  **Create a virtual environment (optional but recommended):**
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    - Create a `.env` file in the `backend/` directory.
    - Add your Gemini API key:
      ```env
      GEMINI_API_KEY=your_actual_api_key_here
      ```
    - *(Tip: You can copy `.env.example` to `.env` if it exists)*

5.  **Start the Backend Server:**
    ```bash
    python main.py
    ```
    The server should start on `http://127.0.0.1:5000`.

### 2. Frontend Setup (React App)

Open a **new terminal** (keep the backend running) and set up the frontend:

1.  **Move to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The site will typically run on `http://localhost:5173`.

---

## Features

- **Object Detection:** Detects e-waste items using YOLO (or Gemini as fallback).
- **Material Analysis:** precise breakdown of materials found in the e-waste.
- **Value Estimation:** Estimates the potential recycling value.
- **Recycling Locations:** Finds nearby recycling centers using Google Maps.

## Troubleshooting

- **Backend errors?** Check if your `GEMINI_API_KEY` is correct in `backend/.env`.
- **Frontend can't connect?** Ensure the backend is running on port `5000`.
- **Missing modules?** Run `pip install -r requirements.txt` (backend) or `npm install` (frontend) again.
