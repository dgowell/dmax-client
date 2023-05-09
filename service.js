/**
* dmax backend service
*
* @dgowell
*/

//Load a file..
MDS.load("dmax.js");

//Are we logging data
var logs = false;

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
                    //create two variables for the amount and the p2pidentity
                    var amount = json.data.amount;
                    var p2pidentity = json.data.p2pidentity;

                    //set the static MLS
                    //maxextra action:staticmls host: <p2pidentity> (Mx...@34.190.784.3:9001)
                    //send money
                    //send amount of money from form to the max wallet (hard coded address)
                    //coinID is retiurned
                    //send via maxima coinID
                    //send(‘paymentConfirmation’, {coinID, clientPK})
                }

                else if (messagetype == "ENDDATE_RESPONSE") {
                    //navigate user to countdown page
                } else {
                    MDS.log("INVALID message type in dmax server: " + messagetype);
                }
            });
        }
    }
});
