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
  WebView,
  Dimensions
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
const { width, height } = Dimensions.get("window");
const basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/';
let downloading = null;

class GridViewWithSection extends Component {

  componentWillMount() {
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
    this.state = {
      dataPdf:{},
      localData:[],
      needDelete:null,
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
    AsyncStorage.removeItem('pdfPathSection');
    this.checkStorage();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  checkStorage(){
    AsyncStorage.getItem('pdfPathSection')
    .then(res=>{
      //  console.log(res);
      if (res == null) {
        let temp= [
          {year:2016, pdf: 'Q4_ENG_2016.pdf', stored:'', width:0,minus:false},
          {year:2016, pdf: 'Q3_ENG_2016.pdf', stored:'', width:0,minus:false},
          {year:2016, pdf: 'Q2_ENG_2016.pdf', stored:'', width:0,minus:false},
          {year:2016, pdf: 'Q1_ENG_2016.pdf', stored:'', width:0,minus:false},
          {year:2015, pdf: 'Q4_ENG_2015.pdf', stored:'', width:0,minus:false},
          {year:2015, pdf: 'Q3_ENG_2015.pdf', stored:'', width:0,minus:false},
          {year:2015, pdf: 'Q2_ENG_2015.pdf', stored:'', width:0,minus:false},
          {year:2015, pdf: 'Q1_ENG_2015.pdf', stored:'', width:0,minus:false},
          {year:2014, pdf: 'Q4_ENG_2014.pdf', stored:'', width:0,minus:false},
          {year:2014, pdf: 'Q3_ENG_2014.pdf', stored:'', width:0,minus:false},
          {year:2014, pdf: 'Q2_ENG_2014.pdf', stored:'', width:0,minus:false},
          {year:2014, pdf: 'Q1_ENG_2014.pdf', stored:'', width:0,minus:false},
          {year:2013, pdf: 'Q4_ENG_2013.pdf', stored:'', width:0,minus:false},
          {year:2013, pdf: 'Q3_ENG_2013.pdf', stored:'', width:0,minus:false},
          {year:2013, pdf: 'Q2_ENG_2013.pdf', stored:'', width:0,minus:false},
          {year:2013, pdf: 'Q1_ENG_2013.pdf', stored:'', width:0,minus:false},
          {year:2012, pdf: 'Q4_ENG_2012.pdf', stored:'', width:0,minus:false},
          {year:2012, pdf: 'Q3_ENG_2012.pdf', stored:'', width:0,minus:false},
          {year:2012, pdf: 'Q2_ENG_2012.pdf', stored:'', width:0,minus:false},
          {year:2012, pdf: 'Q1_ENG_2012.pdf', stored:'', width:0,minus:false},
          {year:2011, pdf: 'Q4_ENG_2011.pdf', stored:'', width:0,minus:false},
          {year:2011, pdf: 'Q3_ENG_2011.pdf', stored:'', width:0,minus:false},
          {year:2011, pdf: 'Q2_ENG_2011.pdf', stored:'', width:0,minus:false},
          {year:2011, pdf: 'Q1_ENG_2011.pdf', stored:'', width:0,minus:false},
          {year:2010, pdf: 'Q4_ENG_2010.pdf', stored:'', width:0,minus:false},
          {year:2010, pdf: 'Q3_ENG_2010.pdf', stored:'', width:0,minus:false},
          {year:2010, pdf: 'Q2_ENG_2010.pdf', stored:'', width:0,minus:false},
          {year:2010, pdf: 'Q1_ENG_2010.pdf', stored:'', width:0,minus:false},
          {year:2009, pdf: 'Q4_ENG_2009.pdf', stored:'', width:0,minus:false},
          {year:2009, pdf: 'Q3_ENG_2009.pdf', stored:'', width:0,minus:false},
          {year:2009, pdf: 'Q2_ENG_2009.pdf', stored:'', width:0,minus:false},
          {year:2009, pdf: 'Q1_ENG_2009.pdf', stored:'', width:0,minus:false},
        ];
        AsyncStorage.setItem('pdfPathSection',JSON.stringify(temp));
        this.setState({
            // localData:temp,
            dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(temp)),
          });
      }
      else {
        this.setState({
            localData:JSON.parse(res),
            dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(JSON.parse(res))),
          });
        // console.log("temp");
      }
    });
  }
  convertDataArrayToMap =(data)=>{
  let dataCategoryMap = {}; // Create the blank map
  data.forEach((rowData)=>{
    if (!dataCategoryMap[rowData.year]) dataCategoryMap[rowData.year] = [];
    dataCategoryMap[rowData.year].push(rowData);
  });
  // console.log(dataCategoryMap);
  return dataCategoryMap;
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
          if (data.year==this.state.dataPdf.year) this.setState({width});
          this.setState({localData:temp});
          let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
          this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
      })
      .then((res) => {
        // console.log(res);
        this.setState({dataPdf: {year:data.year, pdf:data.pdf ,stored:res.path(),width:1,minus:false}  });
        AsyncStorage.getItem('pdfPathSection')
          .then(res => {
            let temp = [];
            JSON.parse(res).map(storeval=>{
              // console.log(storeval);
              if (storeval.year==data.year)
              {storeval.stored = this.state.dataPdf.stored;storeval.width=1;}
              temp.push(storeval);
            })
            // console.log(this.state.dataPdf.stored);
            this.setState({localData:temp});
            let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
            this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
            AsyncStorage.setItem('pdfPathSection',JSON.stringify(temp));
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
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
    this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
  }
  deleteFile = () =>{
    let temp = [];
    this.state.localData.map(localres=>{
      this.state.needDelete.map(del=>{
        if (localres.year==del.year) {localres.stored = '';localres.minus = false;localres.width = 0;}
      });
      temp.push(localres);
    })
    this.setState({localData:temp, needDelete:null});
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
    this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
    AsyncStorage.setItem('pdfPathSection',JSON.stringify(temp));
  }
  cancelAllDelete= ()=>{
    let temp = [];
    this.state.localData.map(localres=>{
       localres.minus = false;
      temp.push(localres);
    });
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
    this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp)), needDelete:null});
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
  renderIcon(rowData){
    // console.log(rowData);
    if (rowData.stored!=''&& rowData.minus== false&& rowData.width== 1)
      return (
        <Icon1 onPress={()=>{
          let temp= [];
          let temp2 =this.state.needDelete;
          let flag = false;
          if (temp2 === null) {
            temp2 = [];
            temp2.push(rowData);
            // console.log(temp2);
          }
          else {
            // console.log(temp2);
            this.state.needDelete.map(localres=>{
              if (localres.year!=rowData.year) flag=true;
            })
            if(flag) temp2.push(rowData);
          }

          // console.log(temp2,rowData.year);
          this.state.localData.map(localres=>{
            if (localres.year==rowData.year) localres.minus = true;
            temp.push(localres);
          });
          this.setState({localData:temp, needDelete:temp2});
          let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
          this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
        }}
        name="md-checkmark" size={20} color="#228b22" style={styles.imageIconCheck}/>
      );
      else if (rowData.stored!=''&& rowData.minus== true)
       return(
        <Icon onPress={()=>{
            let temp= [];
            this.state.localData.map(localres=>{
              if (localres.year==rowData.year) localres.minus = false;
              temp.push(localres);
            });
            if(this.state.needDelete.length == 1) this.setState({needDelete:null});
            else{
              let temp2=[];
              this.state.needDelete.map(localres=>{
                if (localres.year!=rowData.year) temp2.push(localres);
              });
              this.setState({needDelete:temp2});
            }
            this.setState({localData:temp});
            let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
            this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
        }}
        name="minus" size={20} color="#fff" style={styles.imageIconMinus}/>
      )
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
          {rowData.pdf.slice(0,11)}
        </Text>
        </Image>
      </TouchableHighlight>
    )
    return <Progress.Bar progress={rowData.width} width={50} />
  }
  renderRow = (rowData) => {
    // console.log(rowData.pdf.slice(0,11));
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+rowData.pdf.slice(0,11)+'_63_90_3x.jpg';
    // console.log(rowData);
    return (
      <View style={styles.row}>
        {this.renderImage(rowData.width,rowData,baseUrl)}
        {this.renderIcon(rowData)}
      </View>
    );
  }
  renderSectionHeader=(sectionData, year)=>{
  return (
    <Text style={{fontWeight: "700",fontSize:18, margin:5}}>{year}</Text>
  )
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
      <View>
          <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
          />
          {(this.state.needDelete!=null)?<View style={{ flexDirection: 'column',}}>
            <TouchableOpacity onPress={this.deleteFile}>
              <Text style={{textAlign: 'center', fontSize:20, color:'blue', paddingVertical:15}}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.cancelAllDelete}>
              <Text style={{textAlign: 'center', fontSize:20, color:'blue', paddingVertical:15}}>Cancel</Text>
            </TouchableOpacity>
          </View>:null}
          <Modal1 style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
            <Text style={{fontSize:22,margin:5, marginBottom:10}}
            onPress={() => {
              this.refs.modal3.close();
               this.setModalVisible(!this.state.modalVisible);
              this.setState({ isOpen: true, width:0});
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
               let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
               this.setModalVisible(!this.state.modalVisible);
               this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataArrayToMap(this.state.localData))});
             }}>
              <Icon1 name="ios-arrow-back" size={40} color="#696969"/>
             </TouchableHighlight>
             <Icon1 name="ios-share-outline" size={40} color="#696969" />
           </View>

            {this.renderPdf(this.state.dataPdf)}
          </Modal>

          <Modal1 style={[styles.modal, styles.modal4]} position={'bottom'} ref={'modal4'}>
          <Text>Share {this.state.dataPdf.pdf} via</Text>
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
    list:{
      flexDirection: 'column',
      flexWrap: 'wrap'
    },
    row: {
      padding: 5,
      marginBottom: 0,
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
      width: 75,
      height: 70,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    alignSelf: 'flex-end',
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
      top:0,
      right:5
    },
    imageIconMinus:{
      alignSelf:'center',
      width:20,
      height:20,
      borderRadius:20 ,
      borderWidth:1,
      borderColor:'#ff0000',
      backgroundColor:'#dc143c',
      position:'absolute',
      top:0,
      right:5
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
      padding: 3,
      position: 'absolute',
      fontSize: 11,
      bottom: 0,
      width: 90
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
export default GridViewWithSection;
