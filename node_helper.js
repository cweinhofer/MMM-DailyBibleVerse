/* Magic Mirror
 * Node Helper: MMM-DailyBibleVerse
 *
 * By Arthur Garza
 * MIT Licensed.
 *
 * REVISED to use axios and remove 'request' vulnerability
 */

var NodeHelper = require("node_helper");
const axios = require("axios"); // You already had this, which is correct!

module.exports = NodeHelper.create({
    // Subclass start method.
    start: function() {
        console.log("Started node_helper.js for MMM-DailyBibleVerse.");
    },

    socketNotificationReceived: function(notification, payload) {
        console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
        this.bibleGatewayRequest(payload);
    },

    //
    // --- THIS IS THE UPDATED FUNCTION ---
    //
    bibleGatewayRequest: function(version) {
        var self = this;
        var bibleGatewayURL = "https://www.biblegateway.com/votd/get/?format=json&version=" + version;

        // Use axios.get which returns a "promise"
        axios.get(bibleGatewayURL)
            .then(function (response) {
                // Request was successful!
                // axios automatically parses the JSON, so 'response.data' is the object
                var result = response.data;
                
                // The original code logged the raw body, we'll log the result object
                console.log(self.name + " received data: ", result);
                
                // Send the result back to the main module
                self.sendSocketNotification('BIBLE_GATEWAY_RESULT', result);
            })
            .catch(function (error) {
                // An error occurred (e.g., network error, 404)
                console.log(self.name + " ERROR fetching verse: ", error.message);
            });
    }
});
