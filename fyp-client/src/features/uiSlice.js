import { createSlice } from '@reduxjs/toolkit';
import { readLocalStorage, writeLocalStorage } from '@utils';

const initialState = {
  theme: readLocalStorage("theme") ?? "light",
  title: null,
  description: null,
  isLoading: false,
  errors: {}
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      writeLocalStorage("theme", action.payload);

      if (typeof document != "undefined") {
        document.documentElement.classList.toggle("dark", action.payload == "dark");
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMetadata: (state, action) => {
      const { title = null, description = null } = action.payload;
      state.title = title;
      state.description = description;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
  },
});

export const { setTheme, setLoading, setMetadata, setErrors, clearErrors } = uiSlice.actions;
export default uiSlice.reducer;

