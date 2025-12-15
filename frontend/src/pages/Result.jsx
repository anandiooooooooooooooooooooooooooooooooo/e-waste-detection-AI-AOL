import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state from location or sessionStorage
  const [resultData, setResultData] = useState(() => {
      const stateData = location.state?.resultData;
      if (stateData) {
          sessionStorage.setItem('lastResult', JSON.stringify(stateData));
          return stateData;
      }
      const stored = sessionStorage.getItem('lastResult');
      return stored ? JSON.parse(stored) : null;
  });

  const [activeTab, setActiveTab] = useState("details"); // 'details', 'locations'

  useEffect(() => {
     // If we have fresh data from navigation, update storage and state
     if (location.state?.resultData) {
         setResultData(location.state.resultData);
         sessionStorage.setItem('lastResult', JSON.stringify(location.state.resultData));
     }
  }, [location.state]);


  // --- HELPER: Get Unique Colors ---
  const getMaterialColor = (material, index) => {
    // Extensive palette of distinct, vibrant colors to ensure uniqueness
    const palette = [
        "#3B82F6", // Blue-500
        "#EF4444", // Red-500
        "#10B981", // Emerald-500
        "#F59E0B", // Amber-500
        "#8B5CF6", // Violet-500
        "#EC4899", // Pink-500
        "#06B6D4", // Cyan-500
        "#F97316", // Orange-500
        "#6366F1", // Indigo-500
        "#84CC16", // Lime-500
        "#D946EF", // Fuchsia-500
        "#14B8A6", // Teal-500
        "#F43F5E", // Rose-500
        "#A855F7", // Purple-500
        "#EAB308", // Yellow-500
        "#22C55E", // Green-500
    ];
    return palette[index % palette.length];
  };

  // Sort materials by percentage descending
  const sortedMaterials = Object.entries(resultData?.materials || {})
    .sort(([, a], [, b]) => b - a);

  const materialKeys = sortedMaterials.map(([k]) => k);
  const materialValues = sortedMaterials.map(([, v]) => v);
  const materialColors = materialKeys.map((k, i) => getMaterialColor(k, i));

  // --- CHART OPTIONS ---
  const chartData = {
    labels: materialKeys,
    datasets: [
      {
        data: materialValues,
        backgroundColor: materialColors,
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#1e1e1e", font: { family: "Outfit", size: 14 } },
      },
    },
    cutout: "70%",
  };

  if (!resultData) {
      return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-12">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] animation-delay-2000 animate-float" />
            </div>

            <div className="glass-panel p-12 rounded-3xl text-center space-y-6 max-w-lg mx-4 animate-fade-up">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">No result yet..</h2>
                <p className="text-[var(--text-secondary)]">
                    Upload photo first
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                    Start Analysis
                </button>
            </div>
        </div>
      );
  }

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
                        className="w-full h-full object-contain rounded-xl bg-black"
                        onError={() => {
                            console.log("Image failed to load, clearing result data.");
                            sessionStorage.removeItem('lastResult');
                            setResultData(null);
                        }}
                    />
                </div>

                {/* 2. Overview Stats */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Primary Item - Now List of Detected Items */}
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group h-full">
                        <div className="flex-shrink-0 text-teal-500 opacity-20 p-2">
                             <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider mb-2">Detected Items ({resultData.detections?.length || 0})</p>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[160px] custom-scrollbar">
                            {resultData.detections && resultData.detections.length > 0 ? (
                                resultData.detections.map((det, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-2xl font-bold text-[var(--text-primary)] flex items-baseline gap-1">{det.label}</span>
                                        <span className="text-xs font-mono bg-teal-500/10 text-teal-600 px-2 py-1 rounded-full border border-teal-500/20">
                                            {Math.round((det.confidence || 0) * 100)}%
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-2xl font-black text-[var(--text-primary)]">Unknown</p>
                            )}
                        </div>
                        <p className="text-teal-600 mt-3 text-sm font-medium border-t border-black/5 pt-2">
                            {resultData.primary_component || "Detailed Analysis Below"}
                        </p>
                    </div>
                </div>

                    {/* Valuation */}
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
                        <div className="flex-shrink-0 text-teal-400 opacity-20 p-2">
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider mb-1">Estimated Value</p>
                            <p className="text-3xl font-bold text-[var(--text-primary)] flex items-baseline gap-1">
                                {resultData.pricing?.currency || "IDR"}
                                <span className="text-teal-600 ml-2">
                                    {resultData.pricing?.estimated_value_min ? `${resultData.pricing.estimated_value_min.toLocaleString()} - ${resultData.pricing.estimated_value_max.toLocaleString()}` : "0"}
                                </span>
                            </p>
                            <p className="text-[var(--text-secondary)] text-xs mt-2 max-w-sm">{resultData.pricing?.reasoning}</p>
                        </div>
                    </div>

                    {/* Recyclability */}
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
                        <div className="flex-shrink-0 text-teal-500 opacity-20 p-2">
                             <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider mb-1">Recyclability Status</p>
                            <p className="text-3xl font-bold text-[var(--text-primary)]">Safe to Recycle</p>
                            <p className="text-teal-600 mt-2 text-sm">Processed properly at standard facilities.</p>
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
                                <Doughnut data={chartData} options={chartOptions} />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Material Composition</h3>
                                <div className="space-y-4">
                                {sortedMaterials.map(([mat, percent], i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                                <span className="text-[var(--text-secondary)] font-medium group-hover:text-black transition-colors">{mat}</span>
                                                <span className="text-[var(--text-primary)] font-mono font-bold" style={{ color: getMaterialColor(mat, i) }}>{percent}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full relative transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${percent}%`,
                                                        backgroundColor: getMaterialColor(mat, i)
                                                    }}
                                                >
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`${activeTab === 'locations' ? 'block' : 'hidden'} h-[90vh] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative`}>
                             <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '500px' }}
                                loading="eager"
                                allowFullScreen
                                src={`https://www.google.com/maps?q=barang+bekas+${resultData.detections[0]?.label || "elektronik"}&output=embed&t=k`}
                            ></iframe>

                        </div>
                </div>
            </div>

        </div>
    </div>
  );
}

export default Result;
