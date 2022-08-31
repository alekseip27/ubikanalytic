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
        let orderh = data["orderhistory"]

          firebase.firestore().doc("users/" + firebase.auth().currentUser.uid).set({ Timestamp: timestamp }, { merge: true });

if(!!admin) {
$('#adminlogo').show()
$('#eventsdropdown').css('display','flex');
$('#events').css('display','flex');
$('#addevent').css('display','flex');
 
$('#buying').css('display','flex');
$('#queue').css('display','flex');
$('#history').css('display','flex');
$('#errorlog').css('display','flex');
 
$('.main-confirm-button').css('display','flex');
 
$('#normalplaceholder').css('display','none');
$('#adminplaceholder').css('display','block');


$('#stats').css('display','flex');

$('#emaildropdown').css('display','flex');
$('#create-emails').css('display','flex');
$('#manage-emails').css('display','flex');


}

if(!!buyer) {
$('#buyerlogo').show()
$('#eventsdropdown').css('display','flex');
$('#addevent').css('display','flex');
 
$('#buying').css('display','flex');
$('#emaildropdown').css('display','flex');
$('#queue').css('display','flex');
$('#history').css('display','flex');
$('#errorlog').css('display','flex');
}

if(!!buyer && window.location.href.includes('/events')) {
location.href = '/buy-queue'
}

if(!!entry) {
$('#entrylogo').show()
$('#eventsdropdown').css('display','flex');
$('#addevent').css('display','flex');
$('#emaildropdown').css('display','flex');
$('#buying').css('display','flex');
$('#history').css('display','flex');
}


if(!!orderh){
$('#orderhlogo').show()
$('#buying').css('display','flex');
$('#history').css('display','flex');
}
        
if(!!entry && (window.location.href.includes('/events') || window.location.href.includes('/buy-queue'))) {
location.href = '/order-history'
}

if(!!orderh && (window.location.href.includes('/events') || window.location.href.includes('/buy-queue'))) {
location.href = '/order-history'
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
