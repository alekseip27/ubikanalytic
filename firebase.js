const firebaseConfig = {
  apiKey: "AIzaSyBCW9c1Wmkiw7H2I0ibWzuGAB4WEI8cIaU",
  authDomain: "ubik-analytic.firebaseapp.com",
  projectId: "ubik-analytic",
  storageBucket: "ubik-analytic.appspot.com",
  messagingSenderId: "669494520220",
  appId: "1:669494520220:web:134d91d840aa725e630059"
};

const thnd = new Date();
let thn = 
  thnd.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })


const userName = document.querySelector("#userName");
const email = document.querySelector("#email");
const signOutButton = document.querySelector("#signOutButton");
let timestamp = moment(thn).format('MM/DD/YYYY HH:mm:ss')

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const authChanged = firebase.auth().onAuthStateChanged((user) => {
  const signout = () => {
    auth.signOut();
  };
  signOutButton.addEventListener("click", signout);

  auth.onAuthStateChanged(async (user) => {
    let currentPath = window.location.pathname;
    if (user) {
      let curUser = firebase.auth().currentUser;
      let myFS = firebase.firestore();
      let docRef = myFS.doc("users/" + curUser.uid);
      docRef.get().then((docSnap) => {
        let data = docSnap.data();
        let name = data["Name"];
        let email = data["Email"];
        let profileuid = curUser.uid;
        let admin = data["admin"];
        let buyer = data["buyer"];
        let entry = data["entry"];

          firebase.firestore().doc("users/" + firebase.auth().currentUser.uid).set({ Timestamp: timestamp }, { merge: true });

if(!!admin) {
$('#events').show()
$('#buying').show()
$('#history').show()
$('#addevent').show()
}

if(!!buyer) {
$('#buying').show()
$('#history').show()
$('#addevent').show()
}

if(!!entry) {
$('#history').show()
$('#addevent').show()
}

if(!!entry && (window.location.href.includes('/events' || window.location.href.includes('/buy-queue' ) {
auth.signOut();
location.href = '/login'
}

if(!!buyer && (window.location.href.includes('/events') {
auth.signOut();
location.href = '/login'
}



       if (!!email) {
          $("#email").html(email);
        } else {
          firebase
            .firestore()
            .doc("users/" + firebase.auth().currentUser.uid)
            .set({ Email: user.email }, { merge: true });
        }

        if (!!name) {
          $("#username").html(name);
        } else {
          firebase
            .firestore()
            .doc("users/" + firebase.auth().currentUser.uid)
            .set({ Name: user.displayName }, { merge: true });
          {
            setTimeout(() => {
              window.location.href = "/events";
            }, 2000);
          }
          $("#username").html(name);
        }
        
        let firstletter = name.substring(0, 1);
        $(".firstletter").html(firstletter);
        

      });
    } else {
    auth.signOut();
location.href = '/login'
    }})})
