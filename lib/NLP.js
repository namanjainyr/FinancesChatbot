const dialogflow = require('dialogflow');
const uuid = require('uuid');
const LANGUAGE_CODE = 'en-US';
var configure = require("../Utilities/config");

class DialogFlow {
    

	constructor () {
        var configure = require("../Utilities/config");
        this.projectId = configure.dialogFlowProjectID;
        let privateKey = configure.dialogFlow_Key;
        let clientEmail = configure.dialogFlowClientEmail;
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}
	
		this.sessionClient = new dialogflow.SessionsClient(config)
	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}
		try {
			let responses = await this.sessionClient.detectIntent(request)			
            return responses
		}
		catch(err) {
            
			console.error(configure.DialogFlowIntentError, err);
			throw err
		}
	}
}

module.exports = DialogFlow;
