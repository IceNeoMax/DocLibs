import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Header } from './components/common';
import reducers from './reducers';
import TabViewExample from './components/TabViewExample';


class App extends Component {
  componentWillMount() {

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
