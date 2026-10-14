import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { searchMovies } from '../api';

export function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load(pageToLoad) {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchMovies(query.trim(), pageToLoad);
      // OMDb returns 10 per page, so append the next page to go past 10 results
      setMovies(pageToLoad === 1 ? data.movies : [...movies, ...data.movies]);
      setTotal(data.total);
      setPage(pageToLoad);
    } catch (e) {
      if (pageToLoad === 1) setMovies([]);
      setError(e.message);
    }
    setLoading(false);
  }

  function loadMore() {
    if (movies.length < total) load(page + 1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Movie title..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => load(1)}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={() => load(1)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.message}>{error}</Text> : null}
      {total > 0 ? (
        <Text style={styles.count}>
          Showing {movies.length} of {total}
        </Text>
      ) : null}

      <FlatList
        data={movies}
        keyExtractor={(item, index) => item.imdbID + index}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 16 }} /> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('Details', { id: item.imdbID, title: item.Title })
            }
          >
            {item.Poster !== 'N/A' ? (
              <Image source={{ uri: item.Poster }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.noPoster]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.Title}</Text>
              <Text style={styles.sub}>
                {item.Year} · {item.Type}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  message: { textAlign: 'center', color: '#888', marginTop: 16 },
  count: { color: '#888', paddingHorizontal: 12, marginBottom: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  poster: { width: 50, height: 75, borderRadius: 4 },
  noPoster: { backgroundColor: '#ddd' },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { color: '#888', marginTop: 4 },
});
