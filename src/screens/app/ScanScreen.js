import * as React from 'react';
import { Text, View, StyleSheet, Button ,TextInput,TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {Ionicons,Entypo,MaterialIcons ,AntDesign,FontAwesome} from "@expo/vector-icons";

import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRoute } from '@react-navigation/native';
import {LogBox} from 'react-native';
  LogBox.ignoreAllLogs();

export default class ScanScreen extends React.Component {
  
  static navigationOptions = {
    headerShown: false
};

  constructor(props) {
    super(props);
  
  this.state = {
    hasCameraPermission: null,
    scanned: false,
    queryText: '',   query: ''
   
  }}
 
  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    
    const { navigate } = this.props.navigation;  

    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={
          styles.container }>
                         <View style={styles.header}>
                    <Text style={styles.headerTitle}>Add Cattle </Text>
                    <TouchableOpacity  style={styles.headerTitle} onPress={()=>this.props.navigation.navigate('AddAnimalScreen')}>
                    <AntDesign name="close" size={25} color="#73788B"  />

                    </TouchableOpacity>
                    </View>
  
  

<View style>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={{height:"100%",width:"100%"}}
        />
</View>
        {scanned && (
          <Button
            title={'Tap to Scan Again'}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }
handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.setState({ queryText: data })
    this.props.navigation.navigate('AddAnimalScreen', {  
      value: data
     
  })  

  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
},
header: {
    paddingTop:40,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: {height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
    flexDirection:"row",
    justifyContent:"space-between",
    
},
headerTitle: {
    marginRight:20,
    marginLeft:20,
    fontSize: 15,
    fontWeight: "700"
},
});