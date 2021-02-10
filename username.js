import * as React from 'react';
import { StyleSheet, Text,TextInput, View, TouchableOpacity } from 'react-native';
import {createSwitchNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
import Transaction from './Screens/transaction.js'
import Search from './Screens/search.js'

export default class LockScreen extends React.Component {
  render(){
    return (
      <View>
          <TextInput placeHolder = 'username'style={styles.inputBox}></TextInput>
          <TextInput placeHolder = 'password'style={styles.inputBox}></TextInput>
          <TouchableOpacity style={styles.submitButton}><Text>Submit</Text></TouchableOpacity>
      </View>
    );
  }
}

// var AppNavigator = createSwitchNavigator({
//   trans:Transaction,
//   search:Search
// })
// const AppContainer = createAppContainer(AppNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayText: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  inputView: {
    flexDirection: 'row',
    margin: 20,
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  scanButton: {
    backgroundColor: '#66BB6A',
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  submitButton: {
    backgroundColor: '#FBC02D',
    width: 100,
    height: 50,
  },
  submitButtonText: {
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
