import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-4xl font-extrabold text-pink-600 hover:text-pink-800 transition-colors transform hover:scale-105">
                PROMIBOL
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/')
                    ? 'border-pink-500 text-pink-700 font-bold'
                    : 'border-transparent text-gray-600 hover:border-pink-300 hover:text-pink-500'
                } inline-flex items-center px-1 pt-1 border-b-4 text-lg font-medium transition-all`}
              >
                Inicio
              </Link>
              <Link
                to="/artists"
                className={`${
                  isActive('/artists')
                    ? 'border-pink-500 text-pink-700 font-bold'
                    : 'border-transparent text-gray-600 hover:border-pink-300 hover:text-pink-500'
                } inline-flex items-center px-1 pt-1 border-b-4 text-lg font-medium transition-all`}
              >
                Artistas
              </Link>
              <Link
                to="/events"
                className={`${
                  isActive('/events')
                    ? 'border-pink-500 text-pink-700 font-bold'
                    : 'border-transparent text-gray-600 hover:border-pink-300 hover:text-pink-500'
                } inline-flex items-center px-1 pt-1 border-b-4 text-lg font-medium transition-all`}
              >
                Eventos
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'artist' && (
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive('/dashboard')
                        ? 'bg-pink-600 text-white'
                        : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                    } px-4 py-2 rounded-full font-medium transition-colors`}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">Hola, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-50 text-pink-600 border border-pink-600 px-4 py-2 rounded-full font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
            >
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`${
                isActive('/')
                  ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Inicio
            </Link>
            <Link
              to="/artists"
              onClick={() => setMobileMenuOpen(false)}
              className={`${
                isActive('/artists')
                  ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Artistas
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`${
                isActive('/events')
                  ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Eventos
            </Link>
            {isAuthenticated && user?.role === 'artist' && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive('/dashboard')
                    ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-4 space-y-2">
                <div className="text-sm text-gray-700">Hola, {user?.name}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-white hover:bg-gray-50 text-pink-600 border border-pink-600 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;