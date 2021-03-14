import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
export default class loadingscreens extends React.Component {


    constructor(props) {
        super(props);
    }

    componentDidMount() {
        f.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "App" : "Auth");
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text> loading</Text>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

