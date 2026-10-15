import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StoryRow } from '../components/StoryRow';
import { clearRead } from '../store/librarySlice';

export function SavedScreen({ navigation }) {
  const dispatch = useDispatch();
  const saved = useSelector((state) => state.library.saved);
  const readCount = useSelector((state) => Object.keys(state.library.readIds).length);

  function confirmClear() {
    Alert.alert('Clear history', 'Mark all stories as unread?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearRead()) },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {saved.length} saved · {readCount} read
        </Text>
        {readCount > 0 ? (
          <TouchableOpacity onPress={confirmClear}>
            <Text style={styles.clear}>Clear history</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={saved}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StoryRow story={item} onPress={() => navigation.navigate('Story', { story: item })} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No saved stories yet.{'\n'}Tap ☆ Save on any story.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6ef' },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statsText: { color: '#666' },
  clear: { color: '#ff6600', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888', lineHeight: 22 },
});
