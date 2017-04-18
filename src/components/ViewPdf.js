import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import * as Progress from 'react-native-progress';
import PDFView from 'react-native-pdf-view';
import RNFetchBlob from 'react-native-fetch-blob';

const pdfDownloadURL = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/Q1_ENG_2015.pdf';

export default class ViewPdf extends React.Component {
  state = {
    isPdfDownload: false,
    width: 0,
    pdfFile: ''
  };

  constructor(props) {
    super(props);
    this.pdfView = null;
  }

  componentDidMount() {
    const options = {
      fromUrl: pdfDownloadURL,
      toFile: this.pdfPath
    };
    RNFetchBlob.config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache : true,
            path : RNFetchBlob.fs.dirs.DocumentDir + '/test.pdf'
          })
          .fetch('GET', pdfDownloadURL , {
            //some headers ..
          })
          .progress((received, total) => {
              this.setState({
                width : 200 * (received/total)
              })
          })
          .then((res) => {
            // the temp file path
            this.setState({isPdfDownload: true, pdfFile: res.path() });
            console.log('The file saved to ', res.path())
          });
  }

  // zoom(val = 2.5) {
  //   this.pdfView && setTimeout(() => {
  //     this.pdfView.setNativeProps({width: val});
  //   }, 1000);
  // }

  render() {
    if (!this.state.isPdfDownload) {
      return (
        <View style={styles.container}>
          <Progress.Bar progress={this.state.width} width={200} />
        </View>
      );
    }
    return (
        <PDFView ref={(pdf)=>{this.pdfView = pdf;}}
                 key="sop"
                 path={this.state.pdfFile}
                 onLoadComplete={(pageCount)=>{
                          console.log(`total page count: ${pageCount}`);
                       }}
                 style={styles.pdf}/>
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
