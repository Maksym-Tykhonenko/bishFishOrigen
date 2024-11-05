import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, TextInput, Dimensions, StyleSheet } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icons from "./Icons"

const { height } = Dimensions.get('window');

const CreateNote = ({setCreatePressed}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [title, setTitle] = useState('');
    const [warnings, setWarnings] = useState({ title: '', category: '' });

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    const handleImageUpload = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const handleSubmit = async () => {
        let titleWarning = '';
        let categoryWarning = '';

        if (title.trim().length < 1) titleWarning = 'Note must contain at least 1 character';
        if (!selectedCategory) categoryWarning = 'Please select a category';

        if (titleWarning || categoryWarning) {
            setWarnings({ title: titleWarning, category: categoryWarning });
        } else {
            setWarnings({ title: '', category: '' });

            const defaultImageUri = require('../assets/decor/3.png');
            const currentDate = new Date();
            const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

            const newNote = {
                title,
                category: selectedCategory,
                imageUri: imageUri || defaultImageUri,
                date: formattedDate, 
            };

            try {
                const storedNotes = await AsyncStorage.getItem('notes');
                const updatedNotes = storedNotes ? JSON.parse(storedNotes).concat(newNote) : [newNote];
                await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
            } catch (error) {
                console.error('Failed to save note:', error);
            }

            setTitle('');
            setSelectedCategory(null);
            setImageUri(null);
            setCreatePressed(false);
        }
    };


    return (
        <View style={styles.createContainer}>

        <Text style={styles.createText}>Add the image</Text>

        <TouchableOpacity style={styles.imageContainer} onPress={handleImageUpload}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
                <View style={styles.imageIcon}>
                    <Icons type={'image'} />
                </View>
            )}
        </TouchableOpacity>

        <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#7d7d7d"
            value={title}
            onChangeText={setTitle}
        />
        {warnings.title ? <Text style={styles.warningText}>{warnings.title}</Text> : null}

        <Text style={styles.createText}>Choose the category</Text>
        <View style={styles.noteBtnContainer}>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Work' && { backgroundColor: 'rgba(255, 0, 0, 0.5)' , borderColor: '#e54d4d'}
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
        {warnings.category ? <Text style={styles.warningText}>{warnings.category}</Text> : null}

        <TouchableOpacity style={styles.createNoteBtn} onPress={handleSubmit}>
            <Text style={styles.createBtnText}>Create</Text>
        </TouchableOpacity>
    </View>
    )
};

const styles = StyleSheet.create({
    createBtnText: {
        fontWeight: '900',
        // fontFamily: 'Nunito',
        fontSize: 20,
        color: '#fffdfa',
    },
    createContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    createText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#e8f7ff',
        // fontFamily: 'Nunito',
        paddingBottom: height * 0.015,
        lineHeight: 18.2
    },
    imageContainer: {
        width: '100%',
        height: height * 0.2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#d3d3d3',
        borderRadius: 12,
        marginBottom: height * 0.02,
        overflow: 'hidden'
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    imageIcon: {
        width: 80,
        height: 80,
    },
    input: {
        width: '100%',
        borderColor: '#d3d3d3',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 23,
        paddingVertical: 12,
        color: '#000',
        fontSize: 20,
        fontWeight: '600',
        // fontFamily: 'Nunito',
        marginBottom: height * 0.02
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
    createNoteBtn: {
        width: '100%',
        backgroundColor: '#4ca6d9',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14
    },
    warningText: {
        color: 'red',
        fontSize: 12,
        fontWeight: '300',
        marginTop: -10,
        marginBottom: 15
    },
    noteCard: {
        width: '100%',
        height: 360,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        borderColor: '#ccc',
        borderWidth: 1,
    },
});

export default CreateNote;