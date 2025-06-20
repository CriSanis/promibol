import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtistById } from '../store/slices/artistsSlice';
import { fetchEventsByArtist } from '../store/slices/eventsSlice';
import { showNotification } from '../store/slices/uiSlice';
import BookingModal from '../components/BookingModal';

const ArtistProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentArtist, loading, error } = useSelector((state) => state.artists);
  const { events } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchArtistById(id));
      dispatch(fetchEventsByArtist(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className="py-16 text-center text-xl text-gray-600">Cargando perfil del artista...</div>;
  }
  if (error || !currentArtist) {
    return <div className="py-16 text-center text-xl text-red-600">No se pudo cargar el perfil del artista.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={currentArtist.image_url ? `http://localhost:5000${currentArtist.image_url}` : 'https://source.unsplash.com/random/400x400/?bolivian-artist-portrait'}
            alt="Perfil"
            className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-pink-200"
          />
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-purple-800 mb-2">{currentArtist.artist_name || currentArtist.name}</h2>
            <p className="text-pink-600 text-lg mb-2">{currentArtist.location}</p>
            <p className="text-gray-600 text-base mb-4">{currentArtist.bio}</p>
            {currentArtist.website && (
              <p className="mb-2">
                <span className="font-semibold">Sitio Web:</span>{' '}
                <a href={currentArtist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                  {currentArtist.website}
                </a>
              </p>
            )}
            {currentArtist.tags && (
              <div className="mb-2 flex flex-wrap gap-2">
                {currentArtist.tags.map((tag, idx) => (
                  <span key={idx} className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button
              className="mt-4 px-8 py-3 bg-yellow-400 text-purple-900 rounded-full font-bold hover:bg-yellow-300 transition-colors"
              onClick={() => {
                if (!isAuthenticated || user?.role !== 'client') {
                  dispatch(showNotification({ type: 'warning', message: 'Debes iniciar sesión como cliente para solicitar un servicio.' }));
                  navigate('/login');
                } else {
                  setModalOpen(true);
                }
              }}
            >
              Solicitar Servicio
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Eventos del Artista</h3>
        {events.length === 0 ? (
          <p className="text-gray-500">Este artista aún no tiene eventos registrados.</p>
        ) : (
          <ul className="space-y-4">
            {events.map(event => (
              <li key={event.id} className="border-l-4 border-yellow-400 pl-4 py-2">
                <div className="font-bold text-lg text-purple-800">{event.title}</div>
                <div className="text-gray-600 text-sm">{new Date(event.date).toLocaleDateString()} - {event.location}</div>
                <div className="text-gray-700 text-base mt-1">{event.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        artistId={currentArtist.id}
        artistName={currentArtist.artist_name || currentArtist.name}
      />
    </main>
  );
};

export default ArtistProfilePage; 