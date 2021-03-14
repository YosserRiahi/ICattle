import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, Alert, TouchableOpacity, StatusBar } from 'react-native';

import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();


export default class Forgot extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            moveScreen: false,
            errorMessage: null
        };
    }



    onResetPasswordPress = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert("Password reset email has been sent.");
            }, (error) => {
                Alert.alert(error.message);
            });
    }

    onBackToLoginPress = () => {
        var navActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Login" })]
        });
        this.props.navigation.dispatch(navActions);
    }

    render() {
        return (
            <View style={styles.container}>

                <Image
                    style={{
                        resizeMode: "stretch",
                        height: 200, marginLeft: 60, marginTop: 80,
                        width: 200
                    }}
                    source={require('../../../assets/Picture_PASSWORD_FORGOTTEN.png')}
                />

                <StatusBar barStyle="light-content"></StatusBar>

                <Text style={styles.headerTitle}>Fill your email and we will sent you a link to change your password </Text>

                <TextInput style={styles.input}
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({ email: text }) }}
                    placeholder="Type your email to renew your password"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />


                <TouchableOpacity style={styles.button} onPress={() => this.onResetPasswordPress}>
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Get your new password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ alignSelf: "center", marginTop: 12 }}
                    onPress={() => this.props.navigation.navigate("Register")}
                >
                    <Text style={{ color: "#414959", fontSize: 13 }}>
                        Don't have an account  ? <Text style={{ fontWeight: "500", color: "#00ff00" }}>Register now</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,


        }
    },

    headerTitle: {
        fontWeight: 'Bold',
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 20,
        marginTop: 10,
        marginHorizontal: 30

    },
    button: {

        marginHorizontal: 30,
        backgroundColor: "#00ff00",
        height: 52,
        alignItems: "center",
        justifyContent: "center", borderRadius: 8
    },
    input: {
        marginHorizontal: 30,
        backgroundColor: "#00ff00",
        borderRadius: 8,
        height: 52,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center"
    },


});