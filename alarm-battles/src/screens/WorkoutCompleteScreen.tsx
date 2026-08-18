import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, numeralStyle } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutComplete'>;

/**
 * Placeholder landing spot after a solo alarm is silenced. The real Battle
 * Results screen (MVP item 8 — ranked by completion time, points awarded,
 * friends' clips) isn't built yet; this just closes the loop so the
 * alarm -> ring -> verify -> shutoff flow has somewhere to land.
 */
export function WorkoutCompleteScreen({ route, navigation }: Props) {
  const { repsCompleted } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.badge}>WIN</Text>
      <Text style={[styles.reps, numeralStyle]}>{repsCompleted}</Text>
      <Text style={styles.subtitle}>reps logged — alarm silenced</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background, alignItems: 'center', justifyContent: 'center' },
  badge: {
    color: theme.color.background,
    backgroundColor: theme.color.win,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
    paddingVertical: theme.space(1),
    paddingHorizontal: theme.space(4),
    borderRadius: theme.radius.pill,
  },
  reps: { color: theme.color.textPrimary, fontSize: 64, marginTop: theme.space(6) },
  subtitle: { color: theme.color.textSecondary, marginTop: theme.space(1) },
  button: {
    marginTop: theme.space(10),
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space(4),
    paddingHorizontal: theme.space(10),
  },
  buttonText: { color: theme.color.textPrimary, fontWeight: '700' },
});
