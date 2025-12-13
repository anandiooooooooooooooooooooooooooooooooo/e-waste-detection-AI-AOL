import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_IMAGE_URL =
  "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=500&fit=crop";

function App() {
  const navigate = useNavigate();
  const uploadCardRef = useRef(null);
  const fileInputRef = useRef(null);

  // App State
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Loading Steps
  const loadingSteps = [
    "Detecting components...",
    "Analyzing materials...",
    "Calculating value...",
  ];

  // Convert file/blob to Base64 URL
  const fileToDataUrl = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

  const displayImage = async (file) => {
    setFile(file);
    const url = await fileToDataUrl(file);
    setPreviewUrl(url);
  };

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) displayImage(selectedFile);
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) displayImage(droppedFile);
    if (uploadCardRef.current) {
        uploadCardRef.current.classList.remove("drag-over");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (uploadCardRef.current) {
        uploadCardRef.current.classList.add("drag-over");
    }
  };

  const handleDragLeave = () => {
    if (uploadCardRef.current) {
        uploadCardRef.current.classList.remove("drag-over");
    }
  };

  const useDemoImage = async () => {
    try {
      const res = await fetch(DUMMY_IMAGE_URL);
      const blob = await res.blob();
      displayImage(blob);
    } catch (err) {
      console.error("Failed to load demo image", err);
    }
  };

  const startDetecting = async () => {
    if (!file) return alert("Please upload an image first!");

    setLoading(true);
    setLoadingStep(0);

    // Simulate steps locally for effect while fetching
    const stepInterval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/detect", formData);
      if (!res.data.success) throw new Error("Detection failed");

      // Artificial delay to show off animation if api is too fast
      setTimeout(() => {
        clearInterval(stepInterval);
        navigate("/result", { state: { resultData: res.data.resultData } });
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("Upload or detection failed.");
      setLoading(false);
    }
  };


  // --- RENDER HELPERS ---

  const renderLoading = () => (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-up">
        <div className="relative w-32 h-32 mb-12">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 border-r-teal-500 animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 rounded-full border border-teal-500/30"></div>
            <div className="absolute inset-4 rounded-full bg-teal-500/10 flex items-center justify-center overflow-hidden backdrop-blur-md">
                <svg className="w-12 h-12 text-teal-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
            </div>
        </div>

        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Analyzing E-Waste</h2>
        <p className="text-gray-500 mb-8">AI is processing your image...</p>

        {/* Steps */}
        <div className="space-y-4 w-full max-w-xs">
            {loadingSteps.map((step, index) => (
                <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${index <= loadingStep ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                    <div className={`w-3 h-3 rounded-full ${index < loadingStep ? 'bg-teal-500' : index === loadingStep ? 'bg-teal-500 animate-ping' : 'bg-gray-300'}`}></div>
                    <span className={index <= loadingStep ? 'text-[var(--text-primary)] font-medium' : 'text-gray-400'}>{step}</span>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] animation-delay-2000 animate-float" />
      </div>

      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl w-full mx-auto">

            {!loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Hero Left */}
                    <div className="space-y-8 animate-fade-up">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border border-black/10 backdrop-blur-sm text-xs font-medium text-teal-600">
                                <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                                AI-Powered Detection
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tight">
                            <span className="text-[var(--text-primary)]">Next Gen</span>
                            <br />
                            <span className="text-gradient drop-shadow-sm">E-Waste</span>
                            <br />
                            <span className="text-[var(--text-secondary)]">Analysis</span>
                            </h1>
                        </div>
                        <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                            Unlock the value of electronic waste with <span className="text-[var(--text-primary)] font-semibold">e-nfo</span>.
                            Powered by YOLOv8 and custom regression models to give you instant, accurate component breakdowns and valuation.
                        </p>

                    </div>

                    {/* Hero Right: Upload Card */}
                    <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="glass-panel rounded-3xl p-8 relative z-10 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    Upload Image
                                </h3>
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                                    <span className="w-2 h-2 rounded-full bg-yellow-500/50"></span>
                                    <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label
                                    htmlFor="fileInput"
                                    className={`upload-zone h-64 flex flex-col items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden group ${previewUrl ? 'has-image' : ''}`}
                                    ref={uploadCardRef}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="text-center p-6 space-y-3 relative z-10">
                                                <div className="w-16 h-16 rounded-full bg-black/5 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                                    <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <p className="text-lg font-medium text-[var(--text-primary)]">Drop image here</p>
                                                <p className="text-sm text-[var(--text-secondary)]">or click to browse</p>
                                            </div>
                                        )}
                                        {previewUrl && (
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white font-medium flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                Change Image
                                                </span>
                                            </div>
                                        )}
                                        <input
                                        type="file"
                                        id="fileInput"
                                        className="hidden"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                {previewUrl ? (
                                    <button
                                        className="btn-primary w-full py-4 text-lg shadow-lg shadow-purple-500/20"
                                        onClick={startDetecting}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Analyzing...
                                            </span>
                                        ) : "Analyze Now"}
                                    </button>
                                ) : (
                                    <>
                                        <div className="relative flex py-2 items-center">
                                            <div className="flex-grow border-t border-black/10"></div>
                                            <span className="flex-shrink-0 mx-4 text-[var(--text-secondary)] text-xs uppercase tracking-wider">Or try demo</span>
                                            <div className="flex-grow border-t border-black/10"></div>
                                        </div>
                                        <button
                                            className="btn-secondary w-full py-3 flex items-center justify-center gap-2 group"
                                            onClick={useDemoImage}
                                        >
                                            <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Use Sample Image</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : renderLoading()}

        </div>
      </section>
    </div>
  );
}

export default App;
