import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'El nombre es requerido';
    if (!formData.email.trim()) return 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Email inválido';
    if (!formData.message.trim()) return 'El mensaje es requerido';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setSubmitStatus({
        loading: false,
        success: false,
        error: validationError
      });
      return;
    }

    setSubmitStatus({ loading: true, success: false, error: null });

    // Simulación de envío
    setTimeout(() => {
      setSubmitStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    }, 1500);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">Contáctanos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Información de contacto</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Teléfono</h3>
                  <p className="text-blue-600">+591 12345678</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Email</h3>
                  <p className="text-blue-600">contacto@promibol.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Dirección</h3>
                  <p className="text-blue-600">Av. Cultural #123, La Paz, Bolivia</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Envía un mensaje</h2>
            {submitStatus.success && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
              </div>
            )}
            {submitStatus.error && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                {submitStatus.error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-1">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-800 mb-1">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submitStatus.loading}
                className={`w-full px-6 py-3 rounded-full font-bold transition-colors flex items-center justify-center ${
                  submitStatus.loading
                    ? 'bg-yellow-300 text-blue-800 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-blue-800'
                }`}
              >
                {submitStatus.loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Enviar mensaje'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

// DONE