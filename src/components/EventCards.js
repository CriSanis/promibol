import { useSelector, useDispatch } from 'react-redux';
import { bookEvent, selectFilteredEvents } from '../store/slices/eventsSlice';
import { showNotification } from '../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BookingModal from './BookingModal';

const EventCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const events = useSelector(selectFilteredEvents);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleBookEvent = (eventId) => {
    if (!isAuthenticated) {
      dispatch(showNotification({ type: 'warning', message: 'Debes iniciar sesión para reservar.' }));
      navigate('/login');
      return;
    }
    
    if (user.role !== 'client') {
      dispatch(showNotification({ type: 'info', message: 'Los artistas no pueden reservar eventos.' }));
      return;
    }
    
    dispatch(bookEvent({ event_id: eventId }))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ type: 'success', message: '¡Reserva realizada con éxito!', description: 'Puedes ver tus reservas en tu dashboard.' }));
      })
      .catch((error) => {
        dispatch(showNotification({ type: 'error', message: 'Error en la reserva', description: error }));
      });
  };

  const handleWantToGo = (event) => {
    if (!isAuthenticated) {
      dispatch(showNotification({ type: 'warning', message: 'Debes iniciar sesión para reservar.' }));
      navigate('/login');
      return;
    }
    if (user.role !== 'client') {
      dispatch(showNotification({ type: 'info', message: 'Los artistas no pueden reservar eventos.' }));
      return;
    }
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="relative overflow-hidden rounded-xl shadow-lg group flex flex-col">
              <img src={event.image_url || `https://source.unsplash.com/random/400x300/?event,${event.category}`} alt={event.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              
              <div className="relative p-6 text-white flex-grow flex flex-col justify-end">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center mt-1 text-sm">
                  <svg className="w-4 h-4 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-6 bg-white">
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{event.description}</p>
                
                {isAuthenticated && user?.role === 'client' && (
                   <button 
                    onClick={() => handleWantToGo(event)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-900 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Quiero ir
                  </button>
                )}

                {(!isAuthenticated || user?.role !== 'client') && (
                  <button className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed">
                    Inicia sesión como cliente para reservar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <BookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          artistId={selectedEvent ? selectedEvent.artist_id : null}
          artistName={selectedEvent ? selectedEvent.title : ''}
        />
      </div>
    </section>
  );
};

export default EventCards;