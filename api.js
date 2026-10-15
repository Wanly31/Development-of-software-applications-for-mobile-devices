const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const PAGE_SIZE = 20;

export async function getFeedIds(feed) {
  const res = await fetch(`${BASE_URL}/${feed}stories.json`);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  return res.json();
}

export async function getItem(id) {
  const res = await fetch(`${BASE_URL}/item/${id}.json`);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  return res.json();
}

// deleted/dead items come back as null or flagged, so drop them
export async function getItems(ids) {
  const items = await Promise.all(ids.map(getItem));
  return items.filter((item) => item && !item.deleted && !item.dead);
}
