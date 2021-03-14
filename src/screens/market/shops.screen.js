import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, TouchableHighlight, TextInput, Alert, Button, Pressable } from "react-native";
import { f, auth, database, storage } from "../../utilies/firebase.util";
import { Feather } from '@expo/vector-icons';
import { FlatListSlider } from 'react-native-flatlist-slider';
import { AntDesign, FontAwesome, EvilIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar, Avatar, Badge, Icon, withBadge } from 'react-native-elements';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();


export default class shops extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true,
      idididuser: f.auth().currentUser.uid,
      loggedin: false,
      comments_list: [],
      ok: '',
      visible: false,
      show: false,
      vvv: "",




    }
  }
  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  static navigationOptions = ({ navigation }) => {
    return {

      headerLeft: (
        <TouchableHighlight onPress={navigation.getParam('close')}>
          <AntDesign name="close" size={25} color="#73788B" />

        </TouchableHighlight>
      )
    };
  };

  close = () => {
    this.props.navigation.navigate('shops');
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ close: this.close });

    const { isUser, userId } = this.props;
    if (isUser == true) {
      this.loadFeed(userId);
    } else {
      this.loadFeed('')
    }


  };

  goToComment = (id) => {

    this.props.navigation.navigate('Comments', { photoId: id })
  };

  goToDetails = (id) => {


    this.props.navigation.navigate('Details', { photoId: id })
  };


  checkTime = (s) => {
    if (s == 1) {
      return 'ago';
    } else {
      return 's ago';
    }

  };

  timeConverter = (timestamp) => {
    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + ' year ' + this.checkTime(interval);
    }

    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
      return interval + ' month ' + this.checkTime(interval);
    }

    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
      return interval + ' day ' + this.checkTime(interval);
    }

    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
      return interval + ' hour ' + this.checkTime(interval);
    }

    interval = Math.floor(seconds / 60);

    if (interval > 1) {
      return interval + ' minute ' + this.checkTime(interval);
    }

    return Math.floor(seconds) + ' second ' + this.checkTime(seconds);


  };

  addToFlatlist = (photo_feed, data, photo) => {
    var that = this;
    var photoObjt = data[photo];
    database.ref('users').child(photoObjt.author).once('value').then(function (snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
      photo_feed.push({

        id: photo,
        url: photoObjt.url,
        img: photoObjt.img,
        prix: photoObjt.prix,
        tel: data.tel,
        caption: photoObjt.caption,
        posted: that.timeConverter(photoObjt.posted),
        authorUsername: data.username,
        authorname: data.name,
        switchValue: photoObjt.switchValue,
        authorAvatar: data.avatar,
        authorId: photoObjt.author,

      });
      that.setState({
        refresh: false,
        loading: false


      });

    }).catch(error => console.log(error));


  };

  loadFeed = (userId = '') => {
    this.setState({
      refresh: true,
      photo_feed: []
    });
    var that = this;
    var loadRef = database.ref('shopsphotos');
    if (userId != '') {
      loadRef = database.ref('users').child(userId).child('photos');
    }
    loadRef.orderByChild('posted').once('value').then(function (snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) data = snapshot.val();
      var photo_feed = that.state.photo_feed;
      for (var photo in data) {
        that.addToFlatlist(photo_feed, data, photo);
      }
    }).catch(error => console.log(error));


  };

  loadNew = () => {
    this.loadFeed();
  };

  del = (id) => {
    var query = database.ref('shopsphotos').child(id)
    query.remove()
    alert(id)

    const { isUser, userId } = this.props;
    if (isUser == true) {
      this.loadFeed(userId);
    } else {
      this.loadFeed('')
    }


  };


  gotoEdit = (id) => {
    //function to make two option alert
    // alert(` ${id} `);
    this.props.navigation.navigate('UpdatePost', { photoId: id })
  }


  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  };


  uniqueId = () => {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
  };

  handleOpen = () => {
    this.setState({ show: true })
  }

  handleClose = (id) => {
    this.setState({ show: false })
    this.props.navigation.navigate('UpdatePost', { photoId: id })

  }





  countComment = () => {

    database.ref('comments').child("aedf500f-1396-c38c-be37-d8e2-17a7-5a11-")
      .once("value").then(function (snapshot) {
        var vvv = snapshot.numChildren()
        alert(vvv)

      })
  };



  Read = (id) => {

    database.ref('comments').child(id)
      .once("value").then(function (snapshot) {
        x = snapshot.numChildren()

      });



  }



  OptionAlertHandler = (id) => {
    //function to make two option alert
    Alert.alert(
      //title
      'Choose option',
      //body
      '',
      [
        { text: 'delete', onPress: () => this.del(id) },
        { text: 'update', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }




  render() {

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>I-Cattle Market</Text>

        </View>
        <View style={{
          flexDirection: "row",
          borderRadius: 15,
          padding: 8,
          margin: 10,
          marginVertical: 8
        }}>



          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? '#A9A9A9' : '#008000',
              },
              styles.button,
            ]}
            onPress={() =>
              this.props.navigation.navigate('addshop')}>
            <Text style={styles.buttonText}>SellCattle</Text>
          </Pressable>
        </View>
        {this.state.loading == true ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading ..</Text>
          </View>

        ) : (

            <FlatList
              refreshing={this.state.refresh}
              onRefresh={this.loadNew}
              data={this.state.photo_feed}
              keyExtractor={(item, index) => index.toString()}
              style={styles.la}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.listItem}>

                  <View style={{ flex: 1, width: '100%' }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                      <View style={{ flexDirection: "row" }}>
                        <View>
                          <Image
                            source={
                              item.authorAvatar
                                ? { uri: item.authorAvatar }
                                : require("../../../assets/tempAvatar.jpg")
                            }
                            style={styles.avatar}
                          />
                        </View>
                        <View style={{ flexDirection: "column" }}>

                          <TouchableOpacity   >
                            <Text style={styles.name}>{item.authorname} {item.authorUsername} </Text>
                          </TouchableOpacity>

                          <Text style={styles.timestamp}>{item.posted}</Text>
                          <Text style={styles.timestamp}>{this.state.vvv}</Text>


                        </View>


                      </View>
                      <View  >

                        {this.state.idididuser == item.authorId &&

                          <TouchableOpacity onPress={() => this.RBSheet.open()} >
                            <Feather name="more-vertical" size={20} color="#000000" />
                          </TouchableOpacity>
                        }
                        {this.state.idididuser == item.authorId &&

                          <RBSheet
                            ref={ref => {
                              this.RBSheet = ref;
                            }}
                            height={300}
                            openDuration={250}
                            customStyles={{
                              container:
                              {

                                justifyContent: "center",
                                alignItems: "center",
                                borderTopLeftRadius: 15, borderTopRightRadius: 15

                              }
                            }}
                          >

                            <View style={styles.panel}>
                              <View style={{ alignItems: 'center' }}>
                                <Text style={styles.panelTitle}>Choose Option</Text>
                                <Text style={styles.panelSubtitle}></Text>

                              </View>
                              <TouchableOpacity style={styles.panelButton}>
                                <Text style={styles.panelButtonTitle} onPress={() => this.gotoEdit(item.id)} >UpdatePost</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => this.del(item.id)} style={styles.panelButton1} >
                                <Text style={styles.panelButtonTitle}>DeletePost</Text>
                              </TouchableOpacity>

                            </View>

                          </RBSheet>
                        }
                      </View>

                    </View>

                    <Text style={styles.post1}>{item.prix} DT</Text>
                    <Text style={styles.post}>{item.caption}</Text>

                    <Image source={{ uri: item.url }} style={styles.postImage} resizeMode="cover" />

                    {
                      item.switchValue == false ?  // if has image
                        <View style={{ height: 30, backgroundColor: "red", width: 100, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                          <Text style={{ color: "#FFFFFF" }}>Not available</Text>
                        </View>
                        :
                        <View style={{ height: 30, backgroundColor: "#00ff00", width: 100, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>

                          <Text style={{ color: "#fff" }}>Available </Text>
                        </View>
                    }









                    <View style={{ height: 1, marginTop: 10, width: undefined, backgroundColor: '#ABB2B9', marginLeft: 20, marginRight: 20 }} />



                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", marginRight: 40, marginLeft: 40 }}>




                      <TouchableOpacity onPress={() => this.goToComment(item.id)}  >

                        <FontAwesome name="comment-o" size={20} color="#2E4053" />


                      </TouchableOpacity>



                    </View>



                  </View>
                </View>

              )}

            />



          )
        }
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
  }, button: {
    borderRadius: 8,
    padding: 6,
    height: 40,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, marginRight: 10
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  la: {
    marginHorizontal: 16
  },
  listItem: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65"
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899"
  },
  postImage: {
    width: undefined,
    height: 170,
    borderRadius: 20,
    marginVertical: 16
  },
  post1: {
    fontSize: 20,
    color: "#FF0000",
    marginTop: 20

  },
  post2: {
    fontSize: 14,
    color: "#008000",
    marginTop: 20,


  },
  post3: {
    fontSize: 14,
    color: "#008000",
    marginTop: 20,
    //   textDecorationLine: 'underline',


  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#008000',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButton1: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#BB0B0B',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,

  },
});

