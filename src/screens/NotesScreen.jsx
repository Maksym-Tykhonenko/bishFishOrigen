import { View } from "react-native"
import Notes from "../components/Notes"

const NotesScreen = () => {
    return (
        <View style={styles.container}>
            <Notes />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default NotesScreen;