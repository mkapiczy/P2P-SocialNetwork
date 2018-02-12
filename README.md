# P2P-SocialNetwork
Peer to peer social network project created for a IoT course at Aarhus University.

Nowadays, social networks are crucial part of human everyday lives. They are widely used by almost everyone, and it is hard to imagine a world without them. They facilitate many of the tasks people performed on daily basis such as communicating with friends and family, organising events, selling and buying products, sharing interests through multiple groups with friends and strangers from all over the world.

Most of the big players, such as Facebook, Twitter, Instagram etc. use a centralised client-server architecture in order to build their solutions, and manage user information. This architecture is well-known, and provides many benefits, especially from the system designers point of view. It provides increased security, %does it???
static topology, easy access to the data stored by a system, as it is stored in single place - server, scalability, and loose coupling between clients. It provides an easy control over communication scheme, as every request user makes goes through the central point of the system. And as a result, it makes it easier to track users activities and preferences in the network, and organise system's behaviour according to it.

However, the problem is that all the data is usually stored in a single data storage, making it vulnerable for hacking, and privacy leakage. What's more an owner of the system - a big corporation behind a fancy logo - owns all user information, and is able to track all user activities. One might say that this is a price we need to pay for the tools they provide, but is it?

For that reason, an idea of using peer-to-peer infrastructure for a social network usage has been born. This research aims to investigate how peer-to-peer infrastructure is adjusted for a social network systems application. The main difference between peer-to-peer and client server networks is that there is no central identity responsible for managing the data, all the system information is shared across the peers, and there is no single point of failure, as all the nodes communicate directly between each other. The question is how this huge shift of the paradigm can influence the widely known solution.

The idea behind this paper is to use a structured P2P distributed hash table Kademlia protocol, as a base for the project, and on top of it build a social network system solution. The research's goal is to investigate the benefits, and drawbacks of the peer-two-peer social network infrastructure from the practical point of view, as well as get familiar with common issues, which need to be addressed in peer-two-peer networks.

The system consists of two components:

 - Client web application
 - Server side application

The client side application has been implemented with use of Javascript language and AngularJS framework.

The server side application has been implemented on top of Kademlia implementation created during first part of the Building the Internet of Things with P2P and Cloud Computing course. The Kademlia implementation was coded with use of Javascript language. On later stage of the project it has been decided that the P2P Social Network project will be implemented in Typescript in order to provide static type checking functionality. As a result, most of the project modules are written in Typescript, with some Javascript leftover modules from previous project. The application uses NodeJS server side framework.

The code structure is divided into:<br>

Views - Client side application,<br>
Controllers - Controllers handling http requests from client application,<br>
Services - Services being invoked from the controllers in order to perform business logic functionality such as getting or storing the value in the network,<br>
Custom modules:
- Crypto - Generation of asymetric keys, encryption, decryption, and digital signature functionality,
- Data - Module responsible for storing the data locally on the node,
- Kademlia - Distributed hashtable protocol implementation,

Web application functionality has been done with use of NodeJS express framework.

Cryptography component has been implemented with use of node-rsa javascript library.

<b>Implemented functionality</b><br><br>

- User registration - A user can choose a username and an approver name, to create a request for acceptance into the network. 
- User login - After a user has been approved, the user can login and does then act as a contributing node to the network (storing nodes and values and be a part of the search chain when a message or node is requested).
 - Overview and confirmation/declining of pending registration request - When a user is logged in, he can view his pending registration request from other users. The user can then ''confirm'' or ''decline'' a request, and the request will be removed from the view.
- Chat functionality with one peer - A view is presented with a list of all peers added to the users bucket. From here, the user is able to chat with another peer.

When a user create a request for joining the network, a public and private key pair is generated using the node-rsa library. The keys are saved locally in a file, and are not added to the network before approval. When the approver confirms the request, he then signs the public key with his private key, and store it in the network. That way, other nodes can confirm the new users is trusted by someone in the network. 
When a node receive a request such as ping, the node will validate the sender of the message, by verifying the public key with the public key of the approver. Information about who approved a public key is saved as meta data to the public key. 
