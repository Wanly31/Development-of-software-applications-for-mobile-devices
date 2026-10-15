import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedIds, getItems, PAGE_SIZE } from '../api';
import { toStory } from '../utils';

export const FEEDS = ['top', 'new', 'best'];

const emptyFeed = { ids: [], items: [], status: 'idle', error: '' };

export const fetchFeed = createAsyncThunk('stories/fetchFeed', async (feed) => {
  const ids = await getFeedIds(feed);
  const items = await getItems(ids.slice(0, PAGE_SIZE));
  return { ids, items: items.map(toStory) };
});

export const fetchMore = createAsyncThunk(
  'stories/fetchMore',
  async (feed, { getState }) => {
    const { ids, items } = getState().stories[feed];
    const items2 = await getItems(ids.slice(items.length, items.length + PAGE_SIZE));
    return items2.map(toStory);
  },
  {
    // skip if a request is already running or everything is loaded
    condition: (feed, { getState }) => {
      const { ids, items, status } = getState().stories[feed];
      return status === 'idle' && items.length < ids.length;
    },
  }
);

const storiesSlice = createSlice({
  name: 'stories',
  initialState: Object.fromEntries(FEEDS.map((feed) => [feed, emptyFeed])),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        state[action.meta.arg].status = 'refreshing';
        state[action.meta.arg].error = '';
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state[action.meta.arg] = { ...action.payload, status: 'idle', error: '' };
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state[action.meta.arg].status = 'idle';
        state[action.meta.arg].error = action.error.message;
      })
      .addCase(fetchMore.pending, (state, action) => {
        state[action.meta.arg].status = 'loadingMore';
      })
      .addCase(fetchMore.fulfilled, (state, action) => {
        const feed = state[action.meta.arg];
        feed.items.push(...action.payload);
        feed.status = 'idle';
      })
      .addCase(fetchMore.rejected, (state, action) => {
        state[action.meta.arg].status = 'idle';
        state[action.meta.arg].error = action.error.message;
      });
  },
});

export default storiesSlice.reducer;
