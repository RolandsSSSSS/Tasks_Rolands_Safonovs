import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { habit } from "../../../../backend/src/models/db/habit";
import { ComponentHabit } from "../components/ComponentHabit";
import axios, { AxiosResponse } from "axios";
import { HabitRequest } from "../../../../backend/src/models/messages/HabitRequest";
import { HabitResponse } from "../../../../backend/src/models/messages/HabitResponse";

interface Props {
	title: string;
}
export const ScreenHabits = (props: Props): React.JSX.Element => {
	const [habits, setHabits] = useState<habit[]>([]);

	useEffect(() => {
		setHabits([
			{
				habit_id: 1,
				user_id: 0,
				description: "Read book",
				number_of_times_in_week: 3,
			},
			{
				habit_id: 2,
				user_id: 0,
				description: "Go to gym",
				number_of_times_in_week: 2,
			},
		]);
	}, []);

	const onAddHabit = () => {
		setHabits([
			...habits,
			{
				habit_id: habits.length + 1,
				user_id: 0,
				description: "New habit",
				number_of_times_in_week: 0,
			},
		]);
		syncWithBackend();
	};

	const onHabitEdit = (habit: habit) => {
		let idxHabit = habits.findIndex((h) => h.habit_id === habit.habit_id);
		if (idxHabit >= 0) {
			let newHabits = [...habits];
			newHabits[idxHabit] = habit;
			setHabits(newHabits);
		}
		syncWithBackend();
	};

	const onHabitDelete = (habit_id: number) => {
		let newHabits = habits.filter((h) => h.habit_id !== habit_id);
		setHabits(newHabits);
		syncWithBackend();
	};

	const syncWithBackend = async () => {
		let habitsRequest: HabitRequest = {
			session_token: "",
			habits: habits,
			modified: new Date().getTime(),
		};

		let response: AxiosResponse<HabitResponse> = await axios.post(
			"http://127.0.0.1:8000/habits/update",
			habitsRequest,
			{
				headers: {
					"Content-Type": "application/json",
					responseType: "json",
				},
			},
		);
		let habitsResponse = response.data;

		console.log(habitsResponse);
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "flex-start",
				backgroundColor: "lighgrey",
				padding: 20,
			}}>
			<Text
				style={{
					fontWeight: "bold",
					fontSize: 24,
					textAlign: "center",
					paddingBottom: 20,
				}}>
				{props.title}
			</Text>
			<ScrollView
				style={{
					backgroundColor: "white",
					flex: 1,
					marginBottom: 20,
				}}>
				{habits.map((habit, index) => (
					<ComponentHabit
						onHabitChange={onHabitEdit}
						onHabitDelete={onHabitDelete}
						key={index}
						habit={habit}></ComponentHabit>
				))}
			</ScrollView>
			<Button title={"Add Habit"} onPress={onAddHabit}></Button>
		</View>
	);
};
