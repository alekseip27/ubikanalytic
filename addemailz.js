{
document.addEventListener("input", () => {
let fld1 = document.querySelector("#textverifiednumber").value;
let fld2 = document.querySelector("#verifiedcode").value;
let fld3 = document.querySelector("#textchestcode").value;
let fld4 = document.querySelector("#googledate").value
let fld5 = document.querySelector("#teamubikconf").value
let fld6 = document.querySelector("#teamubiktest").value;
let cbox1 = (document.querySelector("#checkbox1").checked)
let cbox2 = (document.querySelector("#checkbox2").checked)
let cbox3 = (document.querySelector("#checkbox3").checked)
let cbox4 = (document.querySelector("#checkbox4").checked)
let cbox5 = (document.querySelector("#checkbox5").checked)
let cbox6 = (document.querySelector("#checkbox6").checked)
let cbox7 = (document.querySelector("#checkbox7").checked)
let cbox8 = (document.querySelector("#checkbox8").checked)
let cbox9 = (document.querySelector("#checkbox9").checked)
let cbox10 = (document.querySelector('#checkbox10').checked)

if(!!fld1 && !!fld2 && !!fld3 && !!fld4 && !!fld5 && !!fld6 && !!cbox1 && !!cbox2 && !!cbox3 && !!cbox4 && !!cbox5 && !!cbox6 && !!cbox7 && !!cbox8 && !!cbox9 && !!cbox10) {
$("#buyfake").css("display", "none");
$("#buybtn").css("display", "flex");
}else {
$("#buyfake").css("display", "flex");
$("#buybtn").css("display", "none");
}
})
}


{
var pkid = document.location.href.split('https://www.ubikanalytic.com/email/add?')[1]

var request = new XMLHttpRequest()
let xanoUrl = new URL('https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/getdata_email?search=' + pkid);

request.open('GET', xanoUrl.toString(), true)

request.onload = function() {
var data = JSON.parse(this.response)
if (request.status >= 200 && request.status < 400) {
const itemContainer = document.getElementById("Item-Container")
const item = document.getElementById('samplestyle')

document.querySelector('#emailaddress').textContent =  data[0].Buyer_Emails_Email
document.querySelector('#firstname').textContent =  data[0].Tbl_CC_First
document.querySelector('#lastname').textContent =  data[0].Tbl_CC_Last
document.querySelector('#phonenumber').textContent =  data[0].Tbl_CC_Phone
document.querySelector('#dateofbirth').textContent =  data[0].Tbl_CC_Date_of_Birth
document.querySelector('#gender').textContent =  data[0].Tbl_CC_Gender
document.querySelector('#forwardto').textContent =  data[0].Buyer_Emails_Forward_Address

document.querySelector('#myemail3').textContent = data[0].Buyer_Emails_Email
document.querySelector("#checkbox1").checked = data[0].Buyer_Emails_Dashlane_Added_Name_And_Password
document.querySelector("#checkbox2").checked = data[0].Buyer_Emails_Dashlane_Password_Shared
document.querySelector("#checkbox3").checked = data[0].Buyer_Emails_Textverified_Gmail_Verify_Number
document.querySelector("#checkbox4").checked = data[0].Buyer_Emails_Copy_Phone_Replace_Number
document.querySelector("#checkbox5").checked = data[0].Buyer_Emails_Textchest_Copy_New_Code
document.querySelector("#checkbox6").checked = data[0].Buyer_Emails_Finish_Yes_Im_In
document.querySelector("#checkbox7").checked = data[0].Buyer_Emails_Open_Team_Ubik_And_Copy
document.querySelector("#checkbox8").checked = data[0].Buyer_Emails_Forward_A_Copy_And_Save
document.querySelector("#checkbox9").checked = data[0].Buyer_Emails_Copy_Phrase_And_Send
document.querySelector("#checkbox10").checked = data[0].Buyer_Emails_Uncheck_Cview
document.querySelector("#textverifiednumber").value = data[0].Buyer_Emails_Text_Verified_Number
document.querySelector("#verifiedcode").value = data[0].Buyer_Emails_Google_Verification_Code
document.querySelector("#textchestcode").value = data[0].Buyer_Emails_Textchest_Code
document.querySelector("#googledate").value = data[0].Buyer_Emails_New_Account_Date
document.querySelector("#teamubikconf").value = data[0].Buyer_Emails_Confirmation_Code
document.querySelector("#teamubiktest").value = data[0].Buyer_Emails_Forward_Verify_Date

itemContainer.appendChild(item);
}
}}
request.send()

