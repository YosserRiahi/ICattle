import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Image,
  Dimensions, Button, ImageBackground
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, Alert } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome5, MaterialIcons, Feather, Fontisto, FontAwesome, Foundation, Entypo } from "@expo/vector-icons";
import { f, auth, database, storage } from "../../utilies/firebase.util.js"
const { width, height } = Dimensions.get('window');
import Weather from '../../components/wheather.component';
import { API_KEY } from '../../utilies/weatherapikey.util';
//import { Calendar } from 'react-native-calendars'; 
import CalendarStrip from 'react-native-slideable-calendar-strip';
import HorizontalCalendar from 'horizontal-calendar'

import { Calendar } from 'react-native-toggle-calendar';
import { color } from 'react-native-reanimated';
import { SearchBar, Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default class AnimalScreen extends React.Component {


  constructor() {
    super();
    this.state = {
      posts: [],
      query: null,
      dataSource: [],
      isLoading: true,
      temperature: 0,
      humidity: 0,
      weatherCondition: null,
      error: null,
      search: '',
      dataBackup: [],
    };

  }
  updateSearch = (search) => {
    this.setState({ search });
  };


  componentDidMount() {
    const userid = f.auth().currentUser.uid
    database.ref('users').child(userid).child('photos').once('value', (snapshot) => {
      var data = []
      snapshot.forEach((child) => {
        data.push({
          key: child.key,
          animalreference: child.val().animalreference,
          animaltype: child.val().animaltype,
          animalbreed: child.val().animalbreed,
          url: child.val().url,


        })
      })
      this.setState({
        dataBackup: data,
        dataSource: data

      })
    })


    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Getting Weather Conditions'
        });
      }
    );

  }


  fetchWeather(lat = 25, lon = 25) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          temperature: json.main.temp,
          humidity: json.main.humidity,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      });
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
      data = data.filter(l => l.animalbreed.toLowerCase().match(search));

      this.setState({
        dataSource: data,
      });
    }
  };


  healthReport = (id, reference) => {
    this.props.navigation.navigate('healthReport', { id: id, reference: reference });
  }

  traking = (id, reference) => {
    this.props.navigation.navigate('traking', { id: id, reference: reference });
  }



  shop = (id) => {
    this.props.navigation.navigate('addshop', { ok: id })
  };
  gotoEdit = (id) => {
    //function to make two option alert
    // alert(` ${id} `);
    this.props.navigation.navigate('UpdateCattle', { value: id })
  }

  delete = (id) => {
    Alert.alert(

      //title
      'Confirm',
      //body
      'Are you sure you want to delete this cattle ?',
      [
        { text: 'yes', onPress: () => this.del(id) },
        { text: 'no', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }
  del = (id1) => {
    const userid = f.auth().currentUser.uid

    var query = database.ref('users').child(userid).child(`photos/${id1}`)
    query.on('child_added', function (snapshot) {
      snapshot.ref.remove();

    });
  };

  render() {
    const { isLoading } = this.state;
    const { search } = this.state;
    return (

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>I-Cattle </Text>
          <View style={{
            flexDirection: "row",


          }}>
          </View>
        </View>

        <SearchBar
          placeholder="Type cow name"
          onChangeText={this.filterItem}
          value={search}

        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 7, marginTop: 15, marginBottom: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", marginTop: 5, color: "#2F4F4F" }}>  New Cattle  </Text>
          <TouchableOpacity style={{ marginRight: 15, marginTop: 2 }} onPress={() => this.props.navigation.navigate("AddAnimalScreen")} >
            <Ionicons name="md-add-circle-sharp" size={30} color="#008000" />
          </TouchableOpacity>
        </View>
        <FlatList

          data={this.state.dataSource}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.ListItem}>

              <View style={{ flex: 1, width: '100%' }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                  <Text style={{ marginTop: 5, fontWeight: "600", fontSize: 15, color: "#2F4F4F" }}>{item.animalbreed}</Text>

                </View>

                <Image source={{ uri: item.url }} style={styles.postImage} resizeMode="cover" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                </View>
                <View style={{ flexDirection: "row-reverse", marginTop: 20, alignItems: "flex-end" }}>
                  <TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.delete(item.key)} >
                    <Ionicons name="ios-trash" size={22} color="#C0C0C0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 7 }} onPress={() => this.gotoEdit(item.key)} >
                    <FontAwesome name="edit" size={22} color="#C0C0C0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 7 }} onPress={() => this.shop(item.key)}>
                    <Feather name="shopping-cart" size={22} color="#C0C0C0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 7 }} onPress={() => this.healthReport(item.key, item.animalreference)} >
                    <Ionicons name="checkbox" size={22} color="#C0C0C0" />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginRight: 7 }} onPress={() => this.traking(item.key, item.animalreference)} >
                    <Entypo name="location" size={22} color="#C0C0C0" />
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          )}

        />

      </View >
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
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between", padding: 30
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700"
  },
  ListItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    marginVertical: 7,
    marginHorizontal: 7
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 10,
    marginVertical: 16
  }
});