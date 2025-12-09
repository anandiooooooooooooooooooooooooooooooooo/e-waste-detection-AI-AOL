# Quick Setup Guide for Gemini API Integration

Follow these steps to get the Gemini API integration up and running.

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:

- `flask` - Web framework
- `flask-cors` - CORS support
- `ultralytics` - YOLO model
- `google-generativeai` - Gemini API client
- `python-dotenv` - Environment variable management

## Step 2: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

## Step 3: Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
# On Windows
copy .env.example .env

# On Mac/Linux
cp .env.example .env
```

Edit the `.env` file and add your API key:

```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

## Step 4: Start the Server

```bash
python main.py
```

You should see:

```
 * Running on http://127.0.0.1:5000
```

## Step 5: Test the Integration

Open a new terminal and run:

```bash
python test_gemini.py
```

You should see test results for:

- ✅ Health Check
- ✅ Text Generation
- ✅ Detection Analysis
- ✅ Recycling Info

## Step 6: Test with cURL (Optional)

### Health Check

```bash
curl http://localhost:5000/api/gemini/health
```

### Generate Text

```bash
curl -X POST http://localhost:5000/api/gemini/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is e-waste?"}'
```

### Analyze Detections

```bash
curl -X POST http://localhost:5000/api/gemini/analyze-detections \
  -H "Content-Type: application/json" \
  -d '{"detections": [{"label": "mouse", "confidence": 0.95, "box": [100, 150, 200, 250]}]}'
```

### Get Recycling Info

```bash
curl http://localhost:5000/api/gemini/recycling-info/mouse
```

## Troubleshooting

### Issue: "Gemini service not initialized"

**Solution:**

1. Check that `.env` file exists in `backend/` directory
2. Verify `GEMINI_API_KEY` is set correctly (no quotes, no spaces)
3. Restart the Flask server

### Issue: "Module not found" errors

**Solution:**

```bash
pip install -r requirements.txt --upgrade
```

### Issue: "API key not valid"

**Solution:**

1. Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Make sure you copied the entire key
3. Check for extra spaces or newlines in `.env`

### Issue: "Connection refused" when testing

**Solution:**

1. Make sure Flask server is running (`python main.py`)
2. Check that it's running on port 5000
3. Try accessing `http://localhost:5000/api/gemini/health` in your browser

## Next Steps

1. **Integrate with Frontend**: Use the API endpoints in your React frontend
2. **Customize Prompts**: Modify prompts in `services/gemini_service.py`
3. **Add Features**: Extend the Gemini service with new methods
4. **Deploy**: Deploy to production with proper security measures

## Security Notes

⚠️ **Important:**

- Never commit `.env` file to version control
- Add `.env` to your `.gitignore`
- Use environment variables in production
- Rotate API keys regularly
- Monitor API usage to avoid unexpected charges

## API Rate Limits

Gemini API has rate limits:

- Free tier: 60 requests per minute
- Consider implementing caching for common queries
- Add rate limiting middleware if needed

## Additional Resources

- [Full Documentation](./README.md)
- [Gemini Integration Guide](./GEMINI_INTEGRATION.md)
- [Google Gemini API Docs](https://ai.google.dev/docs)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the full documentation
3. Check Google AI Studio for API status
4. Verify your API key is active

---

**Ready to go!** 🚀

Your Gemini API integration is now set up and ready to use.
