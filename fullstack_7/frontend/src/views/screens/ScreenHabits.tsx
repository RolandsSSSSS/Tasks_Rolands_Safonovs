import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { Habit } from "../../../../backend/src/models/db/Habit";
import { HabitsRequest } from "../../../../backend/src/models/messages/HabitsRequest";
import { HabitsResponse } from "../../../../backend/src/models/messages/HabitsResponse";
import { ComponentHabit } from "../components/ComponentHabit";
import axios, { AxiosResponse } from "axios";
import { NavigationProp, StackNavigationState, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
interface Props {
	title: string;
}
export const ScreenHabits = (props: Props): React.JSX.Element => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const route = useRoute();

	useEffect(() => {
		// constructor
		// TODO: get habits from backend
		setHabits([
			{
				habit_id: 0,
				user_id: 0,
				description: "Read book",
				number_of_times_in_week: 3,
			},
			{
				habit_id: 1,
				user_id: 0,
				description: "Go to gym",
				number_of_times_in_week: 2,
			},
		]);
		return () => {
			// destructor
		};
	}, []); // only on first render
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

	const onHabitEdit = (habit: Habit) => {
		let idxHabit = habits.findIndex((h) => h.habit_id === habit.habit_id);
		if (idxHabit >= 0) {
			let newHabits = [...habits];
			newHabits[idxHabit] = habit;
			setHabits(newHabits);
		}
		syncWithBackend();
	};

	const syncWithBackend = async () => {
		try {
			let habitsRequest: HabitsRequest = {
				session_token: "",
				habits: habits,
				modified: new Date().getTime(),
			};

			//console.log(habitsRequest);
			//console.log(JSON.stringify(habitsRequest));
			const responseNative = await fetch("http://10.0.2.2:8000/habits/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(habitsRequest),
			});

			const data = await responseNative.json();
			console.log("responseNative");
			console.log(data);

			let response: AxiosResponse<HabitsResponse> = await axios.post(
				"http://10.0.2.2:8000/habits/update",
				habitsRequest,
				{
					headers: {
						"Content-Type": "application/json",
						responseType: "json",
					},
				},
			);

			let habitsResponse: HabitsResponse = response.data;
			console.log("responseAxios");
			console.log(habitsResponse);
		} catch (error) {
			console.log(error);
		}
	};

	const goToScreen = (screenName: string) => {
		if(route.name !== screenName) {
			let state = navigation.getState();
			let index = state.routes.findIndex((r) => r.name === screenName);
			if(index >= 0) {
				//@ts-ignore
				navigation.popToTop({index: index});
			} else {
				navigation.push(screenName);
			}
		}
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "flex-start",
				backgroundColor: "lightgrey",
			}}>
			<View style={{
				flexDirection: "row",
				gap: 10,
			}}>
				<Button
					title={"Home"}
					onPress={() => {
						navigation.navigate("TabHome");
					}}></Button>
				<Button
					title={"Stats"}
					onPress={() => {
						goToScreen("Stats");
					}}></Button>
				<Button
					title={"Pop"}
					onPress={() => {
						navigation.pop();
					}}></Button>
			</View>
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
					<ComponentHabit onHabitChange={onHabitEdit} key={index} habit={habit} number_of_times_in_week={null}></ComponentHabit>
				))}
			</ScrollView>
			<Button title={"Add Habit"} onPress={onAddHabit}></Button>
		</View>
	);
};
