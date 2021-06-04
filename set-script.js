// Dependencies 
const {
    ipcRenderer,
    MenuItem
} = require('electron');
const Store = require('electron-store');
const os = require('os');
const fs = require('fs');
const lineReader = require('line-reader');

// Database or (persistent) local storage
const db = new Store();

// Session storage
var tempdb = sessionStorage;

// Global variables
var payload = {
    type: "STARTUP",
    payload: "system has started..."
};
var returnPayload;
var percentageUsed = 0;
var percentageAvailable = 100;
var tokenSize = 1;
var setList = 0;

// Functions
function remove(el) {
    document.getElementById(el).remove()
}

// IPC startup message, to see how fast everything is running
returnPayload = ipcRenderer.sendSync('synchronous-message', JSON.stringify(payload));
console.log(JSON.parse(returnPayload))

// Check for setlist.txt on startup
fs.readFile('./setlist.txt', (err, data) => {

    // if theres an error, log it because we dont care, lineReader 
    if (err) console.log(err)

    // get the token list from the DOM
    var tokenList = document.getElementById('token-list');

    // test if its a name or a token input
    // use a module called lineReader to read the setlist.txt, it gives an anonymous function with two parameters as the return value
    lineReader.eachLine('./setlist.txt', (line, last) => {
        
        var isToken = line.split('').includes('|');

        if (!isToken) {
            document.getElementById('name-input').value = line;
        }

        // split our lines up by their respective dividers, it could be easier with json, but this works
        var stringArr = line.split('|');

        // dom creation 
        var outerDiv = document.createElement('div');
        outerDiv.className = 'columns'
        var tokenElement = document.createElement('li');
        var coininputDiv = document.createElement('div');
        var buttoninputDiv = document.createElement('div');
        var deleteButton = document.createElement('button');
        var weightinputDiv = document.createElement('div');
        var quantityinputDiv = document.createElement('div');
        var coinInput = document.createElement('input');
        var weightInput = document.createElement('input');
        var quantityInput = document.createElement('input');
        var tokenListLength = document.getElementById("token-list").getElementsByTagName("li").length

        tempdb.setItem((parseInt(tokenListLength) + 1).toString(), JSON.stringify({
            'name': stringArr[0],
            'weight': stringArr[1],
            'quantity': stringArr[2]
        }))

        // setting id names
        tokenElement.id = (parseInt(tokenListLength) + 1).toString();
        deleteButton.id = (parseInt(tokenListLength) + 1).toString()

        // setting class names
        tokenElement.className = "list__item"
        coininputDiv.className = 'column'
        coinInput.className = 'coin-input'
        buttoninputDiv.className = 'column'
        deleteButton.className = 'button is-danger is-light'
        weightinputDiv.className = 'column'
        weightInput.className = 'percentage-input'
        weightInput.id = 'perinput-'+(parseInt(tokenListLength) + 1).toString();
        quantityinputDiv.className = 'column'
        quantityInput.className = 'quantity-input'
        quantityInput.id = 'quaninput-'+(parseInt(tokenListLength) + 1).toString();

        // setting listeners
        deleteButton.addEventListener('click', function (e) {
            e.currentTarget.parentNode.parentNode.parentNode.remove();
            document.getElementById('weight-available').innerHTML = parseFloat(document.getElementById('weight-available').innerHTML) + parseFloat(stringArr[1], )
            document.getElementById('weight-used').innerHTML = parseFloat(document.getElementById('weight-used').innerHTML) - parseFloat(stringArr[1])
        }, false);

        // setting values
        coinInput.value = stringArr[0]
        weightInput.value = stringArr[1].replace('%', '')
        quantityInput.value = stringArr[2]
        deleteButton.innerHTML = 'Delete'


        // calculations for percentage weightings
        document.getElementById('weight-available').innerHTML = parseFloat(document.getElementById('weight-available').innerHTML) - parseFloat(stringArr[1], )
        document.getElementById('weight-used').innerHTML = parseFloat(document.getElementById('weight-used').innerHTML) + parseFloat(stringArr[1])

        // append token 
        outerDiv.appendChild(coininputDiv);
        coininputDiv.appendChild(coinInput);
        outerDiv.appendChild(buttoninputDiv);
        buttoninputDiv.appendChild(deleteButton);
        outerDiv.appendChild(weightinputDiv);
        weightinputDiv.appendChild(weightInput);
        outerDiv.appendChild(quantityinputDiv);
        quantityinputDiv.appendChild(quantityInput);
        tokenElement.appendChild(outerDiv);
        tokenList.appendChild(tokenElement);
        console.log("Adding token... " + stringArr[0])

        // log the successful message
        console.log('Added successfully...')
    });
});

