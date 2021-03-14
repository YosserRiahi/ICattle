import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Stars from 'react-native-stars';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import { AntDesign } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { API_KEY } from '../../utilies/weatherapikey.util';
import { weatherConditions } from '../../utilies/wheathercondition.util.js';
import Weather from '../../components/wheather.component';
import { FlatList } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

LogBox.ignoreAllLogs();


export default class HealthReport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isLoading: true,
      temperature: 0,
      humidity: 0,
      weatherCondition: null,
      dataBackup: [],
      dataSource: [],
      query: null,
      visibility: false,
      DateDisplay: ""

    };
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

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,

    };
  };


  componentDidMount = () => {

    const { navigation } = this.props;

    const idphoto = navigation.getParam('id');
    const reference = navigation.getParam('reference');
    var that = this;


    database.ref('sensors').child(reference).once('value').then(function (snapshot) {

      that.setState({
        latestTemperature: snapshot.val().latestTemperature,

      })
    });

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

    database.ref('sensors').child(reference).child("historyTemperture").on('value', (snapshot) => {
      var data = []
      snapshot.forEach((child) => {
        data.push({
          key: child.val(),

        })

      })
      this.setState({
        dataSource: data,
        dataBackup: data

      })
    })
  };


  filterItem = event => {
    var DateDisplay = event.nativeEvent.text;
    this.setState({
      DateDisplay: DateDisplay,
    });
    if (DateDisplay == '') {
      this.setState({
        dataSource: this.state.dataBackup,
      });
    } else {
      var data = this.state.dataBackup;
      DateDisplay = DateDisplay.toLowerCase();
      data = data.filter(l => l.key.toLowerCase().match(DateDisplay));

      this.setState({
        dataSource: data,
      });
    }
  };

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

  render() {
    const { isLoading } = this.state;

    const { navigation } = this.props;
    const idphoto = navigation.getParam('id');
    const reference = navigation.getParam('reference');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health report</Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('Animal')}>
            <AntDesign name="close" size={25} color="#73788B" />
          </TouchableOpacity>
        </View>
        <View style={styles.header1}>
          {isLoading ? (
            <Text>Fetching The Weather</Text>
          ) : (

              <Weather
                weather={this.state.weatherCondition}
                temperature={this.state.temperature}
                humidity={this.state.humidity}
                visibility={this.state.pressure}
              />
            )}

        </View>

        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>

          <TextInput
            editable={true}
            placeholder="Search here ..."
            placeholderTextColor="gray"
            style={styles.input}
            onChange={this.filterItem.bind(this)}
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
        <View>

          {
            +(this.state.latestTemperature) > 40 ?  // if has image

              <View style={{ marginTop: 30, marginLeft: 30, height: 200, backgroundColor: "red", width: 250, justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                <FontAwesome5 style={{ marginBottom: 10 }} name="temperature-low" size={30} color={'#FFFFFF'} />
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>{this.state.latestTemperature}°C</Text>

                <Text style={{ color: "#FFFFFF", marginBottom: 20, marginLeft: 30 }}>The temperature of your cow is very high contact a doctor</Text>

              </View>
              :
              +(this.state.latestTemperature) > 37 ?
                <View style={{ marginTop: 30, marginLeft: 30, height: 200, backgroundColor: "green", width: 250, justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                  <FontAwesome5 style={{ marginBottom: 10 }} name="temperature-low" size={30} color={'#FFFFFF'} />
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>{this.state.latestTemperature}°C</Text>

                  <Text style={{ color: "#FFFFFF", marginBottom: 20, marginLeft: 30 }}>Your cow's temperature is ideal, don't worry </Text>


                </View>
                :
                +(this.state.latestTemperature) > 17 ?
                  <View style={{ marginTop: 30, marginLeft: 30, height: 200, backgroundColor: "blue", width: 250, justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                    <FontAwesome5 style={{ marginBottom: 10 }} name="temperature-low" size={30} color={'#FFFFFF'} />
                    <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>{this.state.latestTemperature}°C</Text>


                  </View>
                  :


                  <View >

                  </View>





          }








        </View>



        <FlatList
          data={this.state.dataSource}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1, backgroundColor: '#fff', marginHorizontal: 7, borderRadius: 12, marginVertical: 7 }}
          renderItem={({ item, index }) => (
            <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>

              <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>



                <View style={{ padding: 20, paddingRight: 80, width: '100%', flexDirection: "column", justifyContent: 'space-between' }}>

                  <Text>{item.key}  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>);
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
  header1: {
    paddingTop: 30,
    paddingBottom: 30,
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
  input: {
    height: 45,
    width: '90%',
    backgroundColor: '#eaeaea',
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,

  },
});


