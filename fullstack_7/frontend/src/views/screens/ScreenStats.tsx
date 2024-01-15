import { View, Text, Alert } from "react-native";
import { Rating, Slider, Button } from "@rneui/themed";
import { useState } from "react";

interface Props {
  countHabits: number;
  countHabitsCompleted: number;
  countHabitsNotCompleted: number;
}
export const ScreenStats = ({
  countHabits,
}: Props) => {
  const [rating, setRating] = useState(0);
  return (
    <View>
      <Slider value={rating} onValueChange={setRating} maximumValue={10} minimumValue={0} />
      <Rating showRating={true} onFinishRating={(value:number) => {
        setRating(value);
      }} />
      <Button title={"RNEUI Button"} color="secondary" />
      <Text>{`Rating: ${rating}`}</Text>
      <Text>{`Number of habits: ${countHabits}`}</Text>
    </View>
  );
}
