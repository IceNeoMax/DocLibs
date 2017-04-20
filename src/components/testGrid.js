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


export default class testGrid extends React.Component {
  state = {
    isPdfDownload: false,
    width: 0,
    pdfFile: ''
  };


  render() {

    return (
        <View style={styles.container}>
        <Text>123
        </Text>
        </View>
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
