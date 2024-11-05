import { View } from "react-native"
import CalendarNotes from "../components/Calendar"

const CalendarScreen = () => {
    return (
        <View style={styles.container}>
            <CalendarNotes />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default CalendarScreen;