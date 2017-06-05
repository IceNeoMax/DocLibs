import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  AsyncStorage,
  Platform,
  WebView,
  Dimensions,
  FlatList,
  NetInfo
} from 'react-native';
import { connect } from 'react-redux';
import { updateRow,updateQueue, shiftQueue,updateQueueIndex, incresDown, decresDown,netChange,resetLength } from '../actions';
import Popover from './common/popover';
import ActionSheet from 'react-native-actionsheet';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
// import Modal1 from 'react-native-modalbox';
import Share from 'react-native-share';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';
// import _ from 'underscore';
import axios from 'axios';
// import ModalDropdown from 'react-native-modal-dropdown';

import MiniRow from './MiniRow';

let { width, height } = Dimensions.get("window");
let halfHeight=height/2-30;
let halfWidth = width/2;
let widthButton= width-10;
const shareOptions = ['Send via Email', 'Tweet this', 'Share via Whatsapp', 'Share on Facebook','Cancel'];
const basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/';
let downloading = [];
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let downloads=[];
// let localQueue=[];
let dataUpdate=[];

class GridView extends Component {
  componentWillMount() {
    this.state = {
      dataPdf:{},
      localData:[],
      needDelete:null,
      isPdfDownload: false,
      width: 0,
      shareOptions : {},
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      isVisible: false,
      modalVisible: false,
      startDownload:false,
      dataSource:ds,
      pdfOn:'',
      showPopover : false,
      buttonRect: {},
      screenSize : Dimensions.get('window')
    };
    this.renderRow = this.renderRow.bind(this);
    // AsyncStorage.removeItem('pdfPath');
    this.checkStorage();
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange);
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
  }
  handleConnectivityChange = (isConnected) => {
    // console.log(isConnected);
    this.props.netChange(isConnected);
    // console.log(isConnected,this.props.isConnected);
    if (isConnected== false) {
      // lost connection
        let temp = this.state.localData;
        temp.map(localres=>{
          downloads.map(download=>{
            if (localres.pdf==download.pdf) localres.width=0;
          })
          this.props.dataUpdateQueue.map(queue=>{
            if (localres.pdf==queue.pdf) {localres.width= 0;}
          })
        });
        // console.log(temp);
        downloads=[];
        downloading=[];
        this.props.updateQueueIndex([],1);
        this.props.updateRow([],0);
        this.props.resetLength(0);
        this.setState({
            localData:temp,
            dataSource:ds.cloneWithRows(temp),
          });
    }
  };
  componentWillReceiveProps(nextProps){
    // console.log(this.props.isConnected);
    let flag =false;
    if(nextProps.dataUpdateQueue.length>0&&nextProps.downloadLength<3&&downloads.length<3){
      this.state.localData.map(localPdf=>{
          if (nextProps.dataUpdateQueue[0].pdf==localPdf.pdf) flag=true;
      })
    }
    if (flag) {
      tempQueue = this.props.dataUpdateQueue[0];
      tempQueue.width=0.01;
      downloads.push(tempQueue);
      // downloads.push(nextProps.dataUpdateQueue[0]);
      this.downloadPdf(nextProps.dataUpdateQueue[0]);
      this.props.shiftQueue(nextProps.dataUpdateQueue);
      this.props.incresDown(nextProps.downloadLength);
      // console.log(this.props.downloadLength);
    }
  }
  // componentWillUpdate(nextProps,nextState){
  //   return this.props.downloadLength!= nextProps.downloadLength
  // }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  closePopover = () => {
      this.setState({showPopover: false});
  }
  sharePopoverListItem = ({item,index}) => {
      return(
          <TouchableOpacity>
              <Text>{item}</Text>
          </TouchableOpacity>
      )
  }
  checkStorage(){
    AsyncStorage.getItem('pdfPath')
    .then(res=>{
      //  console.log(res);
      if (res == null) {

        axios.get('http://113.190.248.146/myirappapi2/api/v1/documentlibrary/dk-nzmb/en-gb/report/id_1')
        .then(val=>{
          let temp = [];
          // console.log(val.data);
          val.data.map(val =>{
            let year = parseInt(val.FileName.slice(7,11));
            temp.push({year, pdf: val.FileName, ETag:val.ETag, stored:'', width:0,minus:false});
          })
          AsyncStorage.setItem('pdfPath',JSON.stringify(temp));
          this.setState({
              localData:temp,
              dataSource:this.state.dataSource.cloneWithRows(temp),
            });
        })
      }
      else {
        axios.get('http://113.190.248.146/myirappapi2/api/v1/documentlibrary/dk-nzmb/en-gb/report/id_1')
        .then(result=>{
          let temp = JSON.parse(res);
          result.data.map(server =>{
            JSON.parse(res).map(local=>{
              if (server.ETag!=local.ETag&&server.FileName==local.pdf){
                RNFetchBlob.fs.unlink(local.pdf).catch(err => console.log(err));
                local.stored='';
                temp[JSON.parse(res).findIndex(findObj => findObj.pdf==data.pdf)]=local;
              }
            })
          });
          // console.log(temp);
          this.setState({
              localData:temp,
              dataSource:this.state.dataSource.cloneWithRows(temp),
            });
        }).catch(()=>{
          let temp = JSON.parse(res);
          this.setState({
              localData:temp,
              dataSource:this.state.dataSource.cloneWithRows(JSON.parse(res)),
            });
        });
      }
    });
  }

  resetListView = (temp) => {
    this.setState({dataSource: ds.cloneWithRows(temp)});
  }
  downloadPdf = (data) => {
    // this.props.updateRow(downloads,0.01);
    downloadFile = RNFetchBlob.config({
        // fileCache : true,
        path : RNFetchBlob.fs.dirs.DocumentDir + '/' +data.pdf,
        // overwrite: false,
      }).fetch('GET', basePdf+data.pdf , {
          //some headers ..
          //basePdf+data.pdf
          // 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/Q4_ENG_2015.pdf'
        });
    downloadFile.pdf=data.pdf;
    downloading.push(downloadFile);
    downloadFile.progress((received, total) => {
        let width= (received/total);
        // console.log(width);
        index = downloads.findIndex(findObj => findObj.pdf==data.pdf);
        if (downloads[index]) downloads[index].width=width;
        if (data.year==this.state.dataPdf.year) this.setState({width});
        this.props.updateRow(downloads,width);
    })
      .then((res) => {
        AsyncStorage.getItem('pdfPath')
          .then(val => {
            index = downloads.findIndex(findObj => findObj.pdf==data.pdf);
            downloads.splice(index,1);
            downloading.splice(index,1);
            let flag= false;
            let tempQueue={};
            if(this.props.dataUpdateQueue.length>0){
              this.state.localData.map(localPdf=>{
                  if (this.props.dataUpdateQueue[0].pdf==localPdf.pdf) flag=true;
              })
            }
            if (flag) {
              tempQueue = this.props.dataUpdateQueue[0];
              tempQueue.width=0.01;
              downloads.push(tempQueue);
              this.downloadPdf(this.props.dataUpdateQueue[0]);
              this.props.shiftQueue(this.props.dataUpdateQueue);
              this.props.incresDown(this.props.downloadLength);
            }
            this.props.decresDown(this.props.downloadLength);
            let temp = [];
            let tempOpen = [];
            JSON.parse(val).map(localres=>{
              if (localres.stored=='') localres.width=0;
              if (tempQueue!={}&&tempQueue.pdf==localres.pdf) {localres.width=0.01;}
              downloads.map(download=>{
                if (localres.pdf==download.pdf) localres.width=download.width;
                else if (localres.stored!='') localres.width=1;
              })
              this.props.dataUpdateQueue.map(queue=>{
                if (localres.pdf==queue.pdf) {localres.width= 0.01;}
                // else localres.width= 0;
              })
              if (localres.pdf==data.pdf)
              {
                tempOpen=localres;
                localres.stored = res.path(); localres.width=1;
              }
              temp.push(localres);
            })
            this.props.updateRow(temp,1);
            if (this.state.pdfOn==data.pdf) {
              setTimeout(()=>this.setState({dataPdf:tempOpen}),500);
            }
            this.setState({localData:temp});
            this.resetListView(temp);
            // this.setState({width:0});
            AsyncStorage.setItem('pdfPath',JSON.stringify(temp));
        });
      })
      .catch((err)=>{
        console.log(err);
      });

    }
  cancelDownload = ()=>{
    let check = false;
    // downloads.map(down=>{
    //   if (down.pdf==this.state.dataPdf.pdf) check = true;
    // });
    for (var i = 0; i < downloads.length; i++) {
      if (downloads[i].pdf==this.state.dataPdf.pdf)
       {check = true; break;}
    }
    if(!check){
      index2 = this.props.dataUpdateQueue.findIndex(findObj => findObj.pdf==this.state.dataPdf.pdf);
      // console.log(index2);
      let queue = this.props.dataUpdateQueue;
      queue.splice(index2,1);
      this.props.updateQueueIndex(queue,1);
      this.setModalVisible(!this.state.modalVisible);
      return;
    }
    else {
      index = downloads.findIndex(findObj => findObj.pdf==this.state.dataPdf.pdf);
      // console.log(downloading[index]["_65"]);
      // console.log(index);
      if(downloads[index]){
        downloading[index].cancel(
          (err, taskId)=>{
            let temp2 = [];
            if (this.props.dataUpdate) {
              this.props.dataUpdate.map(localres=>{
                if (localres.pdf==downloads[index].pdf) {console.log(localres,downloads[index]); localres.width = 0;}
                temp2.push(localres);
              });
            }
            downloads.splice(index,1);
            downloading.splice(index,1);
            let flag =false;
            if(this.props.dataUpdateQueue.length>0){
              this.state.localData.map(localPdf=>{
                  if (this.props.dataUpdateQueue[0].pdf==localPdf.pdf) {flag=true;}
              })
            }
            if (flag) {
              tempQueue = this.props.dataUpdateQueue[0];
              tempQueue.width=0.01;
              downloads.push(tempQueue);
              this.props.incresDown(this.props.downloadLength);
              this.downloadPdf(this.props.dataUpdateQueue[0]);
              this.props.shiftQueue(this.props.dataUpdateQueue);
            }
            this.props.decresDown(this.props.downloadLength);
            this.props.updateRow(temp2,0);
            this.setModalVisible(!this.state.modalVisible);
          }
        );
      }
    }
  }

  deleteFile = () =>{
    let temp = [];
    this.state.needDelete.map(del=>{
      // console.log(del.stored);
      RNFetchBlob.fs.unlink(del.stored)
      .catch(err => console.log(err));
    });
    this.state.localData.map(localres=>{
      this.state.needDelete.map(del=>{
        if (localres.year==del.year) {localres.stored = '';localres.minus = false;localres.width = 0;}
      });
      temp.push(localres);
    })
    this.setState({localData:temp, needDelete:null});
    this.resetListView(temp);
    AsyncStorage.setItem('pdfPath',JSON.stringify(temp));
  }
  cancelAllDelete= ()=>{
    let temp = [];
    this.state.localData.map(localres=>{
       localres.minus = false;
      temp.push(localres);
    });
    this.setState({localData:temp, needDelete:null});
    this.resetListView(temp);
  }
  renderPdf() {
    if (this.state.dataPdf.stored=='') {
      // console.log(this.state.width);
      return (
        <View style={styles.groundPdfDownload}>
          <Progress.Bar style={styles.progressBar} progress={this.state.width} width={halfWidth} />
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity onPress={()=>this.setModalVisible(!this.state.modalVisible)}>
              <Text style={styles.buttonModal}> Move to Background</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.cancelDownload}>
              <Text style={styles.buttonModal}> Cancel</Text>
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
        <WebView scalesPageToFit={true} hasZoom={true} maxZoom={2} source={{uri: this.state.dataPdf.stored}}/>
      )
  }
  renderIcon(rowData){
    // console.log(rowData);
    // console.log('icon rendered!');
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
          this.resetListView(temp);
        }}
        name="md-checkmark" size={20} color="#4CAF50" style={styles.imageIconCheck}/>
      );
      else if (rowData.stored!=''&& rowData.minus== true)
       return(
        <Icon onPress={()=>{
            let temp= this.state.localData;
            this.state.localData.map(localres=>{
              if (localres.year==rowData.year) {localres.minus = false;
              temp[localres]=localres;}
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
            this.resetListView(temp);
        }}
        name="minus" size={20} color="#fff" style={styles.imageIconMinus}/>
      )
  }

  renderRow = (rowData) => {
    // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_2009_63_90_3x.jpg';
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_'+rowData.year+'_63_90_3x.jpg';
    // let basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/'+rowData.pdf;
    return (
      <View style={styles.row}>
        <TouchableOpacity  onPress={()=>{
          // console.log(rowData,this.props.dataUpdate);
          this.setState({dataPdf:rowData,
            width:0,
            pdfOn:rowData.pdf,
            shareOptions:{title: 'Share PDF',
            message: 'Novozymes '+rowData.pdf,
            url: (basePdf+rowData.pdf),
            subject: "Share Link"
          }});
          if (this.props.isConnected==false&&rowData.stored=='') {
            return;
          }
          let Isdownload = false;
          this.props.dataUpdate.map(val=>{
            if (val.pdf==rowData.pdf&&val.width!=0)
            Isdownload = true;
          })
          // console.log(downloading[0]);
          // if(Isdownload==false||rowData.width==1)
          this.setModalVisible(!this.state.modalVisible);
          if(rowData.stored==''&&this.props.downloadLength<3){
             if (!Isdownload){
              //  console.log("download start");
               let tempRow = rowData;
               tempRow.width=0.01;
               downloads.push(tempRow);
               this.props.updateRow(downloads,0.001);
              //  console.log(downloads);
               this.props.incresDown(this.props.downloadLength);
               this.downloadPdf(tempRow);
            }
             this.setModalVisible(!this.state.modalVisible);
           }
          else if(this.props.downloadLength==3&&!Isdownload) {
            if (rowData.stored!='') return;
            if(this.props.dataUpdateQueue.length==0) {this.props.updateQueue(rowData,[],0.01); }
            else if(this.props.dataUpdateQueue.length>0){
              // console.log("leuleu");
              let flag = false;
              this.props.dataUpdateQueue.map(SQueue=>{
                if(rowData.pdf==SQueue.pdf) flag=true;
               });
             if(!flag) this.props.updateQueue(rowData,this.props.dataUpdateQueue);
             let temp=this.props.dataUpdateQueue;
             downloads.map(download=>{
               index = this.props.dataUpdateQueue.findIndex(findObj => findObj.pdf==download.pdf);
              //  console.log(index);
               if(index != -1) temp.splice(index, 1);
             })
             this.props.updateQueueIndex(temp,0.01);
            }
          }
        }}>
          <MiniRow data={rowData} baseUrl={baseUrl}/>
        </TouchableOpacity>
        {this.renderIcon(rowData)}
      </View>
    );
  }

  _actionSheethandlePress = (index) => {
      //['Send via Email', 'Tweet this', 'Share via Whatsapp', 'Share on Facebook','Cancel']

      switch(index){
          case 0 :
          // mail

          //Linking.openURL("mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail));

          setTimeout(() => {
              Share.shareSingle(Object.assign(this.state.shareOptions, {
                "social": "email"
              }));
            },300);
          break;
          case 1 :
          setTimeout(() => {
              Share.shareSingle(Object.assign(this.state.shareOptions, {
                "social": "twitter"
              }));
            },300);
          //tweet
          break;
          case 2 :
          setTimeout(() => {
              Share.shareSingle(Object.assign(this.state.shareOptions, {
                "social": "whatsapp"
              }));
            },300);
          break;
          case 3 :
          setTimeout(() => {
              Share.shareSingle(Object.assign(this.state.shareOptions, {
                "social": "facebook"
              }));
            },300);
          break;
      };
      if(this.state.showPopover){
          this.setState({
              showPopover: false
          })
      }
      this.setModalVisible(!this.state.modalVisible);
      // if(index !== shareOptions.length - 1)
      //         this.props.navigator.pop();
  }
  // backEvent = () => {
  //     this.props.navigator.pop();
  // }
  sharePopoverListItem = ({item,index}) => {
      return(
        <TouchableOpacity style={[styles.sharePopoverStyle,{borderBottomWidth : (index == shareOptions.length - 1) ? 0 : 1  }]} onPress={() => this._actionSheethandlePress(index)}>
            <Text style={[styles.sharePopoverText,{color : (index == shareOptions.length - 1) ? 'red' : "#007aff" }]}>{item}</Text>
        </TouchableOpacity>
      )
  }
  shareSheetShowEvent = () => {

  if(Platform.OS == 'ios' && width <= 375){
      this.ActionSheet.show()
      return;
  }
  this.shareBtn.measure((ox, oy, width, height, px, py) => {
      this.setState({
          showPopover : true,
          buttonRect: {x: px , y: py+50, width: width, height: 0}
      });
      });
  }
  render() {

    return (
      <View style={{ flex: 1,backgroundColor:'#EFEFF4' }}>

          <ListView
            initialListSize={20}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
          {(this.state.needDelete!=null)?<View style={{ flexDirection: 'column',}}>
            <TouchableOpacity onPress={this.deleteFile}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.cancelAllDelete}>
              <Text style={styles.deleteButton}>Cancel</Text>
            </TouchableOpacity>
          </View>:null}

          <Modal
            animationType={"slide"}
            transparent={true}
            ref="modal1"
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
           >
           {(this.state.dataPdf.stored=='')?<View style={styles.overlayModal}></View>:<View style={styles.pdfShare}>
               <TouchableOpacity  onPress={() =>{
                 this.resetListView(this.state.localData);
                 this.setModalVisible(!this.state.modalVisible);
               }}>
                <Icon1 name="ios-arrow-back" size={50} color="#696969"/>
               </TouchableOpacity>
               <TouchableOpacity ref={b => this.shareBtn = b} onPress={()=>{
                 this.shareSheetShowEvent();
                //  Share.open(this.state.shareOptions).catch(err => console.log(err));
              }}>
               <Icon1 name="ios-share-outline" size={50} color="#696969" />
               </TouchableOpacity>
             </View>}
            {this.renderPdf(this.state.dataPdf)}
            <Popover
                isVisible={this.state.showPopover}
                fromRect={this.state.buttonRect}
                onClose={this.closePopover}
                placement={"bottom"}
                displayArea={{x : 0, y : 0, width : this.state.screenSize.width, height : this.state.screenSize.height}}
                >
                <FlatList
                    removeClippedSubviews={false}
                    data={shareOptions}
                    keyExtractor={(item,index) => index}
                    renderItem={this.sharePopoverListItem}
                    />
            </Popover>
          </Modal>
          <ActionSheet
              ref={o => this.ActionSheet = o}
              options={shareOptions}
              cancelButtonIndex={shareOptions.length - 1}
              onPress={this._actionSheethandlePress}
              />

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
      margin:10,
      marginBottom: 5,
      width: 100,
      height: 130,
      alignItems: 'center',
      borderColor: '#CCC'
    },
    pdfShare:{
      paddingHorizontal:10,
      paddingTop:25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor:'white'
    },
    thumb: {
      width: 65,
      height: 130,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
    opacity: 0.5
    },
    overlayModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)'
    },
    progressBar:{
      marginTop: halfHeight,
      alignSelf:'center',
      backgroundColor:'#fff',
      borderRadius:0,
      borderWidth:1,
      borderColor:'white'
    },
    buttonModal:{
      width:widthButton,
      marginVertical:5,
      padding:10,
      color: 'blue',
      fontSize:18,
      borderRadius:10,
      textAlign: 'center',
      backgroundColor:'white'
    },
    deleteButton:{
      margin:5,
      marginHorizontal:10,
      paddingVertical:10,
      textAlign: 'center',
      fontSize:20,
      borderRadius:10,
      color:'blue',
      backgroundColor:'white'
    },
    imageIconCheck:{
      ...Platform.select({
        ios:{
          alignSelf:'center',
          margin:5,
          width:20,
          height:20,
          paddingLeft:2,
          borderRadius:10 ,
          borderWidth:1,
          borderColor:'#4CAF50',
          backgroundColor:'#C8E6C9',
          position:'absolute',
          top:0,
          right:7,
          overflow:'hidden'
        },
        android:{
          alignSelf:'center',
          margin:5,
          width:20,
          height:20,
          paddingLeft:2,
          borderRadius:20 ,
          borderWidth:1,
          borderColor:'#4CAF50',
          backgroundColor:'#C8E6C9',
          position:'absolute',
          top:0,
          right:7
        }
      })
    },
    imageIconMinus:{
      ...Platform.select({
        ios:{
          alignSelf:'center',
          margin:5,
          width:20,
          height:20,
          borderRadius:10 ,
          borderWidth:1,
          borderColor:'#fff',
          backgroundColor:'#dc143c',
          position:'absolute',
          top:0,
          right:5,
          overflow:'hidden'
        },
        android:{
          alignSelf:'center',
          margin:5,
          width:20,
          height:20,
          borderRadius:20 ,
          borderWidth:1,
          borderColor:'#ff0000',
          backgroundColor:'#dc143c',
          position:'absolute',
          top:0,
          right:5
        }
      })
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
      textAlign:'center',
      color: 'black',
      fontSize: 14,
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
    },
    sharePopoverStyle : {
        width:270,
        padding:15,
        alignItems:'center',
        borderBottomWidth: 1,
        borderColor: '#d6d6da'
    },
    sharePopoverText : {
        fontSize:16,
        color : "#007aff",
        padding: 10
    }
});
const mapStateToProps = ({miniRow}) => {
  const { dataUpdate, downloadLength, dataUpdateQueue, isConnected } = miniRow;
  // console.log(downloadLength);
  return { dataUpdate, downloadLength, dataUpdateQueue, isConnected };
};
export default connect(mapStateToProps,{ updateRow,updateQueue,shiftQueue,updateQueueIndex, incresDown, decresDown,netChange,resetLength })(GridView);
