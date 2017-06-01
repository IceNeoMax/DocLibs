import React, { Component } from 'react';
import { View, StyleSheet,Text,Platform,TouchableOpacity,ScrollView,NetInfo } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import GridView from './GridView';
import GridViewWithSection from './GridViewWithSection';
import ViewPdf from './ViewPdf';
// import { connect } from 'react-redux';

// import { netChange } from '../actions';
// import testGrid from './testGrid';

const styles = StyleSheet.create({

  tabbar: {
    backgroundColor: '#4D4D4D',
  },
  tab: {
    justifyContent: 'center',
    borderColor: '#eee',
    borderRadius: 6,
    margin: 5
  },
  container: {
    flex: 1,
  },
  page: { flex: 1 },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#4D4D4D',
  },
  tabTextStyle : {
      fontSize : 14,
      color: '#fff',
      padding: 8,
      backgroundColor: 'transparent'
  },
});

class TabViewExample extends Component {
  //   componentWillMount() {
  //    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange);
  //  }
   //
  //  componentWillUnmount() {
  //    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
  //  }

  //  handleConnectivityChange = (isConnected) => {
  //   //  console.log(isConnected);
  //    this.props.netChange(isConnected);
  //   //  console.log(this.props.isConnected);
  //  };
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'ANNUAL' },
      { key: '2', title: 'QUARTERLY' },
      // { key: '3', title: 'Grid' },
    ],
  };
  // setBorder(index){
  //   this.setState({ index });
  // }
  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderHeader = (props) => {
    let tabView = [];
    this.state.routes.forEach((item,index) => {
      tabView.push(
        <TouchableOpacity key={index} style={[styles.tab,{borderWidth: (this.state.index == index) ? 1 : 0}]}  onPress={() => this.handleChangeTab(index)}>
                  <View key={index}>

                      <Text key={index} style={styles.tabTextStyle}>{item.title}</Text>

                    </View>
         </TouchableOpacity>
                    )
    }
    )

    return (
      <View style={styles.tabsContainer}>
        {tabView}
      </View>
    )
    // return <TabBar {...props}
    //     renderIndicator={()=> {return null}}
    //     tabStyle={styles.tab}
    //     style={styles.tabbar}/>;
  };

  renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return (
        <View style={[styles.page]}>
          <GridView />
        </View>
    );
    case '2':
      return (
        <View style={[styles.page]}>
        <GridViewWithSection />
        </View>
      );
      // case '3':
      //   return (
      //     <View style={[styles.page]}>
      //     <ViewPdf />
      //     </View>
      //   );
    default:
      return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onRequestChangeTab={this.handleChangeTab}
        ref={p => this.tabView = p}
      />
    );
  }
}
// const mapStateToProps = ({miniRow}) => {
//   const { isConnected } = miniRow;
//   // console.log(downloadLength);
//   return { isConnected };
// };
export default TabViewExample;
