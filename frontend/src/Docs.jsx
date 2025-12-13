import { useNavigate } from "react-router-dom";

function DocsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col font-['Outfit'] text-white">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] animation-delay-2000 animate-float" />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-16 pt-32">

        {/* Header */}
        <section className="text-center space-y-4 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">
                Project <span className="text-gradient">Documentation</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                A comprehensive guide to the Intelligent E-Waste Classification & Valuation System.
            </p>
        </section>

        {/* Overview */}
        <section className="glass-panel p-8 rounded-2xl animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-600">Overview</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                <span className="font-bold text-[var(--text-primary)]">e-nfo</span> is designed to tackle the growing problem of global electronic waste. By leveraging state-of-the-art Computer Vision and Generative AI, this application empowers users to correctly identify, value, and recycle their old electronics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-600 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <h3 className="font-bold mb-1 text-[var(--text-primary)]">Detection</h3>
                    <p className="text-xs text-[var(--text-secondary)]">YOLOv8 instantly identifies electronic components.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-600 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 className="font-bold mb-1 text-[var(--text-primary)]">Analysis</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Gemini AI / Mock Engine values materials.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-600 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <h3 className="font-bold mb-1 text-[var(--text-primary)]">Action</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Finds nearest recycling centers via Maps.</p>
                </div>
            </div>
        </section>

        {/* Technical Architecture */}
        <section className="space-y-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-teal-600">Tech Stack</h2>
            <div className="glass-panel p-6 rounded-2xl">
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded text-xs font-mono border border-yellow-500/20 shrink-0">Frontend</span>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">React + Tailwind CSS</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                Built with Vite for speed. Uses a custom dark/glassmorphism theme ("Antigravity") for a premium feel. State management handles image uploads and async API polling.
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-black/5"></div>
                    <div className="flex items-start gap-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-xs font-mono border border-blue-500/20 shrink-0">Backend</span>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Flask (Python)</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                Lightweight REST API that serves the model. Handles file uploads, image processing, and coordinates the AI services.
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-black/5"></div>
                    <div className="flex items-start gap-4">
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-xs font-mono border border-purple-500/20 shrink-0">AI Models</span>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">YOLOv8 + Gemini / Mock Engine</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                <strong>YOLOv8 (Ultralytics)</strong>: Detects and bounds objects in real-time.<br/>
                                <strong>Gemini (Google)</strong>: Provides material composition and economic analysis (swappable with Mock Engine).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features In-Depth */}
        <section className="space-y-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl hover:bg-black/5 transition-colors">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Real-World Valuation</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        The system estimates the scrap value of detected items in IDR. This isn't just a random number—it's based on the recoverable materials (gold, copper, rare earth elements) found within the detected component.
                    </p>
                </div>
                <div className="glass-panel p-6 rounded-2xl hover:bg-black/5 transition-colors">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Smart Geolocation</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Integrated Google Maps doesn't just show generic results. It dynamically updates the query based on what you scanned (e.g., "recycle laptop") to find the most relevant facilities nearby.
                    </p>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-6 text-center border-t border-white/5">
            <p className="text-[var(--text-secondary)] text-sm">
                &copy; 2024 Group 1 AI AOL. All rights reserved. <br/>
                Built with <span className="text-red-500">♥</span> for the future.
            </p>
        </footer>

      </main>
    </div>
  );
}

export default DocsPage;
