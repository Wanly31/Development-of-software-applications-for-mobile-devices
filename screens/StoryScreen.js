import { useEffect } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { markRead, selectIsSaved, toggleSaved } from '../store/librarySlice';
import { getDomain, htmlToText, timeAgo } from '../utils';

export function StoryScreen({ route, navigation }) {
  const { story } = route.params;
  const dispatch = useDispatch();
  const isSaved = useSelector(selectIsSaved(story.id));

  useEffect(() => {
    dispatch(markRead(story.id));
  }, [dispatch, story.id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{story.title}</Text>
      {story.url ? <Text style={styles.domain}>{getDomain(story.url)}</Text> : null}

      <View style={styles.metaRow}>
        <Text style={styles.meta}>▲ {story.score} points</Text>
        <Text style={styles.meta}>by {story.by}</Text>
        <Text style={styles.meta}>{timeAgo(story.time)}</Text>
      </View>

      {story.text ? <Text style={styles.text}>{htmlToText(story.text)}</Text> : null}

      {story.url ? (
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(story.url)}>
          <Text style={styles.buttonText}>Open article</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => dispatch(toggleSaved(story))}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>
          {isSaved ? '★ Saved' : '☆ Save'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        disabled={story.kids.length === 0}
        onPress={() => navigation.navigate('Comments', { story })}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>
          💬 {story.descendants} comments
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 6 },
  domain: { fontSize: 14, color: '#ff6600', marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  meta: { color: '#888' },
  text: { fontSize: 15, lineHeight: 22, marginBottom: 16, color: '#333' },
  button: {
    backgroundColor: '#ff6600',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ff6600' },
  secondaryText: { color: '#ff6600' },
});
