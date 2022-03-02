/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets, HsmX509Provider, Transaction } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const FabricCAServices = require('fabric-ca-client');
const { networkInterfaces, userInfo } = require('os');
const crypto = require('crypto');
const { query } = require('express');
const { channel } = require('diagnostics_channel');
const { IdentityService } = require('fabric-ca-client');
const { ICryptoSuite, User } = require('fabric-common');

//const ClientIdentity = require('fabric-shim').ClientIdentity;

const ccpPath = path.resolve(__dirname, '..', '..', 'test-network','organizations', 'peerOrganizations', 'org1.example.com','connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
const mspId = ccp.organizations['Org1'].mspid;
const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false }, caInfo.caName);

const ccpPath2 = path.resolve(__dirname, '..', '..', 'test-network','organizations', 'peerOrganizations', 'org2.example.com','connection-org2.json');
const ccp2 = JSON.parse(fs.readFileSync(ccpPath2, 'utf8'));
const caInfo2 = ccp2.certificateAuthorities['ca.org2.example.com'];
const mspId2 = ccp2.organizations['Org2'].mspid;
const ca2 = new FabricCAServices(caInfo2.url, { trustedRoots: caInfo2.tlsCACerts.pem, verify: false }, caInfo2.caName);

const ccpPath3 = path.resolve(__dirname, '..', '..', 'test-network','organizations', 'peerOrganizations', 'org3.example.com','connection-org3.json');
const ccp3 = JSON.parse(fs.readFileSync(ccpPath3, 'utf8'));
const caInfo3 = ccp3.certificateAuthorities['ca.org3.example.com'];
const mspId3 = ccp3.organizations['Org3'].mspid;
const ca3 = new FabricCAServices(caInfo3.url, { trustedRoots: caInfo3.tlsCACerts.pem, verify: false }, caInfo3.caName);

const ccpPath4 = path.resolve(__dirname, '..', '..', 'test-network','organizations', 'peerOrganizations', 'org4.example.com','connection-org4.json');
const ccp4 = JSON.parse(fs.readFileSync(ccpPath4, 'utf8'));
const caInfo4 = ccp4.certificateAuthorities['ca.org4.example.com'];
const mspId4 = ccp4.organizations['Org4'].mspid;
const ca4 = new FabricCAServices(caInfo4.url, { trustedRoots: caInfo4.tlsCACerts.pem, verify: false }, caInfo4.caName);


async function main() {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(ca.getCaName());
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'pranaychawhan2015@gmail.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        
        const provider = wallet.getProviderRegistry().getProvider('X.509');
        console.log(1);
        //console.log(provider.getCryptoSuite())
        const adminIdentity = await provider.getUserContext(identity, 'admin');
        console.log(2);
        const identityService = ca.newIdentityService();
        console.log(3);
        console.log(4);
        const identities =  await identityService.getAll(adminIdentity);
        
        var org1adminIdentity = null;
        var peer0Identity = null;
        identities.result.identities.forEach(element => {
            if(element.id == 'org1admin')
            {
                org1adminIdentity = element;
            }
            if(element.id == "peer0")
            {
                peer0Identity = element;
            }
        });

        console.log(peer0Identity);
        console.log(org1adminIdentity);
        const newprovider = wallet.getProviderRegistry().getProvider('X.509');
        const peer0Context = await newprovider.getUserContext(peer0Identity, 'peer0');

        console.log(peer0Context);

        // Disconnect from the gateway.
        gateway.disconnect();
                
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();

//module.exports.main = main;
