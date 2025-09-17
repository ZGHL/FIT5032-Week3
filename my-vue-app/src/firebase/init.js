import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1xBQ8LM0NLlg-xwzyyrrX0d7tQOKyQ3U",
  authDomain: "week7-guohouzhang.firebaseapp.com",
  projectId: "week7-guohouzhang",
  storageBucket: "week7-guohouzhang.firebasestorage.app",
  messagingSenderId: "85043116688",
  appId: "1:85043116688:web:979ad39464f8ba7763b615"
};


// Initialize Firestore
initializeApp(firebaseConfig);
const db = getFirestore();
export default db