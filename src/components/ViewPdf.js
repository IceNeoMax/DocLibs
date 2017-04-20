import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  Image,
} from 'react-native';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';

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
  let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2 });
  this.state = {
    food: [
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
    dataSource: ds,
  };
  this.setState({
    dataSource: ds.cloneWithRowsAndSections(this.convertFoodArrayToMap(this.state.food))
  })
}
convertFoodArrayToMap=(food)=>{
let foodCategoryMap = {}; // Create the blank map
food.forEach((foodItem)=>{
  if (!foodCategoryMap[foodItem.year]) {
    // Create an entry in the map for the year if it hasn't yet been created
    foodCategoryMap[foodItem.year] = [];
  }
  foodCategoryMap[foodItem.year].push(foodItem);
});
// console.log(foodCategoryMap);
return foodCategoryMap
}
renderRow=(foodItem)=>{
    // console.log(foodItem);
    let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+foodItem.pdf.slice(0,11)+'_63_90_3x.jpg';

    return (
      <View>
      <Image
          style={{width: 50, height: 50}}
          source={{uri: baseUrl}}
        />
      <Text>dkmmm</Text>

      </View>
    )
}

renderSectionHeader=(sectionData, year)=>{

// let baseUrl = 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/'+sectionData.pdf.slice(0,11)+'_63_90_3x.jpg';

  return (

    <Text style={{fontWeight: "700"}}>{year}</Text>

  )
}
  render() {
    return (
      <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              renderSectionHeader={this.renderSectionHeader}
            />
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pdf: {
    flex: 1
  }
});
