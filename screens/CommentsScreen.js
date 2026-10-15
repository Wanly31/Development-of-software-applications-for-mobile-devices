import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getItems } from '../api';
import { htmlToText, timeAgo } from '../utils';

function Comment({ comment, depth }) {
  const [replies, setReplies] = useState(null);
  const [loading, setLoading] = useState(false);
  const kids = comment.kids || [];

  async function toggleReplies() {
    if (replies) return setReplies(null);
    setLoading(true);
    try {
      setReplies(await getItems(kids));
    } catch {
      setReplies([]);
    }
    setLoading(false);
  }

  return (
    <View style={[styles.comment, { marginLeft: depth * 12 }, depth > 0 && styles.reply]}>
      <Text style={styles.author}>
        {comment.by} · {timeAgo(comment.time)}
      </Text>
      <Text style={styles.text}>{htmlToText(comment.text).trim()}</Text>

      {kids.length > 0 ? (
        <TouchableOpacity onPress={toggleReplies} disabled={loading}>
          <Text style={styles.toggle}>
            {replies ? 'Hide replies' : `Show ${kids.length} ${kids.length === 1 ? 'reply' : 'replies'}`}
          </Text>
        </TouchableOpacity>
      ) : null}
      {loading ? <ActivityIndicator style={styles.small} /> : null}

      {replies?.map((reply) => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </View>
  );
}

export function CommentsScreen({ route }) {
  const { story } = route.params;
  const [comments, setComments] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getItems(story.kids).then(setComments).catch((e) => setError(e.message));
  }, [story.kids]);

  if (error) return <Text style={styles.center}>{error}</Text>;
  if (!comments) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <FlatList
      style={styles.list}
      data={comments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <Comment comment={item} depth={0} />}
      ListHeaderComponent={<Text style={styles.header}>{story.title}</Text>}
      ListEmptyComponent={<Text style={styles.center}>No comments.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: '#f6f6ef' },
  header: { fontSize: 17, fontWeight: '700', padding: 16, color: '#222' },
  center: { textAlign: 'center', marginTop: 40, color: '#888' },
  comment: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 6,
  },
  reply: { borderLeftWidth: 2, borderLeftColor: '#ff6600', marginRight: 0, marginTop: 8 },
  author: { fontSize: 12, color: '#888', marginBottom: 4 },
  text: { fontSize: 14, lineHeight: 20, color: '#333' },
  toggle: { color: '#ff6600', fontWeight: '600', marginTop: 8 },
  small: { marginTop: 8 },
});
