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

	const onEditPress = () => {
		setIsEditing(true);
	};

	const onSaveHabit = () => {
		setIsEditing(false);
		if (props.onHabitChange) {
			props.onHabitChange({
				...props.habit,
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
					<TextInput onChangeText={(text) => sethabitDesc(text)}>{habitDesc}</TextInput>
				) : (
					<Text>{habitDesc}</Text>
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
