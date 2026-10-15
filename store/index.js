import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import storiesReducer from './storiesSlice';
import libraryReducer, { hydrate } from './librarySlice';

const STORAGE_KEY = 'library';

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    library: libraryReducer,
  },
});

export async function loadLibrary() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) store.dispatch(hydrate(JSON.parse(json)));
  } catch {
    // a broken cache shouldn't stop the app from starting
  }

  // start saving only after loading, so the empty initial state can't overwrite it
  let last = store.getState().library;
  store.subscribe(() => {
    const library = store.getState().library;
    if (library !== last) {
      last = library;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(library)).catch(() => {});
    }
  });
}
