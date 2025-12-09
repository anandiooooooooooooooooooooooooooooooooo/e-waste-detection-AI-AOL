import google.generativeai as genai
import os
from typing import Optional, Dict, Any

class GeminiService:
    """Service class for interacting with Google's Gemini API"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini service with API key

        Args:
            api_key: Optional API key. If not provided, will use GEMINI_API_KEY from environment
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key not found. Set GEMINI_API_KEY environment variable.")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_text(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """
        Generate text using Gemini API

        Args:
            prompt: The text prompt to send to Gemini
            **kwargs: Additional parameters for generation (temperature, max_tokens, etc.)

        Returns:
            Dictionary containing the generated text and metadata
        """
        try:
            response = self.model.generate_content(prompt, **kwargs)
            return {
                "success": True,
                "text": response.text,
                "prompt": prompt
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "prompt": prompt
            }

    def analyze_detection_results(self, detections: list) -> Dict[str, Any]:
        """
        Analyze YOLO detection results using Gemini

        Args:
            detections: List of detection results from YOLO

        Returns:
            Dictionary containing analysis and recommendations
        """
        # Create a prompt based on detection results
        detected_items = [d['label'] for d in detections]
        item_counts = {}
        for item in detected_items:
            item_counts[item] = item_counts.get(item, 0) + 1

        prompt = f"""
        Analyze the following e-waste detection results and provide:
        1. A brief summary of detected items
        2. Environmental impact assessment
        3. Recycling recommendations
        4. Safety considerations

        Detected items: {item_counts}

        Please provide a structured response with clear sections.
        """

        return self.generate_text(prompt)

    def get_recycling_info(self, item_type: str) -> Dict[str, Any]:
        """
        Get recycling information for a specific e-waste item

        Args:
            item_type: Type of e-waste item

        Returns:
            Dictionary containing recycling information
        """
        prompt = f"""
        Provide detailed recycling information for: {item_type}

        Include:
        1. Proper disposal methods
        2. Recyclable components
        3. Hazardous materials to be aware of
        4. Local recycling options (general guidance)
        5. Environmental benefits of proper recycling
        """

        return self.generate_text(prompt)
