import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50">
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white py-24 md:py-40 overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900/?bolivia-carnival)' }}></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 drop-shadow-2xl animate-fade-in-down">
            ¡El Arte Boliviano Explota Aquí!
          </h1>
          <p className="text-xl md:text-3xl mb-12 max-w-4xl mx-auto font-light animate-fade-in-up">
            Sumérgete en un universo de creatividad, pasión y talento inigualable.
          </p>
          <div className="flex justify-center space-x-6 animate-fade-in-up">
            <button
              onClick={() => navigate('/artists')}
              className="bg-yellow-400 hover:bg-yellow-300 text-pink-800 px-10 py-4 rounded-full font-bold text-xl shadow-lg transition-all transform hover:scale-105 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              Explorar Artistas 🎉
            </button>
            <button
              onClick={() => navigate('/events')}
              className="bg-white hover:bg-gray-100 text-purple-600 px-10 py-4 rounded-full font-bold text-xl shadow-lg transition-all transform hover:scale-105 hover:-rotate-1 focus:outline-none focus:ring-4 focus:ring-white"
            >
              Ver Eventos 🎊
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white shadow-inner">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Nuestra Magia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Promoción Estelar',
                description: 'Damos a conocer a músicos, pintores, danzantes y más, ¡con el brillo que merecen!',
                icon: '🌟',
                image: 'https://source.unsplash.com/random/400x300/?bolivian-musician-performance'
              },
              {
                title: 'Eventos Inolvidables',
                description: 'Un calendario lleno de conciertos, exposiciones, obras de teatro y festivales que te harán vibrar.',
                icon: '🎆',
                image: 'https://source.unsplash.com/random/400x300/?bolivian-festival-crowd'
              },
              {
                title: 'Comunidad Creativa',
                description: 'Conectamos mentes brillantes: artistas, gestores y amantes del arte para crear magia juntos.',
                icon: '🤝',
                image: 'https://source.unsplash.com/random/400x300/?bolivian-art-workshop'
              }
            ].map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img src={service.image} alt={service.title} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="p-8">
                  <div className="text-5xl mb-4 text-center animate-bounce-slow">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-3 text-center">{service.title}</h3>
                  <p className="text-gray-700 text-center">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-100 to-orange-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">¡Únete a la Fiesta del Arte!</h2>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Ya seas un artista buscando tu escenario o un alma curiosa sedienta de inspiración, ¡Promibol te espera!
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-full font-bold text-xl shadow-lg transition-colors transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            ¡Regístrate Ahora y Brilla! ✨
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;