// DOM listeners
document.getElementById('add-token').onclick = function () {

    // token input variables
    var tokenInput = document.getElementById('token-input').value;
    var tokenWeight = document.getElementById('token-weight').value;
    var tokenQuantity = document.getElementById('token-quantity').value;
    var tokenListLength = document.getElementById("token-list").getElementsByTagName("li").length

    // set the session storage
    tempdb.setItem((parseInt(tokenListLength) + 1).toString(), JSON.stringify({
        'name': tokenInput,
        'weight': tokenWeight,
        'quantity': tokenQuantity
    }))

    // dom creation 
    var tokenList = document.getElementById('token-list');

    // data validation
    if (parseFloat(tokenQuantity) && parseFloat(tokenWeight)) {
        if (Math.sign(parseFloat(document.getElementById('weight-available').innerHTML) - parseFloat(tokenWeight)) != -1) {

            // dom creation 
            var outerDiv = document.createElement('div');
            outerDiv.className = 'columns'
            var tokenElement = document.createElement('li');
            var coininputDiv = document.createElement('div');
            var buttoninputDiv = document.createElement('div');
            var deleteButton = document.createElement('button');
            var weightinputDiv = document.createElement('div');
            var quantityinputDiv = document.createElement('div');
            var coinInput = document.createElement('input');
            var weightInput = document.createElement('input');
            var quantityInput = document.createElement('input');
            var tokenListLength = document.getElementById("token-list").getElementsByTagName("li").length

            tempdb.setItem((parseInt(tokenListLength) + 1).toString(), JSON.stringify({
                'name': tokenInput,
                'weight': tokenWeight,
                'quantity': tokenQuantity
            }))

            // setting id names
            tokenElement.id = (parseInt(tokenListLength) + 1).toString();

            // setting class names
            tokenElement.className = "list__item"
            coininputDiv.className = 'column'
            coinInput.className = 'coin-input'
            buttoninputDiv.className = 'column'
            deleteButton.className = 'button is-danger is-light'
            deleteButton.id = (parseInt(tokenListLength) + 1).toString()
            weightinputDiv.className = 'column'
            weightInput.className = 'percentage-input'
            weightInput.id = 'perinput-'+(parseInt(tokenListLength) + 1).toString();
            quantityinputDiv.className = 'column'
            quantityInput.className = 'quantity-input'
            quantityInput.id = 'quaninput-'+(parseInt(tokenListLength) + 1).toString();

            // setting values
            coinInput.value = tokenInput
            weightInput.value = tokenWeight
            quantityInput.value = tokenQuantity
            deleteButton.innerHTML = 'Delete'

            // setting listeners
            quantityInput.addEventListener('change', function (e) {
                var oldVal = JSON.parse(tempdb.getItem((parseInt(tokenListLength) + 1).toString()));

                var percentOfChange = parseFloat(this.value) / parseFloat(oldVal.quantity);
                var newWeight = parseFloat(oldVal.weight) * percentOfChange;

                document.getElementById('weight-used').innerHTML = (parseFloat(document.getElementById('weight-used').innerHTML) - parseFloat(oldVal.weight)).toFixed(2);
                document.getElementById('weight-used').innerHTML = (parseFloat(document.getElementById('weight-used').innerHTML) + parseFloat(newWeight)).toFixed(2)

                document.getElementById('weight-available').innerHTML = (parseFloat(document.getElementById('weight-available').innerHTML) + parseFloat(oldVal.weight)).toFixed(2)
                document.getElementById('weight-available').innerHTML = (parseFloat(document.getElementById('weight-available').innerHTML) - parseFloat(newWeight)).toFixed(2)

                
                oldVal.weight = newWeight.toFixed(2);
                oldVal.quantity = parseFloat(this.value).toFixed(2);

                tempdb.setItem((parseInt(tokenListLength) + 1).toString(), JSON.stringify(oldVal))

                weightInput.value = newWeight.toFixed(2);
                
            }, false);

            deleteButton.addEventListener('click', function (e) {
                e.currentTarget.parentNode.parentNode.parentNode.remove();
                document.getElementById('weight-available').innerHTML = parseFloat(document.getElementById('weight-available').innerHTML) + parseFloat(tokenWeight)
                document.getElementById('weight-used').innerHTML = parseFloat(document.getElementById('weight-used').innerHTML) - parseFloat(tokenWeight)
            }, false);


            // calculations for percentage weightings
            document.getElementById('weight-available').innerHTML = parseFloat(document.getElementById('weight-available').innerHTML) - parseFloat(tokenWeight)
            document.getElementById('weight-used').innerHTML = parseFloat(document.getElementById('weight-used').innerHTML) + parseFloat(tokenWeight)

            if (parseFloat(document.getElementById('weight-used').innerHTML) == 100.0) {
                document.getElementById('save-token').style.color = "green";
            }

            // append token 
            outerDiv.appendChild(coininputDiv);
            coininputDiv.appendChild(coinInput);
            outerDiv.appendChild(buttoninputDiv);
            buttoninputDiv.appendChild(deleteButton);
            outerDiv.appendChild(weightinputDiv);
            weightinputDiv.appendChild(weightInput);
            outerDiv.appendChild(quantityinputDiv);
            quantityinputDiv.appendChild(quantityInput);
            tokenElement.appendChild(outerDiv);
            tokenList.appendChild(tokenElement);
            console.log("Adding token... " + tokenInput)

            console.log('Added successfully...')

            // set the values to empty 
            document.getElementById('token-input').value = '';
            document.getElementById('token-weight').value = '';
            document.getElementById('token-quantity').value = '';
        }
    }
}

// listeners for enter key for any of the intial inputs
document.getElementById('token-input').addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('add-token').click();
    }
});

document.getElementById('token-weight').addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('add-token').click();
    }
});

document.getElementById('token-quantity').addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('add-token').click();
    }
});

// save set as txt file
document.getElementById('save-token').onclick = function () {

    var tokenListLength = document.getElementById("token-list").getElementsByTagName("li").length;

    // Open a file stream to save to text file
    const CreateFiles = fs.createWriteStream('./setlist.txt', {
        flags: 'a' //flags: 'a' preserved old data
    });

    for (var i = 0; i <= tokenListLength; i++) {
        if (tempdb.getItem(i) == null) {
            console.log('Save file: null item found in sessions storage')
        } else {

            // format the token input and get it from session storage
            var token = JSON.parse(tempdb.getItem(i));

            // pretty print it
            var saveStr = token.name + "|" + token.weight + "%|" + token.quantity

            // file stream
            CreateFiles.write(saveStr + '\r\n')
        }
    }

    CreateFiles.write(document.getElementById('name-input').value + '\r\n')
    alert("Set has been saved as /setlist.txt");
}