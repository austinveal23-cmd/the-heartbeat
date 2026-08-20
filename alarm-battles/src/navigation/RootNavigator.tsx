import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AlarmCreateScreen } from '../screens/AlarmCreateScreen';
import { AlarmRingingScreen } from '../screens/AlarmRingingScreen';
import { WorkoutCameraScreen } from '../screens/WorkoutCameraScreen';
import { WorkoutCompleteScreen } from '../screens/WorkoutCompleteScreen';
import { navigationRef } from './navigationRef';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Matches app.json's "scheme": "alarmbattles" and the deep link built by
// expo-alarm-scheduler's AlarmScheduling.ringingDeepLink (Android) /
// the notification tap route (iOS) — see src/screens/AlarmRingingScreen.tsx.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['alarmbattles://'],
  config: {
    screens: {
      Login: 'login',
      SignUp: 'sign-up',
      Profile: 'profile',
      Home: 'home',
      AlarmCreate: 'alarm-create',
      AlarmRinging: 'alarm-ringing',
      WorkoutCamera: 'workout-camera',
      WorkoutComplete: 'workout-complete',
    },
  },
};

const navTheme = {
  dark: true,
  colors: {
    primary: theme.color.battle,
    background: theme.color.background,
    card: theme.color.surface,
    text: theme.color.textPrimary,
    border: theme.color.border,
    notification: theme.color.battle,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
  },
};

export function RootNavigator() {
  const authStatus = useAuthStore((s) => s.status);

  // Auth session restore happens async (native session check via
  // onAuthStateChanged) — wait for the first result before picking an
  // initial route, so a session-restored user isn't flashed the Login
  // screen before jumping to Home. initialRouteName only applies on first
  // mount, so the navigator itself isn't rendered until this resolves.
  if (authStatus === 'initializing') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.color.battle} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking} theme={navTheme}>
      <Stack.Navigator
        initialRouteName={authStatus === 'signedIn' ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.color.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AlarmCreate" component={AlarmCreateScreen} />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="WorkoutCamera"
          component={WorkoutCameraScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: theme.color.background, alignItems: 'center', justifyContent: 'center' },
});
