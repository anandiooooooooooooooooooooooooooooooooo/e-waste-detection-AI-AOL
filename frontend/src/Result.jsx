import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend);

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const chartRef = useRef(null);

  const [activeTab, setActiveTab] = useState("details"); // 'details', 'locations'

  // Get data from navigation state or redirect if missing
  const resultData = location.state?.resultData;

  useEffect(() => {
    if (!resultData) {
        navigate("/", { replace: true });
    }
  }, [resultData, navigate]);

  // --- CHART EFFECT ---

  useEffect(() => {
    if (!resultData) return;

    // Draw Chart
    if (activeTab === "details") {
        const timer = setTimeout(() => {
            const ctx = document.getElementById("compositionChart");
            if (ctx) {
                if (chartRef.current) {
                    chartRef.current.destroy();
                }

                chartRef.current = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: Object.keys(resultData.materials || {}),
                        datasets: [
                        {
                            data: Object.values(resultData.materials || {}),
                            backgroundColor: [
                            "#40b19b", // Primary Teal
                            "#1e1e1e", // Dark Grey
                            "#f59e0b", // Amber (Accent)
                            "#6b7280", // Slate
                            "#9ca3af", // Light Grey
                            ],
                            borderColor: "rgba(255, 255, 255, 1)", // White border for separation
                            borderWidth: 2,
                            hoverOffset: 10
                        },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { color: '#1e1e1e', font: { family: 'Outfit', size: 14 } }
                            },
                        },
                        cutout: '70%',
                    },
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [resultData, activeTab]);

  if (!resultData) return null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col pt-24 pb-12">
        {/* Background Decor */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] animate-float" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] animation-delay-2000 animate-float" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-up">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                     <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border border-black/10 backdrop-blur-sm text-xs font-medium text-teal-600 mb-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                        Analysis Complete
                    </div>
                    <h2 className="text-4xl font-bold text-[var(--text-primary)]">Result Overview</h2>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="btn-secondary flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Analyze Another
                </button>
            </div>

            {/* TOP ROW: Image + Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Annotated Image */}
                <div className="glass-panel p-2 rounded-2xl relative group overflow-hidden h-full min-h-[400px]">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium text-white flex items-center gap-2">
                        <span className="text-[var(--text-tertiary)]">Confidence:</span> <span className="text-teal-400">{Math.round((resultData.detections[0]?.confidence || 0) * 100)}%</span>
                    </div>
                    <img
                        src={`http://127.0.0.1:5000${resultData.annotated_image_url}`}
                        alt="Annotated Result"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>

                {/* 2. Overview Stats */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Primary Item */}
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                             <svg className="w-32 h-32 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider mb-1">Detected Item</p>
                        <p className="text-4xl font-black text-[var(--text-primary)]">{resultData.detections[0]?.label || "Unknown"}</p>
                        <p className="text-teal-600 mt-2 text-sm">{resultData.primary_component}</p>
                    </div>

                    {/* Valuation */}
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-32 h-32 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider mb-1">Estimated Value</p>
                        <p className="text-3xl font-bold text-[var(--text-primary)] flex items-baseline gap-1">
                            {resultData.pricing?.currency || "IDR"}
                            <span className="text-teal-600 ml-2">
                                {resultData.pricing?.estimated_value_min ? `${resultData.pricing.estimated_value_min.toLocaleString()} - ${resultData.pricing.estimated_value_max.toLocaleString()}` : "0"}
                            </span>
                        </p>
                        <p className="text-[var(--text-secondary)] text-xs mt-2 max-w-sm">{resultData.pricing?.reasoning}</p>
                    </div>

                    {/* Recylability */}
                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
                        <div>
                             <p className="text-teal-600 text-sm font-medium uppercase tracking-wider mb-1">Recyclability Status</p>
                             <p className="text-xl font-bold text-[var(--text-primary)]">Safe to Recycle</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: Deep Dive Card */}
            <div className="glass-panel rounded-2xl p-0 overflow-hidden min-h-[600px] flex flex-col">
                {/* Tabs Header */}
                <div className="border-b border-black/5 bg-black/5 p-4 flex gap-4">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'details' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25' : 'text-[var(--text-secondary)] hover:text-black hover:bg-black/5'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        Component Breakdown
                    </button>
                    <button
                        onClick={() => setActiveTab('locations')}
                        className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'locations' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25' : 'text-[var(--text-secondary)] hover:text-black hover:bg-black/5'}`}
                    >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Recycling Centers
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 bg-black/5">
                     {activeTab === 'details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center">
                            <div className="h-[400px] relative">
                                <canvas id="compositionChart"></canvas>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Material Composition</h3>
                                <div className="space-y-4">
                                    {Object.entries(resultData.materials || {}).map(([mat, percent], i) => (
                                        <div key={i} className="group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[var(--text-secondary)] font-medium group-hover:text-black transition-colors">{mat}</span>
                                                <span className="text-teal-600 font-mono">{percent}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-teal-500 to-teal-400 relative"
                                                    style={{ width: `${percent}%` }}
                                                >
                                                    <div className="absolute top-0 right-0 bottom-0 w-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'locations' && (
                        <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                             <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '500px' }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps?q=recycle+${resultData.detections[0]?.label || "e-waste"}+near+me&output=embed`}
                            ></iframe>
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-xl">
                                📍 Near You
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
}

export default Result;
