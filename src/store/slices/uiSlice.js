import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notifications: [],
    sidebarOpen: false,
    theme: 'light',
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        autoClose: true,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  setLoading,
} = uiSlice.actions;

// Thunk para notificaciones automáticas
export const showNotification = (notification) => (dispatch) => {
  dispatch(addNotification(notification));
  
  if (notification.autoClose !== false) {
    setTimeout(() => {
      dispatch(removeNotification(notification.id || Date.now()));
    }, notification.duration || 5000);
  }
};

export default uiSlice.reducer; 