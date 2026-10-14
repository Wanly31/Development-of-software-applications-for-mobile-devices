import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getMovieDetails } from '../api';

export function DetailsScreen({ route }) {
  const { id } = route.params;
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMovieDetails(id).then(setMovie).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <Text style={styles.center}>{error}</Text>;
  if (!movie) return <ActivityIndicator style={{ marginTop: 40 }} />;

  const rows = [
    ['Year', movie.Year],
    ['Rated', movie.Rated],
    ['Runtime', movie.Runtime],
    ['Genre', movie.Genre],
    ['Director', movie.Director],
    ['Actors', movie.Actors],
    ['IMDb rating', movie.imdbRating],
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {movie.Poster !== 'N/A' ? (
        <Image source={{ uri: movie.Poster }} style={styles.poster} resizeMode="contain" />
      ) : null}
      <Text style={styles.title}>{movie.Title}</Text>

      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}

      <Text style={styles.plot}>{movie.Plot}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  center: { textAlign: 'center', marginTop: 40, color: '#888' },
  poster: { width: '100%', height: 360, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', paddingVertical: 6 },
  label: { width: 100, color: '#888' },
  value: { flex: 1 },
  plot: { marginTop: 16, lineHeight: 22 },
});
