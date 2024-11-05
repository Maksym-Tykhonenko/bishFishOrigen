import { View } from "react-native"
import Home from "../components/Home"

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Home />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default HomeScreen;