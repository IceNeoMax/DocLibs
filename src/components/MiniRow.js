import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  WebView,
} from 'react-native';
import { connect } from 'react-redux';
import { updateRow,updateQueue } from '../actions';
import * as Progress from 'react-native-progress';
// import _ from 'underscore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class MiniRow extends Component {
  componentWillMount(){
    // console.log(this.props.dataUpdateQueue);
    this.state={
      dataWidth:0
    }
  }
  componentWillReceiveProps(){
    // console.log(this.props.dataUpdate);
    index1 = this.props.dataUpdateQueue.findIndex(findObj => findObj.pdf==this.props.data.pdf);
    if (index1 == -1&&this.props.queue==1) {
       this.setState({dataWidth:0})
     }
    if(this.props.dataUpdate==[]) this.setState({dataWidth:0})
    else index = this.props.dataUpdate.findIndex(findObj => findObj.pdf==this.props.data.pdf);
    if (this.props.dataUpdate[index]!==undefined) this.setState({dataWidth:this.props.dataUpdate[index].width});

    if (index1 != -1&&this.props.queue==0.01) {
      this.setState({dataWidth:this.props.queue})
    }
    // console.log(this.state.dataWidth,this.props.dataUpdateQueue,index);
  }
  renderProgressbar(){
    return(
      <Progress.Bar style={{alignSelf:'center',backgroundColor:'#fff',borderRadius:0}} progress={this.state.dataWidth} width={55} />
    )
  }
  // <Progress.Bar style={{alignSelf:'center',backgroundColor:'#fff',borderRadius:0}} progress={this.props.dataUpdate.width} width={55} />
  renderIcon(){
    if(this.state.dataWidth === 1)
    return(
      <Icon name="minus" size={30} color="#fff"/>
    )
  }
  renderImage(rowData,baseUrl){
      // console.log(rowData);
    if(this.state.dataWidth === 0||this.state.dataWidth === 1)
    return(
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
    )

    return (
      <View>
      <Image
        ref='thumb'
        style={styles.thumb}
        source={{ uri: baseUrl }}
      >
      <View style={styles.overlay}/>
      {this.renderProgressbar()}
      </Image>
      <Text style={styles.text}>
        {rowData.year}
      </Text>
    </View>
    )
  }
 render(){
    return(
      <View style={styles.row}>
        {this.renderImage(this.props.data,this.props.baseUrl)}
      </View>
    );
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
  text: {
    textAlign:'center',
    color: 'black',
    fontSize: 12,
    bottom: 0,
    width: 64
  }
});
const mapStateToProps = ({ miniRow }) => {
  const { dataUpdate,width,dataUpdateQueue,queue } = miniRow;
  return { dataUpdate,width,dataUpdateQueue,queue };
};
export default connect(mapStateToProps,{ updateRow,updateQueue })(MiniRow);
