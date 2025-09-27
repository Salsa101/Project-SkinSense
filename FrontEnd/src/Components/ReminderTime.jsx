import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, parse } from 'date-fns';
import api from '../api';

const ReminderTime = ({ timeOfDay, reminder, fetchReminders }) => {
  const [reminderTime, setReminderTime] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (reminder?.reminderTime) {
      const time = format(
        parse(reminder.reminderTime, 'HH:mm:ss', new Date()),
        'HH:mm',
      );
      setReminderTime(time);
      setEnabled(reminder.enabled ?? true);
    }
    setHasLoaded(true);
  }, [reminder]);

  const handleConfirm = async date => {
    const hour = date.getHours();

    setShowPicker(false);

    if (timeOfDay === 'morning' && hour >= 18) {
      Alert.alert('Invalid time', 'Morning reminder must be before 18:00');
      return;
    }
    if (timeOfDay === 'night' && hour < 18) {
      Alert.alert('Invalid time', 'Night reminder must be after 18:00');
      return;
    }

    const formattedTime = format(date, 'HH:mm');
    setReminderTime(formattedTime);

    try {
      if (reminder?.id) {
        await api.patch(`/reminder-times/${timeOfDay}`, {
          reminderTime: formattedTime,
        });
      } else {
        await api.post('/reminder-times/add', {
          timeOfDay,
          reminderTime: formattedTime,
        });
      }
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEnabled = async () => {
    try {
      if (reminder?.id) {
        await api.patch(`/reminder-times/${timeOfDay}/toggle`);
        setEnabled(!enabled);
        fetchReminders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.timeContainer}
      >
        <Text style={styles.timeText}>
          {reminderTime ??
            (!hasLoaded
              ? '-'
              : timeOfDay === 'morning'
              ? 'Morning Reminder'
              : 'Night Reminder')}
        </Text>

        <Text style={styles.labelText}>
          {timeOfDay === 'morning'
            ? 'Wake up & ready for skincare'
            : 'Night skincare reminder'}
        </Text>
      </TouchableOpacity>
      <Switch value={enabled} onValueChange={toggleEnabled} />
      <DateTimePickerModal
        isVisible={showPicker}
        mode="time"
        date={
          reminderTime ? parse(reminderTime, 'HH:mm', new Date()) : new Date()
        }
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#efcceeff',
    borderRadius: 10,
    shadowColor: '#AB8C8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  timeContainer: { flex: 1 },
  timeText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#E07C8E' },
  labelText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#B67F89',
    marginTop: 3,
  },
});

export default ReminderTime;
