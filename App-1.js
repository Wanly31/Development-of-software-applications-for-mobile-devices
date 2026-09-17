import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Vibration } from 'react-native';
import React, { useState } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function App() {
  const [time, setTime] = useState(WORK_MINUTES * 60); // час у секундах
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [inputTime, setInputTime] = useState(String(WORK_MINUTES)); // довільний час у хвилинах

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            clearInterval(id);
            setIsRunning(false);
            Vibration.vibrate();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    const parsed = parseInt(inputTime, 10);
    setTime((isNaN(parsed) ? WORK_MINUTES : parsed) * 60);
  };

  // Тільки запам'ятовуємо, що ввів користувач.
  // Саме значення застосовується при натисканні Reset,
  // щоб редагування поля не збивало запущений таймер.
  const handleInputChange = (text) => {
    setInputTime(text);
  };

  const switchMode = (minutes) => {
    clearInterval(intervalId);
    setIsRunning(false);
    setInputTime(String(minutes));
    setTime(minutes * 60);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>

      <Text style={styles.time}>
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
      </Text>

      <View style={styles.row}>
        <Button title="Робота (25)" onPress={() => switchMode(WORK_MINUTES)} />
        <Button title="Перерва (5)" onPress={() => switchMode(BREAK_MINUTES)} />
      </View>

      <TextInput
        style={styles.input}
        value={inputTime}
        onChangeText={handleInputChange}
        keyboardType="numeric"
        placeholder="Свій час у хвилинах"
      />

      <View style={styles.row}>
        <Button title="Start" onPress={startTimer} />
        <Button title="Stop" onPress={stopTimer} />
        <Button title="Reset" onPress={resetTimer} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
});
