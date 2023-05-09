/**
* RANTR Utility Functions
*
* @dgowell
*/

/**
 * Global variables
 */
var SERVER_WALLET = "MxG0853Q0NQ1CH9ZD51AW5H02F8KZUD08TWZENRJ03W13EKK6YA2FZHQ6VJ2F8E"; //mini address when typing getaddress on the command line
var SERVER_ADDRESS = "MAX#0x30819F300D06092A864886F70D010101050003818D003081890281810087916B30523665FF05A8554F5B0BECE54D8FD420DD82C46219E809027F51126196CF419EAD94B022DBF97123E02A677201115216AD225AC4F3E08AC8D3D9DAF76D629143D557448573B7F53C31D56E90F3D7DAFE752A27AD659FD903BD52B89ABBBC0DF97AD81C7B2E27D32E75588520DD44A2386E8FA79A9F9A405A541394750203010001#MxG18HGG6FJ038614Y8CW46US6G20810K0070CD00Z83282G60G16KD3ADUVWE789VEVFHC9A9Z4YC2T1JFQYCWNRS41VPQWJFKW2BMGQFRJ6GDMT0TG5KVNG2WQ0PVCE99Z30BCH85KAV1B7PNY8E4A45BCQYP4PU3AQ06BESHA9YWBQND6YVEF74P9FW7EHCUT31ZDTZ4145F5EWURCD91HEP8VY2P4F2SY808PYABMZVKK6R4M72TCKCSRHN1K10608006C2AE9F@31.125.188.214:9001"; //perm address of server

/*//client side app draft. allows client to send requests to server and receive responses from server also allows for payment and confirmation */

/**
* Called when form is submitted
* @param amount
*/

function onSubmit(amount) {

    //get the clients contact address
    getContactAddress(function (address) {

        //create p2pidentity request
        sendMaximaMessage({ "type": "P2P_REQUEST", "data": { "amount": amount, "contact": contact } }, SERVER_ADDRESS, function (msg) {
            MDS.log("Sent P2P request to " + SERVER_ADDRESS);

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