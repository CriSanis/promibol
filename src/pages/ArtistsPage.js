import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtists, selectFilteredArtists } from '../store/slices/artistsSlice';
import { showNotification } from '../store/slices/uiSlice';
import SearchAndFilters from '../components/SearchAndFilters';
import { useNavigate } from 'react-router-dom';

const ArtistsPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.artists);
  const filteredArtists = useSelector(selectFilteredArtists);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(showNotification({
        type: 'error',
        message: error,
        duration: 5000
      }));
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Cargando artistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-purple-800 mb-8 text-center">Nuestros Artistas Brillantes ✨</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Sumérgete en el talento diverso de Bolivia, donde cada artista es una joya cultural.
        </p>
        
        <SearchAndFilters type="artists" />
        
        {filteredArtists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No se encontraron artistas</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArtists.map(artist => (
              <div key={artist.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-br from-pink-100 to-yellow-100 overflow-hidden relative">
                  <img 
                    src={artist.image_url ? `http://localhost:5000${artist.image_url}` : `https://source.unsplash.com/random/400x300/?bolivian-artist`} 
                    alt={artist.artist_name || artist.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  {artist.tags && Array.isArray(artist.tags) && artist.tags.length > 0 && (
                    <span className="absolute top-4 left-4 bg-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                      {artist.tags[0]}
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-purple-800 mb-2">{artist.artist_name || artist.name}</h3>
                  <p className="text-pink-600 text-lg mb-4">{artist.location || 'Artista boliviano'}</p>
                  <p className="text-gray-700 text-base mb-6 line-clamp-3">
                    {artist.bio || 'Artista talentoso de Bolivia con una pasión única por su arte.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {artist.tags && Array.isArray(artist.tags) && artist.tags.map((tag, idx) => (
                      <span key={idx} className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      className="text-purple-600 hover:text-purple-800 font-bold flex items-center text-lg"
                      onClick={() => navigate(`/artists/${artist.id}`)}
                    >
                      Ver Perfil
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    <div className="flex space-x-3">
                      {artist.social_media && (
                        <>
                          {artist.social_media.facebook && (
                            <a href={artist.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                              </svg>
                            </a>
                          )}
                          {artist.social_media.instagram && (
                            <a href={artist.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                              </svg>
                            </a>
                          )}
                          {artist.social_media.youtube && (
                            <a href={artist.social_media.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                              </svg>
                            </a>
                          )}
                          {artist.social_media.twitter && (
                            <a href={artist.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistsPage;