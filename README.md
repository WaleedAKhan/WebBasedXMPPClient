The webclient will work as follows-

Required - OpenFire Server

A user will have to initially enter the following information
1)serverName - This is the name of the openfire Server
2)JID - This is bare JID with out a domain name
3)Password - Password for the given JID

-The client will then establish a connection to the server using JID@serverName

For example:
Assume the server to establish an http connection is 

'http://virtual-mint:7070/http-bind/'

And a user exists with JID bob

- Bob will enter in 'virtual-mint' as the serverName and 'bob' as JID and the appropirate password and hit connect to establish a connection.

- The page will display connected once connected.

- The page will display any contacts that are avaliable to communicate with
- The user can then update his/her status, and send messages to any online contacts.

To update status:
	- Choose a status to show from the drop-down menu
	- Enter any status message in the status message box and hit update

To Send messages:
	- Assume a user alice@virtual-mint exists on the same server and is on bob's roster
	- Bob will enter the 'alice' in the Jid to send a message to
	- Any message text will be put in the Message box
	- Hit send to send the message out to alice.
