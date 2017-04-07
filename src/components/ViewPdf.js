import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';

import PDFView from 'react-native-pdf-view';
import RNFS from 'react-native-fs';

const pdfDownloadURL = 'http://northeurope.blob.euroland.com/pdf/DK-NZMB/Q1_ENG_2015.pdf';

export default class ViewPdf extends React.Component {
  state = {
    isPdfDownload: false,
  };

  constructor(props) {
    super(props);
    this.pdfView = null;
    this.pdfPath = RNFS.DocumentDirectoryPath + '/test.pdf'
  }

  componentDidMount() {
    const options = {
      fromUrl: pdfDownloadURL,
      toFile: this.pdfPath
    };
    RNFS.downloadFile(options).promise.then(res => {
      this.setState({isPdfDownload: true});
    }).catch(err => {
      console.log(err);
    });
  }

  zoom(val = 1) {
    this.pdfView && setTimeout(() => {
      this.pdfView.setNativeProps({zoom: val});
    }, 1000);
  }

  render() {
    if (!this.state.isPdfDownload) {
      return (
        <View style={styles.container}>
          <Text>Downloading</Text>
        </View>
      );
    }
    return (

        <PDFView ref={(pdf)=>{this.pdfView = pdf;}}
                 key="sop"
                 path={this.pdfPath}
                 onLoadComplete={(pageCount)=>{
                          console.log(`total page count: ${pageCount}`);
                          this.zoom();
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
