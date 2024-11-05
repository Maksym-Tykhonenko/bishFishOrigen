import { View } from "react-native"
import AddNote from "../components/AddNote"

const AddNoteScreen = ({ route }) => {
    const { title, note, imageUri } = route.params;

    return (
        <View style={styles.container}>
            <AddNote 
                title={title} 
                note={note} 
                imageUri={imageUri} 
            />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default AddNoteScreen;