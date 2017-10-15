var client;

click_handler = function(e) {
    if(e.target.value == ""){
        return;
    }
    
    client.unsubscribe(e.target.value, {
         onSuccess: unsubscribeSuccess,
         onFailure: unsubscribeFailure,
         invocationContext: {topic : e.target.value}
     });
    
    var list = document.getElementById("subscribedTopics");
    list.remove(e);
}

function unsubscribeSuccess(context){
    status('Successfully unsubscribed');
}

function unsubscribeFailure(context){
    status('Failed to unsubscribe');
}

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
    $('#subscribedTopics').click(click_handler);

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
    client.subscribe($('#topicTXT').val(), {qos: 2}); 
    status("Subscribed");
    
    var list = document.getElementById("subscribedTopics");
    list.add(new Option($('#topicTXT').val(), $('#topicTXT').val()));
}

function publish(){
    console.log("publish()");
    
     var message = new Messaging.Message($('#messageTXT').val());
     message.destinationName = $('#topicTXT').val();
     message.qos = 1;
     client.send(message);
}
