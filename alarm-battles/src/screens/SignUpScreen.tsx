import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const signUp = useAuthStore((s) => s.signUp);
  const error = useAuthStore((s) => s.error);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    setSubmitting(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch {
      // authStore already recorded a user-facing message in `error`.
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = displayName.trim().length > 0 && email.length > 0 && password.length >= 6;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Join the Battle</Text>
        <Text style={styles.subtitle}>Create an account to start competing.</Text>

        <View style={styles.form}>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
            placeholderTextColor={theme.color.textMuted}
            autoCapitalize="words"
            style={styles.input}
          />
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
            placeholder="Password (6+ characters)"
            placeholderTextColor={theme.color.textMuted}
            autoCapitalize="none"
            autoComplete="password-new"
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.signUpButton, (submitting || !canSubmit) && styles.disabled]}
            onPress={handleSignUp}
            disabled={submitting || !canSubmit}
          >
            {submitting ? (
              <ActivityIndicator color={theme.color.background} />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </Pressable>

          <Pressable style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextEmphasis}>Log In</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: theme.space(6), paddingVertical: theme.space(10) },
  title: { color: theme.color.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: theme.color.textSecondary, marginTop: theme.space(1), fontSize: 14, textAlign: 'center' },
  form: { marginTop: theme.space(8), gap: theme.space(3) },
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
  signUpButton: {
    marginTop: theme.space(3),
    backgroundColor: theme.color.win,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space(4),
    alignItems: 'center',
  },
  disabled: { opacity: 0.6 },
  signUpButtonText: { color: theme.color.background, fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: theme.space(4), alignItems: 'center', padding: theme.space(2) },
  linkText: { color: theme.color.textSecondary, fontSize: 13 },
  linkTextEmphasis: { color: theme.color.win, fontWeight: '700' },
});
