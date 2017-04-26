import React, { Component } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import GridView from './GridView';
import GridViewWithSection from './GridViewWithSection';
import ViewPdf from './ViewPdf';
// import testGrid from './testGrid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: { flex: 1 },
});

export default class TabViewExample extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
      // { key: '3', title: 'Grid' },
    ],
  };

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderHeader = (props) => {
    return <TabBar style={{ backgroundColor: '#696969' }} {...props} />;
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
