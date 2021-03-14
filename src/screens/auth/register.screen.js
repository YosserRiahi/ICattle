import React from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserPermissions from "../../utilies/userpermissions.util";
import * as ImagePicker from "expo-image-picker";
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { ScrollView } from "react-native-gesture-handler";
import * as Permissions from 'expo-permissions';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();


export default class RegisterScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            tel: "",
            email: "",
            password: "",
            moveScreen: false,
            errorMessage: null,
            avatar: "",
            specialite: "",
            adresse: "",
            type: "doctor"

        };
    }


    creeateUserObj = (userObj, email, username, name, tel, avatar) => {
        var uObj = {
            name: name,
            username: username,
            tel: tel,
            //  avatar: 'http://www.gravatar.com/this.state.avatar',
            avatar: avatar,
            email: email,
        };
        database.ref('users').child(userObj.uid).set(uObj);


    };

    creeateUserDoctorObj = (userObj, email, username, name, tel, avatar, specialite, adresse, type) => {
        var uObj = {
            name: name,
            username: username,
            tel: tel,
            avatar: avatar,
            email: email,
            specialite: specialite,
            adresse: adresse,
            type: type
        };
        database.ref('users').child(userObj.uid).set(uObj);


    };



    handleSignUp = async () => {
        var email = this.state.email;
        var username = this.state.username;
        var name = this.state.name;
        var tel = this.state.tel;
        var password = this.state.password;
        var avatar = this.state.avatar;
        var specialite = this.state.specialite;
        var adresse = this.state.adresse;
        var type = this.state.type;
        const { navigation } = this.props;

        const user_name = navigation.getParam("value");
        if (email != '' && password != '' && user_name == "doctor") {

            try {
                let user = await auth.createUserWithEmailAndPassword(email, password)
                    .then((userObj) => this.creeateUserDoctorObj(userObj.user, email, username, name, tel, avatar, specialite, adresse, type))
                    .catch((error) => alert(error));

            } catch (error) {
                console.log(error);
                alert(error);
            }
        }

        else if (email != '' && password != '' && user_name == "farmer") {



            try {
                let user = await auth.createUserWithEmailAndPassword(email, password)
                    .then((userObj) => this.creeateUserObj(userObj.user, email, username, name, tel, avatar, specialite, adresse, type))
                    .catch((error) => alert(error));

            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('email or password is empty');

        }




    };

    handlePickAvatar = async () => {
        UserPermissions.getCameraPermission();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            this.setState({ ...this.state.avatar, avatar: result.uri });
        }

    };





    findNewImageCamera = async () => {

        this._checkPermissions();

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3]

        });
        console.log(result);

        if (!result.cancelled) {
            console.log('upload image');
            // this.uploadImage(result.uri);
            this.setState(
                { ...this.state.avatar, avatar: result.uri }

            )

        }

    };
    findNewImageGallery = async () => {

        this._checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3]
        });
        console.log(result);

        if (!result.cancelled) {
            console.log('upload image');
            // this.uploadImage(result.uri);
            this.setState(
                { avatar: result.uri }
            )

        }



    };

    _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });


    };

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);

    };


    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
    };







    render() {

        const { navigation } = this.props;

        const user_name = navigation.getParam("value");
        return (

            <View style={styles.container}>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <ScrollView>

                    {
                        user_name == "doctor" ?
                            <View style={styles.form}>
                                <View>
                                    <Text style={styles.inputTitle}>Full Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ name: text })} value={this.state.name}
                                        value={this.state.name}
                                    ></TextInput>
                                </View>
                                <View>
                                    <Text style={styles.inputTitle}>Username</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ username: text })} value={this.state.username}
                                        value={this.state.username}
                                    ></TextInput>
                                </View>
                                <View>
                                    <Text style={styles.inputTitle}>Phone number</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ tel: text })} value={this.state.tel}
                                        value={this.state.tel}
                                        keyboardType={'numeric'}
                                    ></TextInput>
                                </View>


                                <View>
                                    <Text style={styles.inputTitle}>adresse</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ adresse: text })} value={this.state.adresse}
                                        value={this.state.adresse}
                                    ></TextInput>
                                </View>

                                <View>
                                    <Text style={styles.inputTitle}>specialite</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ specialite: text })} value={this.state.specialite}
                                        value={this.state.specialite}
                                    ></TextInput>
                                </View>

                                <View style={{ marginTop: 32 }}>
                                    <Text style={styles.inputTitle}>Email Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        autoCapitalize="none"
                                        onChangeText={(text) => this.setState({ email: text })} value={this.state.email}
                                        value={this.state.email}
                                    ></TextInput>
                                </View>

                                <View style={{ marginTop: 32 }}>
                                    <Text style={styles.inputTitle}>Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        onChangeText={(text) => this.setState({ password: text })} value={this.state.password}
                                        value={this.state.password}
                                    ></TextInput>
                                </View>
                            </View>

                            :

                            <View style={styles.form}>
                                <View>
                                    <Text style={styles.inputTitle}>Full Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ name: text })} value={this.state.name}
                                        value={this.state.name}
                                    ></TextInput>
                                </View>
                                <View>
                                    <Text style={styles.inputTitle}>Username</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ username: text })} value={this.state.username}
                                        value={this.state.username}
                                    ></TextInput>
                                </View>

                                <View>
                                    <Text style={styles.inputTitle}>Phone number</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => this.setState({ tel: text })} value={this.state.tel}
                                        value={this.state.tel}
                                        keyboardType={'numeric'}
                                    ></TextInput>
                                </View>

                                <View style={{ marginTop: 32 }}>
                                    <Text style={styles.inputTitle}>Email Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        autoCapitalize="none"
                                        onChangeText={(text) => this.setState({ email: text })} value={this.state.email}
                                        value={this.state.email}
                                    ></TextInput>
                                </View>

                                <View style={{ marginTop: 32 }}>
                                    <Text style={styles.inputTitle}>Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        onChangeText={(text) => this.setState({ password: text })} value={this.state.password}
                                        value={this.state.password}
                                    ></TextInput>
                                </View>
                            </View>


                    }


                </ScrollView>


                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ alignSelf: "center", marginTop: 32 }}
                    onPress={() => this.props.navigation.navigate("Login")}
                >
                    <Text style={{ color: "#414959", fontSize: 13 }}>
                        Already have an account? <Text style={{ fontWeight: "500", color: "#00ff00" }}>Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },


    form: {
        marginTop: 35,
        marginBottom: 38,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        marginHorizontal: 20,
        backgroundColor: "#00ff00",
        borderRadius: 4,
        height: 52,
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

