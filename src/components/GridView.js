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
// import Modal1 from 'react-native-modalbox';
import Share, {ShareSheet, Button} from 'react-native-share';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';
// import ModalDropdown from 'react-native-modal-dropdown';


const basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/';
let downloading = null;

class GridView extends Component {
  componentWillMount() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataPdf:{},
      localData:[],
      needDelete:null,
      isPdfDownload: false,
      width: 0,
      shareOptions : {
        title: '',
        message: '',
        url: '',
        subject: "Share Link", //  for email
      },
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
          {year:2016, pdf: 'AR_ENG_2016.pdf', stored:'', width:0,minus:false},
          {year:2015, pdf: 'AR_ENG_2015.pdf', stored:'', width:0,minus:false},
          {year:2014, pdf: 'AR_ENG_2014.pdf', stored:'', width:0,minus:false},
          {year:2013, pdf: 'AR_ENG_2013.pdf', stored:'', width:0,minus:false},
          {year:2012, pdf: 'AR_ENG_2012.pdf', stored:'', width:0,minus:false},
          {year:2011, pdf: 'AR_ENG_2011.pdf', stored:'', width:0,minus:false},
          {year:2010, pdf: 'AR_ENG_2010.pdf', stored:'', width:0,minus:false},
          {year:2009, pdf: 'AR_ENG_2009.pdf', stored:'', width:0,minus:false},
          {year:2008, pdf: 'AR_ENG_2008.pdf', stored:'', width:0,minus:false},
          {year:2007, pdf: 'AR_ENG_2007.pdf', stored:'', width:0,minus:false},
          {year:2006, pdf: 'AR_ENG_2006.pdf', stored:'', width:0,minus:false},
          {year:2005, pdf: 'AR_ENG_2005.pdf', stored:'', width:0,minus:false},
          {year:2004, pdf: 'AR_ENG_2004.pdf', stored:'', width:0,minus:false},
          {year:2003, pdf: 'AR_ENG_2003.pdf', stored:'', width:0,minus:false},
          {year:2002, pdf: 'AR_ENG_2002.pdf', stored:'', width:0,minus:false},
          {year:2001, pdf: 'AR_ENG_2001.pdf', stored:'', width:0,minus:false},
          {year:2000, pdf: 'AR_ENG_2000.pdf', stored:'', width:0,minus:false},
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
        // console.log(JSON.parse(res));
      }
    });
  }

  resetListView = (temp) => {
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({dataSource: ds.cloneWithRows(temp)});
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
          this.resetListView(temp);
      })
      .then((res) => {
        // console.log(res);

        this.setState({dataPdf: {year:data.year, pdf:data.pdf ,stored:res.path(),width:1,minus:false},width:0  });
        AsyncStorage.getItem('pdfPath')
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
            this.resetListView(temp);
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
    this.resetListView(temp);
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
          let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
          this.setState({dataSource: ds.cloneWithRows(temp)});
        }}
        name="md-checkmark" size={20} color="#4CAF50" style={styles.imageIconCheck}/>
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
            let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({dataSource: ds.cloneWithRows(temp)});
        }}
        name="minus" size={20} color="#fff" style={styles.imageIconMinus}/>
      )
  }
  renderImage(width,rowData,baseUrl){
      // console.log(rowData);
    if(width === 0||width === 1)
    return(
      <TouchableOpacity onPress={()=>{
        this.setState({dataPdf:rowData,width:0,
          shareOptions:{title: 'Share PDF',
        message: 'Novozymes '+rowData.pdf,
        url: (basePdf+rowData.pdf),
        subject: "Share Link",
        social:"email"
      }});
        this.setModalVisible(!this.state.modalVisible);
        if(rowData.stored==''){ this.downloadPdf(rowData);}
      }}>
      <View>
        <Image
          ref='thumb'
          style={styles.thumb}
          source={{ uri: baseUrl }}
        />
        <Text style={styles.text}>
          {rowData.year}
        </Text>
      </View>
      </TouchableOpacity>
    )
    return (
      <View>
      <Image
        ref='thumb'
        style={styles.thumb}
        source={{ uri: baseUrl }}
      >
      <View style={styles.overlay}/>
      <Progress.Bar style={{alignSelf:'center',backgroundColor:'#fff',borderRadius:0}} progress={rowData.width} width={55} />
      </Image>
      <Text style={styles.text}>
        {rowData.year}
      </Text>
    </View>
    )
  }
  renderRow = (rowData) => {
    // console.log(rowData);
    // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_2009_63_90_3x.jpg';
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_'+rowData.year+'_63_90_3x.jpg';
    // let basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/'+rowData.pdf;
    // console.log(this.state.width);
    return (
      <View style={styles.row}>
        {this.renderImage(rowData.width,rowData,baseUrl)}
        {this.renderIcon(rowData)}
      </View>
    );
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
              <Text style={{textAlign: 'center', fontSize:20, color:'blue', paddingVertical:15}}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.cancelAllDelete}>
              <Text style={{textAlign: 'center', fontSize:20, color:'blue', paddingVertical:15}}>Cancel</Text>
            </TouchableOpacity>
          </View>:null}
          <Modal
            animationType={"slide"}
            transparent={false}
            ref="modal1"
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
           >
           <View style={styles.pdfShare}>
             <TouchableOpacity  onPress={() =>{
               this.setModalVisible(!this.state.modalVisible);
               this.resetListView(this.state.localData);
             }}>
              <Icon1 name="ios-arrow-back" size={40} color="#696969"/>
             </TouchableOpacity>
             <Icon1 onPress={()=>{
               Share.open(this.state.shareOptions).catch(err => console.log(err));
             }} name="ios-share-outline" size={40} color="#696969" />
           </View>

            {this.renderPdf(this.state.dataPdf)}
          </Modal>
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
      marginBottom: 5,
      width: 100,
      height: 130,
      alignItems: 'center',
      borderColor: '#CCC'
    },
    pdfShare:{
      marginTop:10,
      padding:10,
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    imageIconCheck:{
      ...Platform.select({
        ios:{
          alignSelf:'center',
          width:20,
          height:20,
          paddingLeft:2,
          borderRadius:10 ,
          borderWidth:1,
          borderColor:'#4CAF50',
          backgroundColor:'#C8E6C9',
          position:'absolute',
          top:0,
          right:5,
          overflow:'hidden'
        },
        android:{
          alignSelf:'center',
          width:20,
          height:20,
          paddingLeft:2,
          borderRadius:20 ,
          borderWidth:1,
          borderColor:'#4CAF50',
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
    }
});

export default GridView;
