export function timeAgo(unixSeconds) {
  const diff = Math.floor(Date.now() / 1000) - unixSeconds;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getDomain(url) {
  if (!url) return '';
  const match = url.match(/^https?:\/\/(?:www\.)?([^/]+)/);
  return match ? match[1] : '';
}

const ENTITIES = { '&quot;': '"', '&#x27;': "'", '&#x2F;': '/', '&gt;': '>', '&lt;': '<', '&amp;': '&' };

// HN comments are HTML; a plain Text component needs paragraphs and entities converted
export function htmlToText(html) {
  if (!html) return '';
  return html
    .replace(/<p>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;|&#x27;|&#x2F;|&gt;|&lt;|&amp;/g, (m) => ENTITIES[m]);
}

// only keep the fields the app shows, so saved stories stay small in storage
export function toStory(item) {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    text: item.text,
    by: item.by,
    score: item.score,
    time: item.time,
    descendants: item.descendants || 0,
    kids: item.kids || [],
  };
}
