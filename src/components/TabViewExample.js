import React, { Component } from 'react';
import { View, StyleSheet,Text,Platform } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import GridView from './GridView';
import GridViewWithSection from './GridViewWithSection';
import ViewPdf from './ViewPdf';
// import testGrid from './testGrid';

const styles = StyleSheet.create({

  tabbar: {
    backgroundColor: '#4D4D4D',
  },
  tab: {
    opacity: 1,
    width: 100,
    margin:10,
    padding:-50,
    // paddingHorizontal:-25,
    borderRadius:10,
    borderWidth:1,
    borderColor:'white'
  },
  container: {
    flex: 1,
  },
  page: { flex: 1 },
});

export default class TabViewExample extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Annual' },
      { key: '2', title: 'Quaterly' },
      // { key: '3', title: 'Grid' },
    ],
  };

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderHeader = (props) => {
    return <TabBar {...props} pressColor="rgba(255, 64, 129, .5)" tabStyle={styles.tab}
        style={styles.tabbar}/>;
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
      />
    );
  }
}
