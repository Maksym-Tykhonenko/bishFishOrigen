import React, { useState } from "react"
import { View, Text,TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from "react-native"
import { useNavigation } from "@react-navigation/native";
import Welcome from "./Welcome";
import WelcomeTwo from "./WelcomeTwo";
import WelcomeThree from "./WelcomeThree";

const { height } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const [componentIndex, setComponentIndex] = useState(0);

    const components = [ <Welcome />, <WelcomeTwo />, <WelcomeThree /> ]

    const handleButtonPress = () => {
        setComponentIndex((prevIndex) => (prevIndex + 1) % components.length);

        if(componentIndex === 2) {
            navigation.navigate('NotesScreen')
        }
    };

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{flex: 1}}>
        <View style={styles.container}>
            {components[componentIndex]}
            <View style={styles.infoContainer}>
                {
                    componentIndex === 0 && 
                    <Text style={styles.title}>Welcome to Bish-Fish Advanced notebook</Text>
                }
                {
                    componentIndex === 1 && 
                    <Text style={styles.title}>Create notes with a single tap!</Text>
                }
                {
                    componentIndex === 2 && 
                    <Text style={styles.title}>Organize your notes by categories and tags.</Text>
                }

                {
                    componentIndex === 0 && 
                    <Text style={styles.text}>Ready to create notes that will become your reliable assistant in everyday life?</Text>
                }
                {
                    componentIndex === 1 && 
                    <Text style={styles.text}>Add text, images, videos, and audio to enrich your ideas.</Text>
                }
                {
                    componentIndex === 2 && 
                    <Text style={styles.text}>Easy search helps you quickly find the information you need.</Text>
                }

            <TouchableOpacity style={styles.btn} onPress={handleButtonPress}>
                <Text style={styles.btnText}>{componentIndex === 0 ? 'Get started' : 'Continue'}</Text>
            </TouchableOpacity>

            <View style={styles.paginationContainer}>
                    {components.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                componentIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: height * 0.06,
        paddingBottom: 55,
    },
    infoContainer: {
        width: '100%',
        paddingHorizontal: 28,
        alignItems: 'center',
        position: 'absolute',
        bottom: height * 0.055
    },
    title: {
        color: '#e8f7ff',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: height * 0.012,
        // fontFamily: 'Nunito',
        lineHeight: 27.28
    },
    text: {
        fontWeight: '700',
        fontSize: 16,
        color: '#b8f3e8',
        textAlign: 'center',
        marginBottom: height * 0.12,
        // fontFamily: 'Nunito',
        lineHeight: 20.8
    },
    btn: {
        width: '100%',
        padding: height * 0.024,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#4ca6d9',
        marginBottom: height * 0.02
    },
    btnText: {
        fontWeight: '900',
        // fontFamily: 'Nunito',
        fontSize: 20,
        color: '#fffdfa',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: '#4ca6d9',
        marginHorizontal: 3,
        opacity: 0.5
    },
    activeDot: {
        backgroundColor: '#4ca6d9',
        opacity: 1,
        width: 10,
        height: 10,
    },
})

export default Home;