
import { f, auth, database, storage } from "../../utilies/firebase.util.js"
import { deleteData } from "../../utilies/localstorage.util"
import { USER_STORAGE_KEY } from "../../bases/asyncStorage.bases"
import React from "react";
import { TextInput, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons, FontAwesome5, Entypo, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from "expo-image-picker";
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();


export default class ProfileScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            imageSelected: false,
        }
    }

    fetchUserInfo = (userId) => {
        var that = this;
        database.ref('users').child(userId).once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            that.setState({
                username: data.username,
                name: data.name,
                avatar: data.avatar,
                loaded: true,
                userId: userId


            })
        });

    };
    _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });


    };
    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
    };
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);

    };
    findNewImageCamera = async () => {

        this._checkPermissions();

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });
        console.log(result);

        if (!result.cancelled) {
            console.log('upload image');
            // this.uploadImage(result.uri);
            this.setState({
                imageSelected: true,
                imageId: this.uniqueId(),
                uri: result.uri,

            })

        } else {
            console.log('cancel');
            this.setState({
                imageSelected: false
            })

        }

    };
    findNewImageGallery = async () => {

        this._checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });
        console.log(result);

        if (!result.cancelled) {
            console.log('upload image');
            // this.uploadImage(result.uri);
            this.setState({
                imageSelected: true,
                imageId: this.uniqueId(),
                uri: result.uri,


            })

        } else {
            console.log('cancel');
            this.setState({
                imageSelected: false
            })

        }

    };

    checkParams = () => {
        var params = this.props.navigation.state.params;
        if (params) {
            if (params.userId) {
                this.setState({
                    userId: params.userId
                });
                this.fetchUserInfo(params.userId);
            }
        }


    };


    componentDidMount = () => {
        this.checkParams();
        var that = this;
        f.auth().onAuthStateChanged(function (user) {

            if (user) {
                that.fetchUserInfo(user.uid);

                // userId:user.uid;
            }

        })
    };

    saveProfile = () => {
        var name = this.state.name;
        var username = this.state.username;
        var avatar = this.state.uri;

        if (name !== '') {
            database.ref('users').child(this.state.userId).child('name').set(name);

        }
        if (username !== '') {
            database.ref('users').child(this.state.userId).child('username').set(username);

        }

        //    database.ref('users').child(this.state.userId).child('avatar').set(avatar);

        this.setState({ editingProfile: false });

    };


    logoutUser = () => {
        f.auth().signOut();
        deleteData(USER_STORAGE_KEY).then(r => { }, error => { alert("enable to clear session!") })

        this.props.navigation.navigate("Login")
        alert('Logged Out')
    };

    editProfil = () => {
        this.setState({ editingProfile: true })

    };

    render() {
        return (

            <View style={styles.container}>
                {this.state.loaded == false ? (
                    <View>
                        <Text>Loading ....</Text>
                    </View>

                ) : (
                        <React.Fragment>


                            <View style={{ marginTop: 64, alignItems: "center" }}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={
                                            this.state.uri
                                                ? { uri: this.state.uri }
                                                : require("../../../assets/tempAvatar.jpg")
                                        }
                                        style={styles.avatar}
                                    />

                                </View>



                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => this.RBSheet.open()} style={{ marginTop: -35, resizeMode: 'cover', width: 50, height: 50, borderRadius: 10, alignContent: "center", justifyContent: "center", alignItems: "center", marginLeft: 80 }}  >
                                        <Ionicons name="md-camera" size={40} color="#C4C9C7"></Ionicons>
                                    </TouchableOpacity>
                                    <RBSheet
                                        ref={ref => {
                                            this.RBSheet = ref;
                                        }}
                                        height={300}
                                        openDuration={250}
                                        customStyles={{
                                            container:
                                            {

                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderTopLeftRadius: 15, borderTopRightRadius: 15

                                            }
                                        }}
                                    >

                                        <View style={styles.panel}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={styles.panelTitle}>Choose Option</Text>
                                                <Text style={styles.panelSubtitle}></Text>

                                            </View>
                                            <TouchableOpacity onPress={() => this.findNewImageCamera()} style={styles.panelButton}>
                                                <Text style={styles.panelButtonTitle}>Open Camera</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.findNewImageGallery()} style={styles.panelButton1} >
                                                <Text style={styles.panelButtonTitle}>Select From Gallery</Text>
                                            </TouchableOpacity>

                                        </View>

                                    </RBSheet>


                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={styles.name}>{this.state.name}</Text>
                                    <Text style={styles.name}>{this.state.username}</Text>
                                </View>
                            </View>



                            {this.state.editingProfile == true ? (
                                <View
                                    style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottomWidth: 2 }}>
                                    <TouchableOpacity onPress={() => this.setState({ editingProfile: false })}>
                                        <Text style={{ fontWeight: 'bold' }}>Cancel Editing</Text>
                                    </TouchableOpacity>
                                    <Text>Name</Text>
                                    <TextInput
                                        editable={true}
                                        placeholder={'Enter your name'}
                                        onChangeText={(text) => this.setState({ name: text })}
                                        value={this.state.name}
                                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'grey', borderWidth: 1 }}
                                    />

                                    <Text>Username</Text>
                                    <TextInput
                                        editable={true}
                                        placeholder={'Enter your username'}
                                        onChangeText={(text) => this.setState({ username: text })}
                                        value={this.state.username}
                                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'grey', borderWidth: 1 }}
                                    />

                                    <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10 }}
                                        onPress={() => this.saveProfile()}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Changes</Text>
                                    </TouchableOpacity>

                                </View>
                            ) : (
                                    <View style={{ marginLeft: 10, marginTop: 20 }}  >


                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ marginBottom: 10, width: 60, height: 60, borderRadius: 40, backgroundColor: "#F0C300", marginLeft: 10, justifyContent: "center", alignItems: "center" }} >

                                                <TouchableOpacity
                                                    onPress={() => this.editProfil()}
                                                    style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>
                                                    <FontAwesome5 name="user-edit" size={25} color="#fff" ></FontAwesome5>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ marginBottom: 10, marginLeft: 10, fontSize: 15, marginTop: 15, fontWeight: "600" }}>Edit Profile</Text>

                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ marginBottom: 10, width: 60, height: 60, borderRadius: 40, backgroundColor: "#008000", marginLeft: 10, justifyContent: "center", alignItems: "center" }} >

                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate("Mychats")}
                                                    style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>
                                                    <Entypo name="chat" size={25} color="#fff" ></Entypo>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ marginBottom: 10, marginLeft: 10, fontSize: 15, marginTop: 15, fontWeight: "600" }}>My chats</Text>

                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ marginBottom: 10, width: 60, height: 60, borderRadius: 40, backgroundColor: "#BB0B0B", marginLeft: 10, justifyContent: "center", alignItems: "center" }} >

                                                <TouchableOpacity
                                                    onPress={() => this.logoutUser()}
                                                    style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>
                                                    <MaterialCommunityIcons name="logout-variant" size={25} color="#fff" ></MaterialCommunityIcons>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ marginBottom: 10, marginLeft: 10, fontSize: 15, marginTop: 15, fontWeight: "600" }}>Logout</Text>

                                        </View>


                                    </View>



                                )}

                        </React.Fragment>)}

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 30,
        shadowOpacity: 0.4
    },

    name: {
        marginTop: 24,
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
        marginBottom: 10
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#008000',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButton1: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#008000',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
});