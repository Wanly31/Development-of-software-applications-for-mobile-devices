import { createSlice } from '@reduxjs/toolkit';

// saved stories and read history, persisted to AsyncStorage in store/index.js
const librarySlice = createSlice({
  name: 'library',
  initialState: { saved: [], readIds: {} },
  reducers: {
    toggleSaved(state, action) {
      const story = action.payload;
      const index = state.saved.findIndex((s) => s.id === story.id);
      if (index >= 0) state.saved.splice(index, 1);
      else state.saved.unshift({ ...story, savedAt: Date.now() });
    },
    markRead(state, action) {
      state.readIds[action.payload] = true;
    },
    clearRead(state) {
      state.readIds = {};
    },
    hydrate(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { toggleSaved, markRead, clearRead, hydrate } = librarySlice.actions;

export const selectIsSaved = (id) => (state) => state.library.saved.some((s) => s.id === id);
export const selectIsRead = (id) => (state) => Boolean(state.library.readIds[id]);

export default librarySlice.reducer;
