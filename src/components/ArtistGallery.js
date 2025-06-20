import { useState } from 'react';
import { Link } from 'react-router-dom';

const ArtistGallery = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedArtist, setSelectedArtist] = useState(null);

  const disciplines = ['Todos', 'Música', 'Danza', 'Pintura', 'Teatro', 'Artesanía', 'Literatura'];
  
  const artists = [
    {
      id: 1,
      name: 'María Laredo',
      discipline: 'Música',
      specialty: 'Canto lírico',
      image: '/images/artista1.jpg',
      events: [
        { date: '15 Oct 2023', venue: 'Teatro Municipal', city: 'La Paz' },
        { date: '22 Nov 2023', venue: 'Casa de la Cultura', city: 'Cochabamba' }
      ],
      social: {
        facebook: '#',
        instagram: '#',
        youtube: '#'
      }
    },
    {
      id: 2,
      name: 'Carlos Mamani',
      discipline: 'Danza',
      specialty: 'Folklore andino',
      image: '/images/artista2.jpg',
      events: [
        { date: '5 Nov 2023', venue: 'Festival Internacional', city: 'Santa Cruz' },
        { date: '12 Dic 2023', venue: 'Teatro al Aire Libre', city: 'Sucre' }
      ],
      social: {
        facebook: '#',
        instagram: '#'
      }
    },
    {
      id: 3,
      name: 'Lucía Valdez',
      discipline: 'Pintura',
      specialty: 'Arte abstracto',
      image: '/images/artista3.jpg',
      events: [
        { date: '20 Oct 2023', venue: 'Galería de Arte Moderno', city: 'La Paz' }
      ],
      social: {
        instagram: '#',
        twitter: '#'
      }
    },
    {
      id: 4,
      name: 'Grupo Takirari',
      discipline: 'Música',
      specialty: 'Fusión tradicional',
      image: '/images/artista4.jpg',
      events: [
        { date: '8 Nov 2023', venue: 'Peña Folklorica', city: 'Cochabamba' },
        { date: '25 Nov 2023', venue: 'Festival de la Canción', city: 'Tarija' }
      ],
      social: {
        facebook: '#',
        youtube: '#'
      }
    },
    {
      id: 5,
      name: 'Compañía Ayni',
      discipline: 'Teatro',
      specialty: 'Drama contemporáneo',
      image: '/images/artista5.jpg',
      events: [
        { date: '3 Nov 2023', venue: 'Teatro Municipal', city: 'La Paz' },
        { date: '18 Nov 2023', venue: 'Centro Cultural', city: 'Santa Cruz' }
      ],
      social: {
        facebook: '#',
        instagram: '#'
      }
    },
    {
      id: 6,
      name: 'Ana Condori',
      discipline: 'Artesanía',
      specialty: 'Textiles andinos',
      image: '/images/artista6.jpg',
      events: [
        { date: '10 Dic 2023', venue: 'Feria Artesanal', city: 'La Paz' }
      ],
      social: {
        instagram: '#'
      }
    }
  ];

  const filteredArtists = activeFilter === 'Todos' 
    ? artists 
    : artists.filter(artist => artist.discipline === activeFilter);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Nuestra Comunidad Artística</h2>
          <p className="text-xl text-blue-600 max-w-2xl mx-auto">
            Descubre la diversidad de talentos que hacen vibrar la cultura boliviana
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {disciplines.map((discipline) => (
            <button
              key={discipline}
              onClick={() => {
                setActiveFilter(discipline);
                setSelectedArtist(null);
              }}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeFilter === discipline
                  ? 'bg-yellow-400 text-blue-800 shadow-md hover:bg-yellow-300'
                  : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
              }`}
            >
              {discipline}
            </button>
          ))}
        </div>

        {/* Galería y Detalle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Artistas */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredArtists.map((artist) => (
              <div 
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                  selectedArtist?.id === artist.id ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <div className="relative h-48">
                  <img 
                    src={artist.image} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{artist.name}</h3>
                    <p className="text-blue-200">{artist.specialty}</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {artist.discipline}
                  </span>
                  <span className="text-sm text-blue-600">
                    {artist.events.length} evento{artist.events.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detalle del Artista */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
            {selectedArtist ? (
              <>
                <div className="flex items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-blue-800 mb-1">{selectedArtist.name}</h3>
                    <p className="text-blue-600 font-medium">{selectedArtist.specialty}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                    {selectedArtist.discipline}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-red-500 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Próximos Eventos
                  </h4>
                  
                  {selectedArtist.events.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedArtist.events.map((event, index) => (
                        <li key={index} className="bg-blue-50 rounded-lg p-3 border-l-4 border-yellow-400">
                          <div className="font-medium text-blue-800">{event.date}</div>
                          <div className="text-blue-600">{event.venue}</div>
                          <div className="text-sm text-blue-500">{event.city}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-blue-400 italic">No hay eventos programados</p>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-blue-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Redes Sociales
                  </h4>
                  <div className="flex space-x-3">
                    {selectedArtist.social.facebook && (
                      <a href={selectedArtist.social.facebook} className="text-blue-600 hover:text-blue-800">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                    )}
                    {selectedArtist.social.instagram && (
                      <a href={selectedArtist.social.instagram} className="text-pink-600 hover:text-pink-800">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                    {selectedArtist.social.youtube && (
                      <a href={selectedArtist.social.youtube} className="text-red-600 hover:text-red-800">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </a>
                    )}
                    {selectedArtist.social.twitter && (
                      <a href={selectedArtist.social.twitter} className="text-blue-400 hover:text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                <Link
                  to={`/artistas/${selectedArtist.id}`}
                  className="block w-full bg-yellow-400 hover:bg-yellow-300 text-blue-800 py-3 rounded-lg font-bold transition-colors text-center"
                >
                  Ver Perfil Completo
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-blue-300 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-xl font-medium text-blue-600 mb-2">Selecciona un artista</h4>
                <p className="text-blue-400">Haz clic en un artista para ver sus detalles, eventos y redes sociales</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistGallery;