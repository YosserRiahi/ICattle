import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Image,
  Dimensions, Button
} from 'react-native';
import SearchBar from 'react-native-search-bar';

import { TouchableOpacity, Alert } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import { f, auth, database, storage } from "../../utilies/firebase.util"
const { width, height } = Dimensions.get('window');

export default class Screen2 extends Component {
  constructor() {
    super();
    this.state = {
      query: null,
      dataSource: [],
      dataBackup: [],
    };
  }




  componentDidMount() {
    database.ref('vets').on('value', (snapshot) => {
      var data = []
      snapshot.forEach((child) => {
        data.push({
          key: child.key,
          nom: child.val().nom,
          prenom: child.val().prenom,
          email: child.val().email,
          image: child.val().url

        })
      })
      this.setState({
        dataBackup: data,
        dataSource: data

      })
    })
  }
  del = (id1) => {

    let ttest10 = database.ref('vets').child(id1);
    ttest10.remove();

  };




  _twoOptionAlertHandler = (id) => {
    //function to make two option alert
    Alert.alert(
      //title
      'Confirm',
      //body
      'Are you sure you want to delete this user ?',
      [
        { text: 'Yes', onPress: () => this.del(id) },
        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }

  filterItem = event => {
    var query = event.nativeEvent.text;
    this.setState({
      query: query,
    });
    if (query == '') {
      this.setState({
        dataSource: this.state.dataBackup,
      });
    } else {
      var data = this.state.dataBackup;
      query = query.toLowerCase();
      data = data.filter(l => l.nom.toLowerCase().match(query));

      this.setState({
        dataSource: data,
      });
    }
  };

  separator = () => {
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#e5e5e5' }} />
    );
  };

  render() {
    console.disableYellowBox = true;
    return (

      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.find}>Find user</Text>

          <TextInput
            placeholder="Enter vet name"
            placeholderTextColor="gray"
            value={this.state.query}
            onChange={this.filterItem.bind(this)}
            style={styles.input}
          />

        </View>


        <View style={{ height: 10, width: '100%', backgroundColor: '#e5e5e5' }} />

        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={() => this.separator()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.listItem}>

                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../../assets/tempAvatar.jpg")
                  }
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text style={styles.name}>{item.nom}</Text>
                  <Text>{item.prenom}</Text>
                </View>

                <TouchableOpacity onPress={() => this._twoOptionAlertHandler(item.key)} style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>
                  <Ionicons name="ios-trash" size={35} color="#73788B" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              </View>


            );
          }}
        />









      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: "#EBECF4"
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "500"
  },
  header: {
    height: 150,
    width: '100%',
    backgroundColor: '#fefefe',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },
  find: {
    fontSize: 20,
    fontWeight: 'bold',

    marginBottom: 15
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',


    marginBottom: 7
  },
  input: {
    height: 45,
    width: '90%',
    backgroundColor: '#eaeaea',
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,

  },



  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "90%",

    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  },
  author: {
    fontSize: 16,
  },
});