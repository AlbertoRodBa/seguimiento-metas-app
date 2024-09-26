import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import GoalItem from './src/components/GoalItem';
import { Picker } from '@react-native-picker/picker'; 

export default function App() {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState([]);
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('Personal'); // Nueva variable de estado para categoría
  const [priority, setPriority] = useState('Media'); // Nueva variable de estado para prioridad

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    const loadGoals = async () => {
      const storedGoals = await AsyncStorage.getItem('goals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    };
    loadGoals();
  }, []);

  const addGoal = async () => {
    if (goal) {
      const newGoal = {
        id: Date.now().toString(),
        text: goal,
        category,
        priority,
        deadline: formatDate(deadline),
        completed: false
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals)); 
      setGoal('');
      setCategory('Personal'); // Reiniciar categoría
      setPriority('Media'); // Reiniciar prioridad
      setDeadline(new Date());
    }
  };

  const toggleCompletion = (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    AsyncStorage.setItem('goals', JSON.stringify(updatedGoals)); 
  };

  const removeGoal = async (id) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals)); 
  };

  const renderGoalItem = ({ item }) => (
    <GoalItem item={item} toggleCompletion={toggleCompletion} removeGoal={removeGoal} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seguimiento de Metas</Text>
      <TextInput
        placeholder="Escribe tu meta..."
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
      />
      {/* Selector de categoría */}
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Salud" value="Salud" />
        <Picker.Item label="Trabajo" value="Trabajo" />
        <Picker.Item label="Otros" value="Otros" />
      </Picker>
      {/* Selector de prioridad */}
      <Picker
        selectedValue={priority}
        onValueChange={(itemValue) => setPriority(itemValue)}
      >
        <Picker.Item label="Alta" value="Alta" />
        <Picker.Item label="Media" value="Media" />
        <Picker.Item label="Baja" value="Baja" />
      </Picker>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      <Text style={styles.dateText}>Fecha límite: {formatDate(deadline)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDeadline(selectedDate);
          }}
        />
      )}
      <Button title="Añadir Meta" onPress={addGoal} />
      <FlatList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dateText: {
    color: 'blue',
    marginBottom: 20,
  },
});
