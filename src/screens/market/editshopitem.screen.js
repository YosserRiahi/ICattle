import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, Alert, TouchableOpacity, StatusBar, TouchableHighlight, Switch } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { f, auth, database, storage } from "../../utilies/firebase.util"

import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

export default class UpdateScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      switchValue: false,

    };
  }


  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,


    };
  };



  _logout = () => {
    this.props.navigation.navigate('shops');
  }

  toggleSwitch = value => {
    //onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    //state changes according to switch
    //which will result in re-render the text
  };


  componentDidMount = () => {
    this.props.navigation.setParams({ logout: this._logout });

    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');

    database.ref('shopsphotos').child(user_name).on('value', (snapshot) => {

      this.setState({

        prix: snapshot.val().prix,
        switchValue: snapshot.val().switchValue,


      })
    })


  };
  savecowupdates = () => {

    var switchValue = this.state.switchValue;
    var prix = this.state.prix;

    //  var animalbreed = this.state.animalbreed;


    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');
    const key = user_name

    database.ref('shopsphotos').child(key).child('switchValue').set(switchValue);
    database.ref('shopsphotos').child(key).child('prix').set(prix);



    Alert.alert(
      //title
      'Confirm',
      //body
      'Changes saved',
      [
        { text: 'Yes', onPress: () => this.props.navigation.navigate("shops") },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );

  };


  render() {
    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Update Post </Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('shops')}>
            <AntDesign name="close" size={25} color="#73788B" />
          </TouchableOpacity>
        </View>
        <View style={{ margin: 10, borderColor: "#008000", padding: 10, borderRadius: 3 }}>
          <Text style={{ color: "#808080", marginBottom: 10, marginTop: 10, width: '100%' }}> Available</Text>
          <Switch
            onValueChange={this.toggleSwitch}
            value={this.state.switchValue}
          />
          <Text style={{ color: "#808080", marginBottom: 10, marginTop: 10, width: '100%' }}>Prix</Text>

          <TextInput
            editable={true}
            autoFocus={true}
            multiline={true}
            keyboardType='numeric'
            numberOfLines={4}
            style={{ borderColor: "#008000", borderWidth: 1, marginVertical: 10, height: 30, padding: 5, borderRadius: 3, backgroundColor: 'white', color: 'black' }}

            onChangeText={text => this.setState({ prix: text })}
            value={this.state.prix}
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