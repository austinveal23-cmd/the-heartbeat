import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch {
      // authStore already recorded a user-facing message in `error`.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ALARM BATTLES</Text>
        <Text style={styles.subtitle}>Get up. Move. Win.</Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.color.textMuted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.color.textMuted}
            autoCapitalize="none"
            autoComplete="password"
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.loginButton, submitting && styles.disabled]}
            onPress={handleLogin}
            disabled={submitting || !email || !password}
          >
            {submitting ? (
              <ActivityIndicator color={theme.color.textPrimary} />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </Pressable>

          <Pressable style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkTextEmphasis}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: theme.space(6) },
  title: { color: theme.color.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: 1, textAlign: 'center' },
  subtitle: { color: theme.color.textSecondary, marginTop: theme.space(1), fontSize: 14, textAlign: 'center' },
  form: { marginTop: theme.space(10), gap: theme.space(3) },
  input: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.color.border,
    color: theme.color.textPrimary,
    padding: theme.space(4),
    fontSize: 15,
  },
  error: { color: theme.color.battle, fontSize: 13, textAlign: 'center' },
  loginButton: {
    marginTop: theme.space(3),
    backgroundColor: theme.color.battle,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space(4),
    alignItems: 'center',
  },
  disabled: { opacity: 0.6 },
  loginButtonText: { color: theme.color.textPrimary, fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: theme.space(4), alignItems: 'center', padding: theme.space(2) },
  linkText: { color: theme.color.textSecondary, fontSize: 13 },
  linkTextEmphasis: { color: theme.color.win, fontWeight: '700' },
});
