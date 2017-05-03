
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


/*
var mqtt_server = "codingpirates.lamotech.dk";
var mqtt_port = 1884;
var clientid = "myclientid_" + parseInt(Math.random() * 100, 10);
var username = "pirates";
var password = "secret";
var topic = "codingpirates";

//Using the HiveMQ public Broker, with a random client Id
var client = new Messaging.Client(mqtt_server, mqtt_port, clientid);

//Gets  called if the websocket/mqtt connection gets disconnected for any reason
client.onConnectionLost = function (responseObject) {
     //Depending on your scenario you could implement a reconnect logic here
     alert("connection lost: " + responseObject.errorMessage);
 };

 //Gets called whenever you receive a message for your subscriptions
 client.onMessageArrived = function (message) {
     //Do something with the push message you received
     $('#messages').append('<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>');
 };

 //Connect Options
 var options = {
     timeout: 3,
     userName: username,
     password: password,
     //Gets Called if the connection has sucessfully been established
     onSuccess: function () {
         alert("Connected");
     },
     //Gets Called if the connection could not be established
     onFailure: function (message) {
         alert("Connection failed: " + message.errorMessage);
     }
 };

 //Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
 var publish = function (payload, topic, qos) {
     //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
     var message = new Messaging.Message(payload);
     message.destinationName = topic;
     message.qos = qos;
     client.send(message);
			 }*/