import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyBookings } from '../store/slices/bookingsSlice';
import { logout } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBookings());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showNotification({ message: 'Sesión cerrada. ¡Hasta pronto!' }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600">Mis Reservas</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-purple-800 mb-8">Historial de Reservas</h2>
          {loading && <p>Cargando reservas...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Aún no has realizado ninguna reserva.</p>
              <p className="mt-2 text-gray-400">¡Explora los eventos y apoya a nuestros artistas!</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {bookings.map(booking => (
                <li key={booking.id} className="bg-gray-50 p-6 rounded-xl shadow-md transition-transform hover:scale-105">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <p className="font-bold text-xl text-gray-800">{booking.event_title}</p>
                      <p className="text-gray-600 text-sm">
                        {new Date(booking.event_date).toLocaleDateString()} - {booking.event_location}
                      </p>
                      <p className="text-gray-500 text-sm">Reservado el: {new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard; 