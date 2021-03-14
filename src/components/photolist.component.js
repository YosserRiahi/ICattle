import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TextInput } from "react-native";
import { f, auth, database, storage } from "../utilies/firebase.util";
import { Feather } from '@expo/vector-icons';
import { FlatListSlider } from 'react-native-flatlist-slider';
import { AntDesign } from '@expo/vector-icons';



class PhotoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }








    render() {
        // LayoutAnimation.easeInEaseOut();

        return (

            <View style={styles.container}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },

});

export default PhotoList;