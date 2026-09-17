import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Vibration } from 'react-native';
import React, { useState, useEffect } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function App() {
  const [time, setTime] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState(String(WORK_MINUTES));

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const id = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && time === 0) {
      setIsRunning(false);
      Vibration.vibrate();
    }
  }, [time, isRunning]);

  const startTimer = () => {
    if (time > 0) {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const parsed = parseInt(inputTime, 10);
    setTime((isNaN(parsed) ? WORK_MINUTES : parsed) * 60);
  };

  const handleInputChange = (text) => {
    setInputTime(text);
  };

  const switchMode = (minutes) => {
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
        <Button title="25 хвилин" onPress={() => switchMode(WORK_MINUTES)} />
        <Button title="5 хвилин" onPress={() => switchMode(BREAK_MINUTES)} />
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