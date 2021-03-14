import React from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserPermissions from "../../utilies/userpermissions.util";
import * as ImagePicker from "expo-image-picker";
import { f, auth, database, storage } from "../../utilies/firebase.util"


export default class RegisterOptionScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>


                <Text style={styles.greeting}>{`Hello!`}</Text>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("Register", { value: "farmer" })}
                >
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Farmer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("Register", { value: "doctor" })}
                >
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Doctor</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1


    },
    greeting: {
        marginTop: 25,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },


    button: {
        marginTop: 20,
        marginHorizontal: 30,
        backgroundColor: "#008000",
        borderRadius: 4,
        height: 150,
        alignItems: "center",
        justifyContent: "center"
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },

    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: "#E1E2E6",
        borderRadius: 50,
        marginTop: 48,
        justifyContent: "center",
        alignItems: "center"
    },

    avatar: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50
    }


});


// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
//
// export default class RegisterScreen extends React.Component {
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text>register Screen</Text>
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center"
//     }
// });