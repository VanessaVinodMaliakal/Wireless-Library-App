import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
import Transaction from './Screens/transaction.js'
import Search from './Screens/search.js'

export default class App extends React.Component {
  render(){
    return (
      <AppContainer/>
    );
  }
}

var TabNavigator = createBottomTabNavigator({
  trans:Transaction,
  search:Search
})
const AppContainer = createAppContainer(TabNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
