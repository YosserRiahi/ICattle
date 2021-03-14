import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, Alert, TouchableOpacity, StatusBar, TouchableHighlight, FlatList } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';

import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { SearchBar, Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default class MychatsScreen extends React.Component {

  inval = "";
  constructor() {
    super();
    this.state = {
      dataSource: [],
      loaded: false,
      phoneNumber: "",
      search: '',
      dataBackup: [],

    };
  }


  componentDidMount() {
    this.props.navigation.setParams({ logout: this._logout });
    const userid = f.auth().currentUser.uid
    database.ref('users').child(userid).child('mychats').once('value', (snapshot) => {
      var data = []
      snapshot.forEach((child) => {

        data.push({
          key: child.key,
          uid: child.val().uid,
          image: child.val().image,
          username: child.val().username,
          name: child.val().name,
        })


      })
      this.setState({
        dataSource: data,
        dataBackup: data

      })
    })

  }


  goToChat = (uid, name, image, username) => {
    this.props.navigation.navigate('Chat', {
      uid: uid,
      name: name,
      image: image,
      username: username

    })

  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,


    };
  };


  filterItem = (search) => {
    // var search = this.state.search ;
    this.setState({
      search: search,
    });
    if (search == '') {
      this.setState({
        dataSource: this.state.dataBackup,
      });
    } else {
      var data = this.state.dataBackup;
      search = search.toLowerCase();
      data = data.filter(l => l.username.toLowerCase().match(search));

      this.setState({
        dataSource: data,
      });
    }
  };


  render() {
    const userid = f.auth().currentUser.uid
    const { search } = this.state;

    return (

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My chats </Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('Profile')}>
            <AntDesign name="close" size={25} color="#73788B" />
          </TouchableOpacity>
        </View>
        <SearchBar
          placeholder="Type doctor name"
          onChangeText={this.filterItem}
          value={search}

        />
        <FlatList
          data={this.state.dataSource}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1, backgroundColor: '#fff' }}
          renderItem={({ item, index }) => (
            <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey', height: 120 }}>
              <View style={{ height: 10, width: '100%', backgroundColor: '#e5e5e5' }} />
              <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ padding: 20, paddingRight: 80, width: '100%', flexDirection: "row" }}>
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("../../../assets/tempAvatar.jpg")
                    }
                    style={{ width: 60, height: 60, borderRadius: 30, marginTop: 10 }}
                  />

                  <TouchableOpacity onPress={() => this.goToChat(item.key, item.name, item.image, item.username)}>
                    <Text style={{ marginTop: 25, marginLeft: 20 }}>{item.username}  {item.name} </Text>

                  </TouchableOpacity>

                </View>
              </View>

            </View>

          )}
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