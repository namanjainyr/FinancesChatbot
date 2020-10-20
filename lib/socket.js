var database = require('../lib/database');
var config = require("../Utilities/config");

module.exports = function (io, uuid, DialogFlow, name) {
    io.on(config.socketConnection, (socket) => {
        /**
         * Socket Listener to act when any user joins the conversation
         */
        socket.on(config.socketUsername, function (username, email) {
            socket.username = username;
            socket.email = username;
            const activityId = uuid.v4();

            //Inserting the activity into ChannelActivity MongoDB for tracking users
            database.insertActivity(socket.username, activityId, socket.email, true, Date.now(), null, null, false);

            io.emit(config.socketIsOnline, config.socketWelcome);
            io.emit(config.socketIsOnline, '🔵 <i>' + socket.username + ' joined the chat..</i>');
            io.emit(config.socketIsOnline, config.socketBotJoinedMessage);
            
        });

        /**
         * Socket Listener to act when any user leaves the conversation
         */
        socket.on(config.socketDisConnect, function (username) {
            
            //Inserting the activity into ChannelActivity MongoDB for tracking users
            database.insertActivity(socket.username, undefined, socket.email, true, undefined, true, Date.now(), undefined);
            io.emit(config.socketIsOnline, '🔴 <i>' + socket.username + ' left the chat..</i>');
        })

        /**
         * Socket Listener to act when any user sends message
         * Dialog flow predicts the intend and sends back the response
         */
        socket.on(config.socketChatMessage, function (message) {
            io.emit(config.socketChatMessage, '<div style="float:left; border-radius: 50%"><img src="../images/human.png" width="50px"></div><div style="float:left; margin-left: 20px;"><strong>' + socket.username + '</strong> <br> <br> ' + message +"</div>");

            const sessionId = uuid.v4();
            var dialog = new DialogFlow();

            //Inserting the message to the MongoDB table for tracking purposes
            database.insertMessage(socket.username, sessionId, socket.email, message, config.socketUser, Date.now());

            //Promise to call the dialog flow for intent prediction and retrieve the responses
            var newPromise = new Promise((resolve, reject) => {
                    let responseMessage = dialog.sendTextMessageToDialogFlow(message, sessionId);
                    if (responseMessage) {
                        resolve(responseMessage)
                    } else {
                        reject(config.socketRequestFailureMessage);
                    }
                }).then((value) => {
                    if(value[0].queryResult.intent.displayName === config.ByeGreeting){
                        database.insertActivity(socket.username, undefined, socket.email, undefined, undefined, undefined, undefined, true);
                    }
                    io.emit(config.socketChatMessage, config.socketBoTMessage + value[0].queryResult.fulfillmentText + "</div>");
                    database.insertMessage(socket.username, sessionId, socket.email, value[0].queryResult.fulfillmentText, config.socketBot, Date.now());
                })
                .catch((message) => {
                    console.log(message);
                });
        });
    });

}