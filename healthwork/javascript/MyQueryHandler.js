
const QueryHandler = require('fabric-network'); 
const QueryHandlerFactory = require('fabric-network');
// const QueryHandlerFactory =  
// Query, QueryResults = require('fabric-network');
const {Endorser} = require('fabric-common');
const util = require('util');

class SampleQueryHandler extends  QueryHandler {
    peers = [];

    constructor(peers) {
       this.peers = peers;
   }

     async evaluate(query) {
       const errorMessages = [];
       
        this.peers.forEach(peer => {
        // const results = await query.evaluate([peer]);
        // const result = results[peer.name];
        // if (result.status == 500) {
        //     errorMessages.push(result.toString());
        // } 
        // else {
        //     if (result.isEndorsed) {
        //         return result.payload;
        //     }
        //     throw new Error(result.message);
        // }
        console.log("this is working");
       })
       
       const message = util.format('Query failed. Errors: %j', errorMessages);
       throw new Error(message);
   }
}

const createQueryHandler = function(network) {
   const mspId = network.getGateway().getIdentity().mspId;
   const channel = network.getChannel();
   const orgPeers = channel.getEndorsers(mspId);
   const otherPeers = channel.getEndorsers().filter((peer) => !orgPeers.includes(peer));
   const allPeers = orgPeers.concat(otherPeers);
   return new SampleQueryHandler(allPeers);
};

module.exports = createQueryHandler;