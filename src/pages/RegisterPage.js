import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(showNotification({
        type: 'error',
        message: error,
        duration: 5000
      }));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      dispatch(showNotification({
        type: 'error',
        message: 'El nombre es requerido',
        duration: 3000
      }));
      return false;
    }
    
    if (!formData.email.trim()) {
      dispatch(showNotification({
        type: 'error',
        message: 'El correo es requerido',
        duration: 3000
      }));
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      dispatch(showNotification({
        type: 'error',
        message: 'Formato de correo inválido',
        duration: 3000
      }));
      return false;
    }
    
    if (formData.password.length < 6) {
      dispatch(showNotification({
        type: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres',
        duration: 3000
      }));
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      dispatch(showNotification({
        type: 'error',
        message: 'Las contraseñas no coinciden',
        duration: 3000
      }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      
      dispatch(showNotification({
        type: 'success',
        message: '¡Registro exitoso! Bienvenido a Promibol',
        duration: 3000
      }));
    } catch (error) {
      // El error ya se maneja en el useEffect
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl transition-all hover:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">¡Únete a Promibol!</h1>
          <p className="text-gray-600 text-lg">Crea tu cuenta y sé parte de la comunidad artística</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
              placeholder="tu@email.com"
              required
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              ¿Cómo te registras?
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
            >
              <option value="client">Como Cliente (para ver y contratar)</option>
              <option value="artist">Como Artista (para promocionarte)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-full shadow-lg text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors transform hover:scale-105 ${
                loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-bold text-pink-600 hover:text-pink-800"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;