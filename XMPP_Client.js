
function server_connect(){
	//Variables that are input by the user		
	JIDUser = document.getElementById("JID").value;
	PWDUser = document.getElementById("PWD").value;
	serverName = document.getElementById("serverName").value;
	
	//Complete Server Address that webclient has to bind to
	var connectTo = 'http://'+serverName+':7070/http-bind/'
		
	//Create a new connection to the server
	conn = new Strophe.Connection(connectTo);	
	
	//Try to establish a connection with the given JID, PWD
	conn.connect(JIDUser+'@'+serverName, PWDUser, function (status) {
		console.log("Connecting to ", connectTo);
			if (status == Strophe.Status.CONNECTED) {
				console.log("Hello");
			
			//Handler for incoming message goes to onMessage Function
			conn.addHandler(onMessage, null, 'message','chat');
			
			//Handler for receving presence Stanzas for Users on the Roster
			conn.addHandler(onPresence, null, 'presence');	
			
			//Message displayed once a user is connected
			document.getElementById("connection_status").innerHTML +=  "Connected <br>";

			//Send initial presence to server		
			conn.send($pres());
						
            }
			//If a bad JID/PWD is provided
			if (status == Strophe.Status.AUTHFAIL) {
				document.getElementById("connection_status").innerHTML +=  "Connection Failed";
				console.log("booo");
				}
			}
		)
	}

//Handler for receiving message stanzas 
function onMessage(msg) {

	//Get variables from an incoming message stanza
	var from = msg.getAttribute('from');
	var msg_body = msg.getElementsByTagName('body');

	//Extract the JID from the Sender
	from = Strophe.getNodeFromJid(from);

	//Only looking for stanzas which contain a message body. Ignore stanzas which indicate user is typing
	if(msg_body.length > 0){
	//Display message on web page.
	document.getElementById("message_text").innerHTML +=  from + ": " + msg_body[0].innerHTML + "<br>";
	}

	//Return True to keep connection alive
	return true;
}

//Function which is used to handle sending messages out. Called when the send button is pushed.
function sendMsg(){
	
	//Get user input values
	var SendTo = document.getElementById("SendTo").value;
	//Build the proper JID@Domain format that is needed to send a message stanza out
	var SendTo = SendTo+'@'+serverName;
	var MsgBody = document.getElementById("MsgBody").value;


	//Setup outgoing message in correct format so that we can use Strophe to send it out
	var message = $msg({from: JIDUser, to:SendTo, type:'chat'}).c('body')
				.t(MsgBody).up().c('active', {'xmlns': 'http://jabber.org/protocol/chatstates'});

	//Send the message over the connection
	conn.send(message);

	//Display what was sent on the webpage
	document.getElementById("message_text").innerHTML +=  "You" + ": " + MsgBody + "<br>";

	//Return True to keep connection alive
	return true;
}



//Function which is used to send out status updates
function sendPresence(){

	//Get the user input values from the webpage
	var show = document.getElementById("show").value;
	var statusTxt = document.getElementById("statusTxt").value;

	//Setup outgoing presence stanza in correct format so that we can use Strophe to send it out
	var presence = $pres().c('show').t(show).up().c('status').t(statusTxt);

	//Display on the webpage that the status is being updated
	document.getElementById("message_text").innerHTML +=  "Updating Presence" + ": " + show+ " " + statusTxt + "<br>";

	//Send out the presence update.
	conn.send(presence);

	//Return True to keep connection alive
	return true;
}

//Hanlder for receiving presence stanzas.
function onPresence(presence){

	//Who is sending the presence update
	var from =  presence.getAttribute('from');
	//Extract only the JID from the incoming XML
	from = Strophe.getNodeFromJid(from);

	// Get show and status html/xml elements from the stanza
	var show =  presence.getElementsByTagName('show');
	var status =  presence.getAttribute('status');

	//Do not want to see own presence updates that are sent out
	if(from != JIDUser){
	var show;
	var status;

	//Get the show element
	Strophe.forEachChild(presence, 'show', function(elem){
		show =  elem.textContent;
	});

	//Get the status element
	Strophe.forEachChild(presence, 'status', function(elem){
		status =  elem.textContent;
	});

	//Need to handle cases based on if a show and/or status element are present
	//Once handled, the received status update is written to the webpage.
	
	//Some presence updates do not include a show element, ex) The Online/Offline status on spark
	if(show.length>0){		
		//Both show and status is availabe
		document.getElementById("message_text").innerHTML +=  "[Presence] User: " + from + " "+ show + " Status: "+ 		status	+ "<br>";
			}
	//Only status is available
	else if(status){
		document.getElementById("message_text").innerHTML +=  "[Presence] User: " + from + " "+ status+ "<br>";
			}
	else{
		document.getElementById("message_text").innerHTML +=  "[Presence] User: " + from + " Signed out. <br>";
			}
		
		}
	//Return true to keep handler alive.
	return true;
}



