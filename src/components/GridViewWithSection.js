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

} from 'react-native';
import { connect } from 'react-redux';
import { updateRowSection,updateQueue, shiftQueue,updateQueueIndex, incresDown, decresDown,netChange } from '../actions';
import MiniRowSection from './MiniRowSection';
import Popover from './common/popover';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';
// import _ from 'underscore';
import axios from 'axios';

let { width, height } = Dimensions.get("window");
let halfHeight=height/2-30;
let halfWidth = width/2;
let widthButton= width-10;
const shareOptions = ['Send via Email', 'Tweet this', 'Share via Whatsapp', 'Share on Facebook','Cancel'];
const basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
 });
 let downloading = [];
 let downloads=[];
class GridViewWithSection extends Component {

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
      modalPdf:false,
      pdfOn:'',
      showPopover : false,
      buttonRect: {},
      screenSize : Dimensions.get('window')
    };
    // AsyncStorage.removeItem('pdfPathSection');
    this.checkStorage();
  }
  componentWillReceiveProps(nextProps){
    let flag =false;
    // console.log(this.props.downloadLength);
    if(nextProps.dataUpdateQueue.length>0&&nextProps.downloadLength<3&&downloads.length<3){
      this.state.localData.map(localPdf=>{
          if (this.props.dataUpdateQueue[0].pdf==localPdf.pdf) flag=true;
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
    }
    // console.log(this.props.downloadLength);
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  checkStorage(){
    AsyncStorage.getItem('pdfPathSection')
    .then(res=>{
      //  console.log(res);
      if (res == null) {
        axios.get('http://113.190.248.146/myirappapi2/api/v1/documentlibrary/dk-nzmb/en-gb/report/id_2')
        .then(val=>{
          let temp = [];
          // console.log(res.data);
          val.data.map(val =>{
            let year = parseInt(val.FileName.slice(7,11));
            temp.push({year, pdf: val.FileName, ETag:val.ETag, stored:'', width:0,minus:false});
          })
          AsyncStorage.setItem('pdfPathSection',JSON.stringify(temp));
          this.setState({
              localData:temp,
              dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(temp)),
            });
        })
      }
      else {
        axios.get('http://113.190.248.146/myirappapi2/api/v1/documentlibrary/dk-nzmb/en-gb/report/id_2')
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
              dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(temp)),
            });
        }).catch(()=>{
          // console.log(JSON.parse(res));
          let temp = JSON.parse(res);
          // JSON.parse(res).map(val =>{
          //   // let year = parseInt(val.FileName.slice(7,11));
          //   temp.push({year, pdf: val.FileName, ETag:val.ETag, stored:'', width:0,minus:false});
          // })
          this.setState({
              localData:temp,
              dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(temp)),
            });
        });
      }
    });
  }
