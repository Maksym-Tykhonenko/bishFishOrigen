import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { useNotesContext } from "../constants/context";
import Icons from "./Icons"

const { width, height } = Dimensions.get('window');

const Menu = ({ onClose }) => {
    const navigation = useNavigation();
    const { setCreatePressed } = useNotesContext();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
                <Icons type={'close'}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate('ArchivedScreen'); onClose();}}>
                <View style={styles.icon}>
                    <Icons type={'archive'}/>
                </View>
                <Text style={styles.btnText}>Archive</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate('DeletedScreen'); onClose();}}>
                <View style={styles.icon}>
                    <Icons type={'delete'}/>
                </View>
                <Text style={styles.btnText}>Deleted</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate('CalendarScreen'); onClose();}}>
                <View style={styles.icon}>
                    <Icons type={'calendar'}/>
                </View>
                <Text style={styles.btnText}>Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => { 
                setCreatePressed(false);
                navigation.navigate('NotesScreen');
                onClose();
            }}>
                <View style={styles.icon}>
                    <Icons type={'home'}/>
                </View>
                <Text style={styles.btnText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCreate} onPress={() => { 
                navigation.navigate('NotesScreen', { noteCreationTrigger: true });
                onClose(); 
            }}>
                <Text style={styles.btnCreateText}>Create new note</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.8,
        paddingTop: height * 0.07,
        height: height,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 24
    },

    close: {
        width: 44,
        height: 44,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },

    btn: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 10,
        paddingVertical: 5
    },

    btnText: {
        fontSize: 16,
        fontWeight: '600',
        // fontFamily: 'Nunito',
        lineHeight: 20.8
    },

    icon: {
        width: 24,
        height: 24,
        marginRight: 12
    },

    btnCreate: {
        width: 210,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4ca6d9',
        borderRadius: 15,
        marginTop: 10
    },

    btnCreateText: {
        fontSize: 18,
        fontWeight: '700',
        // fontFamily: 'Nunito',
        lineHeight: 23.4,
        color: '#fff'
    }

});

export default Menu;