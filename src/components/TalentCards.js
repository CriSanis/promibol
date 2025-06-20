import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAllArtists } from '../store/slices/artistsSlice';

const TalentCards = () => {
  const navigate = useNavigate();
  // Usamos el selector para obtener todos los artistas del estado de Redux
  const allArtists = useSelector(selectAllArtists);
  // Mostramos solo los primeros 3 o los que haya si son menos
  const talents = allArtists.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-yellow-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-red-600 mb-4">Nuestros Talentos Bolivianos</h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {talents.map((talent) => (
            <div key={talent.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={talent.image_url || '/images/placeholder-artist.png'} 
                  alt={talent.artist_name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-transparent opacity-30"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="flex flex-wrap gap-2">
                    {talent.tags?.map((tag, index) => (
                      <span key={index} className="text-xs font-bold px-2 py-1 bg-yellow-400 text-red-600 rounded-full capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-red-600 mb-1">{talent.artist_name}</h3>
                <p className="text-gray-600 mb-5 h-20 overflow-hidden">{talent.bio}</p>
                <button 
                  onClick={() => navigate(`/artists`)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white py-3 rounded-full font-bold transition-all flex items-center justify-center group">
                  Saber Más
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/artists')}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-red-600 font-bold rounded-full shadow-lg transition-colors border-2 border-yellow-400 hover:border-yellow-300">
            Ver Todos los Artistas
          </button>
        </div>
      </div>
    </section>
  );
};

export default TalentCards;

// DONE