convertDataArrayToMap =(data)=>{
  let dataCategoryMap = []; // Create the blank map
  data.map((rowData)=>{
    let year = rowData.year;
    if (!dataCategoryMap[rowData.year])
    dataCategoryMap[year] = {[year]:[]};
    dataCategoryMap[year][year].push(rowData);
  });
  // console.log(dataCategoryMap);
  // console.log(Object.assign([], dataCategoryMap).reverse());
  return Object.assign([], dataCategoryMap).reverse();
}
resetListView = (temp) => {
     this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
}
downloadPdf = (data) => {
  // downloads.push(data); //downloading array

  downloadFile =  RNFetchBlob.config({
      fileCache : true,
      path : RNFetchBlob.fs.dirs.DocumentDir + '/' +data.pdf
    }).fetch('GET', basePdf+data.pdf , {
        //some headers ..
        //basePdf+data.pdf
        // 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/AR_ENG_2015.pdf'
      });
  downloadFile.pdf=data.pdf;
  downloading.push(downloadFile)
    downloadFile.progress((received, total) => {
        let width= (received/total);
        // let temp = this.state.localData;
        index = downloads.findIndex(findObj => findObj.pdf==data.pdf);
        if (downloads[index]) downloads[index].width=width;
        // console.log(width);
        if (data.pdf==this.state.dataPdf.pdf) this.setState({width});
        this.props.updateRowSection(downloads,width);
    })
    .then((res) => {
      // console.log(res.path());
      this.setState({width:0.99});
      index = downloads.findIndex(findObj => findObj.pdf==data.pdf);
      downloading.splice(index,1);
      downloads.splice(index,1);
      let flag = false;
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
      AsyncStorage.getItem('pdfPathSection')
        .then(val => {
          let temp = [];
          let tempOpen=[];
          JSON.parse(val).map(localres=>{
          // this.state.localData.map(localres=>{
            if (localres.stored=='') localres.width=0;
            if (tempQueue!={}&&tempQueue.pdf==localres.pdf) {localres.width=0.01;}
            downloads.map(download=>{
              if (localres.pdf==download.pdf) localres.width=download.width;
              else if (localres.stored!='') localres.width=1;
            })
            this.props.dataUpdateQueue.map(queue=>{
              if (localres.pdf==queue.pdf) localres.width= 0.01;
            })
            if (localres.pdf==data.pdf)
            {
              localres.stored = res.path(); localres.width=1;
              tempOpen=localres;
            }
            temp.push(localres);
          })
          this.props.updateRowSection(temp,1);
          if (this.state.pdfOn==data.pdf) {
            setTimeout(()=>this.setState({dataPdf:tempOpen}),800);
          }
          this.setState({localData:temp});
          this.resetListView(temp);
          // this.setState({width:0});
          AsyncStorage.setItem('pdfPathSection',JSON.stringify(temp));
          // .then(()=> this.setState({width:0}));
      });
    });

  }
  cancelDownload = ()=>{
    let check = false;
    downloads.map(down=>{
      if (down.pdf==this.state.dataPdf.pdf) check = true;
    });
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
      index = downloading.findIndex(findObj => findObj.pdf==this.state.dataPdf.pdf);
      if(downloading[index]){
        downloading[index].cancel(
          (err, taskId)=>{
            let temp2 = [];
            if (this.props.dataUpdateSection) {
              this.props.dataUpdateSection.map(localres=>{
                if (localres&&localres.pdf==downloading[index].pdf) localres.width = 0;
                temp2.push(localres);
              });
            }
            let count = this.props.downloadLength-1;
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
              // downloads.push(this.props.dataUpdateQueue[0]);
              this.props.incresDown(this.props.downloadLength);
              this.downloadPdf(this.props.dataUpdateQueue[0]);
              this.props.shiftQueue(this.props.dataUpdateQueue);
            }
            this.props.decresDown(this.props.downloadLength);
            this.props.updateRowSection(temp2,0);
            this.setModalVisible(!this.state.modalVisible);
          }
        );
      }
      if (downloading[index]["_65"]) {
        // console.log(downloading[index]["_65"]);
        let temp2 = [];
        if (this.props.dataUpdate) {
          this.props.dataUpdate.map(localres=>{
            if (localres.pdf==downloads[index].pdf) localres.width = 0;
            temp2.push(localres);
          });
        }
        let count = this.props.downloadLength-1;
        downloads.splice(index,1);
        downloading.splice(index,1);
        this.props.decresDown(this.props.downloadLength);
        this.props.updateRowSection(temp2,0);
        // console.log(this.props.dataUpdate);
        this.setModalVisible(!this.state.modalVisible);
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
      if (localres.pdf==del.pdf) {localres.stored = '';localres.minus = false;localres.width = 0;}
    });
    temp.push(localres);
  })
  this.setState({localData:temp, needDelete:null});
  this.resetListView(temp);
  AsyncStorage.setItem('pdfPathSection',JSON.stringify(temp));
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
  // console.log(this.state.dataPdf.stored);
  if (this.state.dataPdf.stored=='') {
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
            if (localres.pdf!=rowData.pdf) flag=true;
          })
          if(flag) temp2.push(rowData);
        }

        // console.log(temp2,rowData.year);
        this.state.localData.map(localres=>{
          if (localres.pdf==rowData.pdf) localres.minus = true;
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
          let temp= [];
          this.state.localData.map(localres=>{
            if (localres.pdf==rowData.pdf) localres.minus = false;
            temp.push(localres);
          });
          if(this.state.needDelete.length == 1) this.setState({needDelete:null});
          else{
            let temp2=[];
            this.state.needDelete.map(localres=>{
              if (localres.pdf!=rowData.pdf) temp2.push(localres);
            });
            this.setState({needDelete:temp2});
          }
          this.setState({localData:temp});
          this.resetListView(temp);
      }}
      name="minus" size={20} color="#fff" style={styles.imageIconMinus}/>
    )
}

