import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, Alert, TouchableOpacity, StatusBar, TouchableHighlight } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';
import { f, auth, database, storage } from "../../utilies/firebase.util.js"
import MapView from 'react-native-maps';
import { number } from 'prop-types';

export default class TrakingScreen extends React.Component {
  coordinations = {};
  constructor() {
    super();
    this.state = {

    };
  }
  componentDidMount = () => {
    const { navigation } = this.props;
    const idphoto = navigation.getParam('id');
    const reference = navigation.getParam('reference');

    database.ref("Location").child(reference).child("Location").child("latitude").on('value', (snapshot) => {
      snapshot.forEach((child) => {
        this.coordinations.latitude = Number.parseFloat(child.val());
        if (this.coordinations.longitude) this.setState({ coordinations: this.coordinations })
      })
    })

    database.ref("Location").child(reference).child("Location").child("longitude").on('value', (snapshot) => {
      snapshot.forEach((child) => {
        this.coordinations.longitude = Number.parseFloat(child.val());
        if (this.coordinations.latitude) this.setState({ coordinations: this.coordinations })

      })
    })

  };

  render() {
    return (
      <View style={styles.fillScreen}>
        <MapView
          style={styles.fillScreen}
          region={
            {
              latitude: (this.state.coordinations || { latitude: 0, longitude: 0 }).latitude,
              longitude: (this.state.coordinations || { latitude: 0, longitude: 0 }).longitude,
              latitudeDelta: 0,
              longitudeDelta: 0.05,
            }
          }
          rotateEnabled={false}
        >
          <MapView.Marker
            key={1222}
            title={"title"}
            description={"description"}
            coordinate={this.state.coordinations || { latitude: 0, longitude: 0 }}
          />
        </MapView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  fillScreen: {
    flex: 1
  }
});