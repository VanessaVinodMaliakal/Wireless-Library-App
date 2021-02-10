import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../Config.js';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast'

export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      bookID: '',
      studentID: '',
      buttonState: 'Normal',
      scanned: false,
    };
  }
  getCameraPermission = async (ID) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    console.log(status === 'granted');
    this.setState({
      hasCameraPermission: status === 'granted',
      buttonState: ID,
      scanned: false,
    });
  };
  handleBarCode = async ({ type, data }) => {
    console.log(data);
    if (this.state.buttonState == 'bookID') {
      this.setState({
        bookID: data,
        scanned: true,
        buttonState: 'Normal',
      });
      console.log(this.state.bookID);
    } else {
      this.setState({
        studentID: data,
        scanned: true,
        buttonState: 'Normal',
      });
    }
  };
  handleBookIssue() {
    db.collection('transactions').add({
      studentID: this.state.studentID,
      bookID: this.state.bookID,
      transactionType: 'issue',
      date: firebase.firestore.Timestamp.now().toDate(),
    });
    console.log('a');
    db.collection('books').doc(this.state.bookID).update({
      bookAvailability: false,
    });
    db.collection('students')
      .doc(this.state.studentID)
      .update({
        NoOfBooksIssued: firebase.firestore.FieldValue.increment(1),
      });
    this.setState({
      studentID: '',
      bookID: '',
    });
  }

  handleBookReturn() {
    db.collection('transactions').add({
      studentID: this.state.studentID,
      bookID: this.state.bookID,
      transactionType: 'return',
      date: firebase.firestore.Timestamp.now().toDate(),
    });
    console.log('a');
    db.collection('books').doc(this.state.bookID).update({
      bookAvailability: true,
    });
    db.collection('students').doc(this.state.studentID).update({
      NoOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
    })

    this.setState({
      studentID: '',
      bookID: '',
    });
    
  }

  handleTransactions = async () => {
    //db.collection("books").doc(this.state.bookID).get().then((doc)=>{
    // console.log(doc.data())
    //})
    var transactionType = await this.checkBookEligibility();
    console.log(studentEligible,"Vanessa")
    console.log(transactionType, 'ghfegdyetey');
    if (transactionType === 'issue') {
      var studentEligible = await this.checkStudentEligibilityForBookIssue()
      if (studentEligible == true){
        this.handleBookIssue();
      Toast.show("Book issued")
      }
    } else {
      this.checkStudentEligibilityForBookReturn()
      this.handleBookReturn();
      Toast.show("Book returned")
    }
  };
  checkBookEligibility = async () => {
    var transactionType = '';
    const docList = await db
      .collection('books')
      .where('bookID', '==', this.state.bookID)
      .get();
    console.log(this.state.bookID, '****');
    if (docList.docs.length !== 0) {
      docList.docs.map((doc) => {
        var docData = doc.data();
        console.log(docData);
        if (docData['bookAvailability'] == true) {
          transactionType = 'issue';
        } else {
          transactionType = 'return';
        }

        console.log('67', transactionType);
      });
    }
    return transactionType;
  };
  checkStudentEligibilityForBookIssue=async()=>{
    var studentEligible = true
    const docList = await db.collection('students').where('StudentID','==',this.state.studentID).get()
    console.log(docList.docs.length,"console")
    console.log(this.state.studentID,"nysa")
    if(docList.docs.length !== 0){
      studentEligible = true
      docList.docs.map((doc)=>{
        console.log(doc.data(),"*****************")
        var docData = doc.data()
        if(docData['NoOfBooksIssued'] >= 3){
          Alert.alert("You can't issue more than 3 books")
          studentEligible = false
        }
    })
    }
    else{
      studentEligible = false
      Alert.alert("Student is not eligible")
    }
    return studentEligible
  }
  checkStudentEligibilityForBookReturn=async()=>{
    var isStudentEligible = true
    const docList = await db.collection('transactions').where('bookID','==',this.state.bookID).limit(1).get()
    //console.log(docList.docs,'Vanessa')
    if(docList.docs.length !== 0){
      docList.docs.map((doc)=>{
        var docData = doc.data()
        //console.log(docData,"0000000000000000",docData[studentID],this.state.studentID)
        if(docData['studentID'] == this.state.studentID){
          isStudentEligible = true
        }
        else{
          isStudentEligible = false
          Alert.alert("this book was'nt issued by this student")
          this.setState({
            studentID : '',
            bookID : ''
          })
        }
      })
    }
    return isStudentEligible
  }
  

  render() {
    if (
      this.state.hasCameraPermission == true &&
      this.state.buttonState !== 'Normal'
    ) {
      return (
        <BarCodeScanner
          onBarCodeScanned={
            this.state.scanned == true 
            ? undefined 
            : this.handleBarCode
          }
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (this.state.buttonState == 'Normal') {
      return (
        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              onChangeText={(text) => {
                this.setState({
                  studentID: text,
                });
              }}
              value={this.state.studentID}
              placeholder="studentID"></TextInput>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermission('studentID');
              }}>
              <Text style={styles.buttonText}>scan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              onChangeText={(text) => {
                this.setState({
                  bookID: text,
                });
              }}
              value={this.state.bookID}
              placeholder="book ID"></TextInput>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermission('bookID');
              }}>
              <Text>scan</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.handleTransactions}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  
  
  