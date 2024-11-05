import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Modal } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const Note = ({ notes, loadNotes, deleted, loadDeleted, archived, loadArchived }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [archiveModalVisible, setArchiveModalVisible] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [noteToArchive, setNoteToArchive] = useState(null);

    const handleDelete = async () => {
        try {
            if (deleted) {
                const updatedDeletedNotes = deleted.filter(n => n.title !== noteToDelete.title);
                await AsyncStorage.setItem('deleted', JSON.stringify(updatedDeletedNotes));
                loadDeleted();
            } else {
                const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
                const updatedNotes = storedNotes.filter(n => n.title !== noteToDelete.title);
                await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

                const deletedNotes = JSON.parse(await AsyncStorage.getItem('deleted')) || [];
                deletedNotes.push(noteToDelete);
                await AsyncStorage.setItem('deleted', JSON.stringify(deletedNotes));
                loadNotes();
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
            Alert.alert("Error", "Failed to delete the note.");
        }
        setModalVisible(false);
    };

    const handleArchive = async () => {
        try {
            if (archived) {
                const updatedArchivedNotes = archived.filter(n => n.title !== noteToArchive.title);
                await AsyncStorage.setItem('archived', JSON.stringify(updatedArchivedNotes));
                loadArchived();
            } else {
                const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
                const updatedNotes = storedNotes.filter(n => n.title !== noteToArchive.title);
                await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

                const archivedNotes = JSON.parse(await AsyncStorage.getItem('archived')) || [];
                archivedNotes.push(noteToArchive);
                await AsyncStorage.setItem('archived', JSON.stringify(archivedNotes));
                loadNotes();
            }
        } catch (error) {
            console.error('Failed to archive note:', error);
            Alert.alert("Error", "Failed to archive the note.");
        }
        setArchiveModalVisible(false);
    };

    const handleUnarchive = async (note) => {
        try {
            const updatedArchivedNotes = archived.filter(n => n.title !== note.title);
            await AsyncStorage.setItem('archived', JSON.stringify(updatedArchivedNotes));
            loadArchived();

            const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            storedNotes.push(note);
            await AsyncStorage.setItem('notes', JSON.stringify(storedNotes));
        } catch (error) {
            console.error('Failed to unarchive note:', error);
            Alert.alert("Error", "Failed to unarchive the note.");
        }
    };

    const handleRestore = async (note) => {
        try {
            const updatedDeletedNotes = deleted.filter(n => n.title !== note.title);
            await AsyncStorage.setItem('deleted', JSON.stringify(updatedDeletedNotes));
            loadDeleted();
    
            const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            storedNotes.push(note);
            await AsyncStorage.setItem('notes', JSON.stringify(storedNotes));
        } catch (error) {
            console.error('Failed to restore note:', error);
            Alert.alert("Error", "Failed to restore the note.");
        }
    };
    
    const handleArchiveFromDeleted = async (note) => {
        try {
            const updatedDeletedNotes = deleted.filter(n => n.title !== note.title);
            await AsyncStorage.setItem('deleted', JSON.stringify(updatedDeletedNotes));
            loadDeleted();
    
            const archivedNotes = JSON.parse(await AsyncStorage.getItem('archived')) || [];
            archivedNotes.push(note);
            await AsyncStorage.setItem('archived', JSON.stringify(archivedNotes));
        } catch (error) {
            console.error('Failed to archive note from deleted:', error);
            Alert.alert("Error", "Failed to archive the note from deleted.");
        }
    };
    

    const confirmDelete = (note) => {
        setNoteToDelete(note);
        setModalVisible(true);
    };

    const confirmArchive = (note) => {
        setNoteToArchive(note);
        setArchiveModalVisible(true);
    };

    const notesToDisplay = deleted || notes || archived;

    return (
        <View style={{width: '100%'}}>
        {
            notesToDisplay.map((note, index) => (
                <View key={index} style={styles.noteCard}>

                    {
                        notesToDisplay === notes && (
                        <View style={{position: 'absolute', top: 18, right: 0, flexDirection: 'row', zIndex: 10}}>
                            <TouchableOpacity style={styles.toolIcon} onPress={() => confirmArchive(note)}>
                                <Icons type={'archive'}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolIcon} onPress={() => confirmDelete(note)}>
                                <Icons type={'delete'}/>
                            </TouchableOpacity>
                        </View>
                        )
                    }

                    {
                        notesToDisplay === archived && (
                        <View style={{position: 'absolute', top: 18, right: 0, flexDirection: 'row', zIndex: 10}}>
                            <TouchableOpacity style={styles.toolBtn} onPress={() => handleUnarchive(note)}>
                                <Text style={styles.toolBtnText}>Unarchive</Text>
                            </TouchableOpacity>
                        </View>
                        )
                    }

                    {
                        notesToDisplay === deleted && (
                        <View style={{position: 'absolute', top: 18, right: 0, flexDirection: 'row', zIndex: 10}}>
                            <TouchableOpacity style={styles.toolBtn} onPress={() => handleRestore(note)}>
                                <Text style={styles.toolBtnText}>Restore</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolIcon} onPress={() => handleArchiveFromDeleted(note)}>
                                <Icons type={'archive'}/>
                            </TouchableOpacity>
                        </View>
                        )
                    }

                    {note.imageUri && (
                        (typeof note.imageUri === 'string' && 
                        (note.imageUri.startsWith('http://') || 
                        note.imageUri.startsWith('https://') || 
                        note.imageUri.startsWith('file://'))) ? (
                            <Image source={{ uri: note.imageUri }} style={styles.uploadedImage} />
                    ) : (
                            <Image source={note.imageUri} style={styles.uploadedImage} />
                        )
                    )}
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{note.title}</Text>
                        <Text style={styles.cardNote} numberOfLines={2} ellipsizeMode="tail">{note.note || ''}</Text>
                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <TouchableOpacity 
                                style={styles.openNoteBtn} 
                                onPress={() => navigation.navigate('AddNoteScreen', {
                                    title: note.title, 
                                    note: note.note,
                                    imageUri: note.imageUri,
                            })}>
                                <Text style={styles.openNoteBtnText}>Open</Text>
                            </TouchableOpacity>
                            <Text style={styles.cardDate}>{note.date}</Text>
                        </View>
                    </View>
                </View>
            ))
        }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are u sure you want to delete this note?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnConfirm} onPress={handleDelete}>
                                <Text style={styles.modalBtnConfirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={archiveModalVisible}
                onRequestClose={() => setArchiveModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are u sure you want to archive this note?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setArchiveModalVisible(false)}>
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnConfirm} onPress={handleArchive}>
                                <Text style={styles.modalBtnConfirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
    </View>
    )
};

const styles = StyleSheet.create({
    noteCard: {
        width: '100%',
        height: 365,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    toolIcon: {
        width: 42,
        height: 42,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        marginRight: 14
    },
    toolBtn: {
        width: 134,
        padding: 11,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#9b9b9b',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14
    },
    toolBtnText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
        lineHeight: 20.8
    },
    uploadedImage: {
        width: '100%',
        height: 186
    },
    cardTextContainer: {
        padding: 15,
        alignItems: 'flex-start'
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        overflow: 'hidden',
        height: 26
    },
    cardNote: {
        fontSize: 18,
        fontWeight: '700',
        color: '#595550',
        lineHeight: 23.4,
        // fontFamily: 'Nunito',
        height: 47,
        marginBottom: 17,
        overflow: 'hidden',
    },
    openNoteBtn: {
        width: 122,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#4ca6d9',
        marginRight: 26
    },
    openNoteBtnText: {
        color: '#fff',
        lineHeight: 23.4,
        fontSize: 18,
        fontWeight: '700',
        // fontFamily: 'Nunito'
    },
    cardDate: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
        // fontFamily: 'Nunito'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    modalContent: {
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
})

export default Note;