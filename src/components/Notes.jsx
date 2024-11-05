import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, Modal, TextInput, ImageBackground } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import { getRandomInspiration } from '../constants/inspiration.js';
import { useNotesContext } from '../constants/context.js';
import CreateNote from './CreateNote';
import Note from './Note';
import Menu from './Menu';
import Icons from "./Icons"

const { height, width } = Dimensions.get('window');

const Notes = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { createPressed, setCreatePressed } = useNotesContext();

    const [notes, setNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const translateX = useSharedValue(-width * 0.8);

    const [inspoModalVisible, setInspoModalVisible] = useState(false);
    const [currentInspiration, setCurrentInspiration] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]); 

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) setNotes(JSON.parse(storedNotes));
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadNotes();
            if (route.params?.noteCreationTrigger) {
                setCreatePressed(true);
                navigation.setParams({ noteCreationTrigger: false });
            }
        }, [route.params])
    );  

    useEffect(() => {
        if (!createPressed) loadNotes();
    }, [createPressed]);

    const handleCreatePress = () => {
        setCreatePressed(!createPressed);
    };

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
        const newCategory = category === selectedCategory ? null : category;
        setSelectedCategory(newCategory);
        handleSearch();
    };

    const filteredNotes = selectedCategory
        ? notes.filter(note => note.category === selectedCategory)
        : notes;

    const handleInspoVisible = () => {
        setInspoModalVisible(!inspoModalVisible);
        if (!inspoModalVisible) {
            setCurrentInspiration(getRandomInspiration());
        }
    };

    const handleGenerateNewInspo = () => {
        setCurrentInspiration(getRandomInspiration());
    };

    const handleSearch = () => {
        const filteredNotes = notes.filter(note =>
            (!selectedCategory || note.category === selectedCategory) &&
            note.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredNotes);
    };    
    
    const toggleSearch = () => {
        setIsSearching(!isSearching);
        setSearchQuery("");
        setSelectedCategory(null);
        setSearchResults(notes);
    };

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{flex: 1}}>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>

                {isMenuOpen && (
                    <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
                        <Menu onClose={toggleMenu} />
                    </Animated.View>
                )}

                {isSearching ? (
                    <View style={styles.upperContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search notes by title"
                            placeholderTextColor="#7d7d7d"
                            value={searchQuery}
                            onChangeText={text => {
                                setSearchQuery(text);
                                handleSearch();
                            }}
                        />
                        <TouchableOpacity style={styles.toolIcon} onPress={toggleSearch}>
                            <Icons type={'search'} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.upperContainer}>
                        <TouchableOpacity style={styles.toolIcon} onPress={toggleMenu}>
                            <Icons type={'menu'} />
                        </TouchableOpacity>
                        <Text style={styles.title}>All Notes</Text>
                        <TouchableOpacity style={styles.toolIcon} onPress={toggleSearch}>
                            <Icons type={'search'} />
                        </TouchableOpacity>
                    </View>
                )}

                {!isSearching && (
                    <TouchableOpacity style={styles.inspoBtn} onPress={handleInspoVisible}>
                        <LinearGradient
                            colors={['#4CA6D9', '#D478FF']}
                            start={{ x: -0.15, y: 0.5 }}
                            end={{ x: 1.1, y: 0.5 }}
                            style={[styles.gradient]}
                        >
                            <View style={styles.sparkleIcon}>
                                <Icons type={'sparkle'} />
                            </View>
                            <Text style={styles.inspoBtnText}>Daily inspiration</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

            {
                notes.length === 0 ? (
                <View style={{width: '100%'}}>
                {
                createPressed ? (
                    <CreateNote setCreatePressed={setCreatePressed}/>
                ) : (
                    <View style={{width: '100%', paddingHorizontal: 13, alignItems: 'center'}}>
                        <ScrollView>
                            <Image source={require('../assets/decor/1.png')} style={styles.image}/>
                            <Text style={styles.noNotesTitle}>Create Your First Note</Text>
                            <Text style={styles.noNotesText}>Add a note about anything (your thoughts on climate change, or your history essay) and share it with the world.</Text>
                            <TouchableOpacity style={styles.createBtn} onPress={handleCreatePress}>
                                <Text style={styles.createBtnText}>Create A Note</Text>
                            </TouchableOpacity>
                            <View style={{height: 150}}/>
                        </ScrollView>
                    </View>
                )
            }
            </View>
            ) : (
                createPressed ? (
                    <CreateNote setCreatePressed={setCreatePressed} />   
                ) : (
                    <View style={{width: '100%'}}>

                        {
                            (!isSearching || searchResults.length > 0) && (
                                <View style={styles.noteBtnContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.noteBtn,
                                            selectedCategory === 'Work' && { backgroundColor: 'rgba(255, 0, 0, 0.3)' , borderColor: '#e54d4d'}
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
                                            selectedCategory === 'Other' && { backgroundColor: 'rgba(205, 255, 188, 1)', borderColor: '#207c00' }
                                        ]}
                                        onPress={() => handleCategoryPress('Other')}
                                    >
                                        <Text style={[styles.noteBtnText, selectedCategory === 'Other' && { color: '#207c00'}]}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        <ScrollView style={{ width: '100%', height: height * 0.65 }}>
                            {isSearching ? (
                                searchResults.length > 0 ? (
                                    <Note notes={searchResults} loadNotes={loadNotes} />
                                ) : (
                                    <Text style={styles.noNotesText}>No matching results.</Text>
                                )
                            ) : (
                                createPressed ? (
                                    <CreateNote setCreatePressed={setCreatePressed} />
                                ) : (
                                    filteredNotes.length === 0 ? (
                                        <Text style={styles.noNotesText}>No created notes.</Text>
                                    ) : (
                                        <Note notes={notes} loadNotes={loadNotes} />
                                    )
                                )
                            )}
                            {
                                !isSearching && (
                                    <TouchableOpacity style={styles.createBtn} onPress={handleCreatePress}>
                                        <Text style={styles.createBtnText}>Create A Note</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </ScrollView>
                    </View>
                )
                )
            }

            <Modal
                animationType="fade"
                transparent={true}
                visible={inspoModalVisible}
                onRequestClose={handleInspoVisible}>
                <TouchableWithoutFeedback onPress={handleInspoVisible}>
                <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.inspoBtn} onPress={handleInspoVisible}>
                    <LinearGradient
                        colors={['#4CA6D9', '#D478FF']}
                        start={{ x: -0.15, y: 0.5 }}
                        end={{ x: 1.1, y: 0.5 }}
                        style={[styles.gradient]}
                    >
                        <View style={styles.sparkleIcon}>
                            <Icons type={'sparkle'}/>
                        </View>
                        <Text style={styles.inspoBtnText}>Daily inspiration</Text>
                    </LinearGradient>
                </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Your daily inspiration idea:</Text>
                        <Text style={styles.modalInspo}>{currentInspiration}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnAdd} onPress={() => navigation.navigate('AddNoteScreen', { title: currentInspiration }, handleInspoVisible())}>
                                <Text style={styles.modalBtnAddText}>Write this down</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnNew} onPress={handleGenerateNewInspo}>
                                <Text style={styles.modalBtnNewText}>Generate new</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>

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
    inspoBtn: {
        width: '100%',
        height: height * 0.065,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: height * 0.02,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        flexDirection: 'row',
    },
    sparkleIcon: {
        width: 22,
        height: 22,
        marginRight: 13
    },
    inspoBtnText: {
        fontSize: 17,
        color: '#fff',
        // fontFamily: 'Nunito',
        fontWeight: '900'
    },
    image: {
        width: height * 0.32,
        height: height * 0.32,
        resizeMode: 'contain',
        marginBottom: height * 0.05,
        marginTop: height * 0.05,
        alignSelf: 'center'
    },
    noNotesTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#e8f7ff',
        // fontFamily: 'Nunito',
        paddingBottom: height * 0.015,
        textAlign: 'center'
    },
    noNotesText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#b8f3e8',
        // fontFamily: 'Nunito',
        paddingBottom: height * 0.06,
        textAlign: 'center',
        lineHeight: 21.82
    },
    createBtn: {
        width: '100%',
        backgroundColor: '#4ca6d9',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    createBtnText: {
        fontWeight: '900',
        // fontFamily: 'Nunito',
        fontSize: 20,
        color: '#fffdfa',
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: height * 0.1565,
        paddingHorizontal: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 22
    },
    modalText: {
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 19.36,
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalBtnAdd: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12.5,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#7301c2',
    },
    modalBtnAddText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 14.52
    },
    modalBtnNew: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12.5,
        borderRadius: 14,
        backgroundColor: '#7301c2',
    },
    modalBtnNewText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 14.52
    },
    modalInspo: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 16,
        color: '#71727a',
        marginBottom: 28,
        textAlign: 'center'
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        marginRight: 10,
        color: '#403b36',
        backgroundColor: '#fff'
    },
    
})

export default Notes;