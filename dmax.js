/**
* RANTR Utility Functions
*
* @dgowell
*/

/**
 * Global variables
 */
var SERVER_WALLET = "0x000000000";

/*//client side app draft. allows client to send requests to server and receive responses from server also allows for payment and confirmation


// Parse the JSON response
var json = JSON.parse(resp.response.conversion);

// Get the message type
var type = json.type;

//when user presses button, send message to server
if (type == "P2P_REQUEST") {

    // Send response to client via maxima, including the amount
    sendMaximaMessage(publickey, { "type": "P2P_RESPONSE", "data": { "status": "OK", "amount": amount } }, function (msg) {
        MDS.log("Sent response to " + publickey);
    });
}

else if (messagetype == "PAYMENT_CONFIRMATION") {
    // Get the coin id the client has sent
    var coinId = json.data.coin_id;

    // Confirm payment
    confirmPayment(coinId, function (msg) {
        var amount = msg.response.amount;

        // Add the clients permanent maxima address
        addPermanentAddress(publickey, function (msg) {
            MDS.log("Added permanent address for " + publickey);

            // Set the date that the MLS will expire
            setExpiryDate(amount, function (expirydate) {
                MDS.log("Set expire date for " + publickey);

                // Send response to client via maxima
                sendMaximaMessage(publickey, { "type": "EXPIRY_DATE", "data": { "status": "OK", "expiry_date": expirydate } }, function (msg) {
                    MDS.log("Sent response to " + publickey);
                });
            });
        });
    });
} else {
    MDS.log("INVALID message type in dmax server: " + messagetype);
}
//guess we also need to add in the function of testing whether enddate is reached and then clearing the permanent address
/**
 * Create the main SQL DB
 */
function createDB(callback) {

    //Create the DB if not exists
    var initsql = "CREATE TABLE IF NOT EXISTS `clients` ( "
        + "  `id` bigint auto_increment, "
        + "  `publickey` varchar(512) NOT NULL, "
        + "  `expirydate` bigint NOT NULL, "
        + " )";

    //Run this..
    MDS.sql(initsql, function (msg) {
        if (callback) {
            callback(msg);
        }
    });
}

/*
* Check for expired MLS
*/
function checkExpiredMLS(callback) {
    //Get the UNIX timestamp
    var now = Math.floor(Date.now() / 1000);

    //Select all the expired clients
    selectExpiredClients(now, function (sqlmsg) {
        //Loop through them
        for (var i = 0; i < sqlmsg.rows.length; i++) {
            var row = sqlmsg.rows[i];
            //delete each one
            deleteClient(row.publickey, function (msg) {
                MDS.log("Deleted expired client from db" + row.publickey);
            });
            //remove client permanent address
            removePermanentAddress(row.publickey, function (msg) {
                MDS.log("Removed permanent address for " + row.publickey);
            });
        }
    });
}


/**
 * Add client pk to create permanent address
 */
function addPermanentAddress(pk, callback) {
    var maxcmd = "maxextra action:addpermanent publickey:" + pk;
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg);
        }
    });
}

/**
 * Remove  expired client
 */
function removePermanentAddress(pk, callback) {
    var maxcmd = "maxextra action:removepermanent publickey:" + pk;
    MDS.cmd(maxcmd, function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg);
        }
    });
}

/**
 * Send message via Maxima to contat address or permanent address
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
 * Set Expiry Date
 * @param {*} pk
 * @param {*} callback
 * @param {*} expirydate
 * @returns true
 */
function setExpiryDate(pk, amount, callback) {
    //get unix timestamp
    var now = Math.floor(Date.now() / 1000);

    //convert whole number amount into days
    amount = amount * 86400;

    //and add to now
    var expirydate = now + amount;

    //update expirydate
    updateExpiryDate(pk, expirydate, function (sqlmsg) {
        if (callback) {
            callback(sqlmsg);
        }
    });
}

/**
 * Get P2P Identity
 * @param {*} callback
 */
function getP2PIdentity(callback) {
    MDS.cmd("maxima", function (msg) {
        MDS.log(JSON.stringify(msg));
        if (callback) {
            callback(msg.response.p2pidentity);
        }
    });
}