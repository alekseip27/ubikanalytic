
document.getElementById('source').addEventListener('change', async function () {
    const selectedSource = this.value;
    if (!selectedSource) return;
    try {
        const response = await fetch(`https://shibuy.co:8443/getinputdata?path=${selectedSource}`);
        const headerRows = await response.json();
        const columnSelect = document.getElementById('column');
        columnSelect.innerHTML = '';
        
        // Sort the header rows alphabetically
        headerRows.sort((a, b) => a.localeCompare(b));

        for (const columnName of headerRows) {
            const option = document.createElement('option');
            option.text = columnName;
            columnSelect.add(option);
        }
    } catch (error) {
        console.error('Error fetching column data:', error);
    }
});

async function fetchFileNames() {
    try {
        const response = await fetch('https://shibuy.co:8443/dropboxbearer');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const fileNames = await response.json();
        return fileNames;
    } catch (error) {
        console.error('Error fetching file names:', error);
        return [];
    }
}

async function populateSelect() {
    try {
        const fileNames = await fetchFileNames();

        // Sort the file names alphabetically
        fileNames.sort((a, b) => a.localeCompare(b));

        const selectElement = document.getElementById('source');
        const selectElement2 = document.getElementById('sourcetwo');
        
        // Clear options from both select elements
        selectElement.innerHTML = '';
        selectElement2.innerHTML = '';
        
        // Keep the option with no value at the top
        const noValueOption = document.createElement('option');
        noValueOption.text = 'Select source...';
        noValueOption.value = '';
        selectElement.appendChild(noValueOption);

        fileNames.forEach((fileName) => {
            const option = document.createElement('option');
            option.text = fileName;
            option.value = fileName;
            selectElement.appendChild(option);
            const option2 = option.cloneNode(true);
            selectElement2.appendChild(option2);
        });

        // Sort the options alphabetically for the source select element
        Array.from(selectElement.options).slice(1).sort((a, b) => a.text.localeCompare(b.text)).forEach(option => {
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching file names:', error);
    }
}

document.querySelector('#updatecolumn').addEventListener('click', function () {
    document.querySelector('.final').style.display = 'flex';
    const sourceSelect = document.getElementById("column");
    const targetSelect = document.getElementById("final_column");

    const optionsArray = Array.from(sourceSelect.options);

    optionsArray.sort((a, b) => a.text.localeCompare(b.text));

    targetSelect.innerHTML = '';

    optionsArray.forEach(option => {
        const newOption = document.createElement('option');
        newOption.text = option.text;
        newOption.value = option.value;
        targetSelect.appendChild(newOption);
    });
});

document.addEventListener('DOMContentLoaded', populateSelect);



document.querySelector('#updatecolumn').addEventListener('click',function(){
document.querySelector('.final').style.display = 'flex'
const sourceSelect = document.getElementById("column");
const targetSelect = document.getElementById("final_column");
for (const option of sourceSelect.options) {
const newOption = document.createElement('option');
newOption.text = option.text;
newOption.value = option.value;
targetSelect.appendChild(newOption);
}
})
function checkifog(){
var ruleBoxes = document.querySelectorAll(".main-box-details");
var ruleBoxCount = 0;
ruleBoxes.forEach(function (ruleBox) {
ruleBoxCount++
})
if (ruleBoxCount === 1) {
document.querySelector('.deletelabelingrule').style.display = 'none'
document.querySelector('#addbutton').style.display = 'flex'
document.querySelector('#addbuttonor').style.display = 'flex'
document.querySelector('#updatecolumn').style.display = 'flex'
document.getElementById("rule-box").setAttribute('condition','none');
}}
setInterval(checkifog, 1000);
document.getElementById("addbutton").style.pointerEvents = "none";
document.getElementById("addbuttonor").style.pointerEvents = "none";
document.getElementById("updatecolumn").style.pointerEvents = "none";
var field1 = document.querySelector("#source");
var field2 = document.querySelector("#column");
var field3 = document.querySelector("#contains");
var addButton = document.getElementById("addbutton");
var addButtonor = document.getElementById("addbuttonor");
var columnButton = document.getElementById("updatecolumn");
var whenInput = document.querySelector("#when");
field1.addEventListener("input", checkFields);
field2.addEventListener("input", checkFields);
field3.addEventListener("input", checkFields);
whenInput.addEventListener("input", checkFields);

function checkFields() {
var whenValue = whenInput.value;
if ((whenValue === "blank" && field1.value.length > 0 && field2.value.length > 0) ||
(field1.value.length > 0 && field2.value.length > 0 && field3.value.length>0 && (whenValue.includes("contains") || whenValue.includes("does-not-contain")  || whenValue === "equal"))
) {
addButton.style.pointerEvents = "auto";
addButtonor.style.pointerEvents = "auto";
columnButton.style.pointerEvents = "auto";
} else {
addButton.style.pointerEvents = "none";
addButtonor.style.pointerEvents = "none";
columnButton.style.pointerEvents = "none";
}
}

var latestClonedRuleBox = null;
function handleDeleteButtonDisplay(clonedRuleBox, latestClonedRuleBox) {
const deletebtn = clonedRuleBox.querySelector('.deletelabelingrule');
if (deletebtn) {
deletebtn.style.display = 'flex';

if (latestClonedRuleBox) {
const prevDeleteButton = latestClonedRuleBox.querySelector('.deletelabelingrule');
if (prevDeleteButton) {
prevDeleteButton.style.display = 'none';
}}}}
function onDeleteClonedRuleBox(clonedRuleBox) {
const prevClone = clonedRuleBox.previousElementSibling;
const prevdatacleaningbtn = prevClone.querySelector(".datacleaning");
const prevorbtn = prevClone.querySelector(".orcondition");

if (clonedRuleBox.getAttribute('condition') === 'or') {
prevdatacleaningbtn.style.display = 'none';
prevorbtn.style.display = 'flex';
}
if (clonedRuleBox.getAttribute('condition') === 'and') {
prevdatacleaningbtn.style.display = 'flex';
prevorbtn.style.display = 'none';
}

const prevDeleteButton = prevClone.querySelector('.deletelabelingrule');
if (prevDeleteButton) {
prevDeleteButton.style.display = 'flex';
}

clonedRuleBox.remove();
latestClonedRuleBox = prevClone; 
}

document.addEventListener("click", function (event) {
if (event.target.classList.contains("datacleaning")) {
const ruleBox = event.target.closest(".main-box-details");

if (ruleBox) {
ruleBox.setAttribute("condition", event.target.classList.contains("orcondition") ? "or" : "and");
const clonedRuleBox = ruleBox.cloneNode(true);
handleDeleteButtonDisplay(clonedRuleBox, latestClonedRuleBox);
latestClonedRuleBox = clonedRuleBox;

clonedRuleBox.id = '';
ruleBox.insertAdjacentElement("afterend", clonedRuleBox);

const buttonsToHide = ['.updatecolumn', '.datacleaning', '.orcondition'];
buttonsToHide.forEach(selector => {
const btn = ruleBox.querySelector(selector);
if (btn) {
btn.style.display = 'none';
}
});

const datacleaningbutton = clonedRuleBox.querySelector('.datacleaning');
const or_btn = clonedRuleBox.querySelector('.orcondition');

if (clonedRuleBox.getAttribute('condition') === 'or') {
datacleaningbutton.style.display = 'none';
or_btn.style.display = 'flex';
}
if (clonedRuleBox.getAttribute('condition') === 'and') {
datacleaningbutton.style.display = 'flex';
or_btn.style.display = 'none';
}

const deleteLabelingRuleButton = clonedRuleBox.querySelector(".deletelabelingrule");
if (deleteLabelingRuleButton) {
deleteLabelingRuleButton.addEventListener('click', () => onDeleteClonedRuleBox(clonedRuleBox));
}

const updateColumnButton2 = clonedRuleBox.querySelector(".updatecolumn");
updateColumnButton2.addEventListener('click', function () {
document.querySelector('.final').style.display = 'flex';
const sourceSelect = document.getElementById("column");
const targetSelect = document.getElementById("final_column");

for (const option of sourceSelect.options) {
const newOption = document.createElement('option');
newOption.text = option.text;
newOption.value = option.value;
targetSelect.appendChild(newOption);
}
});

const elementsToRemove = ['.heading', '.sourcebar'];
elementsToRemove.forEach(selector => {
const element = clonedRuleBox.querySelector(selector);
if (element) {
element.remove();
}
});

const datacleaningbuttonor = clonedRuleBox.querySelector('.orcondition');;
const updatecolumnbtn = clonedRuleBox.querySelector('.updatecolumn');

datacleaningbutton.style.pointerEvents = "none";
datacleaningbuttonor.style.pointerEvents = "none";
updatecolumnbtn.style.pointerEvents = "none";

const cloneColumn = clonedRuleBox.querySelector('.column');
const cloneWhen = clonedRuleBox.querySelector('.actionbox');
const cloneContains = clonedRuleBox.querySelector('.containsbox');

 
function updatePointerEvents() {
if (cloneWhen.value === 'contains' || cloneWhen.value === 'does-not-contain' || cloneWhen.value === 'equal') {
cloneContains.style.display = 'block';
cloneWhen.classList.add('contains');
} else {
cloneContains.style.display = 'none';
cloneWhen.classList.remove('contains');
}
if (
(cloneColumn.value.length > 0 && cloneWhen.value.length > 0 && cloneWhen.value === 'blank') ||
(cloneColumn.value.length > 0 && cloneContains.value.length > 0 && (cloneWhen.value.includes("contains") || cloneWhen.value.includes("does-not-contain") || cloneWhen.value === "equal"))
) {
datacleaningbutton.style.pointerEvents = "auto";
datacleaningbuttonor.style.pointerEvents = "auto";
updatecolumnbtn.style.pointerEvents = "auto";
} else {
datacleaningbutton.style.pointerEvents = "none";
datacleaningbuttonor.style.pointerEvents = "none";
updatecolumnbtn.style.pointerEvents = "none";
}}

cloneColumn.addEventListener('input', updatePointerEvents);
cloneWhen.addEventListener('input', updatePointerEvents);
cloneContains.addEventListener('input', updatePointerEvents);
