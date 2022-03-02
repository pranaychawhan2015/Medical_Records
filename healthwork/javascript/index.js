'use strict';

const { Gateway, Wallets } = require('fabric-network');
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
let result = '';
let contract;
let int = 0;

app.use(ignoreFavicon)


app.get('/', (req, res) => {
           try
           {
                int = int+1;
                app.get('/favicon.ico', (req, res) => res.status(404).end().next());
                res.statusCode = 200;         
                Perform('/', req.params).then(function(result){
                    res.send(result);
                });
           }
           catch(error)
           {
               res.status(404).send("Not Found");
           }
})

app.use(function (error, req, res, next) {
    console.error(error.stack)
    res.status(500).send('Something broke!')
  })

app.get('/queryAllPatients', (req, res) => {
    //const resultBuffer = main();
    try
    {
        int = int+1;
        app.get('/favicon.ico', (req, res) => res.status(404).end().next());
        res.statusCode = 200;
        res.redirect('/');
    }
    catch(error)
    {
        res.status(404).send('Something broke!')
    }
})

app.get('/favicon.ico', (req, res) => res.status(404).end().next());


app.get('/changePatientDoctor/:patientNumber/:newDoctor', (req, res) => {
    try
    {
        int = int+1;
        app.get('/favicon.ico', (req, res) => res.status(404).end().next());
        //const resultBuffer = main();
        console.log(req.params.carNumber);
        console.log(req.params.newOwner);
        res.statusCode = 200;
        Perform('/changePatientDoctor', req.params).then(function(result){
            res.redirect('/');
        });
    }
    catch(error)
    {
        res.status(404).send('Something broke!')
    }
})



app.get('/createPatient/:patientNumber/:Name/:Age/:Doctor/:Disease', (req, res) => {
    try
    {
        int = int+1;
        app.get('/favicon.ico', (req, res) => res.status(204).end().next());
        //const resultBuffer = main();
        res.statusCode = 200;
        if(res.headersSent)
        Perform('/createPatient', req.params).then(function(result){
            res.redirect('/');
        });
    }
    catch(error)
    {
        res.status(404).send('Something broke!')   
    }
})

app.get('/queryPatient/:patientNumber', (req, res) => {
    try
    {
        int = int+1;

        //const resultBuffer = main();
        res.statusCode = 200;
        Perform('/queryPatient', req.params).then(function(result){
            res.send(result);
        })
    }
    catch(error)
    {
        res.status(404).send('Something broke!')   
    }
})

app.get('/deleteAllPatients',(req, res)=>{
    try
    {
        int = int+1;

        res.statusCode = 200;
        Perform('/deleteAllPatients', req.params).then(function(result)
        {
            res.redirect('/');
        });
    }
    catch(error)
    {
        res.statusCode(404).send('Something broke !');
    }
})


app.get('/deletePatient/:patientNumber',(req, res)=>{

    try
    {
        int = int+1;
        res.statusCode = 200;
        Perform('/deletePatient', req.params).then(
            function(result){
                res.redirect('/');
            }
        )
    }
    catch(error)
    {
        res.statusCode(404).send("Something broke !");
    }
})

app.get('/initPatients', (req, res)=>{
    try
    {
        int = int+1;
        res.statusCode = 200;
        Perform('/initPatients', req.params).then(function(result){
            res.redirect('/');
        });
    }
    catch(error)
    {
        res.status(404).send("Something broke !")
    }
})


 async function Perform(endPoint, params ) {
    try {
        
        if(int == 1)
        {
                    // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        contract = network.getContract('fabcar');
        }

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        if(endPoint == '/' || endPoint == '/queryAllPatients')
        {
            result = await (await contract.evaluateTransaction('queryAllCars')).toString();
        }
        else if(endPoint == "/changePatientDoctor")
        {
            result = await (await contract.submitTransaction("changePatientDoctor", params.carNumber, params.newOwner)).toString();
        }
        else if(endPoint == "/createPatient")
        {
            result = await (await contract.submitTransaction('createCar', params.carNumber, params.make, params.model, params.color, params.owner));
        }
        else if(endPoint == "/queryPatient")
        {
            result = await (await contract.evaluateTransaction("queryCar", params.carNumber)).toString();
        }
        else if(endPoint == '/deleteAllPatients')
        {
            result = await (await contract.submitTransaction('deleteAllCars'));
        }
        else if(endPoint == '/deletePatient')
        {
            result = await (await contract.submitTransaction('deleteCar', params.carNumber));
        }
        else if(endPoint == '/initPatients')
        {
            result = await (await contract.submitTransaction('initLedger'));
        }
        console.log('Transaction has been submitted ', result.toString());
    
        // Disconnect from the gateway.
        //await gateway.disconnect();
        return result;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(404).end()
    }
    next();
  }
  

app.listen(port, () => {
    console.log('Hello world');
})

