import React, { Component } from 'react';
import { View, NetInfo } from 'react-native';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Header } from './components/common';
import reducers from './reducers';
import TabViewExample from './components/TabViewExample';


class App extends Component {
  componentWillMount(){

  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange);
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
  }
  handleConnectivityChange = (isConnected) => {
    // console.log('fick');
    console.log(isConnected);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
      <View style={{ flex: 1 }}>
        <Header headerText="Document Library" />
        <TabViewExample />
      </View>
      </Provider>
    );
  }
}

export default App;
