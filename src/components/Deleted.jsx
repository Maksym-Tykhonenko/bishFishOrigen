import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, ScrollView, ImageBackground } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Note from './Note';
import Menu from './Menu';
import Icons from "./Icons"

const { height, width } = Dimensions.get('window');

const Deleted = () => {
    const [deleted, setDeleted] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const translateX = useSharedValue(-width * 0.8);

    const loadDeleted = async () => {
        try {
            const storedDeleted = await AsyncStorage.getItem('deleted');
            if (storedDeleted) setDeleted(JSON.parse(storedDeleted));
        } catch (error) {
            console.error('Failed to load deleted notes:', error);
        }
    };

    useEffect(() => {
        loadDeleted();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadDeleted();
        }, [])
    );

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        translateX.value = withSpring(isMenuOpen ? 0 : -width * 0.75);
    }, [isMenuOpen]);

    const animatedMenuStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    const filteredDeleted = selectedCategory
        ? deleted.filter(note => note.category === selectedCategory)
        : deleted;

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{flex: 1}}>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>

                {isMenuOpen && (
                    <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
                        <Menu onClose={toggleMenu} />
                    </Animated.View>
                )}

            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.toolIcon} onPress={toggleMenu}>
                    <Icons type={'menu'}/>
                </TouchableOpacity>
                <Text style={styles.title}>Deleted</Text>
                <TouchableOpacity style={styles.toolIcon}> 
                    <Icons type={'search'}/>
                </TouchableOpacity>
            </View>

            <View style={styles.noteBtnContainer}>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Work' && { backgroundColor: 'rgba(255, 0, 0, 0.4)' , borderColor: '#e54d4d'}
                ]}
                onPress={() => handleCategoryPress('Work')}
            >
                <Text style={[styles.noteBtnText, selectedCategory === 'Work' && {color: '#e54d4d'}]}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Study' && { backgroundColor: 'rgba(255, 255, 0, 0.6)', borderColor: '#b48100'}
                ]}
                onPress={() => handleCategoryPress('Study')}
            >
                <Text style={[styles.noteBtnText, selectedCategory === 'Study' && { color: '#b48100' }]}>Study</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Other' && { backgroundColor: 'rgba(205, 255, 188, 0.6)', borderColor: '#207c00' }
                ]}
                onPress={() => handleCategoryPress('Other')}
            >
                <Text style={[styles.noteBtnText, selectedCategory === 'Other' && { color: '#207c00'}]}>Other</Text>
            </TouchableOpacity>
        </View>

            {
                deleted.length > 0 ? (
                <ScrollView style={{ width: '100%', height: height * 0.65 }}>
                    {filteredDeleted.length > 0 ? (
                                        <Note deleted={filteredDeleted} loadDeleted={loadDeleted}/>
                                    ) : (
                                        <Text style={styles.noNotesText}>No deleted notes for selected category.</Text>
                                    )}
                </ScrollView>
                ) : (
                    <Text style={styles.noDeleted}>No deleted notes yet.</Text>
                )
            }
        </View>
        </GestureHandlerRootView>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 15,
        paddingTop: height * 0.08,
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        zIndex: 10,
    },
    upperContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: height * 0.05
    },
    toolIcon: {
        width: 24,
        height: 24,
    },
    title: {
        fontWeight: '900',
        fontSize: 16,
        color: '#e8f7ff',
        // fontFamily: 'Nunito'
    },
    noDeleted: {
        fontWeight: '800',
        fontSize: 18,
        color: '#b8f3e8',
        marginTop: 10
        // fontFamily: 'Nunito'
    },
    noteBtnContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: height * 0.02
    },
    noteBtn: {
        width: '31%',
        padding: 12,
        color: '#000',
        borderColor: '#d3d3d3',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noteBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        // fontFamily: 'Nunito',
    },
    noNotesText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#595550',
        // fontFamily: 'Nunito',
        paddingBottom: height * 0.06,
        textAlign: 'center',
        lineHeight: 21.82
    },
});

export default Deleted;