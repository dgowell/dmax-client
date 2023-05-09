/**
* RANTR Utility Functions
*
* @dgowell
*/

/**
 * Global variables
 */
var SERVER_WALLET = "0x000000000";
var SERVER_ADDRESS = "0x000000000";

/*//client side app draft. allows client to send requests to server and receive responses from server also allows for payment and confirmation */

/**
* Called when form is submitted
* @param amount
*/
function onSubmit(amount) {

    //get the clients contact address
    getContactAddress(function (address) {

        //create p2pidentity request
        sendP2PIdentityRequest(amount, address, function (response) {

            //remove the form from the UI and replace with a message
            document.getElementById("js-main").innerHTML = "Your request has been sent to the MLS server. Please wait for confirmation.";
        });
    });
}

/*
* Set Static MLS
* @param {*} callback
*/
function setStaticMLS(p2pidentity, callback) {
    var maxcmd = `maxextra action:staticmls host:${p2pidentity}`;
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg);
        }

    });
}

/**
* Get Contact Address
* @param {*} callback
*/
function getContactAddress(callback) {
    var maxcmd = "maxima";
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg.response.contact);
        }
    });
}
/**
 * Send message via Maxima to contat address or permanent address
 * @param {*} message
 * @param {*} address
 * @param {*} callback
 */
function sendMaximaMessage(message, address, callback) {
    var maxcmd = "maxima action:send poll:true to:" + address + " application:dmax data:" + JSON.stringify(message);
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg);
        }
    });
}

/**
 * Confirm coin exists and return the coin data response
 * @param {*} coinId
 * @param {*} callback
 * @returns coin data
 */
function confirmPayment(coinId, callback) {
    var maxcmd = "coins coinid:" + coinId;
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg);
        }
    });
}

/**
 * Get Public Key
 * @param {*} callback
 */
function getPublicKey(callback) {
    var maxcmd = "maxima";
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg.response.publickey);
        }
    });
}