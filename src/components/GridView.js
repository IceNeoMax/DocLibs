import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';
import Share, {ShareSheet, Button} from 'react-native-share';
const Popover = require('react-native-popover');
import {
  shareOnTwitter
} from 'react-native-social-share';

class GridView extends Component {

  componentWillMount() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      isVisible: false,
      buttonRect: {},
      dataSource: ds.cloneWithRows([
        14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
      ])
    };
    this.renderRow = this.renderRow.bind(this);
    this.showPopover = this.showPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closePopover() {
    this.setState({ isVisible: false });
  }
  tweet() {
      shareOnTwitter({
          'text':'Global democratized marketplace for art',
          'link':'https://artboost.com/',
          'imagelink':'https://artboost.com/apple-touch-icon-144x144.png',
          //or use image
          'image': 'artboost-icon',
        },
        (results) => {
          console.log(results);
        }
      );
    }
  showPopover() {
    //console.log(this);
    //   this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: { x: 200, y: 100, width: 200, height: 200 }
      });
    // });
  }
  showPopover() {
   this.refs.button.measure((ox, oy, width, height, px, py) => {
     this.setState({
       isVisible: true,
       buttonRect: {x: px, y: py, width: width, height: height}
     });
   });
 }
  renderRow(rowData) {
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_2009_63_90_3x.jpg';
    if (rowData <= 9) {
      baseUrl = `http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_200${rowData}_63_90_3x.jpg`;
      rowData = '0' + rowData;
    } else if (rowData > 9) {
      baseUrl = `http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_20${rowData}_63_90_3x.jpg`;
    }
    return (
          <View style={styles.row}>
            <TouchableHighlight ref='button' onPress={this.showPopover}>
              <Image
                ref='thumb'
                style={styles.thumb}
                source={{ uri: baseUrl }}
              >
              <Text style={styles.text}>
                20{rowData}
              </Text>
              </Image>
              </TouchableHighlight>
          </View>
        );
  }

  render() {
    const displayArea = { x: 50, y: 50, width: 300, height: 300 };
    let shareOptions = {
      title: "React Native",
      message: "Hola mundo",
      url: "http://facebook.github.io/react-native/",
      subject: "Share Link", //  for email
       "social": "email"
    };
    return (

      <View style={{ flex: 1 }}>
      <TouchableHighlight ref='button' style={styles.button} onPress={this.showPopover}>
      <Text style={styles.buttonText}>Press me</Text>
    </TouchableHighlight>
          <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />

          <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            displayArea={displayArea}
            onClose={this.closePopover}
          >
            <Text>Open</Text>
            <Text
             onPress={() => {
              //  this.setModalVisible(true);
                this.closePopover();
                this.refs.modal4.open();
                this.setState({ isOpen: true });
              }}
            >Share</Text>
          </Popover>

          <Modal style={[styles.modal, styles.modal4]} position={'bottom'} ref={'modal4'}>
          <Text>Share 'XXX' via</Text>
          <View style={styles.sharingPic}>
            <TouchableOpacity onPress={()=>{
                Share.open(shareOptions);
              }}>
              <View style={{ paddingTop: 7 }}>
                <Icon1 name="md-mail" size={45} color="#696969" />
                <Text style={{ marginLeft: 5 }}>Mail</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity  onPress={this.tweet}>
              <View style={{ paddingLeft: -20 }}>
              <Icon name="twitter-box" size={50} color="#4099FF" />
                <Text style={{ marginLeft: 5 }}>Twitter</Text>
              </View>
            </TouchableOpacity>
          </View>

        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pdf: {
        flex:1
    },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f'
  },
    list: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    row: {
      justifyContent: 'center',
      padding: 5,
      margin: 10,
      marginBottom: -5,
      width: 100,
      height: 100,
      alignItems: 'center',
      borderColor: '#CCC'
    },
    thumb: {
      width: 64,
      height: 64,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    modal4: {
      padding: 15,
      height: 140
    },
    sharingPic: {
      paddingLeft: 50,
      paddingRight: 50,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    text: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: 'white',
      padding: 5,
      position: 'absolute',
      fontSize: 13,
      bottom: 0,
      width: 64
    },
    sharingMessContainer: {
      backgroundColor: 'rgba(0,0,0,0.2)',
       alignSelf: 'stretch',
       flex: 1
    },
    sharingMess: {
      position: 'absolute',
      flexDirection: 'row',
      flex: 1,
      alignSelf: 'stretch',
      height: 50,
      bottom: 0,
      backgroundColor: 'white'
    }
});

export default GridView;
