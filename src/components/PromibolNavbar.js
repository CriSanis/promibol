import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PromibolNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { id: '/', name: 'Inicio' },
    { id: '/artists', name: 'Artistas' },
    { id: '/events', name: 'Eventos' },
    { id: '/contact', name: 'Contacto' }
  ];

  const handlePageChange = (pageId) => {
    navigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => handlePageChange('/')}
            className="text-3xl font-extrabold text-yellow-400 flex items-center hover:text-yellow-300 transition-colors"
          >
            PROMIBOL
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  location.pathname === page.id
                    ? 'bg-yellow-400 text-blue-800 font-bold shadow-md'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full bg-yellow-400 text-blue-800 hover:bg-yellow-300 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page.id)}
                className={`block w-full text-left px-4 py-2 rounded-full ${
                  location.pathname === page.id
                    ? 'bg-yellow-400 text-blue-800 font-bold'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default PromibolNavbar;