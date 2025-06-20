import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ArtistSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredArtists = [
    {
      id: 1,
      name: 'LOS KJARKAS',
      image: '/images/kjarkas.jpg',
      description: 'Leyendas del folklore andino con más de 50 años de trayectoria',
      type: 'Música'
    },
    {
      id: 2,
      name: 'BALLET FOLKLÓRICO',
      image: '/images/ballet.jpg',
      description: 'Espectáculos de danza tradicional con vestuario auténtico',
      type: 'Danza'
    },
    {
      id: 3,
      name: 'MARCO TOLEDO',
      image: '/images/pintor.jpg',
      description: 'Pintor contemporáneo con influencias andinas',
      type: 'Pintura'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredArtists.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen max-h-[600px] overflow-hidden">
      {featuredArtists.map((artist, index) => (
        <div
          key={artist.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${artist.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent bg-opacity-60 flex items-end pb-16 justify-center">
            <div className="text-center max-w-2xl px-4 transform transition-transform duration-300 hover:scale-105">
              <span className="inline-block bg-yellow-400 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mb-2">
                {artist.type}
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {artist.name}
              </h2>
              <p className="text-white text-lg mb-6 font-medium">{artist.description}</p>
              <Link
                to={`/artistas/${artist.id}`}
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-800 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                VER PERFIL
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
        {featuredArtists.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white bg-opacity-60'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtistSlider;