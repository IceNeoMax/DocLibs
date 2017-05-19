import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,

} from 'react-native';
import { connect } from 'react-redux';
import { updateRowSection,updateQueue } from '../actions';
import * as Progress from 'react-native-progress';
// import _ from 'underscore';

class MiniRowSection extends Component {
  componentWillMount(){
    // console.log(this.props);
    this.state={
      dataWidth:0
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log(nextProps.dataUpdateQueue);
    index1 = nextProps.dataUpdateQueue.findIndex(findObj => findObj.pdf==this.props.data.pdf);
    // console.log(index1,nextProps.queue);
    if (index1 == -1&&nextProps.queue==1) {
       this.setState({dataWidth:0})
     }
    if(this.props.dataUpdateSection==[]) this.setState({dataWidth:0})
    else index = this.props.dataUpdateSection.findIndex(findObj => findObj.pdf==this.props.data.pdf);
    if (this.props.dataUpdateSection[index]!==undefined) this.setState({dataWidth:this.props.dataUpdateSection[index].width});

    if (index1 != -1&&nextProps.queue==0.01) {
      this.setState({dataWidth:nextProps.queue})
    }
    // console.log(this.state.dataWidth,index1);
  }
  // shouldComponentUpdate(nextProps,nextState){
    // console.log('nextProps:',nextProps);
    // console.log('nextState:',nextState);
    // console.log(this.props);
  // }
  renderProgressbar(){
    return(
      <Progress.Bar style={{alignSelf:'center',backgroundColor:'#fff',borderRadius:0}} progress={this.state.dataWidth} width={55} />
    )
  }
  // <Progress.Bar style={{alignSelf:'center',backgroundColor:'#fff',borderRadius:0}} progress={this.props.dataUpdateSection.width} width={55} />

  renderImage(rowData,baseUrl){
    // console.log(this.mozerfucker());
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
          {rowData.pdf.slice(0,2)} {rowData.pdf.slice(7,11)}
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
        {rowData.pdf.slice(0,2)} {rowData.pdf.slice(7,11)}
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
    paddingLeft: 10,
    margin: 5,
    marginBottom: 15,
    marginTop: 15,
    width: 105,
    height: 130,
    alignItems: 'center',
    borderColor: '#CCC'
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
  text: {
    textAlign:'center',
    color: 'black',
    fontSize: 10,
    bottom: 0,
    width: 70
  },
});
const mapStateToProps = ({ miniRow }) => {
  const { dataUpdateSection,widthSection,dataUpdateQueue,queue } = miniRow;
  // console.log(dataUpdateQueue);
  return { dataUpdateSection,widthSection,dataUpdateQueue,queue };
};
export default connect(mapStateToProps,{ updateRowSection,updateQueue })(MiniRowSection);
