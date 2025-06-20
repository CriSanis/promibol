import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtistById, updateArtistProfile, uploadArtistImage } from '../store/slices/artistsSlice';
import { fetchEventsByArtist, createEvent, deleteEvent } from '../store/slices/eventsSlice';
import { showNotification } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';

const ArtistDashboard = () => {
  const dispatch = useDispatch();
  
  // Selectores de Redux
  const { user } = useSelector((state) => state.auth);
  const { currentArtist, loading: artistLoading, error: artistError } = useSelector((state) => state.artists);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);

  // Estados locales para formularios
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    artist_name: '',
    bio: '',
    location: '',
    website: '',
    tags: '' // string separado por comas
  });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '', category: 'Música' });
  const [imageFile, setImageFile] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchArtistById(user.id));
      dispatch(fetchEventsByArtist(user.id));
    }
  }, [dispatch, user?.id]);

  // Sincronizar estado del formulario con los datos del artista
  useEffect(() => {
    if (currentArtist) {
      setProfileData({
        artist_name: currentArtist.artist_name || '',
        bio: currentArtist.bio || '',
        location: currentArtist.location || '',
        website: currentArtist.website || '',
        tags: currentArtist.tags ? currentArtist.tags.join(', ') : ''
      });
    }
  }, [currentArtist]);

  // Manejadores de cambios en formularios
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  // Acciones
  const handleSaveProfile = async () => {
    let imageUrl = currentArtist?.image_url;
    if (imageFile) {
      // Sube la imagen y obtén la URL
      const action = await dispatch(uploadArtistImage(imageFile));
      if (action.type.endsWith('fulfilled')) {
        imageUrl = action.payload.imageUrl;
      } else {
        dispatch(showNotification({ type: 'error', message: 'Error subiendo la imagen.' }));
        return;
      }
    }
    // Prepara los tags como array
    const tagsArray = profileData.tags.split(',').map(t => t.trim()).filter(Boolean);
    // Actualiza el perfil
    dispatch(updateArtistProfile({ ...profileData, image_url: imageUrl, tags: tagsArray })).then(() => {
      dispatch(showNotification({ type: 'success', message: '¡Perfil actualizado con éxito!' }));
      setIsEditing(false);
      setImageFile(null);
    });
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location) {
      dispatch(createEvent({ ...newEvent, artist_id: user.id })).then(() => {
        dispatch(showNotification({ type: 'success', message: '¡Evento añadido!' }));
        setNewEvent({ title: '', date: '', location: '', description: '', category: 'Música' });
      });
    } else {
      dispatch(showNotification({ type: 'error', message: 'Por favor, completa los campos obligatorios del evento.' }));
    }
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      dispatch(deleteEvent(id)).then(() => {
        dispatch(showNotification({ type: 'success', message: '¡Evento eliminado!' }));
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showNotification({ message: 'Sesión cerrada. ¡Hasta pronto!' }));
  };

  if (artistLoading) {
    return <div className="py-16 text-center text-xl text-gray-600">Cargando perfil...</div>;
  }

  if (artistError) {
    return <div className="py-16 text-center text-xl text-red-600">{artistError}</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
        <h2 className="text-4xl font-bold text-purple-800 mb-8">Mi Perfil Público</h2>
        
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img 
                src={currentArtist?.image_url ? `http://localhost:5000${currentArtist.image_url}` : 'https://source.unsplash.com/random/400x400/?bolivian-artist-portrait'} 
                alt="Perfil" 
                className="w-24 h-24 rounded-full object-cover shadow-md" 
              />
              <div>
                <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Cambiar Imagen de Perfil</label>
                <input type="file" name="profile_image" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
              </div>
            </div>
            <div>
              <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Artístico</label>
              <input type="text" name="artist_name" value={profileData.artist_name} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
              <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400"></textarea>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ciudad/Ubicación</label>
              <input type="text" name="location" value={profileData.location} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400" />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
              <input type="url" name="website" value={profileData.website} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400" />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Etiquetas (separadas por coma)</label>
              <input type="text" name="tags" value={profileData.tags} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400" />
            </div>
            <div className="flex justify-end space-x-4 mt-10">
              <button onClick={() => setIsEditing(false)} className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-bold">
                Cancelar
              </button>
              <button onClick={handleSaveProfile} className="px-8 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors font-bold">
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-6 mb-6">
              <img 
                src={currentArtist?.image_url ? `http://localhost:5000${currentArtist.image_url}` : 'https://source.unsplash.com/random/400x400/?bolivian-artist-portrait'} 
                alt="Perfil" 
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-pink-200" 
              />
              <div>
                <h3 className="text-3xl font-bold text-purple-800">{currentArtist?.artist_name}</h3>
                <p className="text-pink-600 text-xl">{currentArtist?.location}</p>
                <p className="text-gray-600 text-sm">{currentArtist?.email}</p>
              </div>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{currentArtist?.bio}</p>
            {currentArtist?.website && (
              <p className="text-gray-700 text-lg mb-6">
                <span className="font-semibold">Sitio Web:</span>{' '}
                <a href={currentArtist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                  {currentArtist.website}
                </a>
              </p>
            )}
            {currentArtist?.tags && (
              <div className="mb-6">
                <span className="font-semibold">Etiquetas:</span>{' '}
                {currentArtist.tags.map((tag, idx) => (
                  <span key={idx} className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button onClick={() => setIsEditing(true)} className="px-8 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors font-bold mt-4">
              Editar Perfil
            </button>
            <button onClick={handleLogout} className="ml-4 px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-bold mt-4">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
      {/* Aquí puedes dejar la gestión de eventos igual o mejorarla después */}
    </main>
  );
};

export default ArtistDashboard;