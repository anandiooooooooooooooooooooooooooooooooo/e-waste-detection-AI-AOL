# Gemini API Integration Guide

This document explains how to use the Gemini API integration in the Flask backend.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

## API Endpoints

### 1. Health Check

**Endpoint:** `GET /api/gemini/health`

Check if the Gemini service is available.

**Response:**

```json
{
  "service": "gemini",
  "status": "available",
  "message": "Gemini API is ready"
}
```

### 2. Generate Text

**Endpoint:** `POST /api/gemini/generate`

Generate text using Gemini AI.

**Request Body:**

```json
{
  "prompt": "Explain what e-waste is and why it's important to recycle it",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Response:**

```json
{
  "success": true,
  "text": "E-waste, or electronic waste, refers to...",
  "prompt": "Explain what e-waste is..."
}
```

### 3. Analyze Detection Results

**Endpoint:** `POST /api/gemini/analyze-detections`

Analyze YOLO detection results and get AI-powered insights.

**Request Body:**

```json
{
  "detections": [
    {
      "label": "mouse",
      "confidence": 0.95,
      "box": [100, 150, 200, 250]
    },
    {
      "label": "keyboard",
      "confidence": 0.89,
      "box": [50, 100, 300, 200]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "text": "Analysis of detected items:\n\n1. Summary: Detected 1 mouse and 1 keyboard...",
  "prompt": "Analyze the following e-waste detection results..."
}
```

### 4. Get Recycling Information

**Endpoint:** `GET /api/gemini/recycling-info/<item_type>`

Get detailed recycling information for a specific e-waste item.

**Example:** `GET /api/gemini/recycling-info/mouse`

**Response:**

```json
{
  "success": true,
  "text": "Recycling information for mouse:\n\n1. Proper disposal methods...",
  "prompt": "Provide detailed recycling information for: mouse"
}
```

## Usage Examples

### Python (requests)

```python
import requests

# Generate text
response = requests.post('http://localhost:5000/api/gemini/generate', json={
    'prompt': 'What are the environmental benefits of recycling e-waste?'
})
print(response.json())

# Analyze detections
response = requests.post('http://localhost:5000/api/gemini/analyze-detections', json={
    'detections': [
        {'label': 'monitor', 'confidence': 0.92, 'box': [10, 20, 300, 400]}
    ]
})
print(response.json())

# Get recycling info
response = requests.get('http://localhost:5000/api/gemini/recycling-info/monitor')
print(response.json())
```

### JavaScript (axios)

```javascript
import axios from "axios";

// Generate text
const response = await axios.post("http://localhost:5000/api/gemini/generate", {
  prompt: "What are the environmental benefits of recycling e-waste?",
});
console.log(response.data);

// Analyze detections
const analysisResponse = await axios.post(
  "http://localhost:5000/api/gemini/analyze-detections",
  {
    detections: [
      { label: "monitor", confidence: 0.92, box: [10, 20, 300, 400] },
    ],
  }
);
console.log(analysisResponse.data);

// Get recycling info
const infoResponse = await axios.get(
  "http://localhost:5000/api/gemini/recycling-info/monitor"
);
console.log(infoResponse.data);
```

## Integration with YOLO Detection

You can combine YOLO detection with Gemini analysis:

```python
# After YOLO detection
detections = [
    {"label": "mouse", "confidence": 0.95, "box": [100, 150, 200, 250]},
    {"label": "keyboard", "confidence": 0.89, "box": [50, 100, 300, 200]}
]

# Send to Gemini for analysis
response = requests.post('http://localhost:5000/api/gemini/analyze-detections',
                        json={'detections': detections})
analysis = response.json()
print(analysis['text'])
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "prompt": "Original prompt (if applicable)"
}
```

Common errors:

- `500`: Gemini service not initialized (API key missing)
- `400`: Invalid request body
- `500`: Gemini API error

## Best Practices

1. **Rate Limiting**: Be mindful of API rate limits
2. **Error Handling**: Always check the `success` field in responses
3. **Prompt Engineering**: Craft clear, specific prompts for better results
4. **Caching**: Consider caching common queries to reduce API calls
5. **Security**: Never commit your `.env` file with real API keys

## Troubleshooting

### "Gemini service not initialized"

- Check that `.env` file exists in `backend/` directory
- Verify `GEMINI_API_KEY` is set correctly
- Restart the Flask server after adding the API key

### "API key not valid"

- Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Ensure there are no extra spaces in the `.env` file
- Check if the API key has proper permissions

### Import errors

- Run `pip install -r requirements.txt`
- Ensure you're using Python 3.8 or higher

## Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [YOLO Documentation](https://docs.ultralytics.com/)
