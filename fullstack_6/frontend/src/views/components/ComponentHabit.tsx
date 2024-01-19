import { habit } from "../../../../backend/src/models/db/habit";
import { Button, ScrollView, Text, View, TextInput } from "react-native";
import { useState } from "react";

interface Props {
	habit: habit;
	onHabitChange: (habit: habit) => void;
	onHabitDelete: (habit_id: number) => void;
}

export const ComponentHabit = (props: Props): React.JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const [habitDesc, sethabitDesc] = useState(props.habit.description);
	const [number_of_times_in_week, setNumber_of_times_in_week] = useState(
		props.habit.number_of_times_in_week,
	);

	const onEditPress = () => {
		setIsEditing(true);
	};

	const onSaveHabit = () => {
		setIsEditing(false);
		if (props.onHabitChange) {
			props.onHabitChange({
				...props.habit,
				number_of_times_in_week: number_of_times_in_week,
				description: habitDesc.trim(),
			} as habit);
		}
	};
	const onDeletePress = () => {
		if (props.onHabitDelete) {
			props.onHabitDelete(props.habit.habit_id);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "row",
				marginRight: 10,
			}}>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					paddingLeft: 10,
				}}>
				{isEditing ? (
					<View>
						<TextInput onChangeText={(text) => sethabitDesc(text)}>{habitDesc}</TextInput>
						<TextInput
							onChangeText={(text) => {
								const number = parseInt(text, 10);
								setNumber_of_times_in_week(Math.min(10, Math.max(1, number)));
							}}>
							{number_of_times_in_week}
						</TextInput>
					</View>
				) : (
					<View>
						<Text>{habitDesc}</Text>
						<Text>{number_of_times_in_week}</Text>
					</View>
				)}
			</View>
			{isEditing ? (
				<Button title={"Save"} onPress={onSaveHabit}></Button>
			) : (
				<View style={{ flexDirection: "row" }}>
					<View style={{ marginRight: 10 }}>
						<Button title={"Edit"} onPress={onEditPress}></Button>
					</View>
					<Button title={"Delete"} onPress={onDeletePress}></Button>
				</View>
			)}
		</View>
	);
};
