import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Modal,
  AsyncStorage,
  Platform,
  WebView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Modal1 from 'react-native-modalbox';
import Share, {ShareSheet, Button} from 'react-native-share';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';

import {
  shareOnTwitter
} from 'react-native-social-share';

const basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/';
let downloading = null;
class GridView extends Component {
  componentWillMount() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataPdf:{},
      localData:[
      ],
      isPdfDownload: false,
      width: 0,
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      isVisible: false,
      modalVisible: false,
      startDownload:false,
      dataSource:ds,
    };
    // this.checkStorage();
    // this.setState({
    //     dataSource:this.state.dataSource.cloneWithRows(this.state.localData),
    //   });
    this.renderRow = this.renderRow.bind(this);
    // AsyncStorage.removeItem('pdfPath');
    this.checkStorage();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  checkStorage(){
    AsyncStorage.getItem('pdfPath')
    .then(res=>{
      //  console.log(res);
      if (res == null) {
        let temp= [
          {year:2016, pdf: 'AR_ENG_2016.pdf', stored:'', width:0},
          {year:2015, pdf: 'AR_ENG_2015.pdf', stored:'', width:0},
          {year:2014, pdf: 'AR_ENG_2014.pdf', stored:'', width:0},
          {year:2013, pdf: 'AR_ENG_2013.pdf', stored:'', width:0},
          {year:2012, pdf: 'AR_ENG_2012.pdf', stored:'', width:0},
          {year:2011, pdf: 'AR_ENG_2011.pdf', stored:'', width:0},
          {year:2010, pdf: 'AR_ENG_2010.pdf', stored:'', width:0},
          {year:2009, pdf: 'AR_ENG_2009.pdf', stored:'', width:0},
          {year:2008, pdf: 'AR_ENG_2008.pdf', stored:'', width:0},
          {year:2007, pdf: 'AR_ENG_2007.pdf', stored:'', width:0},
          {year:2006, pdf: 'AR_ENG_2006.pdf', stored:'', width:0},
          {year:2005, pdf: 'AR_ENG_2005.pdf', stored:'', width:0},
          {year:2004, pdf: 'AR_ENG_2004.pdf', stored:'', width:0},
          {year:2003, pdf: 'AR_ENG_2003.pdf', stored:'', width:0},
          {year:2002, pdf: 'AR_ENG_2002.pdf', stored:'', width:0},
          {year:2001, pdf: 'AR_ENG_2001.pdf', stored:'', width:0},
          {year:2000, pdf: 'AR_ENG_2000.pdf', stored:'', width:0},
        ];
        AsyncStorage.setItem('pdfPath',JSON.stringify(temp));
        this.setState({
            // localData:temp,
            dataSource:this.state.dataSource.cloneWithRows(temp),
          });
      }
      else {
        this.setState({
            localData:JSON.parse(res),
            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(res)),
          });
        // console.log("temp");

      }
    });
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
    // downloadPdf= (data) =>{
    //   downloading= RNFetchBlob.config({
    //           // add this option that makes response data to be stored as a file,
    //           // this is much more performant.
    //           fileCache : true,
    //           path : RNFetchBlob.fs.dirs.DocumentDir + '/' +data.pdf
    //         })
    //       .fetch('GET', 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/Q1_ENG_2015.pdf' , {
    //         //some headers ..
    //       });
    //       downloading.then((res) => {
    //         // the temp file path
    //         // this.setState({isPdfDownload: true, pdfFile: res.path() });
    //         console.log('The file saved to ', res.path())
    //       });
    // }
  downloadPdf = (data) => {
    downloading =  RNFetchBlob.config({
        fileCache : true,
        path : RNFetchBlob.fs.dirs.DocumentDir + '/' +data.pdf
      }).fetch('GET', basePdf+data.pdf , {
          //some headers ..
          //basePdf+data.pdf
          // 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/Q4_ENG_2015.pdf'
        });
      downloading.progress((received, total) => {
          let temp = [];
          let width= (received/total);
          this.state.localData.map(localres=>{
            if (localres.year==data.year) localres.width = width;
            temp.push(localres);
          });
          // console.log(width);
          this.setState({localData:temp, width:width});
          let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
          this.setState({dataSource: ds.cloneWithRows(temp)});
      })
      .then((res) => {
        // console.log(res);
        this.setState({dataPdf: {year:data.year, pdf:data.pdf ,stored:res.path(),width:1}  });
        AsyncStorage.getItem('pdfPath')
          .then(res => {
            let temp = [];
            JSON.parse(res).map(storeval=>{
              // console.log(storeval);
              if (storeval.year==data.year) storeval.stored = this.state.dataPdf.stored;
              temp.push(storeval);
            })
            // console.log(this.state.dataPdf.stored);
            this.setState({localData:temp});
            let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({dataSource: ds.cloneWithRows(temp)});
            AsyncStorage.setItem('pdfPath',JSON.stringify(temp));
        });
        // console.log('The file saved to ', res.path());
      });

    }
    cancelDownload = ()=>{
      downloading.cancel(
        // (err, taskId)=>console.log(err,taskId)
      );
      this.setModalVisible(!this.state.modalVisible);
      let temp = [];
      this.state.localData.map(localres=>{
        if (localres.year==this.state.dataPdf.year) localres.width = 0;
        temp.push(localres);
      });
      this.setState({localData:temp, width:0});
      let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      this.setState({dataSource: ds.cloneWithRows(temp)});
    }

    renderPdf() {
      if (this.state.dataPdf.stored=='') {
        return (
          <View style={styles.groundPdfDownload}>
            <Progress.Bar style={{marginTop: 200}} progress={this.state.width} width={200} />
            <View style={{flexDirection: 'column'}}>
              <TouchableOpacity onPress={()=>this.setModalVisible(!this.state.modalVisible)}>
                <Text style={{padding:10, color: 'blue',fontSize:18}}> Move to Background</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.cancelDownload}>
                <Text style={{padding:10, color: 'blue',fontSize:18,  textAlign: 'center',}}> Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      if(Platform.OS === 'android')
        return (
            <PDFView ref={(pdf)=>{this.pdfView = pdf;}}
                     key="sop"
                     path={this.state.dataPdf.stored}
                     onLoadComplete={(pageCount)=>{
                              console.log(`total page count: ${pageCount}`);
                           }}
                     style={styles.pdf}/>
        )
        return(
          <WebView source={{uri: this.state.dataPdf.stored}}/>
        )
    }
    // {(rowData.stored!='')?<Icon1 name="md-checkmark" size={20} color="#228b22"
    //  style={{
    //    alignSelf:'center', width:20, height:20, paddingLeft:2,
    //    borderRadius:20 ,borderWidth:1, borderColor:'#228b22', backgroundColor:'#7fff00',
    //    position:'absolute', top:3, right:3}}/>:null}
  //   {(rowData.width === 0||rowData.width === 1)
  //    ?
  //  // (rowData.stored!='')
  //  <TouchableHighlight onPress={()=>{
  //  this.setState({dataPdf:rowData});
  //  this.refs.modal3.open();
  //  }}>
  //    <Image
  //      ref='thumb'
  //      style={styles.thumb}
  //      source={{ uri: baseUrl }}
  //    >
  //    {this.renderIcon(rowData.stored)}
  //    <Text style={styles.text}>
  //      {rowData.year}
  //    </Text>
  //    </Image>
  //  </TouchableHighlight>
   //
  //  :<Progress.Bar progress={rowData.width} width={50} />
  //  }
    renderIcon(stored,deleteIcon){
      if (stored!=''&&deleteIcon==true)
      return <Icon1 name="md-checkmark" size={20} color="#228b22" style={styles.imageIconCheck}/>
      return <Icon name="minus" size={20} color="#fff" style={styles.imageIconMinus}/>
    }
    renderImage(width,rowData,baseUrl){
      // console.log(rowData);
      if(width === 0||width === 1)
      return(
        <TouchableHighlight onPress={()=>{
        this.setState({dataPdf:rowData});
        this.refs.modal3.open();
        }}>
          <Image
            ref='thumb'
            style={styles.thumb}
            source={{ uri: baseUrl }}
          >
          <Text style={styles.text}>
            {rowData.year}
          </Text>
          </Image>
        </TouchableHighlight>
      )
      return <Progress.Bar progress={rowData.width} width={50} />
    }
  renderRow = (rowData) => {
    // console.log(rowData);
    // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_2009_63_90_3x.jpg';
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_'+rowData.year+'_63_90_3x.jpg';
    // let basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/'+rowData.pdf;
    // console.log(rowData);
    return (
      <View style={styles.row}>
        {this.renderImage(rowData.width,rowData,baseUrl)}
        {this.renderIcon(rowData.stored)}
      </View>
    );
  }

  render() {
    let shareOptions = {
      title: "React Native",
      message: "Hola mundo",
      url: "http://facebook.github.io/react-native/",
      subject: "Share Link", //  for email
       "social": "email"
    };
    return (
      <View style={{ flex: 1 }}>
          <ListView
            initialListSize={20}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
          <Modal1 style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
            <Text style={{fontSize:22,margin:5, marginBottom:10}}
            onPress={() => {
              this.refs.modal3.close();
               this.setModalVisible(!this.state.modalVisible);
              this.setState({ isOpen: true});
              //  console.log(this.state.dataPdf);
              if(this.state.dataPdf.stored=='')
                this.downloadPdf(this.state.dataPdf);
             }}>Open</Text>
            <Text style={{fontSize:22,margin:5}}
             onPress={() => {
               this.refs.modal3.close();
                this.refs.modal4.open();
                this.setState({ isOpen: true });
              }}
            >Share</Text>
          </Modal1>

          <Modal
            animationType={"slide"}
            transparent={false}
            ref="modal1"
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
           >
           <View style={styles.pdfShare}>
             <TouchableHighlight  onPress={() =>{
               let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
               this.setModalVisible(!this.state.modalVisible);
               this.setState({dataSource: ds.cloneWithRows(this.state.localData)});
             }}>
              <Icon1 name="ios-arrow-back" size={40} color="#696969"/>
             </TouchableHighlight>
             <Icon1 name="ios-share-outline" size={40} color="#696969" />
           </View>

            {this.renderPdf(this.state.dataPdf)}
          </Modal>

          <Modal1 style={[styles.modal, styles.modal4]} position={'bottom'} ref={'modal4'}>
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

        </Modal1>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pdf: {
        flex:1
    },
    groundPdfDownload:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
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
    pdfShare:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    thumb: {
      width: 64,
      height: 64,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    imageIconCheck:{
      alignSelf:'center',
      width:20,
      height:20,
      paddingLeft:2,
      borderRadius:20 ,
      borderWidth:1,
      borderColor:'#228b22',
      backgroundColor:'#7fff00',
      position:'absolute',
      top:8,
      right:20
    },
    imageIconMinus:{
      alignSelf:'center',
      width:20,
      height:20,
      paddingLeft:2,
      borderRadius:20 ,
      borderWidth:1,
      borderColor:'#ff0000',
      backgroundColor:'#dc143c',
      position:'absolute',
      top:8,
      right:20
    },
    modal3: {
      padding: 10,
      justifyContent: 'center',
      height: 100,
      width: 100
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
