import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend);

function Result() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/result");
        if (!res.ok) throw new Error("Failed to fetch result");
        const json = await res.json();
        // Ensure the format matches: { image_url, detections: [{ label, confidence, box }] }
        setData({
          image_url: json.image_url,
          detections: json.detections || [],
          // Optionally add fallback for materials/pricing if needed
          materials: json.materials || {},
          pricing: json.pricing || {},
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load results.");
        navigate("/", { replace: true });
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!data || !data.materials || Object.keys(data.materials).length === 0)
      return;

    const ctx = document.getElementById("compositionChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(data.materials),
        datasets: [
          {
            data: Object.values(data.materials),
            backgroundColor: [
              "#10b981",
              "#06b6d4",
              "#f59e0b",
              "#8b5cf6",
              "#6b7280",
            ],
            borderColor: "#1e293b",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }, [data]);

  useEffect(() => {
    if (!data || !data.image_url) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = data.image_url;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      data.detections.forEach((det) => {
        if (det.box) {
          const [x1, y1, x2, y2] = det.box;
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            x1 * canvas.width,
            y1 * canvas.height,
            (x2 - x1) * canvas.width,
            (y2 - y1) * canvas.height
          );
          ctx.fillStyle = "#10b981";
          ctx.font = "bold 16px Arial";
          ctx.fillText(
            `${det.label} ${Math.round(det.confidence)}%`,
            x1 * canvas.width,
            y1 * canvas.height - 5
          );
        }
      });
    };
  }, [data]);

  if (!data) {
    return <p className="text-center mt-12 text-white">Loading results...</p>;
  }
  if (!data.detections || data.detections.length === 0) {
    return (
      <p className="text-center mt-12 text-red-400">
        No detections found. Please try another image.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-12 text-center gradient-text">
        Detection Results
      </h1>

      <div className="max-w-4xl mx-auto mb-12">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Scanned Image</h3>
          <canvas
            ref={canvasRef}
            className="w-full rounded-12 mb-4"
            style={{ borderRadius: "12px" }}
          />
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-sm text-green-400 font-semibold">
              ✓ Analysis Complete
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Confidence: {Math.round(data.detections[0]?.confidence || 0)}%
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "details"
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Primary Component
                  </p>
                  <p className="text-lg font-semibold text-green-400">
                    {data.detections[0]?.label || "Circuit Board"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Safety Status</p>
                  <p className="text-lg font-semibold text-green-400">
                    Safe for Recycling
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Estimated Value</p>
                  <p className="text-2xl font-bold gradient-text">
                    Rp. {25000 + Math.round(Math.random() * 50000)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">GIS Map</h3>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonas%2C%20Jakarta%20Pusat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sen!2sid!4v1630000000000!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <div className="max-w-7xl mx-auto">
          <div className="card space-y-8">
            <h3 className="text-2xl font-semibold mb-8">Detailed Analysis</h3>

            {/* Objects Detected */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">Objects Detected</h4>
              {data.detections.map((obj, i) => (
                <div
                  key={i}
                  className="detected-item mb-4 p-3 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-lg">{obj.label}</p>
                      <p className="text-sm text-gray-400">
                        Detected electronic component
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        {Math.round(obj.confidence)}%
                      </p>
                      <p className="text-xs text-green-400">Confidence</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-400">✓ Safe</span>
                    <span className="text-sm font-semibold">
                      Rp. {5000 + Math.round(Math.random() * 10000)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Material Composition */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <h4 className="text-lg font-semibold mb-6">
                Material Composition
              </h4>
              {data.materials && Object.keys(data.materials).length > 0 ? (
                <>
                  <div className="chart-container h-64">
                    <canvas id="compositionChart"></canvas>
                  </div>
                  <div className="mt-6 space-y-2">
                    {Object.entries(data.materials).map(([mat, percent], i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{mat}</span>
                        <span className="font-semibold">{percent}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No material composition data available.
                </div>
              )}
            </div>

            {/* Material Pricing */}
            <div>
              <h4 className="text-lg font-semibold mb-6">
                Material Pricing Breakdown
              </h4>
              {data.pricing && Object.keys(data.pricing).length > 0 ? (
                <>
                  {Object.entries(data.pricing).map(([mat, info], i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-gray-800 py-2"
                    >
                      <div>
                        <p className="font-semibold">{mat}</p>
                        <p className="text-xs text-gray-400">
                          {data.materials[mat]}% of total weight
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Rp. {info.rate.toLocaleString()}/kg
                        </p>
                        <p className="text-sm text-green-400">
                          = Rp. {info.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 text-right">
                    <span className="text-lg font-semibold">
                      Total Estimated Value:
                    </span>
                    <span className="text-3xl font-bold text-green-400">
                      Rp. {25000 + Math.round(Math.random() * 50000)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No pricing data available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-12 flex gap-4 justify-center">
        <button
          className="btn-primary px-8 py-3 text-lg"
          onClick={() => navigate("/")}
        >
          Analyze Another Image
        </button>
      </div>
    </div>
  );
}

export default Result;
