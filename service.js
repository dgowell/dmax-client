/**
* dmax backend service
*
* @dgowell
*/

//Load a file..
MDS.load("dmax.js");

//Are we logging data
var logs = true;

//Main message handler..
MDS.init(function (msg) {

    //Do initialisation
    if (msg.event == "inited") {
        //MDS.log("dmax service inited");
    } else if (msg.event == "MAXIMA") {

        //Is it for dmax...
        if (msg.data.application == "dmax") {

            //The Maxima user that sent this request
            var publickey = msg.data.from;

            //Convert the data..
            MDS.cmd("convert from:HEX to:String data:" + msg.data.data, function (resp) {

                //And create the actual JSON
                //TODO: Check that conversion is part of the response
                var json = JSON.parse(resp.response.conversion);

                //What type is this..
                var type = json.type;



                if (type == "P2P_RESPONSE") {
                    MDS.log("P2P_RESPONSE received:" + JSON.stringify(json));
                    //create two variables for the amount and the p2pidentity
                    var amount = json.data.amount;
                    var p2pIdentity = json.data.p2pidentity;

                    //set the static MLS
                    setStaticMLS(p2pIdentity, function (resp) {
                        MDS.log("Set static MLS");

                        //send amount of money to the server wallet
                        sendMinima(amount, SERVER_WALLET, function (coinId, error) {
                            if (error) {
                                MDS.log("Error sending Minima: " + error);
                                //update frontend document with error

                                return;
                            }
                            MDS.log("Sent Minima");
                            //coinID is returned

                            //get the client public key
                            getPublicKey(function (clientPK) {
                                MDS.log("Got public key");

                                //send via maxima coinID, clientPK
                                sendMaximaMessage({ "type": "PAY_CONFIRM", "data": { "status": "OK", "coin_id": coinId, "client_pk": clientPK, "amount": amount } }, SERVER_ADDRESS, function (msg) {
                                    MDS.log("Sent response to " + SERVER_ADDRESS);
                                });
                            });
                        });
                    });
                }


                else if (type == "EXPIRY_DATE") {
                    //replace user message with the expiry date and permanent maxima address
                    var expiryDate = json.data.expiry_date;
                    var permanentAddress = json.data.permanent_address;

                    document.getElementById("js-main").innerHTML = `Your MLS will expire on ${expiryDate}. Your permanent address is ${permanentAddress}.`;
                } else {
                    MDS.log("INVALID message type in dmax server: " + messagetype);
                }
            });
        }
    }
});
