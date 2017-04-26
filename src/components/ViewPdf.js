import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';
const { width, height } = Dimensions.get("window");

const pdfDownloadURL = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/Q1_ENG_2015.pdf';

export default class ViewPdf extends React.Component {
//   state = {
//     isPdfDownload: false,
//     width: 0,
//     pdfFile: ''
//   };
//
//   constructor(props) {
//     super(props);
//     this.pdfView = null;
//   }
//
//   componentDidMount() {
//     const options = {
//       fromUrl: pdfDownloadURL,
//       toFile: this.pdfPath
//     };
//     RNFetchBlob.config({
//             // add this option that makes response data to be stored as a file,
//             // this is much more performant.
//             fileCache : true,
//             path : RNFetchBlob.fs.dirs.DocumentDir + '/test.pdf'
//           })
//           .fetch('GET', pdfDownloadURL , {
//             //some headers ..
//           })
//           .progress((received, total) => {
//               this.setState({
//                 width : (received/total)
//               })
//           })
//           .then((res) => {
//             // the temp file path
//             this.setState({isPdfDownload: true, pdfFile: res.path() });
//             console.log('The file saved to ', res.path())
//           });
//   }
//
//   // zoom(val = 2.5) {
//   //   this.pdfView && setTimeout(() => {
//   //     this.pdfView.setNativeProps({width: val});
//   //   }, 1000);
//   // }
//
//   render() {
//     if (!this.state.isPdfDownload) {
//       return (
//         <View style={styles.container}>
//           <Progress.Bar progress={this.state.width} width={200} />
//         </View>
//       );
//     }
//     return (
//         <PDFView ref={(pdf)=>{this.pdfView = pdf;}}
//                  key="sop"
//                  path={this.state.pdfFile}
//                  onLoadComplete={(pageCount)=>{
//                           console.log(`total page count: ${pageCount}`);
//                        }}
//                  style={styles.pdf}/>
//     )
//   }
// }
componentWillMount() {
  let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
  this.state = {
    food1: [
      {year:2009, pdf: 'Q4_ENG_2009.pdf', stored:'', width:0,minus:false},
      {year:2009, pdf: 'Q3_ENG_2009.pdf', stored:'', width:0,minus:false},
      {year:2009, pdf: 'Q2_ENG_2009.pdf', stored:'', width:0,minus:false},
      {year:2009, pdf: 'Q1_ENG_2009.pdf', stored:'', width:0,minus:false},
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
      {year:2016, pdf: 'Q4_ENG_2016.pdf', stored:'', width:0,minus:false},
      {year:2016, pdf: 'Q3_ENG_2016.pdf', stored:'', width:0,minus:false},
      {year:2016, pdf: 'Q2_ENG_2016.pdf', stored:'', width:0,minus:false},
      {year:2016, pdf: 'Q1_ENG_2016.pdf', stored:'', width:0,minus:false},
    ],
    food:[
      {123:{'data':[1,2,3]}},
      {12:{12:[11,22,3]}},
      {18:{18:[13,24,3]}},
      {100:{100:[11,2,3]}},
      {19:{19:[1,21,3]}},
      {1002:{1002:[1,2,31]}},
      {128:{18:[12,2,3]}},
      {1020:{100:[1,22,3]}},
    ],
    dataSource: ds,
  };
  this.setState({
    // dataSource: ds.cloneWithRows(this.convertFoodArrayToMap(this.state.food))
    dataSource: ds.cloneWithRowsAndSections(this.state.food)
  })
}
convertFoodArrayToMap=(food)=>{
  let foodCategoryMap = []; // Create the blank map
  food.map((foodItem)=>{
    // console.log(foodItem.year);
    if (!foodCategoryMap[foodItem.year]) {
      // Create an entry in the map for the year if it hasn't yet been created
      foodCategoryMap[foodItem.year] = [];
    }
    foodCategoryMap[foodItem.year].push(foodItem);
    // console.log(foodCategoryMap);
  });
  // console.log(foodCategoryMap.reverse());
  return foodCategoryMap
}
renderMiniRow=(data)=>{
  // console.log(data);
  return (
    <View>
    <Text>{data}
    </Text>
    </View>
  )
}
// <ListView
//   contentContainerStyle={styles.list}
//   dataSource={tempDS.cloneWithRows(foodItem)}
//   renderRow={this.renderMiniRow}
// />
renderRow=(foodItem,rowID,i)=>{
    // console.log(foodItem);
    // let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+foodItem.pdf.slice(0,11)+'_63_90_3x.jpg';
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+'Q1_ENG_2016'+'_63_90_3x.jpg';
    let tempDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let miniRow = tempDs.cloneWithRows(foodItem);
    // console.log(miniRow);
    return (
      <View style={styles.item}>
      <ListView
        contentContainerStyle={styles.list}
        dataSource={miniRow}
        renderRow={this.renderMiniRow}
      />
      </View>
    )
}

renderSectionHeader=(sectionData, year)=>{

// let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+sectionData.pdf.slice(0,11)+'_63_90_3x.jpg';

  return (
    <View style={{flex:1,flexDirection:'column'}}>
      <Text style={{fontWeight: "700"}}>{year}</Text>
    </View>
  )
}
  render() {
    return (
      <View style={styles.container}>
      <ListView

        initialListSize={20}
        dataSource={this.state.dataSource}
        renderRow={(rowData,rowID,i) => this.renderRow(rowData,rowID,i)}
        renderSectionHeader={this.renderSectionHeader}
      />

      </View>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  item: {
        backgroundColor: '#CCC',
        margin: 10,
        width: 100,
        height: 100
    },
  pdf: {
    flex: 1
  },
  list:{
    justifyContent: 'center',
       flexDirection: 'row',
       flexWrap: 'wrap'
  },
});
