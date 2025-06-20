import React, { useState } from 'react';
import BookingModal from '../components/BookingModal';
import EventBookingModal from '../components/EventBookingModal';

const EventsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: 'Festival Internacional de Danza "La Paz en Movimiento"',
      date: '2023-10-15',
      location: 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
      category: 'Danza',
      image: 'https://source.unsplash.com/random/400x300/?bolivian-dance-festival-colorful',
      description: 'Un encuentro vibrante de compañías de danza nacionales e internacionales, celebrando la diversidad de movimientos y ritmos andinos.'
    },
    {
      id: 2,
      title: 'Exposición "Colores del Altiplano"',
      date: '22 Octubre 2023',
      location: 'Museo Nacional de Arte, La Paz',
      category: 'Pintura',
      image: 'https://source.unsplash.com/random/400x300/?bolivian-art-gallery-colorful',
      description: 'Muestra de arte contemporáneo que explora la riqueza cromática y las texturas inspiradas en el paisaje andino, con obras de artistas emergentes.'
    },
    {
      id: 3,
      title: 'Concierto "Sonidos de la Tierra"',
      date: '5 Noviembre 2023',
      location: 'Plaza Mayor de San Francisco, Sucre',
      category: 'Música',
      image: 'https://source.unsplash.com/random/400x300/?bolivian-music-concert-colorful',
      description: 'Un viaje musical a través de los ritmos y melodías tradicionales de Bolivia, interpretados por artistas locales y grupos folklóricos.'
    },
    {
      id: 4,
      title: 'Feria Artesanal "Manos Bolivianas"',
      date: '12 Noviembre 2023',
      location: 'Campo Ferial Chuquiago Marka, La Paz',
      category: 'Artesanía',
      image: 'https://source.unsplash.com/random/400x300/?bolivian-craft-market-colorful',
      description: 'Exhibición y venta de productos artesanales únicos, desde textiles hasta cerámica, elaborados por maestros bolivianos con técnicas ancestrales.'
    },
    {
      id: 5,
      title: 'Obra de Teatro "El Duende del Lago"',
      date: '19 Noviembre 2023',
      location: 'Teatro Nuna, La Paz',
      category: 'Teatro',
      image: 'https://source.unsplash.com/random/400x300/?bolivian-theater-play-colorful',
      description: 'Una cautivadora puesta en escena que rescata leyendas ancestrales del altiplano boliviano con un toque moderno y actuaciones memorables.'
    },
    {
      id: 6,
      title: 'Recital de Poesía "Voces del Sur"',
      date: '25 Noviembre 2023',
      location: 'Centro Cultural Simón I. Patiño, Cochabamba',
      category: 'Literatura',
      image: 'https://source.unsplash.com/random/400x300/?bolivian-poetry-reading-colorful',
      description: 'Una noche íntima con poetas bolivianos recitando sus obras, explorando temas de identidad, naturaleza y sociedad.'
    }
  ];

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-orange-700 mb-8 text-center">Eventos que te Harán Vibrar 🎊</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          No te pierdas la explosión de creatividad y cultura que se vive en Bolivia.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-pink-100 to-yellow-100 overflow-hidden relative">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                  {event.category}
                </span>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-orange-700 mb-2">{event.title}</h3>
                <p className="text-gray-700 text-base mb-4 line-clamp-3">{event.description}</p>
                <div className="flex items-center text-gray-700 mb-2">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-700 mb-6">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{event.location}</span>
                </div>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors transform hover:scale-105"
                  onClick={() => handleOpenModal(event)}
                >
                  ¡Quiero Ir! 🎉
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedEvent && (
        <EventBookingModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default EventsPage;