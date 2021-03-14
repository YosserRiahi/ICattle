
import React from "react";
import { TextInput, ActivityIndicator, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Image, ScrollView, Button, Alert, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from "expo-image-picker";
import { f, auth, database, storage } from "../../utilies/firebase.util";
import { AntDesign } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
export default class AddCattleToShopScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false, query: null,
            dataSource: [],
            dataBackup: [],
            visibility: false,
            DateDisplay: "",
            switchValue: false,
            loggedin: false,
            imageId: this.uniqueId(),
            imageSelected: false,
            uploading: false,
            prix: '',
            caption: '',
            name: '',
            size: '',
            img: '',
            progress: 0


        }

    }

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



    static navigationOptions = ({ navigation }) => {
        return {

            headerShown: false,

        };
    };


    healthReport = () => {
        //function to make two option alert

        this.props.navigation.navigate('healthReport');


    }



    toggleSwitch = value => {
        //onValueChange of the switch this function will be called
        this.setState({ switchValue: value });
        //state changes according to switch
        //which will result in re-render the text
    };

    uploadPublish = () => {
        if (this.state.uploading == false) {
            if ((this.state.caption != '') && (this.state.prix != '')) {
                this.uploadImage(this.state.uri);
                // alert('ok');

            }
            else {
                alert('Enter all informations ');
            }
        } else {
            console.log('ignore button')
        }

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


    uploadImage = async (uri) => {
        var that = this;
        var userid = f.auth().currentUser.uid;
        var imageId = this.state.imageId;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });

        const response = await fetch(uri);
        const blob = await response.blob();

        var FilePath = imageId + '.' + that.state.currentFileType;

        var uploadTask = storage.ref('user/' + userid + '/img').child(FilePath).put(blob);
        uploadTask.on('state_changed', function (snapshot) {
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            console.log('Upload Is ' + progress + '% complete');
            that.setState({
                progress: progress,

            });
        }, function (error) {
            console.log('error with upload - ' + error);
        }, function () {
            that.setState({ progress: 100 });
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log(downloadURL);
                that.procesUpload(downloadURL);
            });

        });





    };

    procesUpload = (imageUrl) => {
        var imageId = this.state.imageId;
        var userId = f.auth().currentUser.uid;

        var prix = this.state.prix;
        var name = this.state.name;
        var size = this.state.size;
        var img = this.state.uri;

        var caption = this.state.caption;
        var switchValue = this.state.switchValue;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);


        var photoObj = {
            author: userId,
            prix: prix,
            caption: caption,
            posted: timestamp,
            url: imageUrl,
            name: name,
            size: size,
            img: img,
            switchValue: switchValue

        };

        database.ref('/shopsphotos/' + imageId).set(photoObj);
        // database.ref('/users/'+userId+'/photos/' + imageId).set(photoObj);
        alert('Cattle added to the shop list  !!!');
        this.props.navigation.navigate('shops')
        this.setState({
            uploading: false,
            imageSelected: false,
            prix: '',
            caption: '',
            uri: ''



        });


    };



    componentDidMount() {




    }







    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Trade  </Text>
                    <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('shops')}>
                        <AntDesign name="close" size={25} color="#73788B" />
                    </TouchableOpacity>
                </View>
                <ScrollView>

                    <View style={{ flex: 1 }}>
                        <View style={{ margin: 10 }}>
                            <Text style={{ color: '#008000', fontSize: 15, marginBottom: 20, fontWeight: "700" }}>Animal to sell</Text>

                            <Text style={{ marginTop: 5 }}>Prix </Text>
                            <TextInput
                                style={{ marginVertical: 10, height: 30, padding: 5, borderColor: '#008000', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black' }}
                                autoCapitalize="none"
                                onChangeText={(text) => this.setState({ prix: text })} value={this.state.prix}
                                value={this.state.prix}
                                keyboardType={'numeric'}
                            />
                            <Text style={{ marginTop: 9 }}>Description </Text>
                            <TextInput
                                editable={true}
                                autoFocus={true}
                                multiline={true}
                                numberOfLines={4}
                                style={{ marginVertical: 10, height: 100, padding: 5, borderColor: '#008000', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black' }}
                                placeholder="Want to share something?"
                                onChangeText={text => this.setState({ caption: text })}
                                value={this.state.text}
                            />

                            <Text style={{ marginTop: 9 }}>Animal weight (Kg)</Text>
                            <TextInput
                                editable={true}
                                autoFocus={true}
                                multiline={true}
                                keyboardType='numeric'


                                numberOfLines={4}
                                style={{ marginVertical: 10, height: 30, padding: 5, borderColor: '#008000', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black' }}

                                onChangeText={text => this.setState({ size: text })}
                                value={this.state.size}
                            />


                            <Text style={{ marginTop: 9 }}>Name</Text>

                            <TextInput
                                editable={true}
                                autoFocus={true}
                                multiline={true}
                                numberOfLines={4}
                                style={{ marginVertical: 10, height: 30, padding: 5, borderColor: '#008000', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black' }}

                                onChangeText={text => this.setState({ name: text })}
                                value={this.state.name}
                            />

                            <Text style={{ marginTop: 9 }}> Available</Text>
                            <Switch
                                style={{ marginTop: 30 }}
                                onValueChange={this.toggleSwitch}
                                value={this.state.switchValue}
                            />



                            {this.state.uploading == true ? (
                                <View style={{ marginTop: 10 }}>
                                    <Text>{this.state.progress} %</Text>
                                    {this.state.progress != 100 ? (
                                        <ActivityIndicator size="small" color="blue"></ActivityIndicator>
                                    ) : (
                                            <Text>Processing</Text>
                                        )}
                                </View>

                            ) : (
                                    <View></View>
                                )}


                        </View>

                    </View>




                    <View style={{ flexDirection: "row", margin: 10 }}>
                        <Text>Upload Your Image</Text>


                        <TouchableOpacity onPress={() => this.RBSheet.open()} >
                            <Ionicons name="md-camera" size={60} color="#D8D9DB"></Ionicons>
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

                        <Image source={{ uri: this.state.uri }} style={{ marginTop: 10, resizeMode: 'cover', width: 50, height: 50 }} />
                    </View>


                    <View style={{ margin: 10 }}>

                        <TouchableOpacity onPress={() => this.uploadPublish()} style={{ alignSelf: 'center', width: "100%", marginHorizontal: 'auto', backgroundColor: "#008000", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 20 }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Upload & Publish</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingTop: 40,
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
        zIndex: 10,
        flexDirection: "row",
        justifyContent: "space-between",

    },
    headerTitle: {
        marginRight: 20,
        marginLeft: 20,
        fontSize: 15,
        fontWeight: "700"
    },

    textDesign: {
        fontWeight: "600", fontSize: 13, marginBottom: 10
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
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },


});