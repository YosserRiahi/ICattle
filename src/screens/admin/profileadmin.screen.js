import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { f, auth, database, storage } from "../../utilies/firebase.util.js"
import { LogBox } from 'react-native';
import { deleteData } from "../../utilies/localstorage.util"
import { USER_STORAGE_KEY } from "../../bases/asyncStorage.bases"
LogBox.ignoreAllLogs();


export default class ProfileAdminScreen extends React.Component {

    constructor(props) {
        super(props);

    }



    logoutUser = () => {
        f.auth().signOut();
        deleteData(USER_STORAGE_KEY).then(r => { }, error => { alert("enable to clear session!") })
        this.props.navigation.navigate("Login");
        alert('Logged Out')


    };



    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    onPress={() => this.logoutUser()}
                    style={{ marginTop: 300, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5 }}>
                    <Text style={{ textAlign: 'center', color: 'grey' }}>Logout</Text>
                </TouchableOpacity>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },


});