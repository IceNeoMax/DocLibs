import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
// import { Container, Content, ListItem } from 'native-base';

class GridViewWithSection extends Component {

  componentWillMount() {
    const ds = new ListView.DataSource({
       rowHasChanged: (r1, r2) => r1 !== r2
      });
    this.state = {
      dataSource: ds.cloneWithRows([2014, 2013, 2012, 2011, 2010, 2009])
    };
  }


  renderRow(rowData) {
    return (
      <View>
        
        <View style={styles.list}>
          <View style={styles.row}>
            <Image
              style={styles.thumb}
              source={{ uri: `http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/Q4_ENG_${rowData}_63_90_3x.jpg` }}
            >
            <Text style={styles.text}>
              Q4 {rowData}
            </Text>
            </Image>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.thumb}
              source={{ uri: `http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/Q3_ENG_${rowData}_63_90_3x.jpg` }}
            >
            <Text style={styles.text}>
              Q3 {rowData}
            </Text>
            </Image>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.thumb}
              source={{ uri: `http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/Q2_ENG_${rowData}_63_90_3x.jpg` }}
            >
            <Text style={styles.text}>
              Q2 {rowData}
            </Text>
            </Image>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.thumb}
              source={{ uri: `http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/Q1_ENG_${rowData}_63_90_3x.jpg` }}
            >
            <Text style={styles.text}>
              Q1 {rowData}
            </Text>
            </Image>
          </View>

        </View>


      </View>
        );
  }

  render() {
    return (
      // <Container>
            //     <Content>
            //         <ListItem itemDivider>
            //             <Text>2015</Text>
            //         </ListItem>
            //         <View style={styles.row}>
            //           <Image
            //             style={styles.thumb}
            //             source={{ uri: 'http://northeurope.blob.euroland.com/mobiletools/pdfthumbnails/DK-NZMB/Q1_ENG_2015_63_90_3x.jpg' }}
            //           >
            //           <Text style={styles.text}>
            //             Q1 2015
            //           </Text>
            //           </Image>
            //         </View>
            //         <ListView
            //
            //           dataSource={this.state.dataSource}
            //           renderRow={(rowData) => this.renderRow(rowData)}
            //         />
            //     </Content>
            // </Container>
      <View style={{ flex: 1 }}>
          <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    list: {
      flexWrap: 'wrap',
      flexDirection: 'row'
    },
    row: {
      padding: 5,
      marginLeft: 15,
      marginBottom: -5,
      width: 80,
      height: 100,
      backgroundColor: '#F6F6F6',
      borderColor: '#CCC',
      flexDirection: 'row'
    },
    thumb: {
      width: 64,
      height: 64,
      marginLeft: 10,
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-end',
    },

    text: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: 'white',
      padding: 5,
      position: 'absolute',
      fontSize: 13,
      bottom: 0,
      width: 100
    }
});

export default GridViewWithSection;
