import firebase from 'firebase'
  var firebaseConfig = {
    apiKey: "AIzaSyDZQsCH17-b07n1_nigKNv4RhWJL90ZB1g",
    authDomain: "wily-10450.firebaseapp.com",
    projectId: "wily-10450",
    storageBucket: "wily-10450.appspot.com",
    messagingSenderId: "997983483176",
    appId: "1:997983483176:web:a907138bc82a1e999dcc1d"
  };
  if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
  }
export default firebase.firestore()
