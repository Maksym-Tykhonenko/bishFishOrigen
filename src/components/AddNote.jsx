import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, TextInput, Modal, Alert, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const AddNote = ({ title: initialTitle, note: initialNote, imageUri, isInspoTitle }) => {
    const navigation = useNavigation();
    const [title, setTitle] = useState(initialTitle || '');
    const [note, setNote] = useState(initialNote || '');
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [inputHeight, setInputHeight] = useState(26);

    const defaultImageUri = require('../assets/decor/3.png');
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

    useEffect(() => {
        if (isInspoTitle) {
            checkAndSaveInspoNote();
        }
    }, []);

    const checkAndSaveInspoNote = async () => {
        try {
            const existingNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            const noteExists = existingNotes.some(note => note.title === initialTitle);

            if (!noteExists) {
                const newNote = {
                    title: initialTitle,
                    note: '',
                    imageUri: defaultImageUri,
                    date: formattedDate,
                    category: 'Other',
                };
                await AsyncStorage.setItem('notes', JSON.stringify([...existingNotes, newNote]));
            }
        } catch (error) {
            console.error('Failed to save inspiration note:', error);
        }
    };

    const handleSaveAndExit = async () => {
        try {
            const existingNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            const updatedNotes = existingNotes.map(n => n.title === initialTitle ? { title, note, imageUri, date: formattedDate } : n);

            if (!updatedNotes.some(n => n.title === title)) {
                updatedNotes.push({ title, note, imageUri: imageUri || defaultImageUri, date: formattedDate, category: 'Other' });
            }

            await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            const updatedNotes = storedNotes.filter(n => n.title !== noteToDelete.title);

            await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

            const deletedNotes = JSON.parse(await AsyncStorage.getItem('deleted')) || [];
            deletedNotes.push(noteToDelete);
            await AsyncStorage.setItem('deleted', JSON.stringify(deletedNotes));

            setDeleteModalVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error('Failed to delete note:', error);
            Alert.alert("Error", "Failed to delete the note.");
        }
        setDeleteModalVisible(false);
    };

    const confirmDelete = async () => {
        setOptionsVisible(false);
        setNoteToDelete({ title, note, imageUri });
        setDeleteModalVisible(true);
    };

    const handleOptionsVisible = () => {
        setOptionsVisible(!optionsVisible);
    };

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{flex: 1}}>
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.toolIcon} onPress={() => navigation.goBack('')}>
                    <Icons type={'arrow'}/>
                </TouchableOpacity>
                <Text style={styles.title}>Edit Note</Text>
                <TouchableOpacity style={styles.toolIcon} onPress={handleOptionsVisible}> 
                    <Icons type={'dots'}/>
                </TouchableOpacity>
            </View>
            <TextInput 
                style={[styles.titleInput, { height: inputHeight }]}
                placeholder='Title'
                value={title}
                placeholderTextColor="#b6fcff"
                onChangeText={setTitle}
                multiline={true}
                onContentSizeChange={(event) =>
                    setInputHeight(event.nativeEvent.contentSize.height)
                }
            />
            <TextInput
                style={styles.noteInput}
                placeholder='Note'
                value={note}
                placeholderTextColor="#f0f9fd"
                onChangeText={setNote}
                multiline={true}
                scrollEnabled={true}
            />

            {
                optionsVisible && (
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity onPress={handleSaveAndExit}>
                            <Text style={styles.saveButton}>Save & Exit</Text>
                        </TouchableOpacity>
                        <View style={{ width: '100%', backgroundColor: '#ddd', height: 0.5 }} />
                        <TouchableOpacity onPress={confirmDelete}>
                            <Text style={styles.deleteButton}>Delete this note</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.deleteModalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this note?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setDeleteModalVisible(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnConfirm} onPress={handleDelete}>
                                <Text style={styles.modalBtnConfirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 24,
        paddingTop: height * 0.08,
    },
    upperContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
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
    titleInput: {
        fontSize: 20,
        fontWeight: '800',
        lineHeight: 26,
        color: '#b6fcff',
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    noteInput: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f0f9fd',
        lineHeight: 23.4,
        // fontFamily: 'Nunito',
        textAlign: 'left',
        width: '100%',
        height: height * 0.75,
        textAlignVertical: 'top',
    },
    optionsContainer: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',
        right: 24,
        top: height * 0.12,
    },
    saveButton: {
        fontSize: 17,
        color: '#0091a7',
        paddingVertical: 11,
        paddingHorizontal: 16
    },
    deleteButton: {
        fontSize: 17,
        color: 'red',
        paddingVertical: 11,
        paddingHorizontal: 16
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    deleteModalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 19.36,
        color: '#000',
        marginBottom: 25,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalBtnCancel: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12.5,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#4ca6d9',
    },
    modalBtnCancelText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 14.52
    },
    modalBtnConfirm: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12.5,
        borderRadius: 14,
        backgroundColor: '#4ca6d9',
    },
    modalBtnConfirmText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 14.52
    },

});

export default AddNote;