
var client;

function status(message){
    var para = document.createElement("p");
    para.setAttribute("id",Date.now);
    var node = document.createTextNode(message);
    para.appendChild(node);

    document.getElementById("status").appendChild(para);
    
    setTimeout(function() {
        removeStatus(para);
    }, 4000);
}

function removeStatus(node){
    console.log("removeStatus()");
    node.parentElement.removeChild(node);
}

function connect(){
    console.log("connect()");
    status("Starting connection");
    
    var username = prompt("Username");
    var password = prompt("Password");
    var clientID = prompt("Client ID");
    var ip = document.getElementById("brokerIP").value;
    var port = Number(document.getElementById("brokerPort").value);
    
    client = new Messaging.Client(String(ip), Number(port), clientID);
    
    client.onConnectionLost = function (responseObject) {
        status("Lost connection");
    };

    client.onMessageArrived = function (message) {
        $('.receivedTXT').val(message.destinationName + ": " + message.payloadString + "\n" + $('.receivedTXT').val());
    };

    var options = {
     timeout: 3,
     userName: username,
     password: password,

     onSuccess: function () {
         status("Connected");
     },

     onFailure: function (message) {
         status("Connection failed: " + message.errorMessage);
     }
    };

    client.connect(options);
}

function subscribe(){
    console.log("subscribe()");
    client.subscribe(document.getElementById("topicTXT").value, {qos: 2}); 
    status("Subscribed");
}

function publish(){
    console.log("publish()");
    
     var message = new Messaging.Message($('#messageTXT').val());
     message.destinationName = $('#topicTXT').val();
     message.qos = 1;
     client.send(message);
}