{
document.querySelector('#buybtn').addEventListener("click", () => {

var http = new XMLHttpRequest();
var url = "https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/email_create";

const email = document.location.href.split('https://www.ubikanalytic.com/email/add?')[1]

let cbox1 = (document.querySelector("#checkbox1").checked)
let cbox2 = (document.querySelector("#checkbox2").checked)
let cbox3 = (document.querySelector("#checkbox3").checked)
let cbox4 = (document.querySelector("#checkbox4").checked)
let cbox5 = (document.querySelector("#checkbox5").checked)
let cbox6 = (document.querySelector("#checkbox6").checked)
let cbox7 = (document.querySelector("#checkbox7").checked)
let cbox8 = (document.querySelector("#checkbox8").checked)
let cbox9 = (document.querySelector("#checkbox9").checked)
let cbox10 = (document.querySelector("#checkbox10").checked)
let fld1 = document.querySelector("#textverifiednumber").value;
let fld2 = document.querySelector("#verifiedcode").value;
let fld3 = document.querySelector("#textchestcode").value;
let fld4 = document.querySelector("#googledate").value
let fld5 = document.querySelector("#teamubikconf").value
let fld6 = document.querySelector("#teamubiktest").value;

const dt = new Date();
let dtt =
dt.toLocaleString('en-US', {
timeZone: 'America/New_York',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
})
let stimestamp = moment(dtt).format('MM/DD/YYYY HH:mm:ss')

let submittedby = document.querySelector("#username").textcontent;


var params = JSON.stringify(

{
"email": email,
"checkbox1": cbox1,
"checkbox2": cbox2,
"checkbox3": cbox3,
"checkbox4": cbox4,
"checkbox5": cbox5,
"checkbox6": cbox6,
"checkbox7": cbox7,
"checkbox8": cbox8,
"checkbox9": cbox9,
"checkbox10": cbox10,
"field1": fld1,
"field2": fld2,
"field3": fld3,
"field4": fld4,
"field5": fld5,
"field6": fld6,
"Submitted_By": submittedby,
"Submitted_Date": stimestamp

})
http.open("PUT", url, true);

http.setRequestHeader("Content-type", "application/json; charset=utf-8");

http.onreadystatechange = function() {
if(http.readyState == 4 && http.status == 200) {
document.querySelector('#loading').style.display = "flex";
document.querySelector('#Item-Container').style.display = "none";

setTimeout(() => {
window.location.href = "/email/queue";
}, 2000);
}
}
http.send(params);
})
}


setTimeout(() => {
document.querySelector('#loading').style.display = "none";
document.querySelector('#Item-Container').style.display = "flex";
{
let curUser = firebase.auth().currentUser;
let myFS = firebase.firestore();
let docRef = myFS.doc("users/" + curUser.uid);
docRef.get().then((docSnap) => {
let data = docSnap.data();
let email = data["Email"];
document.querySelector('#myemail').textContent = email
})}

}, 1500);

{
function copyToClipboard(text) {
var $temp = $("<input>");
$("body").append($temp);
$temp.val(text).select();
document.execCommand("copy");
$temp.remove();
}

document.querySelector('#copyemailclick').addEventListener('click', function() { copyToClipboard("New Email " + document.querySelector('#myemail3').textContent); });

}

{
document.querySelector('#savebtn').addEventListener("click", () => {

var http = new XMLHttpRequest();
var url = "https://x828-xess-evjx.n7.xano.io/api:Bwn2D4w5/email_create_saveprogress";

const email = document.location.href.split('https://www.ubikanalytic.com/email/add?')[1]

let cbox1 = (document.querySelector("#checkbox1").checked)
let cbox2 = (document.querySelector("#checkbox2").checked)
let cbox3 = (document.querySelector("#checkbox3").checked)
let cbox4 = (document.querySelector("#checkbox4").checked)
let cbox5 = (document.querySelector("#checkbox5").checked)
let cbox6 = (document.querySelector("#checkbox6").checked)
let cbox7 = (document.querySelector("#checkbox7").checked)
let cbox8 = (document.querySelector("#checkbox8").checked)
let cbox9 = (document.querySelector("#checkbox9").checked)
let cbox10 = (document.querySelector("#checkbox10").checked)

let fld1 = document.querySelector("#textverifiednumber").value;
let fld2 = document.querySelector("#verifiedcode").value;
let fld3 = document.querySelector("#textchestcode").value;
let fld4 = document.querySelector("#googledate").value
let fld5 = document.querySelector("#teamubikconf").value
let fld6 = document.querySelector("#teamubiktest").value;

const dt = new Date();
let dtt =
dt.toLocaleString('en-US', {
timeZone: 'America/New_York',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
})
let stimestamp = moment(dtt).format('MM/DD/YYYY HH:mm:ss')

let submittedby = document.querySelector("#username").textcontent;

var params = JSON.stringify(

{
"email": email,
"checkbox1": cbox1,
"checkbox2": cbox2,
"checkbox3": cbox3,
"checkbox4": cbox4,
"checkbox5": cbox5,
"checkbox6": cbox6,
"checkbox7": cbox7,
"checkbox8": cbox8,
"checkbox9": cbox9,
"checkbox10": cbox10,
"field1": fld1,
"field2": fld2,
"field3": fld3,
"field4": fld4,
"field5": fld5,
"field6": fld6,
"Submitted_By": submittedby,
"Submitted_Date": stimestamp

})
http.open("PUT", url, true);

http.setRequestHeader("Content-type", "application/json; charset=utf-8");

http.onreadystatechange = function() {
if(http.readyState == 4 && http.status == 200) {
}
}
http.send(params);
})
}
