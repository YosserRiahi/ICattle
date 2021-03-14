import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation";
import { GiftedChat } from "react-native-gifted-chat";
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { AntDesign } from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
var name, uid;

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loaded: false

    };
    this.user = f.auth().currentUser;
    console.log("User:" + this.user.uid);

    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    console.log("User:" + uid);

    this.chatRef = this.getRef().child("chat/" + this.generateChatId());
    this.chatRefData = this.chatRef.orderByChild("order");
    this.onSend = this.onSend.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('logout')}>
          <AntDesign name="close" size={25} color="#73788B" />

        </TouchableOpacity>
      )
    };
  };

  _logout = () => {
    this.props.navigation.navigate('Vets');
  }






  //generate ChatId works cause when you are the user sending chat you take user.uid and your friend takes uid
  // when your friend is using the app to send message s/he takes user.uid and you take the uid cause you are the friend 

  generateChatId() {
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }

  getRef() {
    return database.ref();
  }

  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        items.push({
          _id: child.val().createdAt,
          text: child.val().text,
          createdAt: new Date(child.val().createdAt),
          user: {
            _id: child.val().uid,
            name: this.state.username,
            avatar: this.state.avatar
          }
        });
      });

      this.setState({
        loading: false,
        messages: items
      });
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({ logout: this._logout });
    this.listenForItems(this.chatRefData);

    this.checkParams();
    var that = this;
    f.auth().onAuthStateChanged(function (user) {

      if (user) {
        that.fetchUserInfo(user.uid);

        // userId:user.uid;
      }

    })

  }

  fetchUserInfo = (userId) => {
    var that = this;
    database.ref('users').child(userId).once('value').then(function (snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
      that.setState({
        username: data.username,
        name: data.name,
        avatar: data.avatar,
        loaded: true,
        userId: userId


      })
    });

  };

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params) {
      if (params.userId) {
        this.setState({
          userId: params.userId
        });
        this.fetchUserInfo(params.userId);
      }
    }


  };


  componentWillUnmount() {
    this.chatRefData.off();
  }

  onSend(messages = []) {
    // this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    username = params.username;
    image = params.image;



    messages.forEach(message => {
      var now = new Date().getTime();
      this.chatRef.push({
        _id: now,
        text: message.text,
        createdAt: now,
        uid: this.user.uid,
        order: -1 * now,
        user: {
          _id: this.user.uid,

        },

      });
    });
    var name1 = this.state.name;
    var username1 = this.state.username;
    var image1 = this.state.avatar;

    var uObj = {
      uid: uid,
      name: name,
      username: username,
      image: image

    };
    var uObj1 = {
      name: name1,
      uid: this.user.uid,
      username: username1,
      image: image1
    };


    database.ref('users').child(this.user.uid + "/mychats/" + uid).set(uObj);
    database.ref('users').child(`${uid}` + "/mychats/" + this.user.uid).set(uObj1);

    //database.ref('doctors').child(this.user.uid+"/mychats/"+uid).set(uObj);




  }
  render() {

    const { navigation } = this.props;
    const user_name = navigation.getParam('name');
    const image = navigation.getParam('image');
    const uid = navigation.getParam('uid');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat with {user_name}</Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('Vets')}>
            <AntDesign name="close" size={25} color="#73788B" />

          </TouchableOpacity>
        </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend.bind(this)}
          user={{
            _id: this.user.uid,
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
