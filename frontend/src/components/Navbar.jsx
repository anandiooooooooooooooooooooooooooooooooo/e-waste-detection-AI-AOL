import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <nav className="absolute top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isHome ? 'text-[var(--text-primary)] bg-black/5' : 'text-gray-500 hover:text-black hover:bg-black/5'}`}
                >
                    Home
                </button>
                <button
                    onClick={() => navigate("/result")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${location.pathname === '/result' ? 'text-[var(--text-primary)] bg-black/5' : 'text-gray-500 hover:text-black hover:bg-black/5'}`}
                >
                    Result
                </button>
                <button
                    onClick={() => navigate("/docs")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${location.pathname === '/docs' ? 'text-[var(--text-primary)] bg-black/5' : 'text-gray-500 hover:text-black hover:bg-black/5'}`}
                >
                    Docs
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
}
