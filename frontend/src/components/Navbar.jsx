import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/20 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate("/")}
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">e-<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">nfo</span></h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isHome ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Home
                </button>
                <button
                    onClick={() => navigate("/docs")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${location.pathname === '/docs' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Docs
                </button>
                <button
                    onClick={() => {
                        navigate("/");
                        // Add a small delay to allow navigation to complete before scrolling
                        setTimeout(() => {
                           const fileInput = document.getElementById('fileInput');
                           if(fileInput) fileInput.click();
                        }, 100);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all"
                >
                    Analyze Now
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
}
