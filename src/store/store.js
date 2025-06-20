import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import artistsReducer from './slices/artistsSlice';
import eventsReducer from './slices/eventsSlice';
import uiReducer from './slices/uiSlice';
import bookingsReducer from './slices/bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artists: artistsReducer,
    events: eventsReducer,
    ui: uiReducer,
    bookings: bookingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 