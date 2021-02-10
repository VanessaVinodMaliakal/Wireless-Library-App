import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList  } from 'react-native';
import firebase from 'firebase'
import db from '../Config.js'

export default class Search extends React.Component {
  constructor(){
    super()
    this.state={
      text : '',
      allTransactions : '',
      lastTransactions : ''
    }
  }
  searchTransactions=async()=>{
    var textArr = this.state.text.split('')
    if (textArr[0] == 'b'){
      const docList = await db.collection('transactions').where('bookID','==',this.state.text).limit(15).get()
      console.log(docList,"Florence")
      if(docList.docs.length != 0){
        var docArr = []
        docList.docs.map((doc)=>{
          var docData = doc.data()
          docArr.push(docData)
          this.setState({
            lastTransactions: doc
          })
        })
        
        this.setState({
            allTransactions : docArr
          })
        }
        console.log(this.state.allTransactions,"Bency")
        console.log(this.state.lastTransactions,"Tency")
    }
  else{
      const docList = await db.collection('transactions').where('studentID','==',this.state.text).limit(15).get()
      if (docList.docs.length != 0){
        var docArr = []
        docList.docs.map((doc)=>{
          var docData = doc.data()
          this.setState({
            lastTransactions: doc
          })
          docArr.push(docData)
        })
      }
      
      this.setState({
        allTransactions : docArr
      })
    }
    console.log(textArr)
    
  }
  searchMoreTransactions=async()=>{
    console.log("Vanessa")
    var textArr = this.state.text.split('')
    if (textArr[0] == 'b'){
      const docList = await db.collection('transactions').where('bookID','==',this.state.text).startAfter(this.state.lastTransactions).limit(15).get()
      if(docList.docs.length != 0){
        var docArr = []
        docList.docs.map((doc)=>{
          var docData = doc.data()
          docArr.push(docData)
          this.setState({
            lastTransactions: doc,
            allTransactions : [...this.state.allTransactions,doc.data()]
          })
        })
        console.log(docArr,'bbbbbbbbbbbbb')
        
        }
    }
  else{
      const docList = await db.collection('transactions').where('studentID','==',this.state.text).startAfter(this.state.lastTransactions).limit(15).get()
      if (docList.docs.length != 0){
        var docArr = []
        docList.docs.map((doc)=>{
          var docData = doc.data()
          this.setState({
            lastTransactions: doc,
            allTransactions : [...this.state.allTransactions,doc.data()]
          })
          docArr.push(docData)
        })
      }
      console.log(docArr,'ssssssssssssss')
      
    }
    console.log(allTransactions,"yfe4fnrt4wg6rh4ty5t4jj454yh")
  }
  render(){
    return (
      <View style={styles.container}>
      <View style={styles.searchBar}>
          <TextInput
          style={styles.bar} 
          placeholder = "Enter bookID or StudentID"
          onChangeText={(text)=>{
            this.setState({
              text : text
            })
            console.log(text)
          }}></TextInput>
          <TouchableOpacity 
          onPress={()=>{
            this.searchTransactions()
            
          }}
          style={styles.searchButton}><Text>Search</Text></TouchableOpacity>
      </View>
      <View>
        <FlatList 
        data ={this.state.allTransactions}
        renderItem={({item})=>{
          return(
            <View style={{borderBottomWidth : 2}}>
              <Text>{item['bookID']}</Text>
              <Text>{item['studentID']}</Text>
              <Text>{item['transactionType']}</Text>
              
            </View>
          )
        }}
        keyExtractor={(item,index)=>{
          index.toString()
        }}
        onEndReachedThreshold={0.7}
        onEndReached={this.searchMoreTransactions}></FlatList>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchBar:{ 
      flexDirection:'row', 
      height:40, 
      width:'auto', 
      marginTop: 200,
      borderWidth:0.5, 
      alignItems:'center', 
      backgroundColor:'grey', 
    }, 
    bar:{ 
      borderWidth:2, 
      height:30,
      width:300, 
      paddingLeft:10, 
    }, 
    searchButton:{ 
      borderWidth:1, 
      height:30, 
      width:80, 
      alignItems:'center', 
      justifyContent:'center', 
      backgroundColor:'green' 
    } 
  });
  