import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    LayoutAnimation,
    ImageBackground,
    Switch
} from "react-native";
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { getData, storeData } from "../../utilies/localstorage.util";
import { USER_STORAGE_KEY } from "../../bases/asyncStorage.bases"
LogBox.ignoreAllLogs();

export default class LoginScreen extends React.Component {
    switchValue = false;
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

    componentDidMount() {
        getData(USER_STORAGE_KEY).then(user => {
            this.implementLogin(user.email, user.password, false);
        }, error => {

        })
    }
    saveSession = user => {
        storeData(USER_STORAGE_KEY, user).then(
            user => {

            }, error => {
                alret("enable to store user session !")
            }
        )
    }
    toggleSwitch = value => {
        this.switchValue = value;

    };
    implementLogin = async (email, password, remember = true) => {
        if (email != '' && password != '') {
            if (email === 'admin@gmail.com' && password === 'adminadmin') {
                try {
                    let user = await auth.signInWithEmailAndPassword(email, password);
                    if (remember) this.saveSession({ email: email, password: password });
                    this.props.navigation.navigate("Admin");

                } catch (error) {
                    console.log(error);
                    alert(error);
                }

            }

            try {
                let user = await auth.signInWithEmailAndPassword(email, password);
                if (remember) this.saveSession({ email: email, password: password });

            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('email or password is empty');

        }
    }
    goToForgotPassword = () => this.props.navigation.navigate('forgot')
    login = async () => {
        var email = this.state.email;
        var password = this.state.password;
        await this.implementLogin(email, password, switchValue);

    };

    render() {
        LayoutAnimation.easeInEaseOut();
        return (

            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>


                <View style={styles.errorMessageee}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>
                <View style={styles.container}>
                    <ImageBackground source={require('../../../assets/backgroundscreen.png')} style={styles.image}>
                    </ImageBackground>
                </View>

                <View>
                    <View style={styles.form}>

                        <Text style={styles.headerTitle}>Welcome to I-Cattle</Text>


                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8 }} >
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
                                    <AntDesign
                                        name="mail"
                                        color="#DBD8D8"
                                        size={20}
                                    />
                                </View>



                                <TextInput style={styles.input}
                                    placeholder={'Email'}
                                    keyboardType={'email-address'}
                                    autoCapitalize="none"
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}>
                                </TextInput>
                            </View>

                        </View>



                        <View style={{ backgroundColor: "#FFFFFF", flexDirection: 'row', marginTop: 20, borderRadius: 8 }}>
                            <View style={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
                                <AntDesign
                                    name="lock"
                                    color="#DBD8D8"
                                    size={20}
                                />
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder={'Password'}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(text) => this.setState({ password: text })} value={this.state.password}
                            ></TextInput>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Text>Remember me</Text>
                            <Switch
                                style={{}}
                                onValueChange={this.toggleSwitch}
                                value={this.switchValue}
                            />
                        </View>


                        <TouchableOpacity onPress={() => this.props.navigation.navigate("forgot")}>
                            <Text style={{ fontSize: 12, marginTop: 15, marginLeft: 160, fontWeight: "500", color: "#00ff00" }}>
                                Forgot Password?
                    </Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={styles.button} onPress={() => this.login()}>
                        <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 15 }}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ alignSelf: "center", marginTop: 15, paddingBottom: 10 }}
                        onPress={() => this.props.navigation.navigate("RegisterOption")}>
                        <Text style={{ color: "#414959", fontSize: 13 }}>
                            Don't have an account  ? <Text style={{ fontWeight: "500", color: "#00ff00" }}>Register now</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        , backgroundColor: "#F70B0B",
        backgroundColor: "#FFFFFF"
    },

    headerTitle: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center", marginBottom: 20
    },
    errorMessageee: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    form: {
        marginBottom: 5,
        marginHorizontal: 15
    },

    input: {
        height: 20,
        width: 270,
        paddingHorizontal: 5,
        marginBottom: 5,
        marginRight: 50,
        marginBottom: 15,
        marginTop: 7,
        borderRadius: 5


    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#00ff00",
        borderRadius: 4,
        height: 40,
        alignItems: "center",
        justifyContent: "center", borderRadius: 8
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        width: null,
        height: 700
    }


});