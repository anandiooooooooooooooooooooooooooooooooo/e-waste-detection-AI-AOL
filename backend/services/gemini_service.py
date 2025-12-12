import google.generativeai as genai
import os
from typing import Optional, Dict, Any, List


class GeminiService:
    """Service class for interacting with Google's Gemini API"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key not found. Set GEMINI_API_KEY environment variable.")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_text(self, prompt: str, **kwargs) -> Dict[str, Any]:
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

    # =============================================================
    # NEW FEATURE: MATERIAL + PRICE ESTIMATE + MAP COORDINATES
    # =============================================================
    def analyze_object(self, detections: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze detected e-waste items and produce:
        1. Estimated materials inside the object
        2. Potential recycling/selling value
        3. Useful Google Maps coordinates based on the item
        """

        detected_items = [d["label"] for d in detections]
        item_counts = {}
        for item in detected_items:
            item_counts[item] = item_counts.get(item, 0) + 1

        prompt = f"""
        You are an expert in e-waste, recycling economics, and environmental safety.

        Based on these detected objects:
        {item_counts}

        Provide a structured analysis with:

        1. MATERIAL ESTIMATION
           - List the expected materials inside each object (example: copper, aluminum, PCB, rare metals, plastics)
           - Provide % estimation or rough weight contribution per material
           - Mention hazardous components if any

        2. RECYCLING VALUE ESTIMATE
           - Estimate potential selling price if we recycle or sell the materials
           - Provide a *range* in USD based on typical market scrap prices
           - Break it down per material (copper value, aluminum value, PCB recovery value, etc.)
           - Provide a total potential value for all detected items combined

        3. GOOGLE MAPS COORDINATES
           - Suggest 2–3 useful locations the user can visit based on the item type:
             Example categories:
               * e-waste recycling centers
               * electronics repair shops
               * official hazardous waste drop-off
           - For each place provide:
               * Name
               * Type of location
               * Example coordinates (latitude, longitude)
               * Short reason why this place is relevant

           NOTE: The coordinates must be fictional but realistic-looking,
           because you cannot access real-time maps. Do NOT mention this limitation.

        4. FINAL SUMMARY
           - Summarize environmental benefit if the user recycles these items correctly
        """

        return self.generate_text(prompt)

    # =============================================================
    # Existing features kept as-is
    # =============================================================
    def analyze_detection_results(self, detections: list) -> Dict[str, Any]:
        import json

        detected_items = [d['label'] for d in detections]
        item_counts = {}
        for item in detected_items:
            item_counts[item] = item_counts.get(item, 0) + 1

        prompt = f"""
        You are an expert e-waste valuator and materials scientist.
        Analyze these detected items: {item_counts}

        Provide a strictly valid JSON response with the following structure:
        {{
            "materials": {{
                "Material Name": percentage_integer
            }},
            "pricing": {{
                "currency": "IDR",
                "estimated_value_min": integer_value,
                "estimated_value_max": integer_value,
                "reasoning": "Short explanation of value based on current scrap prices in Indonesia"
            }},
            "recyclability_score": integer_0_to_100,
            "primary_component": "Name of the main component detected"
        }}

        Rules:
        1. Materials must sum to roughly 100%. estimate based on the typical composition of these electronic items.
        2. Pricing should be realistic for SCRAP/RECYCLE value in Indonesia (Rupiah), not retail value.
        3. Do NOT wrap in markdown code blocks. Just raw JSON.
        """

        try:
            response = self.model.generate_content(prompt)
            print(f"Gemini Raw Response: {response.text}") # Debug

            # Clean response if it has markdown formatting
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text.replace("```json", "", 1)
            if clean_text.startswith("```"):
                clean_text = clean_text.replace("```", "", 1)
            if clean_text.endswith("```"):
                clean_text = clean_text.replace("```", "", 1)

            data = json.loads(clean_text)
            return {
                "success": True,
                "analysis": data
            }
        except Exception as e:
            print(f"Gemini Error: {e}")
            return {
                "success": False,
                "error": str(e),
                "analysis": {
                    "materials": {"Plastic": 50, "Metal": 30, "Other": 20},
                    "pricing": {"estimated_value_min": 10000, "estimated_value_max": 50000, "currency": "IDR"},
                    "recyclability_score": 50,
                    "primary_component": "Unknown"
                }
            }

    def get_recycling_info(self, item_type: str) -> Dict[str, Any]:
        prompt = f"""
        Provide detailed recycling information for: {item_type}

        Include:
        1. Proper disposal methods
        2. Recyclable components
        3. Hazardous materials to be aware of
        4. Local recycling options (generic guidance)
        5. Environmental benefits of proper recycling
        """

        return self.generate_text(prompt)
