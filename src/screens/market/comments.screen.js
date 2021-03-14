import React from "react";
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, TouchableHighlight, TouchableOpacity, Image, FlatList } from "react-native";
import { f, auth, database, storage } from "../../utilies/firebase.util"
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
export default class CommentsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      comments_list: [],
      refresh: false,
    }
  }



  addCommentToList = (comments_list, data, comment) => {
    var that = this;
    var commentObj = data[comment];
    database.ref('users').child(commentObj.author).once('value').then(function (snapshot) {

      const exists = ((snapshot).val() != null);
      if (exists) data = snapshot.val();
      comments_list.push({
        id: comment,
        comment: commentObj.comment,
        posted: that.timeConverter(commentObj.posted),
        author: data.username,
        authorId: commentObj.author,
        authorAvatar: data.avatar,
      });

      that.setState({
        refresh: false,
        loading: false
      });


    }).catch(error => console.log(error));

  };

  fetchComments = (photoId) => {

    var that = this;
    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');
    photoId = user_name;
    database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function (snapshot) {
      const exists = (snapshot.val() != null);
      if (exists) {
        data = snapshot.val();
        var comments_list = that.state.comments_list;
        for (var comment in data) {
          that.addCommentToList(comments_list, data, comment);
        }

      } else {
        that.setState({
          comments_list: []
        });
      }

    }).catch(error => console.log(error));


  };

  loadNew = () => {
    this.fetchComments();
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  };
  uniqueId = () => {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
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

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,


    };
  };

  componentDidMount = () => {

    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');
    // const user_name = navigation.getParam('value','');
    var params = user_name;
    if (params) {
      this.fetchComments(params);
    }



  };
  postComment = () => {
    var comment = this.state.comment;
    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');
    if (comment != '') {

      var imageId = this.state.user_name;
      var userId = f.auth().currentUser.uid;
      var commentId = this.uniqueId();
      var dateTime = Date.now();
      var timestamp = Math.floor(dateTime / 1000);

      this.setState({
        comment: ''


      });

      var commentObj = {
        posted: timestamp,
        author: userId,
        comment: comment

      };
      //database.ref('/comments/'+commentId).set(commentObj);
      database.ref('/comments/' + user_name + '/' + commentId).set(commentObj);

      this.reloadCommentList();
    } else {

      alert('please enter a comment 9bal il posting')
    }


  };

  reloadCommentList = () => {
    const { navigation } = this.props;

    const user_name = navigation.getParam('photoId', '');
    this.setState({
      comments_list: []
    });
    this.fetchComments(user_name);

  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comments </Text>
          <TouchableOpacity style={styles.headerTitle} onPress={() => this.props.navigation.navigate('shops')}>
            <AntDesign name="close" size={25} color="#73788B" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10, }}>

          <TextInput
            placeholder={' Enter comment'}
            onChangeText={(text) => this.setState({ comment: text })}
            style={{ marginVertical: 10, height: 30, padding: 5, borderColor: 'grey', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#EFEFEF', width: '85%' }}
          />
          <TouchableOpacity onPress={() => this.postComment()}
            style={{ marginVertical: 10, height: 30, padding: 5, borderColor: 'grey', backgroundColor: '#EFEFEF', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}
          >
            <Feather name="send" size={20} color="#73788B" />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.root}
          data={this.state.comments_list}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={(item) => {
            const Notification = item.item;
            return (
              <View style={styles.container}>

                <View style={styles.content}>
                  <View style={styles.contentHeader}>
                    <Text style={styles.name}>{Notification.author}</Text>
                    <Text style={styles.time}>  {Notification.posted}                      </Text>

                  </View>
                  <Text rkType='primary3 mediumLine' style={{ marginLeft: 10 }}>{Notification.comment}</Text>

                </View>

              </View>
            );
          }}

        />


      </View>



    );
  }
}

const styles = StyleSheet.create({
  root: {

    backgroundColor: "#ffffff",
    marginTop: 10,
  },
  container: {

    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {

    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20
  },
  time: {
    fontSize: 11,
    color: "#808080",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
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
