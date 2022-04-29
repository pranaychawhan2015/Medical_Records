/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets, HsmX509Provider, Transaction } = require('fabric-network');
const {DiscoveryService, IdentityContext, Client, Discoverer} = require('fabric-common');
const path = require('path');
const fs = require('fs');
const FabricCAServices = require('fabric-ca-client');
const { networkInterfaces } = require('os');
const crypto = require('crypto');
const { query } = require('express');
const { channel } = require('diagnostics_channel');
//const ClientIdentity = require('fabric-shim').ClientIdentity;

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('admin');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);
        
        const provider = wallet.getProviderRegistry().getProvider('X.509');
        const adminIdentity = await wallet.get('admin');

        const adminUser = await provider.getUserContext(adminIdentity, 'admin');
        const appUserIdentity = await wallet.get('appUser');

        const newAppUser = await provider.getUserContext(appUserIdentity, 'appUser');
        const identityService = ca.newIdentityService();
        
        var theIdentityRequest = { enrollmentID: 'appUser', affiliation: 'org1.department1', attrs: [{name:"Doctor", value:"Pranay@456", ecert:true},{name:"Doctor", value:"Abc@789", ecert:true}] };
        let response = await identityService.update('appUser', theIdentityRequest, adminUser);
        console.log("userIdenity attributes: ", response.result.attrs);

        // 4. reenroll testUser
        const newEnrollment = await ca.reenroll(newAppUser);

        const newX509Identity = {
                credentials: {
                        certificate: newEnrollment.certificate,
                        privateKey: newEnrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
        };

        console.log(newX509Identity.credentials.privateKey);

        //await wallet.remove('admin');
        await wallet.put('appUser', newX509Identity);

        gateway.disconnect();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        
        const network2 = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract2 = network2.getContract('healthwork');
        
        //let cid = new ClientIdentity()
        const result2 = await contract2.evaluateTransaction('queryAllPatients');
        console.log(`Transaction has been evaluated, result is: ${result2.toString()}`);
        
        const discovery = new DiscoveryService('healthwork', network.getChannel());
        const userContext = await provider.getUserContext(newX509Identity, 'appUser');
  
        const discoverer = new Discoverer('pranaychawhan@gmail.com', network.getChannel().client, 'Org1MSP');
        await discoverer.connect(network.getChannel().getEndorsers()[0].endpoint);
        
        let peer0Org1Count = 0;
        let peer1Org1Count = 0;
        let peer2Org1Count = 0;
        let peer3Org1Count = 0;
        
        let peer0Org2Count = 0;
        let peer1Org2Count = 0;
        let peer2Org2Count = 0;
        let peer3Org2Count = 0;

        let peer0Org3Count = 0;
        let peer1Org3Count = 0;
        let peer2Org3Count = 0;
        let peer3Org3Count = 0;

        let peer0Org4Count = 0;
        let peer1Org4Count = 0;
        let peer2Org4Count = 0;
        let peer3Org4Count = 0;

        let policyToPeersMap ={};

        let peer0Org4 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer1Org4 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer2Org4 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org4.example.com/peers/peer2.org4.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer3Org4 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org4.example.com/peers/peer3.org4.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer0Org1 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer1Org1 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer2Org1 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer3Org1 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer0Org2 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer1Org2 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer2Org2 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org2.example.com/peers/peer2.org2.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer3Org2 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org2.example.com/peers/peer3.org2.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer0Org3 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer1Org3 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer2Org3 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org3.example.com/peers/peer2.org3.example.com/msp/signcerts/cert.pem', 'utf8');
        let peer3Org3 = fs.readFileSync('/home/cps16/Documents/Medical_Records/test-network/organizations/peerOrganizations/org3.example.com/peers/peer3.org3.example.com/msp/signcerts/cert.pem', 'utf8');

        let counter = 0;

        console.log("Endorsers : " + network.getChannel().getEndorsers());

        for(let i=0; i< 1000; i++)
        {
            const endorsement = network.getChannel().newEndorsement('healthwork');
            discovery.build(new IdentityContext(userContext, network.getChannel().client), {endorsement: endorsement});
            discovery.sign(new IdentityContext(userContext, network.getChannel().client));
            const discovery_results = await discovery.send({targets: [discoverer], asLocalhost: true});
            let build_proposal_request = {
                args: ['dischargeReport', 'pranaychawhan','pranaychawhan']
                };
    
            endorsement.build(new IdentityContext(userContext, network.getChannel().client), build_proposal_request);
            endorsement.sign(new IdentityContext(userContext, network.getChannel().client));       
            const handler = discovery.newHandler();
    
            // do not specify 'targets', use a handler instead
            const  endorse_request = {
                handler: handler,
                requestTimeout: 60000
            };
            
            const endorse_results = await endorsement.send(endorse_request); 
            
            let list = [];

            //console.log('endorser results : '+ endorse_results.responses[0].endorsement.endorser.toString());
            endorse_results.responses.forEach(element=>{
                if(element.endorsement.endorser.includes(peer0Org1))
                {
                    list.push('peer0.org1');
                    ++peer0Org1Count
                }
                if(element.endorsement.endorser.includes(peer1Org1))
                {
                    list.push('peer1.org1');
                    ++peer1Org1Count;
                }
                if(element.endorsement.endorser.includes(peer2Org1))
                {
                    list.push('peer2.org1');
                    ++peer2Org1Count;
                }
                if(element.endorsement.endorser.includes(peer3Org1))
                {
                    list.push('peer3.org1');
                    ++peer3Org1Count;
                }

                if(element.endorsement.endorser.includes(peer0Org2))
                {
                    list.push('peer0.org2');
                    ++peer0Org2Count;
                }

                if(element.endorsement.endorser.includes(peer1Org2))
                {
                    list.push('peer1.org2');
                    ++peer1Org2Count;
                }

                if(element.endorsement.endorser.includes(peer2Org2))
                {
                    list.push('peer2.org2');
                    ++peer2Org2Count;
                }
                if(element.endorsement.endorser.includes(peer3Org2))
                {
                    list.push('peer3.org2');
                    ++peer3Org2Count;
                }



                if(element.endorsement.endorser.includes(peer0Org3))
                {
                    list.push('peer0.org3');
                    ++peer0Org3Count;
                }

                if(element.endorsement.endorser.includes(peer1Org3))
                {
                    list.push('peer1.org3');
                    ++peer1Org3Count;
                }

                if(element.endorsement.endorser.includes(peer2Org3))
                {
                    list.push('peer2.org3');
                    ++peer2Org3Count;
                }
                if(element.endorsement.endorser.includes(peer3Org3))
                {
                    list.push('peer3.org3');

                    ++peer3Org3Count;
                }



                if(element.endorsement.endorser.includes(peer0Org4))
                {
                    list.push('peer0.org4');
                    ++peer0Org4Count;
                }

                if(element.endorsement.endorser.includes(peer1Org4))
                {
                    list.push('peer1.org4');
                    ++peer1Org4Count;
                }

                if(element.endorsement.endorser.includes(peer2Org4))
                {
                    list.push('peer2.org4');
                    ++peer2Org4Count;
                }
                if(element.endorsement.endorser.includes(peer3Org4))
                {
                    list.push('peer3.org4');
                    ++peer3Org4Count;
                }



            })

            
            const commit = endorsement.newCommit();
            
            const  commit_request = {
              handler: handler,
              requestTimeout: 60000
              };
    
            commit.chaincodeId = 'healthwork';
            commit.build(new IdentityContext(userContext, network.getChannel().client), build_proposal_request);
            commit.sign(new IdentityContext(userContext, network.getChannel().client));
            await commit.send(commit_request);

            policyToPeersMap[++counter] = list;
            console.log('list: ' + list);
        }
 
        console.log('org1peer0 :' + peer0Org1Count);
        console.log('org2peer0 :' + peer0Org2Count);
        console.log('org3peer0 :' + peer0Org3Count);
        console.log('org4peer0 :' + peer0Org4Count);

        console.log('org1peer1 :' + peer1Org1Count);
        console.log('org2peer1 :' + peer1Org2Count);
        console.log('org3peer1 :' + peer1Org3Count);
        console.log('org4peer1 :' + peer1Org4Count);

        console.log('org1peer2 :' + peer2Org1Count);
        console.log('org2peer2 :' + peer2Org2Count);
        console.log('org3peer2 :' + peer2Org3Count);
        console.log('org4peer2 :' + peer2Org4Count);

        console.log('org1peer3 :' + peer3Org1Count);
        console.log('org2peer3 :' + peer3Org2Count);
        console.log('org3peer3 :' + peer3Org3Count);
        console.log('org4peer3 :' + peer3Org4Count);
        console.log('policyToMap: ' + policyToPeersMap);

        // Disconnect from the gateway.
        gateway.disconnect();
        
        return result2.toString();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();

//module.exports.main = main;
