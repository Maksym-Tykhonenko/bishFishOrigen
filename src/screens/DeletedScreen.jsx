import { View } from "react-native"
import Deleted from "../components/Deleted"

const DeletedScreen = () => {
    return (
        <View style={styles.container}>
            <Deleted />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default DeletedScreen;