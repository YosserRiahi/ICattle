import React from "react";
import { TextInput, ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, TouchableHighlight } from "react-native";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from "expo-image-picker";
import { f, auth, database, storage } from "../../utilies/firebase.util";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from 'react-native'
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons, Entypo, MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
export default class AddAnimalScreen extends React.Component {

  constructor(propos) {
    super(propos);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      animaltype: '',
      animalreference: '',
      animalweight: '',
      animalbirth: '',
      animalbreed: '',
      // animalhealth:'',
      progress: 0,
      visibility: false,
      DateDisplay: ""


    }

  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,

    };
  };





  componentDidMount = () => {

  }


  handleConfirm = (date) => {
    this.setState({ DateDisplay: date.toUTCString() });

  }
  onPressCancel = () => {
    this.setState({ visibility: false });

  }
  onPressButton = () => {
    this.setState({ visibility: true });

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


  uploadPublish = () => {
    if (this.state.uploading == false) {
      if (this.state.animalweight != '') {
        this.uploadImage(this.state.uri);

      } else {
        alert('enter all informations');
      }
    } else {
      console.log('ignore button')
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
    const { navigation } = this.props;
    const user_name = navigation.getParam('value', '');
    var animaltype = this.state.animaltype;
    var animalreference = user_name;
    var animalweight = this.state.animalweight;
    var animalbirth = this.state.DateDisplay;
    var animalbreed = this.state.animalbreed;
    // var animalhealth = this.state.animalhealth;




    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);


    var photoObj = {
      author: userId,
      animaltype: animaltype,
      animalreference: animalreference,
      animalweight: animalweight,
      animalbirth: animalbirth,
      animalbreed: animalbreed,
      // animalhealth :animalhealth,
      posted: timestamp,
      url: imageUrl


    };

    //  database.ref('/photos/' + imageId).set(photoObj);
    database.ref('/users/' + userId + '/photos/' + imageId).set(photoObj);
    alert('Animal saved ');
    this.props.navigation.navigate("Animal")

    this.setState({
      uploading: false,
      imageSelected: false,
      animaltype: '',
      animalreference: '',
      animalweight: '',
      animalbirth: '',
      animalbreed: '',
      //  animalhealth :'',
      uri: ''



    });


  };


  render() {
    const { navigation } = this.props;
    const user_name = navigation.getParam('value', '');

    // const { params } = this.props.navigation.state;
    // const itemId = params ? params.value : null;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Cattle </Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('Animal')}>
            <AntDesign name="close" size={25} color="#73788B" />

          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>


          <View style={{ backgroundColor: "#F3F3F3" }}>

            <ScrollView>
              <View style={{ margin: 10, borderColor: "#008000", borderWidth: 1, padding: 10, borderRadius: 3 }}>
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




                <Text style={styles.textDesign} >Animal reference</Text>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%" }}>

                  <TextInput
                    editable={true}
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={4}
                    style={{ width: 230, marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black', borderColor: "#008000", borderWidth: 1 }}

                    onChangeText={text => this.setState({ animalreference: text })}
                    //  value={this.state.text}
                    value={user_name}
                  />



                  <TouchableOpacity style={{ marginTop: 8 }} onPress={() => this.props.navigation.navigate('scan')}>
                    <AntDesign name="qrcode" size={34} color="#008000" ></AntDesign>
                  </TouchableOpacity>

                </View>


                <Text style={styles.textDesign} >Animal type</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <AntDesign style={{ marginTop: 20 }} name="caretdown" size={12} color="#008000" ></AntDesign>
                  < Picker style={{ width: '100%', backgroundColor: "#FFFFFF" }}
                    selectedValue={this.state.animaltype}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ animaltype: itemValue })
                    }>
                    <Picker.Item label="Tarentaise" value="Tarentaise" />
                    <Picker.Item label="Brune de l'Atlas" value="Brune de l'Atlas" />
                    <Picker.Item label="Frisonne" value="Frisonne" />
                    <Picker.Item label="Brune" value="Brune" />

                  </Picker>
                </View>

                <Text style={styles.textDesign}  >Animal weight (Kg)</Text>
                <TextInput
                  editable={true}
                  autoFocus={true}
                  multiline={true}
                  keyboardType='numeric'

                  numberOfLines={4}
                  style={{ borderColor: "#008000", borderWidth: 1, marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black' }}

                  onChangeText={text => this.setState({ animalweight: text })}
                  value={this.state.text}
                />



                <Text style={styles.textDesign} >Name</Text>

                <TextInput
                  editable={true}
                  autoFocus={true}
                  multiline={true}
                  numberOfLines={4}
                  style={{ marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black', borderColor: "#008000", borderWidth: 1 }}

                  onChangeText={text => this.setState({ animalbreed: text })}
                  value={this.state.text}
                />

                <Text style={styles.textDesign} >Birth</Text>


                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>

                  <TextInput
                    editable={true}
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={4}
                    style={{ width: 230, marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black', borderColor: "#008000", borderWidth: 1 }}

                    onChangeText={text => this.setState({ animalbirth: text })}
                    value={this.state.DateDisplay}
                  />

                  <DateTimePickerModal
                    isVisible={this.state.visibility}
                    onConfirm={this.handleConfirm}
                    onCancel={this.onPressCancel}
                    mode="date"

                  />


                  <TouchableOpacity style={{ marginTop: 8 }} onPress={this.onPressButton}>
                    <AntDesign name="calendar" size={34} color="#008000"></AntDesign>
                  </TouchableOpacity>

                </View>





                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => this.RBSheet.open()} style={{ marginTop: 10, resizeMode: 'cover', backgroundColor: "#008000", width: 50, height: 50, borderRadius: 10, alignContent: "center", justifyContent: "center", alignItems: "center", marginRight: 10 }}  >
                    <Ionicons name="md-camera" size={40} color="#FFFFFF"></Ionicons>
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
                  <Image source={{ uri: this.state.uri }}
                    style={{ marginTop: 10, resizeMode: 'cover', width: 50, height: 50, borderRadius: 10 }} />
                </View>
                <TouchableOpacity onPress={() => this.uploadPublish()}
                  style={{ alignSelf: 'center', marginHorizontal: 'auto', backgroundColor: "#008000", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20, marginTop: 10, width: '100%' }}>
                  <Text style={{ textAlign: 'center', color: 'white' }}>Save Animal</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </View>
        </View>


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

  },
});