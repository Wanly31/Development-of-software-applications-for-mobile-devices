import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider, useSelector } from 'react-redux';
import { loadLibrary, store } from './store';
import { FeedScreen } from './screens/FeedScreen';
import { SavedScreen } from './screens/SavedScreen';
import { StoryScreen } from './screens/StoryScreen';
import { CommentsScreen } from './screens/CommentsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ORANGE = '#ff6600';

function tabIcon(emoji) {
  return ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function HomeTabs() {
  const savedCount = useSelector((state) => state.library.saved.length);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ORANGE },
        headerTintColor: '#fff',
        tabBarActiveTintColor: ORANGE,
      }}
    >
      <Tab.Screen
        name="Top"
        component={FeedScreen}
        initialParams={{ feed: 'top' }}
        options={{ title: 'Top stories', tabBarLabel: 'Top', tabBarIcon: tabIcon('🔥') }}
      />
      <Tab.Screen
        name="New"
        component={FeedScreen}
        initialParams={{ feed: 'new' }}
        options={{ title: 'New stories', tabBarLabel: 'New', tabBarIcon: tabIcon('🆕') }}
      />
      <Tab.Screen
        name="Best"
        component={FeedScreen}
        initialParams={{ feed: 'best' }}
        options={{ title: 'Best stories', tabBarLabel: 'Best', tabBarIcon: tabIcon('🏆') }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: tabIcon('⭐'),
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadLibrary().then(() => setReady(true));
  }, []);

  if (!ready) return <ActivityIndicator style={{ flex: 1 }} size="large" color={ORANGE} />;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{ headerStyle: { backgroundColor: ORANGE }, headerTintColor: '#fff' }}
        >
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Story" component={StoryScreen} options={{ title: 'Story' }} />
          <Stack.Screen name="Comments" component={CommentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
