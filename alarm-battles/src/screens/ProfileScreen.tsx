import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { theme, numeralStyle } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const signOut = useAuthStore((s) => s.signOut);

  async function handleLogout() {
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  const displayName = profile?.displayName ?? firebaseUser?.displayName ?? 'Battler';
  const email = profile?.email ?? firebaseUser?.email ?? '';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {!profile && (
        <Text style={styles.loadingNote}>Loading profile stats…</Text>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, numeralStyle]}>{profile?.points ?? 0}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, numeralStyle, styles.streakValue]}>{profile?.currentStreak ?? 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background, padding: theme.space(6) },
  header: { alignItems: 'center', marginTop: theme.space(8) },
  displayName: { color: theme.color.textPrimary, fontSize: 22, fontWeight: '800' },
  email: { color: theme.color.textSecondary, marginTop: theme.space(1), fontSize: 14 },
  loadingNote: { color: theme.color.textMuted, fontSize: 12, textAlign: 'center', marginTop: theme.space(3) },
  statsRow: { flexDirection: 'row', gap: theme.space(3), marginTop: theme.space(8) },
  statCard: {
    flex: 1,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingVertical: theme.space(5),
    alignItems: 'center',
  },
  statValue: { color: theme.color.win, fontSize: 36 },
  streakValue: { color: theme.color.battle },
  statLabel: { color: theme.color.textSecondary, fontSize: 12, marginTop: theme.space(1), textTransform: 'uppercase', letterSpacing: 1 },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: theme.space(4),
    backgroundColor: theme.color.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space(4),
    alignItems: 'center',
  },
  logoutButtonText: { color: theme.color.textPrimary, fontWeight: '700', fontSize: 15 },
});
