from typing import Dict, Any, List
import random

class MockService:
    @staticmethod
    def analyze_detection_results(detections: list) -> Dict[str, Any]:
        """
        Simulate Gemini analysis with realistic hardcoded data for common items.
        """
        detected_items = [d['label'] for d in detections]

        # Default fallback
        analysis = {
            "materials": {"Plastic": 60, "Metal": 30, "Silicon": 10},
            "pricing": {
                "currency": "IDR",
                "estimated_value_min": 5000,
                "estimated_value_max": 25000,
                "reasoning": "Standard E-Waste scrap value estimate."
            },
            "recyclability_score": 50,
            "primary_component": "Mixed Electronics"
        }

        # database of realistic mocks
        mocks = {
            "mouse": {
                "materials": {"ABS Plastic": 45, "Copper Wire": 20, "PCB": 15, "Steel": 10, "Rubber": 10},
                "pricing": {"estimated_value_min": 15000, "estimated_value_max": 40000, "currency": "IDR"},
                "recyclability_score": 65,
                "primary_component": "Computer Mouse"
            },
            "keyboard": {
                "materials": {"ABS Plastic": 70, "Steel Plate": 15, "PCB": 10, "Copper": 5},
                "pricing": {"estimated_value_min": 25000, "estimated_value_max": 75000, "currency": "IDR"},
                "recyclability_score": 60,
                "primary_component": "Computer Keyboard"
            },
            "monitor": {
                "materials": {"Glass Panel": 40, "Plastic Casing": 30, "Steel Shielding": 15, "PCB": 10, "Copper": 5},
                "pricing": {"estimated_value_min": 100000, "estimated_value_max": 350000, "currency": "IDR"},
                "recyclability_score": 75,
                "primary_component": "LCD Monitor"
            },
            "laptop": {
                "materials": {"Aluminum/Plastic": 30, "Li-ion Battery": 20, "Motherboard (Gold/Copper)": 25, "LCD Screen": 15, "Keyboard": 10},
                "pricing": {"estimated_value_min": 500000, "estimated_value_max": 2500000, "currency": "IDR"},
                "recyclability_score": 85,
                "primary_component": "Laptop Computer"
            },
            "cell phone": {
                "materials": {"Glass": 30, "Aluminum": 25, "Lithium Battery": 20, "PCB (Gold/Rare Earth)": 25},
                "pricing": {"estimated_value_min": 200000, "estimated_value_max": 1500000, "currency": "IDR"},
                "recyclability_score": 90,
                "primary_component": "Smartphone"
            }
        }

        # Find the most relevant mock based on detected label
        for item in detected_items:
            key = item.lower()
            if key in mocks:
                analysis = mocks[key]
                # Add some random variance to price to make it feel alive
                variance = random.uniform(0.9, 1.1)
                analysis["pricing"]["estimated_value_min"] = int(analysis["pricing"]["estimated_value_min"] * variance)
                analysis["pricing"]["estimated_value_max"] = int(analysis["pricing"]["estimated_value_max"] * variance)
                break

        return {
            "success": True,
            "analysis": analysis
        }
