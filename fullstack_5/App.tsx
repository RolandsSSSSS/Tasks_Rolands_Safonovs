import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {ComponentHabit} from "./ComponentHabit";

export default function App() {
  let[count, setCount] = useState(0);
  let[timeSinceLastCount, setTimeSinceLastCount] = useState(0);
  let[timeDelta, setTimeDelta] = useState(0);
  let[habits, setHabits] = useState<string[]>([]);
  let[habitForDelete, setHabitForDelete] = useState("");
  let[newHabit, setNewHabit] = useState("");
  let[updateId, setUpdateId] = useState<number | null>(null);
  let[updatedHabit, setUpdatedHabit] = useState("");
  let[isEditing, setIsEditing] = useState(false);

  const onPressAddOne = async () => {
    setHabits([...habits, newHabit.trim()]);
    setNewHabit("");
  }

  const changeHabitName = (index: number, newName: string) => {
      setUpdateId(index);
      setUpdatedHabit(newName)
      setIsEditing(true);
  };

  const onSaveEdit = (index: number) => {
      let updatedHabits = [...habits];
      updatedHabits[index] = updatedHabit;
      setHabits(updatedHabits);
      setUpdateId(null);
      setUpdatedHabit("");
      setIsEditing(false)
  }

  const onDeleteHabit = async(index: number) => {
      let habitDelete = habits[index];
      setHabitForDelete(habitDelete)
      let updatedHabits = habits.filter((_, i) => i !== index);
      setHabits(updatedHabits)
  };

  const destroy = async () => {
      console.log("Deleting habit: ", habitForDelete)

      await new Promise(res => setTimeout(res, 500));

      console.log("Habit deleted: ", habitForDelete);
  }

  useEffect(() => {
      if (habitForDelete) {
          destroy();
          setHabitForDelete("");
      }
  }, [habitForDelete])

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>HABITS</Text>
        </View>

        {habits.map((habit, index) => (
            <View key={index} style={styles.habitContainer}>
                {isEditing && updateId === index ? (
                    <TextInput
                        style={styles.input}
                        value={updatedHabit}
                        onChangeText={(text) => setUpdatedHabit(text)}
                    ></TextInput>
                ) : (
                    <ComponentHabit name={habit} />
                )}
                <TouchableOpacity
                    style={styles.buttonDelete}
                    onPress={() => onDeleteHabit(index)}
                >
                    <Text>Delete</Text>
                </TouchableOpacity>

                {isEditing && updateId === index ? (
                    <TouchableOpacity
                        style={styles.buttonSave}
                        onPress={() => onSaveEdit(index)}
                    >
                        <Text>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.buttonEdit}
                        onPress={() => changeHabitName(index, habit)}
                    >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>
        ))}
        <View style={styles.addContainer}>
            <TextInput
                style={styles.input}
                placeholder={"Input your new habit name here."}
                value={newHabit}
                onChangeText={(text) => setNewHabit(text)}
            ></TextInput>
            <TouchableOpacity
                style={styles.addButton}
                onPress={onPressAddOne}
            >
                <Text style={styles.addButtonText}>ADD HABIT</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
      marginLeft: 20,
      marginRight: 20,
      marginTop: 40,
  },
    habitContainer: {
      flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonDelete: {
      backgroundColor: "#FF6B6B",
        padding: 5,
        marginLeft: 8,
        borderStyle: "solid",
        borderRadius: 5,
        borderColor: "#000000",
        borderWidth: 1,
    },
    buttonEdit: {
      backgroundColor: "#5EF8FF",
        padding: 5,
        marginLeft: 5,
        borderRadius: 5,
        borderColor: "#000000",
        borderWidth: 1,
    },
    buttonSave: {
        backgroundColor: "#7DFF69",
        padding: 5,
        marginLeft: 5,
        borderRadius: 5,
        borderColor: "#000000",
        borderWidth: 1,
    },
    addContainer: {
      flexDirection: "column",
        height: 80,
        marginTop: "auto",
        marginBottom: 20,
    },
    addButton: {
      backgroundColor: "#5AD2FF",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginTop: 6,
    },
    addButtonText: {
      color: "#FFFFFF",
    },
    input: {
      borderColor: "#000000",
        height: 35,
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
    },
    header: {
      backgroundColor: "#D4FFCD",
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    headerText: {
      textDecorationLine: "underline",
        fontWeight: "bold",
        fontSize: 20,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: -2, height: 1 },
        textShadowRadius: 2,
    }
});
