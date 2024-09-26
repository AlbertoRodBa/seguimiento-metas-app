import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GoalItem = ({ item, toggleCompletion, removeGoal }) => {
  return (
    <View style={styles.goalItem}>
      <TouchableOpacity onPress={() => toggleCompletion(item.id)}>
        <Text style={item.completed ? styles.completed : styles.goalText}>
          {item.text} - Categoría: {item.category} - Prioridad: {item.priority}
        </Text>
      </TouchableOpacity>
      <Text style={styles.deadlineText}>Fecha límite: {item.deadline}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeGoal(item.id)}>
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  goalText: {
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deadlineText: {
    fontSize: 12,
    color: 'gray',
  },
  removeButton: {
    backgroundColor: 'black', // Fondo negro
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Texto blanco
    fontWeight: 'bold',
  },
});

export default GoalItem;
