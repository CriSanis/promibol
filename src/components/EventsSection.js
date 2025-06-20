import { useState } from 'react';
import { Link } from 'react-router-dom';

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState('Próximos');

  const events = [
    {
      id: 1,
      title: 'Festival Internacional de Danza',
      date: '15 Oct 2023',
      location: 'Teatro Municipal, La Paz',
      type: 'Danza',
      image: '/images/evento1.jpg',
      status: 'Próximos'
    },
    {
      id: 2,
      title: 'Exposición de Arte Contemporáneo',
      date: '22 Oct 2023',
      location: 'Museo Nacional de Arte',
      type: 'Pintura',
      image: '/images/evento2.jpg',
      status: 'Próximos'
    },
    {
      id: 3,
      title: 'Concierto de Música Andina',
      date: '5 Nov 2023',
      location: 'Plaza Mayor, Sucre',
      type: 'Música',
      image: '/images/evento3.jpg',
      status: 'Próximos'
    },
    {
      id: 4,
      title: 'Feria Artesanal Internacional',
      date: '12 Nov 2023',
      location: 'Campo Ferial, Santa Cruz',
      type: 'Artesanía',
      image: '/images/evento4.jpg',
      status: 'Próximos'
    },
    {
      id: 5,
      title: 'Festival de Teatro Callejero',
      date: '3 Sep 2023',
      location: 'Calles del Centro, Cochabamba',
      type: 'Teatro',
      image: '/images/evento5.jpg',
      status: 'Pasados'
    },
    {
      id: 6,
      title: 'Encuentro de Poetas Bolivianos',
      date: '20 Ago 2023',
      location: 'Biblioteca Nacional',
      type: 'Literatura',
      image: '/images/evento6.jpg',
      status: 'Pasados'
    }
  ];

  const filteredEvents = events.filter(event => event.status === activeTab);

  const eventTypes = [...new Set(events.map(event => event.type))];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Eventos Culturales</h2>
          <p className="text-xl text-blue-600 max-w-2xl mx-auto">
            Descubre los mejores eventos artísticos en Bolivia
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-blue-200 p-1">
            {['Próximos', 'Pasados'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-yellow-400 text-blue-800 shadow-sm'
                    : 'text-blue-700 hover:bg-blue-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                  {event.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-2">{event.title}</h3>
                <div className="flex items-center text-blue-600 mb-3">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-blue-500 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                </div>
                <Link
                  to={`/eventos/${event.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Más Información
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/eventos"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-800 px-8 py-3 rounded-full font-bold shadow-md transition-colors"
          >
            Ver Todos los Eventos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;