"""
Test script for Gemini API integration
Run this after setting up your GEMINI_API_KEY in .env file
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test if Gemini service is available"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/api/gemini/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_generate_text():
    """Test text generation"""
    print("\n=== Testing Text Generation ===")
    data = {
        "prompt": "Explain in 2 sentences what e-waste is and why recycling it matters."
    }
    response = requests.post(f"{BASE_URL}/api/gemini/generate", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    if result.get('success'):
        print(f"Generated Text:\n{result['text']}")
    else:
        print(f"Error: {result.get('error')}")
    return response.status_code == 200

def test_analyze_detections():
    """Test detection analysis"""
    print("\n=== Testing Detection Analysis ===")
    data = {
        "detections": [
            {"label": "mouse", "confidence": 0.95, "box": [100, 150, 200, 250]},
            {"label": "keyboard", "confidence": 0.89, "box": [50, 100, 300, 200]},
            {"label": "monitor", "confidence": 0.92, "box": [10, 20, 300, 400]}
        ]
    }
    response = requests.post(f"{BASE_URL}/api/gemini/analyze-detections", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    if result.get('success'):
        print(f"Analysis:\n{result['text']}")
    else:
        print(f"Error: {result.get('error')}")
    return response.status_code == 200

def test_recycling_info():
    """Test recycling information retrieval"""
    print("\n=== Testing Recycling Info ===")
    item_type = "mouse"
    response = requests.get(f"{BASE_URL}/api/gemini/recycling-info/{item_type}")
    print(f"Status: {response.status_code}")
    result = response.json()
    if result.get('success'):
        print(f"Recycling Info for {item_type}:\n{result['text']}")
    else:
        print(f"Error: {result.get('error')}")
    return response.status_code == 200

def main():
    """Run all tests"""
    print("=" * 60)
    print("Gemini API Integration Test Suite")
    print("=" * 60)
    print("\nMake sure:")
    print("1. Flask server is running (python main.py)")
    print("2. GEMINI_API_KEY is set in .env file")
    print("=" * 60)

    try:
        # Test health check first
        if not test_health_check():
            print("\n❌ Health check failed. Make sure GEMINI_API_KEY is set.")
            return

        # Run other tests
        tests = [
            ("Text Generation", test_generate_text),
            ("Detection Analysis", test_analyze_detections),
            ("Recycling Info", test_recycling_info)
        ]

        results = []
        for test_name, test_func in tests:
            try:
                success = test_func()
                results.append((test_name, success))
            except Exception as e:
                print(f"\n❌ {test_name} failed with error: {e}")
                results.append((test_name, False))

        # Print summary
        print("\n" + "=" * 60)
        print("Test Summary")
        print("=" * 60)
        for test_name, success in results:
            status = "✅ PASSED" if success else "❌ FAILED"
            print(f"{test_name}: {status}")

        passed = sum(1 for _, success in results if success)
        total = len(results)
        print(f"\nTotal: {passed}/{total} tests passed")
        print("=" * 60)

    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to Flask server.")
        print("Make sure the server is running: python main.py")

if __name__ == "__main__":
    main()