renderMiniRow=(rowData)=>{
  // console.log(rowData);
  // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+rowData.pdf.slice(0,11)+'_63_90_3x.jpg';
  let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/';
  // console.log(baseUrl);
  return (
    rowData.map(row=>
      <View key={row.pdf} style={styles.row}>
        <TouchableOpacity  onPress={()=>{
          this.setState({dataPdf:row,
            pdfOn:row.pdf,
            width:0,
            shareOptions:{title: 'Share PDF',
          message: 'Novozymes '+row.pdf,
          url: (basePdf+row.pdf),
          subject: "Share Link",
          social:"email"
        }});
        // console.log(row);
          let Isdownload = false;
          this.props.dataUpdateSection.map(val=>{
            if (val.pdf==row.pdf&&val.width!=0)
            Isdownload = true;
          })
          // if(Isdownload==false||row.width==1)
          this.setModalVisible(!this.state.modalVisible);
          if(row.stored==''&&this.props.downloadLength<3){
            this.setModalVisible(!this.state.modalVisible);
            if (!Isdownload){
              let tempRow = row;
              tempRow.width=0.01;
              downloads.push(tempRow);
              this.props.incresDown(this.props.downloadLength);
              this.downloadPdf(row);
            }
           }
           else if(this.props.downloadLength==3) {
             if(this.props.dataUpdateQueue.length==0&&!Isdownload) {this.props.updateQueue(row,[],0.01);}
             else if(this.props.dataUpdateQueue.length>0&&!Isdownload){
               let flag = false;
               this.props.dataUpdateQueue.map(SQueue=>{
                 if(row.pdf==SQueue.pdf) flag=true;
                });
              if(!flag) this.props.updateQueue(row,this.props.dataUpdateQueue);
              let temp=this.props.dataUpdateQueue;
              downloads.map(download=>{
                index = this.props.dataUpdateQueue.findIndex(findObj => findObj.pdf==download.pdf);
               //  console.log(index);
                if(index != -1) temp.splice(index, 1);
              })
              // console.log(temp);
              this.props.updateQueueIndex(temp,0.01);
             }
           }
        }}>
          <MiniRowSection data={row} baseUrl={baseUrl+row.pdf.slice(0,11)+'_63_90_3x.jpg'}/>
        </TouchableOpacity>

          {this.renderIcon(row)}
      </View>
    )
  )
}
renderRow = (rowData) => {
  // console.log(rowData);
  return (
    <View style={styles.list}>
      {this.renderMiniRow(rowData)}
    </View>

  );
}
renderSectionHeader=(sectionData, key)=>{
  return (
    <View style={{flex:1,flexDirection:'column'}}>
      <Text style={styles.headerSection}>{Object.keys(sectionData)[0]}</Text>
    </View>
  )
}
_actionSheethandlePress = (index) => {
    //['Send via Email', 'Tweet this', 'Share via Whatsapp', 'Share on Facebook','Cancel']

    switch(index){
        case 0 :
        // mail
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
closePopover = () => {
    this.setState({showPopover: false});
}
render() {

  return (
    <View style={{ flex: 1,backgroundColor:'#EFEFF4' }}>

        <ListView
          initialListSize={25}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
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
  list:{
       flexDirection: 'row',
       flexWrap: 'wrap'
  },
  row: {
    justifyContent: 'center',
    paddingLeft: 10,
    margin: 5,
    marginBottom: 15,
    marginTop: 15,
    width: 105,
    height: 130,
    alignItems: 'center',
    borderColor: '#CCC'
  },
  pdfShare:{
    paddingHorizontal:10,
    paddingTop:25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white',
  },
  thumb: {
    width: 70,
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
  headerSection:{
    fontWeight: "700",
    padding:10,
    backgroundColor:'#F7F7F7'
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
    borderRadius:10,
    textAlign: 'center',
    fontSize:20,
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
        backgroundColor:'#C8E6C9',
        position:'absolute',
        top:-5,
        right:0,
        overflow:'hidden'
      },
      android:{
        alignSelf:'center',
        margin:5,
        width:20,
        height:20,
        paddingLeft:2,
        borderRadius:20 ,
        backgroundColor:'#C8E6C9',
        position:'absolute',
        top:0,
        right:5
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
        top:-5,
        right:0,
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
  sharingPic: {
    paddingLeft: 50,
    paddingRight: 50,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text: {
    textAlign:'center',
    color: 'black',
    fontSize: 10,
    bottom: 0,
    width: 70
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
const mapStateToProps = ({ miniRow }) => {
  const { dataUpdateSection,widthSection, downloadLength, dataUpdateQueue,isConnected } = miniRow;
  return { dataUpdateSection,widthSection, downloadLength, dataUpdateQueue,isConnected };
};
export default connect(mapStateToProps,{ updateRowSection,updateQueue, shiftQueue,updateQueueIndex, incresDown, decresDown,netChange })(GridViewWithSection);
