var express = require('express');
const bodyParser = require('body-parser');
var database = require('../lib/database');


const router = express.Router({
  mergeParams: true
});
router.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * API to get all the messages from MongoDB
 * Access http://localhost:<<PORT>>/api/messages
 */
router.get('/messages', (req, res) => {
  database.getAllMessages(req, res, () => {});
});

/**
 * API to get all the dropped users from MongoDB
 * Access http://localhost:<<PORT>>/api/getDroppedUsersInfo
 */
router.get('/getDroppedUsersInfo', (req, res) => {
  database.getDroppedUserInfo(req, res, () => {});
});

/**
 * API to get all the users info from MongoDB
 * Access http://localhost:<<PORT>>/api/getAllUsersInfo
 */
router.get('/getAllUsersInfo', (req, res) => {
  database.getAllUserInfo(req, res, () => {});
});

/**
 * API to get all the users who have completed the chat from MongoDB
 * Access http://localhost:<<PORT>>/api/getCompletedUserInfo
 */
router.get('/getCompletedUserInfo', (req, res) => {
  database.getChatCompletedUserInfo(req, res, () => {});
});

module.exports = router;