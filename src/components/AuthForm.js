import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onAuth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onAuth(formData);
      navigate(formData.role === 'artist' ? '/artist-dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={handleChange}
                    className="text-blue-500 focus:ring-blue-200"
                  />
                  <span className="ml-2 text-gray-700">Cliente</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="artist"
                    checked={formData.role === 'artist'}
                    onChange={handleChange}
                    className="text-blue-500 focus:ring-blue-200"
                  />
                  <span className="ml-2 text-gray-700">Artista</span>
                </label>
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            type === 'login' ? 'Iniciar Sesión' : 'Registrarse'
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        {type === 'login' ? (
          <p>
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;