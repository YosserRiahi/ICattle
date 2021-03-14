import React from "react";
import { TextInput, ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Image, ScrollView, Button, Alert } from "react-native";
import { f, auth, database, storage } from "../../utilies/firebase.util"
import PhotoList from '../../components/photolist.component.js'
import { Picker } from 'react-native'
import { Ionicons, Entypo, MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default class EditScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      query: null,
      dataSource: [],
      dataBackup: [],
      visibility: false,
      DateDisplay: ""
    }

  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,

    };
  };


  handleConfirm = (date) => {
    this.setState({ DateDisplay: date.toUTCString() });

  }
  onPressCancel = () => {
    this.setState({ visibility: false });

  }
  onPressButton = () => {
    this.setState({ visibility: true });

  }





  componentDidMount() {


    const { navigation } = this.props;

    const user_name = navigation.getParam('value', '');
    const userid = f.auth().currentUser.uid
    const key = user_name

    database.ref('users').child(userid).child(`photos/${key}`).on('value', (snapshot) => {
      var data = []

      this.setState({


        animalreference: snapshot.val().animalreference,
        animalweight: snapshot.val().animalweight,
        animalbirth: snapshot.val().animalbirth,
        animalbreed: snapshot.val().animalbreed,
        animalhealth: snapshot.val().animalhealth,
        url: snapshot.val().url





      })
    })

  }







  savecowupdates = () => {

    var animalweight = this.state.animalweight;
    var animalbreed = this.state.animalbreed;




    const { navigation } = this.props;
    const userid = f.auth().currentUser.uid

    const user_name = navigation.getParam('value', '');
    const key = user_name

    database.ref('users').child(userid).child(`photos/${key}`).child('animalweight').set(animalweight);
    database.ref('users').child(userid).child(`photos/${key}`).child('animalbreed').set(animalbreed);


    Alert.alert(
      //title
      'Confirm',
      //body
      'Changes saved',
      [
        { text: 'Yes', onPress: () => this.props.navigation.navigate("Animal") },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );

  };



  render() {
    const { navigation } = this.props;
    const user_name = navigation.getParam('value', '');

    return (

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Update Cattle </Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('Animal')}>
            <AntDesign name="close" size={25} color="#73788B" />

          </TouchableOpacity>
        </View>
        <View style={{ margin: 10, borderColor: "#008000", padding: 10, borderRadius: 3 }}>
          <Text style={{ color: "#808080", marginBottom: 10, marginTop: 10, width: '100%' }}>Animal weight (Kg)</Text>
          <TextInput
            editable={true}
            autoFocus={true}
            multiline={true}
            keyboardType='numeric'


            numberOfLines={4}
            style={{ borderColor: "#008000", borderWidth: 1, marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black' }}

            onChangeText={text => this.setState({ animalweight: text })}
            value={this.state.animalweight}
          />



          <Text style={{ color: "#808080", marginBottom: 10, marginTop: 10, width: '100%' }}>Name</Text>

          <TextInput
            editable={true}
            autoFocus={true}
            multiline={true}
            numberOfLines={4}
            style={{ borderColor: "#008000", borderWidth: 1, marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black' }}

            onChangeText={text => this.setState({ animalbreed: text })}
            value={this.state.animalbreed}
          />










          <TouchableOpacity style={{ backgroundColor: '#008000', padding: 10, textAlign: 'center', borderRadius: 3, marginTop: 130 }}
            onPress={() => this.savecowupdates()}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Save Changes</Text>
          </TouchableOpacity>
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
});