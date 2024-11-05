import { View } from "react-native"
import Archived from "../components/Archived"

const ArchivedScreen = () => {
    return (
        <View style={styles.container}>
            <Archived />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default ArchivedScreen;