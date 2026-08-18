import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { theme, numeralStyle } from '../theme/theme';

interface Props {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}

function toDate(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

function formatTime(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

export function TimePickerField({ hour, minute, onChange }: Props) {
  const value = toDate(hour, minute);

  if (Platform.OS === 'android') {
    return (
      <Pressable
        style={styles.androidButton}
        onPress={() =>
          DateTimePickerAndroid.open({
            value,
            mode: 'time',
            is24Hour: false,
            onValueChange: (_event, date) => onChange(date.getHours(), date.getMinutes()),
          })
        }
      >
        <Text style={[styles.time, numeralStyle]}>{formatTime(hour, minute)}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.iosContainer}>
      <RNDateTimePicker
        value={value}
        mode="time"
        display="spinner"
        themeVariant="dark"
        onValueChange={(_event, date) => onChange(date.getHours(), date.getMinutes())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  androidButton: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingVertical: theme.space(5),
    alignItems: 'center',
  },
  iosContainer: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  time: { color: theme.color.textPrimary, fontSize: 40 },
});
