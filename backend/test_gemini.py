"""
Test script for Gemini API integration
Run this after setting up your GEMINI_API_KEY in your environment
"""

import requests
import json

BASE_URL = "http://localhost:5000"


# =============================================================
# Helper functions
# =============================================================
def print_section(title: str):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def pretty(data):
    return json.dumps(data, indent=2)


# =============================================================
# Test cases
# =============================================================
def test_health_check():
    print_section("Testing Health Check")
    response = requests.get(f"{BASE_URL}/api/gemini/health")

    print(f"Status: {response.status_code}")
    try:
        print(pretty(response.json()))
    except Exception:
        print("Invalid JSON response")

    return response.status_code == 200


def test_generate_text():
    print_section("Testing Text Generation")

    payload = {
        "prompt": "Explain e-waste recycling in 1 sentence."
    }

    response = requests.post(f"{BASE_URL}/api/gemini/generate", json=payload)
    print(f"Status: {response.status_code}")

    data = response.json()

    if data.get("success"):
        print("Generated Text:")
        print(data["text"])
    else:
        print(f"Error: {data.get('error')}")

    return response.status_code == 200


def test_analyze_detections():
    print_section("Testing Detection Analysis")

    payload = {
        "detections": [
            {"label": "mouse", "confidence": 0.97},
            {"label": "keyboard", "confidence": 0.91},
            {"label": "monitor", "confidence": 0.95}
        ]
    }

    response = requests.post(f"{BASE_URL}/api/gemini/analyze-detections", json=payload)
    print(f"Status: {response.status_code}")

    data = response.json()
    if data.get("success"):
        print("Analysis:")
        print(data["text"])
    else:
        print(f"Error: {data.get('error')}")

    return response.status_code == 200


def test_recycling_info():
    print_section("Testing Recycling Info")

    item_type = "laptop"
    response = requests.get(f"{BASE_URL}/api/gemini/recycling-info/{item_type}")

    print(f"Status: {response.status_code}")
    data = response.json()

    if data.get("success"):
        print(f"Recycling Info for {item_type}:")
        print(data["text"])
    else:
        print(f"Error: {data.get('error')}")

    return response.status_code == 200


# =============================================================
# NEW TEST: MATERIAL + PRICE + MAP COORDINATES
# =============================================================
def test_analyze_object():
    print_section("Testing Object Material/Price/Map Analysis")

    payload = {
        "detections": [
            {"label": "smartphone", "confidence": 0.96},
            {"label": "laptop", "confidence": 0.88},
            {"label": "charger", "confidence": 0.92}
        ]
    }

    response = requests.post(f"{BASE_URL}/api/gemini/analyze-object", json=payload)
    print(f"Status: {response.status_code}")

    try:
        data = response.json()
    except Exception:
        print("Invalid JSON returned")
        return False

    if data.get("success"):
        print("Object Analysis:")
        print(data["text"])
    else:
        print(f"Error: {data.get('error')}")

    return response.status_code == 200


# =============================================================
# Main runner
# =============================================================
def main():
    print_section("Gemini API Integration Test Suite")

    print("Prerequisites:")
    print("1. Flask server is running (python main.py)")
    print("2. GEMINI_API_KEY is set in OS environment")
    print("3. Internet connection is active")
    print("=" * 60)

    try:
        # Start with health check
        if not test_health_check():
            print("\n❌ Health check failed. Check API key or server.")
            return

        tests = [
            ("Text Generation", test_generate_text),
            ("Detection Analysis", test_analyze_detections),
            ("Recycling Info", test_recycling_info),
            ("Object Material/Price/Map Analysis", test_analyze_object)
        ]

        results = []
        for name, func in tests:
            try:
                ok = func()
                results.append((name, ok))
            except Exception as e:
                print(f"\n❌ {name} crashed: {e}")
                results.append((name, False))

        print_section("Test Summary")
        for name, ok in results:
            print(f"{name}: {'✅ PASSED' if ok else '❌ FAILED'}")

        passed = sum(1 for _, ok in results if ok)
        total = len(results)
        print(f"\nTotal Passed: {passed}/{total}")

    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to Flask server.")
        print("Run: python main.py")


if __name__ == "__main__":
    main()
