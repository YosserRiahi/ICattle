import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageBackground, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { color } from 'react-native-reanimated';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
const slides = [
  {
    key: "one",
    title: "Controling your cattle's health",
    text: "you can set your system in order to get the information of your cattle's health on real-time.",
    image: require("../../../assets/Picture_SPLASH1.png")

  },

  {
    key: "two",
    title: "Get Information About Your cattle's position",
    text: "you can get the geographic coordi",
    image: require('../../../assets/Picture_SPLASH2.png')
  },

  {
    key: "three",
    title: "Build & Share with Community",
    text: "You can communicate with other Farmers and trade cattle , learn from their experiences ...etc",
    image: require('../../../assets/Picture_SPLASH3.png')
  }
];
const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#3EF508',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});
export default class OnboardingScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props);
  }

  _renderItem = ({ item }) => {
    return (

      <View style={{ flex: 1 }}>
        <Image
          source={item.image}
          style={{
            resizeMode: "cover",
            height: "60%",
            width: "100%"
          }}
        />
        <Text
          style={{
            paddingTop: 25,
            paddingBottom: 10,
            fontSize: 23,
            fontWeight: "bold",
            color: "#21465b",
            alignSelf: "center",
            textAlign: "center"
          }}
        >
          {item.title}
        </Text>

        <Text style={{
          textAlign: "center",
          color: "#b5b5b5",
          fontSize: 15,
          paddingHorizontal: 38
        }}>
          {item.text}
        </Text>
      </View>

    );
  }
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <MaterialIcons
          name="navigate-next"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>

        <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} >

          <MaterialIcons
            name="done"
            color="#FFFFFF"
            size={24}
          /></TouchableOpacity>
      </View>
    );
  };
  render() {

    return <AppIntroSlider renderItem={this._renderItem} data={slides}
      activeDotStyle={{
        backgroundColor: "#3EF508",
        width: 30
      }}
      renderDoneButton={this._renderDoneButton}
      renderNextButton={this._renderNextButton}
    />;

  }
}