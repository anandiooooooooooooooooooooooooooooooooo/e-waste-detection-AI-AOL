# E-Waste Detection Backend with Gemini AI

Flask backend for e-waste detection using YOLO and Google Gemini AI for intelligent analysis.

## Features

- 🔍 **YOLO Object Detection**: Detect e-waste items in images
- 🤖 **Gemini AI Integration**: AI-powered analysis and recommendations
- 📊 **Detection Analysis**: Get insights about detected e-waste
- ♻️ **Recycling Information**: Detailed recycling guidance for each item type
- 🌐 **RESTful API**: Easy-to-use endpoints for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 3. Run the Server

```bash
python main.py
```

The server will start at `http://localhost:5000`

### 4. Test the Integration

```bash
python test_gemini.py
```

## API Endpoints

### YOLO Detection

#### POST `/detect`

Upload an image for e-waste detection.

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**

```json
{
  "success": true,
  "resultData": {
    "image_url": "/static/uploads/abc123.jpg",
    "detections": [
      {
        "label": "mouse",
        "confidence": 0.95,
        "box": [100, 150, 200, 250]
      }
    ]
  }
}
```

#### GET `/api/result`

Get the latest detection result.

### Gemini AI Endpoints

#### GET `/api/gemini/health`

Check if Gemini service is available.

#### POST `/api/gemini/generate`

Generate text using Gemini AI.

**Request Body:**

```json
{
  "prompt": "Your prompt here",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

#### POST `/api/gemini/analyze-detections`

Analyze YOLO detection results with AI.

**Request Body:**

```json
{
  "detections": [
    { "label": "mouse", "confidence": 0.95, "box": [100, 150, 200, 250] }
  ]
}
```

#### GET `/api/gemini/recycling-info/<item_type>`

Get recycling information for a specific item.

## Project Structure

```
backend/
├── main.py                      # Flask application entry point
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment variables template
├── GEMINI_INTEGRATION.md        # Detailed Gemini API documentation
├── test_gemini.py              # Test script for Gemini integration
├── models/
│   └── yolo/
│       └── yolov8n.pt          # YOLO model weights
├── routes/
│   └── gemini_routes.py        # Gemini API routes
├── services/
│   └── gemini_service.py       # Gemini service class
└── static/
    ├── uploads/                 # Uploaded images
    └── results/                 # Detection results
```

## Usage Examples

### Python

```python
import requests

# Detect e-waste in image
with open('image.jpg', 'rb') as f:
    response = requests.post('http://localhost:5000/detect',
                           files={'file': f})
    result = response.json()

# Analyze detections with Gemini
analysis = requests.post('http://localhost:5000/api/gemini/analyze-detections',
                        json={'detections': result['resultData']['detections']})
print(analysis.json()['text'])

# Get recycling info
info = requests.get('http://localhost:5000/api/gemini/recycling-info/mouse')
print(info.json()['text'])
```

### JavaScript (Frontend Integration)

```javascript
import axios from "axios";

// Upload and detect
const formData = new FormData();
formData.append("file", imageFile);

const detectResponse = await axios.post(
  "http://localhost:5000/detect",
  formData
);
const detections = detectResponse.data.resultData.detections;

// Analyze with Gemini
const analysisResponse = await axios.post(
  "http://localhost:5000/api/gemini/analyze-detections",
  { detections }
);
console.log(analysisResponse.data.text);

// Get recycling info
const infoResponse = await axios.get(
  `http://localhost:5000/api/gemini/recycling-info/${detections[0].label}`
);
console.log(infoResponse.data.text);
```

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI features)

### YOLO Model

Place your trained YOLO model at `models/yolo/yolov8n.pt`. The model should be trained to detect e-waste items.

## Development

### Adding New Gemini Features

1. Add methods to `services/gemini_service.py`
2. Create routes in `routes/gemini_routes.py`
3. Register routes in `main.py`
4. Update documentation

### Testing

Run the test suite:

```bash
python test_gemini.py
```

## Troubleshooting

### "Gemini service not initialized"

- Ensure `.env` file exists with `GEMINI_API_KEY`
- Restart the Flask server after adding the API key

### "YOLO model not found"

- Check that `models/yolo/yolov8n.pt` exists
- Verify the model path in `main.py`

### CORS Issues

- CORS is enabled by default for all origins
- Modify CORS settings in `main.py` if needed

## Documentation

- [Gemini Integration Guide](./GEMINI_INTEGRATION.md) - Detailed Gemini API documentation
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [YOLO Documentation](https://docs.ultralytics.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## License

This project is part of the Group1 AI AOL assignment.

## Support

For issues or questions, please refer to the documentation or contact the development team.
