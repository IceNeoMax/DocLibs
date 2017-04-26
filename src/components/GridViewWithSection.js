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
import Share from 'react-native-share';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

const { width, height } = Dimensions.get("window");
const basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/';
let downloading = null;

class GridViewWithSection extends Component {

  componentWillMount() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
     });
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
    // AsyncStorage.removeItem('pdfPathSection');
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
  let dataCategoryMap = []; // Create the blank map
  data.map((rowData)=>{
    let year = rowData.year;
    if (!dataCategoryMap[rowData.year])
    dataCategoryMap[rowData.year] = {[year]:[]};
    dataCategoryMap[rowData.year][year].push(rowData);
  });
  // console.log(dataCategoryMap);
  // console.log(Object.assign([], dataCategoryMap).reverse());
  return Object.assign([], dataCategoryMap).reverse();
}
resetListView = (temp) => {
  let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
   });
     this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(this.convertDataArrayToMap(temp))});
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
          if (localres.pdf==data.pdf) localres.width = width;
          temp.push(localres);
        });
        // console.log(width);
        if (data.pdf==this.state.dataPdf.pdf) this.setState({width});
        this.setState({localData:temp});
        this.resetListView(temp);
    })
    .then((res) => {
      // console.log(res);

      this.setState({dataPdf: {year:data.year, pdf:data.pdf ,stored:res.path(),width:1,minus:false},width:0  });
      AsyncStorage.getItem('pdfPathSection')
        .then(res => {
          let temp = [];
          JSON.parse(res).map(storeval=>{
            // console.log(storeval);
            if (storeval.pdf==data.pdf)
            {storeval.stored = this.state.dataPdf.stored;storeval.width=1;}
            temp.push(storeval);
          })
          // console.log(this.state.dataPdf.stored);
          this.setState({localData:temp});
          this.resetListView(temp);
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
    if (localres.pdf==this.state.dataPdf.pdf) localres.width = 0;
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
        {rowData.pdf.slice(0,11)}
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
renderMiniRow=(rowData)=>{
  // console.log(rowData);
  let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+rowData.pdf.slice(0,11)+'_63_90_3x.jpg';
  // console.log(baseUrl);
  return (
    <View style={styles.row}>
      {this.renderImage(rowData.width,rowData,baseUrl)}
      {this.renderIcon(rowData)}
    </View>
  )
}

renderRow = (rowData) => {
  // console.log(rowData);
  // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_2009_63_90_3x.jpg';
  // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/AR_ENG_'+rowData.year+'_63_90_3x.jpg';
  // let basePdf = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/'+rowData.pdf;
  let tempDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  let miniRow = tempDs.cloneWithRows(rowData);
  return (
    <View style={{flex:1}}>
      <ListView
        contentContainerStyle={styles.list}
        dataSource={miniRow}
        renderRow={this.renderMiniRow}
      />
    </View>

  );
}
renderSectionHeader=(sectionData, key)=>{
  // console.log(sectionData,key);
  // console.log(Object.keys(sectionData));
  return (
    <View style={{flex:1,flexDirection:'column'}}>
      <Text style={styles.headerSection}>{Object.keys(sectionData)[0]}</Text>
    </View>
  )
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
    marginTop:10,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  imageIconCheck:{
    ...Platform.select({
      ios:{
        alignSelf:'center',
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
  }
});
export default GridViewWithSection;
