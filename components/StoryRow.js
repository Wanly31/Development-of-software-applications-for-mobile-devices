import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsRead, selectIsSaved } from '../store/librarySlice';
import { getDomain, timeAgo } from '../utils';

export function StoryRow({ story, index, onPress }) {
  const isRead = useSelector(selectIsRead(story.id));
  const isSaved = useSelector(selectIsSaved(story.id));
  const domain = getDomain(story.url);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      {index !== undefined ? <Text style={styles.index}>{index + 1}</Text> : null}
      <View style={styles.body}>
        <Text style={[styles.title, isRead && styles.read]}>
          {isSaved ? '★ ' : ''}
          {story.title}
        </Text>
        {domain ? <Text style={styles.domain}>{domain}</Text> : null}
        <Text style={styles.meta}>
          ▲ {story.score} · {story.by} · {timeAgo(story.time)} · 💬 {story.descendants}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  index: { width: 28, color: '#999', fontSize: 15, paddingTop: 1 },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 2 },
  read: { color: '#888', fontWeight: '400' },
  domain: { fontSize: 13, color: '#ff6600', marginBottom: 4 },
  meta: { fontSize: 12, color: '#888' },
});
