import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error obteniendo eventos');
    }
  }
);

export const fetchEventsByArtist = createAsyncThunk(
  'events/fetchEventsByArtist',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/artists/${artistId}/events`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error obteniendo eventos del artista');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`${API_URL}/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error creando evento');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error eliminando evento');
    }
  }
);

export const bookEvent = createAsyncThunk(
  'events/bookEvent',
  async (bookingData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error reservando evento');
    }
  }
);

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    userEvents: [],
    loading: false,
    error: null,
    searchTerm: '',
    filterCategory: 'all',
    filterDate: 'all',
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
    setFilterDate: (state, action) => {
      state.filterDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Events by Artist
      .addCase(fetchEventsByArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsByArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Book Event
      .addCase(bookEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookEvent.fulfilled, (state, action) => {
        state.loading = false;
        const eventIndex = state.events.findIndex(event => event.id === action.payload.event_id);
        if (eventIndex !== -1) {
          if (!state.events[eventIndex].bookings) {
            state.events[eventIndex].bookings = [];
          }
          state.events[eventIndex].bookings.push(action.payload);
        }
      })
      .addCase(bookEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSearchTerm, setFilterCategory, setFilterDate } = eventsSlice.actions;

// Selectors
export const selectFilteredEvents = (state) => {
  const { events, searchTerm, filterCategory, filterDate } = state.events;
  return events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filterDate) {
        case 'today':
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          matchesDate = eventDate >= today && eventDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(today);
          monthFromNow.setMonth(today.getMonth() + 1);
          matchesDate = eventDate >= today && eventDate <= monthFromNow;
          break;
        case 'past':
          matchesDate = eventDate < today;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });
};

export default eventsSlice.reducer; 