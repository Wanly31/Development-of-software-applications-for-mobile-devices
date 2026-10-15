import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StoryRow } from '../components/StoryRow';
import { fetchFeed, fetchMore } from '../store/storiesSlice';

export function FeedScreen({ route, navigation }) {
  const { feed } = route.params;
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.stories[feed]);

  useEffect(() => {
    dispatch(fetchFeed(feed));
  }, [dispatch, feed]);

  if (status === 'refreshing' && items.length === 0) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <StoryRow
            story={item}
            index={index}
            onPress={() => navigation.navigate('Story', { story: item })}
          />
        )}
        refreshing={status === 'refreshing'}
        onRefresh={() => dispatch(fetchFeed(feed))}
        onEndReached={() => dispatch(fetchMore(feed))}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          status === 'loadingMore' ? <ActivityIndicator style={styles.footer} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6ef' },
  loader: { marginTop: 40 },
  footer: { marginVertical: 16 },
  error: { textAlign: 'center', color: '#c00', padding: 12 },
});
