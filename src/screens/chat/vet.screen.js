import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { TouchableOpacity, Alert, TouchableHighlight, Linking } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import { MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { Ionicons, Feather } from "@expo/vector-icons";
import { f, auth, database, storage } from "../../utilies/firebase.util"
const { width, height } = Dimensions.get('window');
import { SearchBar, Avatar, Badge, Icon, withBadge } from 'react-native-elements';

export default class VetsScreen extends Component {
  constructor() {
    super();
    this.state = {
      idididuser: f.auth().currentUser.uid,

      dataSource: [],
      loaded: false,
      phoneNumber: "",
      search: '',
      dataBackup: [],
    };
  }

  componentDidMount() {
    database.ref('users').orderByChild('type').equalTo("doctor").on('value', (snapshot) => {
      var data = []
      snapshot.forEach((child) => {

        data.push({
          key: child.key,
          specialite: child.val().specialite,
          adresse: child.val().adresse,
          nom: child.val().username,
          prenom: child.val().name,
          phone: child.val().tel,
          email: child.val().email,
          image: child.val().avatar,


        })


      })
      this.setState({
        dataSource: data,
        dataBackup: data

      })
    })

  }
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
      data = data.filter(l => l.prenom.toLowerCase().match(search));

      this.setState({
        dataSource: data,
      });
    }
  };




  _twoOptionAlertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      'Confirm',
      //body
      'You want to delete all the list?',
      [
        { text: 'Yes', onPress: () => this.del() },
        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    );
  }


  call = (phone) => {
    //const { phoneNumber } = this.state

    Linking.openURL(`tel:${phone}`)
    this.setState({ phoneNumber: phone })
  }
  goToDoctorDetails = (id) => {
    //const { phoneNumber } = this.state
    this.props.navigation.navigate('DoctorDetails', { photoId: id })

  }
  goToChat = (uid, name, image, username) => {
    //const { phoneNumber } = this.state
    this.props.navigation.navigate('Chat', {
      uid: uid,
      name: name,
      image: image,
      username: username

    })

  }
  separator = () => {
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#e5e5e5' }} />
    );
  };

  render() {
    const { search } = this.state;

    return (

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}> Doctors  </Text>
        </View>
        <SearchBar
          placeholder="Type doctor name"
          onChangeText={this.filterItem}
          value={search}

        />
        <FlatList
          data={this.state.dataSource}
          refreshing={this.state.refresh}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1, backgroundColor: '#fff', marginHorizontal: 7, borderRadius: 12, marginVertical: 7 }}
          renderItem={({ item, index }) => (
            <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>

              <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../../assets/tempAvatar.jpg")
                  }
                  style={{ width: 60, height: 60, borderRadius: 30, marginLeft: 10, margin: 20, marginTop: 10 }}
                />


                <View style={{ padding: 20, paddingRight: 80, width: '100%', flexDirection: "column", justifyContent: 'space-between' }}>

                  <Text>{item.prenom}  {item.nom}  </Text>

                  <Text>{item.adresse} </Text>
                  <Text>{item.specialite} </Text>

                </View>


              </View>

              <View style={{ flex: 1, flexDirection: "row-reverse", marginBottom: 10, marginLeft: 10 }}>


                <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: "#F0C300", marginLeft: 10, justifyContent: "center", alignItems: "center" }} >

                  <TouchableOpacity onPress={() => this.goToChat(item.key, item.nom, item.image, item.prenom)} style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>

                    <Entypo name="message" size={25} color="#ffffff" ></Entypo>

                  </TouchableOpacity>
                </View>
                <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: "#008000", marginLeft: 10, justifyContent: "center", alignItems: "center" }} >

                  <TouchableOpacity onPress={() => this.call(item.phone)} style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>

                    <Ionicons name="call" size={25} color="#ffffff" ></Ionicons>

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
    paddingTop: 50,
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
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500"
  },








});