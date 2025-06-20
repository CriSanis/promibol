import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/artists`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error obteniendo artistas');
    }
  }
);

export const fetchArtistById = createAsyncThunk(
  'artists/fetchArtistById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/artists/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error obteniendo artista');
    }
  }
);

export const updateArtistProfile = createAsyncThunk(
  'artists/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(`${API_URL}/artists/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error actualizando perfil');
    }
  }
);

export const uploadArtistImage = createAsyncThunk(
  'artists/uploadImage',
  async (imageFile, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(`${API_URL}/artists/upload-image`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error subiendo imagen');
    }
  }
);

// Slice
const artistsSlice = createSlice({
  name: 'artists',
  initialState: {
    artists: [],
    currentArtist: null,
    loading: false,
    error: null,
    searchTerm: '',
    filterCategory: 'all',
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    clearCurrentArtist: (state) => {
      state.currentArtist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Artists
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Artist by ID
      .addCase(fetchArtistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArtist = action.payload;
      })
      .addCase(fetchArtistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateArtistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtistProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Image
      .addCase(uploadArtistImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadArtistImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentArtist) {
          state.currentArtist.profile_image = action.payload.imageUrl;
        }
      })
      .addCase(uploadArtistImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSearchTerm, setFilterCategory, clearCurrentArtist } = artistsSlice.actions;

// Selectors
export const selectFilteredArtists = (state) => {
  const { artists, searchTerm, filterCategory } = state.artists;
  return artists.filter(artist => {
    // Usar artist_name si existe, si no, usar name (para compatibilidad)
    const name = artist.artist_name || artist.name || '';
    const bio = artist.bio || '';
    const location = artist.location || '';
    const tags = Array.isArray(artist.tags) ? artist.tags.join(' ') : '';
    // Búsqueda flexible
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tags.toLowerCase().includes(searchTerm.toLowerCase());
    // Filtrado por categoría (si existe)
    const matchesCategory = filterCategory === 'all' || (artist.tags && artist.tags.includes(filterCategory));
    return matchesSearch && matchesCategory;
  });
};

export default artistsSlice.reducer; 