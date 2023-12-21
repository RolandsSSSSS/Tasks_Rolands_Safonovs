import {Text, View} from "react-native";

interface Props {
    name: string
}

export const ComponentHabit = (props: Props) => {
    return <View>
        <Text>{props.name}</Text>
    </View>;
}