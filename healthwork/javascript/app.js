const express = require('express')
const app = express()
const fs = require('fs')

const { FileSystemWallet, Gateway, Wallets, DefaultQueryHandlerStrategies  } = require('fabric-network');
const {QueryHandler, QueryHandlerFactory, Query, QueryResults, ServiceHandler} = require('fabric-network');
//const {libuv} = require('libuv');

const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { json, query } = require('express');
//const { createQueryHandler }  = require('../javascript/MyQueryHandler');
const { channel, Channel } = require('diagnostics_channel');
const { QueryImpl } = require('fabric-network/lib/impl/query/query');
const { transcode } = require('buffer');
const { TransactionEventHandler } = require('fabric-network/lib/impl/event/transactioneventhandler');
const { TransactionEventStrategy } = require('fabric-network/lib/impl/event/transactioneventstrategy');

const {Network} = require('fabric-network');
const {DiscoveryService, IdentityContext, Client, Discoverer} = require('fabric-common');

//const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
//const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
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

class SampleQueryHandler  {
  peers = [];

  constructor(peers) {
     this.peers = peers;
 }

   async evaluate(query) {
     const errorMessages = [];
     
      this.peers.forEach(peer =>  {
      //const results = await query.evaluate([peer]);
      //const result = results[peer.name];
      // if (result.status == 500) {
      //     errorMessages.push(result.toString());
      // } 
      // else {
          //if (result.isEndorsed) {
              return result.payload;
          //}
          //throw new Error(result.message);
      //}
      //console.log("this is working");
     })
     
     const message = util.format('Query failed. Errors: %j', errorMessages);
     throw new Error(message);
 }
}

function createQueryHandler(network) {
 //const mspId = network.getGateway().getIdentity().mspId;
 const channel = network.getChannel('mychannel');
 const orgPeers = channel.getEndorsers('Org1MSP');
 //const otherPeers = channel.getEndorsers().filter((peer) => !orgPeers.includes(peer));
 //const allPeers = orgPeers.concat(otherPeers);
 return new SampleQueryHandler(orgPeers);
};


const connectOptions =  {
  query: {
      timeout: 3, // timeout in seconds (optional will default to 3)
      strategy: createQueryHandler
  }
}



let caName = null;
// CORS Origin
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  //res.setHeader("Origin", "Content-Type", "Accept", "Authorization", "Access-Control-Request-Allow-Origin", "Access-Control-Allow-Credentials");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(express.json());

app.get('/patients', async (req, res) => {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userExists = await wallet.get('appUser');
    if (!userExists) {
      res.json({status: false, error: {message: 'User not exist in the wallet'}});
      return;
    }
    
    await RegisterAdmins(wallet);
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } }, connectOptions);
    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('healthwork3');
    const result = await contract.evaluateTransaction('queryAllPatients');

    console.log(result.toString());
    res.json({status: true, patients: JSON.parse(result.toString())});
  } catch (err) {
    //console.log(err.toString());
    res.json({status: false, error: err});
  }
});

app.get('/patients/:email', async (req, res) => {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userExists = await wallet.get(req.params.email);
    if (!userExists) {
      res.json({status: false, error: {message: 'User not exist in the wallet'}});
      return;
    }
    //console.log(req.query);
    console.log(1);
    await RegisterAdmins(wallet);

    console.log(2);
    const peerCCP = await FindUserccp(wallet, req.params.email);

    console.log(3);
    //console.log(peerCCP);
    const isvalid = await ValidateUserEmail(wallet, peerCCP, req.params.email, req.query.password);
    //console.log(4);

    if(isvalid)
    {
      const gateway = new Gateway();
      await gateway.connect(peerCCP, { wallet, identity: req.params.email, discovery: { enabled: true, asLocalhost: true } }, connectOptions);
      const network = await gateway.getNetwork('mychannel');
      //console.log(5);
      const contract = network.getContract('healthwork3');
      const result = await contract.evaluateTransaction('queryPatient', req.params.email);
      console.log(result.toString());

      const contract2 = network.getContract('connectionLayer4');
      const result2 = await contract2.submitTransaction('Invoke', 'healthwork3', req.params.email);
      console.log('result:' + result2.toString());

      res.json({status: true, patient: JSON.parse(result.toString())});
    }
    else
    {
      res.json({status: false, error: "Password is incorrect"});
    }
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.post('/patients', async (req, res) => {
  if ((typeof req.body.key === 'undefined' || req.body.key === '') ||
      (typeof req.body.name === 'undefined' || req.body.name === '') ||
      (typeof req.body.age === 'undefined' || req.body.age === '') ||
      (typeof req.body.disease === 'undefined' || req.body.disease === '') ||
      (typeof req.body.specialization === 'undefined' || req.body.specialization === '') ||
      (typeof req.body.email === 'undefined' || req.body.email === '') ||
      (typeof req.body.password === 'undefined' || req.body.password === '') 
      )
       {
    res.json({status: false, error: {message: 'Missing body.'}});
    return;
  }
  console.log(1);
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    let userCCP = null;
    console.log(2);
    await RegisterAdmins(wallet);
    console.log(3);
    const userExists = await wallet.get(req.body.email);
    console.log('identity:' + userExists)
    if (userExists) {
      res.json({status: false, egarror: {message: 'User already registered'}});
      return;
    }
    else
    {
       userCCP = await Register(wallet, req.body.email, req.body.password, req.body.key, req.body.name, req.body.age, req.body.specialization, req.body.disease);
    }
    console.log(userCCP);
    const gateway = new Gateway();
    await gateway.connect(userCCP, { wallet, identity: req.body.email, discovery: { enabled: true, asLocalhost: true } }, connectOptions);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('healthwork3');

    console.log(5);
    console.log(req.body.specialization);
    await contract.submitTransaction('createPatient',req.body.key, req.body.name, req.body.age, req.body.specialization, req.body.disease, req.body.email,req.body.adhar, caName);
    console.log(6);
    res.json({status: true, message: 'Transaction (create patient) has been submitted.'})
  } catch (err) {
    console.log(err);
    res.json({status: false, error: err});
  }
});

app.put('/patients', async (req, res) => {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userExists = await wallet.get(req.body.patient.Email);
    if (!userExists) {
      res.json({status: false, error: {message: 'User not exist in the wallet'}});
      return;
    }
    await RegisterAdmins(wallet);
    console.log(1);
    const gateway = new Gateway();
    
    const Organization = req.body.patient.Organization;
    if(Organization == 'ca-org1')
    {
      await gateway.connect(ccp, { wallet, identity: req.body.patient.Email, discovery: { enabled: true, asLocalhost: true } }, connectOptions);
    }
    else if(Organization== 'ca-org2')
    {
      await gateway.connect(ccp2, { wallet, identity: req.body.patient.Email, discovery: { enabled: true, asLocalhost: true } }, connectOptions);
    }
    else if(Organization == 'ca-org3')
    {
      await gateway.connect(ccp3, { wallet, identity: req.body.patient.Email, discovery: { enabled: true, asLocalhost: true } }, connectOptions);
    }
    else if(Organization == 'ca-org4')
    {
      await gateway.connect(ccp4, { wallet, identity: req.body.patient.Email, discovery: { enabled: true, asLocalhost: true } }, connectOptions);
    }
    
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('healthwork3');

    let endorsers = [];
    //console.log(req.body.policies);
    endorsers = await GetNames(wallet, req.body.policies, req.body.patient.Doctor_Specialization, ca, mspId, endorsers, network.getChannel().getEndorsers());
    endorsers = await GetNames(wallet, req.body.policies, req.body.patient.Doctor_Specialization, ca2, mspId2, endorsers, network.getChannel().getEndorsers());
    endorsers = await GetNames(wallet, req.body.policies, req.body.patient.Doctor_Specialization, ca3, mspId3, endorsers, network.getChannel().getEndorsers());
    endorsers = await GetNames(wallet, req.body.policies, req.body.patient.Doctor_Specialization, ca4, mspId4, endorsers, network.getChannel().getEndorsers());
    //console.log(endorsers);
    //console.log(req.body.policies);
    
    console.log("Endorsers :" + endorsers);
    console.log(req.body.operation);
         //const transaction1 = contract.createTransaction('testsampleReport');
      
         const discovery = new DiscoveryService('healthwork3', network.getChannel());
         //discovery.targets = endorsers;
         const provider = wallet.getProviderRegistry().getProvider(userExists.type);
         const userContext = await provider.getUserContext(userExists, req.body.patient.Email);
   
         const discoverer = new Discoverer(req.body.patient.Email, network.getChannel().client, 'Org1MSP');
         await discoverer.connect(endorsers[0].endpoint);
   
         const endorsement = network.getChannel().newEndorsement('healthwork3');
           
         discovery.build(new IdentityContext(userContext, network.getChannel().client), {endorsement: endorsement});
         discovery.sign(new IdentityContext(userContext, network.getChannel().client));
           // discovery results will be based on the chaincode of the endorsement
           const discovery_results = await discovery.send({targets: [discoverer], asLocalhost: true});
           //testUtil.logMsg('\nDiscovery test 1 results :: ' + JSON.stringify(discovery_results));
       
           // input to the build a proposal request
           let build_proposal_request = {
            args: ['dischargeReport', req.body.patient.Email,req.body.key]
            };

           if (req.body.operation === "testsampleReport")
           {
               build_proposal_request = {
              args: ['testsampleReport', req.body.patient.Email,req.body.key]
              };      
           }

           endorsement.build(new IdentityContext(userContext, network.getChannel().client), build_proposal_request);
           endorsement.sign(new IdentityContext(userContext, network.getChannel().client));       
           const handler = discovery.newHandler();
   
           // do not specify 'targets', use a handler instead
           const  endorse_request = {
               targets: endorsers,
               requestTimeout: 60000
           };
           
           const endorse_results = await endorsement.send(endorse_request); 
   
           const commit = endorsement.newCommit();
           
           const  commit_request = {
             handler: handler,
             requestTimeout: 60000
             };

           commit.chaincodeId = 'healthwork3';
           commit.build(new IdentityContext(userContext, network.getChannel().client), build_proposal_request);
           commit.sign(new IdentityContext(userContext, network.getChannel().client));
           await commit.send(commit_request); 

           if (req.body.operation === "testsampleReport") {     
            res.json({status: true, message: 'Transaction (Test Sample Report) has been submitted.'})
          }
          else
          {
            //console.log(req.body.operation);
            res.json({status: true, message: 'Transaction (Discharge Report) has been submitted.'})
          }

  } catch (err) {
    console.log(err);
    res.json({status: false, error: err});
  }
});


async function GetNames(wallet, policy, specialization, ca, mspId, endorsers, peers)
{
 const newPolicy = policy.split(',')
const provider = wallet.getProviderRegistry().getProvider('X.509');
let adminIdentity = await wallet.get(ca.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca.enroll({ enrollmentID:'admin',enrollmentSecret:
    'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId,
    type: 'X.509',
    };
    await wallet.put(ca.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca.getCaName());
  }

let roles = [];
const adminUser = await provider.getUserContext(adminIdentity, ca.getCaName());
const identityService = ca.newIdentityService();
const identities = await (await identityService.getAll(adminUser)).result.identities;

identities.forEach(function(e){

//console.log(e.attrs);
let attrs = [];
const result = e.attrs.filter(function(d)
{
// var pushValue = false;
// if(d.name == "Role" && d.value == "Student")
// {
// pushValue = true;
// }
// if(pushValue)
// {
// if(d.name == "Email")
// {
// roles.push(d.value);
// }
// }
//return (d.value == "Student" || d.value == "Doctor" || d.value == "Engineer")
  newPolicy.filter(element=>{
      if (d.value == element)
      {
        attrs.push(d.value)
      }
  })
});

console.log(attrs);

if(attrs.length != 0)
{
  //let attrs2 = [];

  let isSpecialization = false;

  attrs.forEach(element=>{
    
    e.attrs.filter(function(d)
    {
      if (d.name == "Specialization") {
        if (d.value == specialization) {
          isSpecialization = true;
        }
      }
    }
    )

    if (isSpecialization) {
      e.attrs.filter(function(d){
        if (d.name == "Email") {
          roles.push(d.value);
        }
      })
    }

    if (!isSpecialization && (element === "Admin" || element === "Lab_Technician")) {
      e.attrs.filter(function(d){
        if (d.name == "Email") {
          roles.push(d.value);
        }
      })    
    }
  
    // if (attrs2.length != 0) {
    //   e.attrs.filter(function(d)
    //   {
    //     if(d.name == "Email")
    //     {
    //       roles.push(d.value);
    //     }
    // }
    // ) 
    // }
  })

  
}

})

console.log(roles);

roles.forEach(name => {
  peers.filter(element => {
  if(element.name.startsWith(name))
  {
  endorsers.push(element);
  }
  });
  });

return endorsers;
}


async function Register(wallet, email, password, key, name, age, specialization, disease )
{ 
    const provider = wallet.getProviderRegistry().getProvider('X.509');
    let adminIdentity = await wallet.get(ca.getCaName());
    if(adminIdentity == null)
    {
      const enrollment = await ca.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
      const x509Identity = {
      credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
      },
      mspId: mspId,
      type: 'X.509',
      };
      await wallet.put(ca.getCaName(), x509Identity);
      adminIdentity = await wallet.get(ca.getCaName());
  }

  let orgFound = false;
  let caOrg = null;
  let adminUser = await provider.getUserContext(adminIdentity, 'admin');
  let identityService = ca.newIdentityService();
  let identities = await (await identityService.getAll(adminUser)).result.identities;

  console.log(identities);
  identities.forEach(element=> 
  {
    let attrs = [];
    console.log(element.attrs);
    const result = element.attrs.filter(function(d)
    {
        if(d.value == specialization)
        {
          return true;
        }
    });

    if(result != null)
    {
      orgFound = true;
      caOrg = ca;
    }
  }
)

if(orgFound == false)
{
  adminIdentity = await wallet.get(ca2.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca2.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId2,
    type: 'X.509',
    };
    await wallet.put(ca2.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca2.getCaName());
}

adminUser = await provider.getUserContext(adminIdentity, 'admin');
identityService = ca2.newIdentityService();
identities = await (await identityService.getAll(adminUser)).result.identities;


identities.forEach(element=> 
{
  let attrs = [];

  console.log(element.attrs);
  const result = element.attrs.filter(function(d)
  {
      if(d.value == specialization)
      {
        return true;
      }
  });

  if(result != null)
  {
    orgFound = true;
    caOrg = ca2;
    console.log(result);
  }

})

}

if(orgFound == false)
{
  adminIdentity = await wallet.get(ca3.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca3.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId3,
    type: 'X.509',
    };
    await wallet.put(ca3.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca3.getCaName());
}

 adminUser = await provider.getUserContext(adminIdentity, 'admin');
 identityService = ca3.newIdentityService();
 identities = await (await identityService.getAll(adminUser)).result.identities;

identities.forEach(element=> 
{
  let attrs = [];
  const result = element.attrs.filter(function(d)
  {
      if(d.value == specialization)
      {
        return true;
      }
  });

  if(result != null)
  {
    orgFound = true;
    caOrg = ca3;
    console.log(result);
  }

})


}

if(orgFound == false)
{

  adminIdentity = await wallet.get(ca4.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca4.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId4,
    type: 'X.509',
    };
    await wallet.put(ca4.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca4.getCaName());
}

adminUser = await provider.getUserContext(adminIdentity, 'admin');
identityService = ca4.newIdentityService();
identities = await (await identityService.getAll(adminUser)).result.identities;

identities.forEach(element=> 
{
  let attrs = [];
  const result = element.attrs.filter(function(d)
  {
      if(d.value == specialization)
      {
        return true;
      }
  });

  if(result != null)
  {
    orgFound = true;
    caOrg = ca4;
    console.log(result);
  }

})


}

console.log(orgFound);

const secret = await caOrg.register({
  enrollmentID: email,
  role: 'client',
  attrs:[{name:"Password", value: password, ecert:true}]
}, adminUser);

const enrollment = await caOrg.enroll({
  enrollmentID: email,
  enrollmentSecret: secret
});

const x509Identity = {
  credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
  },
  mspId: 'Org1MSP',
  type: 'X.509',
};

await wallet.put(email, x509Identity);

caName = caOrg.getCaName();
if(caOrg.getCaName() == ca.getCaName())
{
  return ccp;
}
if(caOrg.getCaName() == ca2.getCaName())
{
  return ccp2;
}
if(caOrg.getCaName() == ca3.getCaName())
{
  return ccp3;
}
if(caOrg.getCaName() == ca4.getCaName())
{
  return ccp4;
}

}


async function RegisterAdmins(wallet)
{ 
    const provider = wallet.getProviderRegistry().getProvider('X.509');
    let adminIdentity = await wallet.get(ca.getCaName());
    if(adminIdentity == null)
    {
      const enrollment = await ca.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
      const x509Identity = {
      credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
      },
      mspId: mspId,
      type: 'X.509',
      };
      await wallet.put(ca.getCaName(), x509Identity);
      adminIdentity = await wallet.get(ca.getCaName());
    }

    adminIdentity = await wallet.get(ca2.getCaName());
    if(adminIdentity == null)
    {
      const enrollment = await ca2.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
      const x509Identity = {
      credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
      mspId: mspId2,
      type: 'X.509',
      };
      await wallet.put(ca2.getCaName(), x509Identity);
      adminIdentity = await wallet.get(ca2.getCaName());
    }

    adminIdentity = await wallet.get(ca3.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca3.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId3,
    type: 'X.509',
    };
    await wallet.put(ca3.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca3.getCaName());  
  }

  adminIdentity = await wallet.get(ca4.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca4.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId4,
    type: 'X.509',
    };
    await wallet.put(ca4.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca4.getCaName());
}

}


async function FindUserccp(wallet, email)
{ 
    const provider = wallet.getProviderRegistry().getProvider('X.509');
    let adminIdentity = await wallet.get(ca.getCaName());
    if(adminIdentity == null)
    {
      const enrollment = await ca.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
      const x509Identity = {
      credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
      },
      mspId: mspId,
      type: 'X.509',
      };
      await wallet.put(ca.getCaName(), x509Identity);
      adminIdentity = await wallet.get(ca.getCaName());
  }

  let orgFound = false;
  let caOrg = null;
  let adminUser = await provider.getUserContext(adminIdentity, 'admin');
  let identityService = ca.newIdentityService();
  let identities = await (await identityService.getAll(adminUser)).result.identities;

  console.log(identities);
  identities.forEach(element=> 
  {
    let attrs = [];
    console.log(element.attrs);
    const result = element.attrs.filter(function(d)
    {
        if(d.value == email)
        {
          return true;
        }
    });

    if(result != null)
    {
      orgFound = true;
      caOrg = ca;
    }
  }
)

if(orgFound == false)
{
  adminIdentity = await wallet.get(ca2.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca2.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId2,
    type: 'X.509',
    };
    await wallet.put(ca2.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca2.getCaName());
}

adminUser = await provider.getUserContext(adminIdentity, 'admin');
identityService = ca2.newIdentityService();
identities = await (await identityService.getAll(adminUser)).result.identities;


identities.forEach(element=> 
{
  let attrs = [];

  console.log(element.attrs);
  const result = element.attrs.filter(function(d)
  {
      if(d.value == email)
      {
        return true;
      }
  });

  if(result != null)
  {
    orgFound = true;
    caOrg = ca2;
    console.log(result);
  }

})

}

if(orgFound == false)
{
  adminIdentity = await wallet.get(ca3.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca3.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId3,
    type: 'X.509',
    };
    await wallet.put(ca3.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca3.getCaName());
}

 adminUser = await provider.getUserContext(adminIdentity, 'admin');
identityService = ca3.newIdentityService();
identities = await (await identityService.getAll(adminUser)).result.identities;

identities.forEach(element=> 
{
  let attrs = [];
  const result = element.attrs.filter(function(d)
  {
      if(d.value == email)
      {
        return true;
      }
  });

  if(result != null)
  {
    orgFound = true;
    caOrg = ca3;
    console.log(result);
  }

})


}

if(orgFound == false)
{

  adminIdentity = await wallet.get(ca4.getCaName());
  if(adminIdentity == null)
  {
    const enrollment = await ca4.enroll({ enrollmentID:'admin',enrollmentSecret:'adminpw', ecert:true});
    const x509Identity = {
    credentials: {
    certificate: enrollment.certificate,
    privateKey: enrollment.key.toBytes(),
    },
    mspId: mspId4,
    type: 'X.509',
    };
    await wallet.put(ca4.getCaName(), x509Identity);
    adminIdentity = await wallet.get(ca4.getCaName());
}

adminUser = await provider.getUserContext(adminIdentity, 'admin');
identityService = ca4.newIdentityService();
identities = await (await identityService.getAll(adminUser)).result.identities;

identities.forEach(element=> 
{
  let attrs = [];
  const result = element.attrs.filter(function(d)
  {
      if(d.value == email)
      {
        return true;
      }
  });

  if(result != null)
  {
    orgFound = true;
    caOrg = ca4;
    console.log(result);
  }

})


}

console.log(orgFound);

if(caOrg.getCaName() == ca.getCaName())
{
  return ccp;
}
if(caOrg.getCaName() == ca2.getCaName())
{
  return ccp2;
}
if(caOrg.getCaName() == ca3.getCaName())
{
  return ccp3;
}
if(caOrg.getCaName() == ca4.getCaName())
{
  return ccp4;
}

}


async function ValidateUserEmail(wallet, peerccp, email, password)
{ 
    const provider = wallet.getProviderRegistry().getProvider('X.509');

    let peerCa = null;
    let adminIdentity = await wallet.get(ca.getCaName())  ;
    //console.log(peerccp);
    if(peerccp == ccp)
    {
        peerCa = ca;
    }
    if(peerccp == ccp2)
    {
        peerCa = ca2;
        adminIdentity = await wallet.get(ca2.getCaName());
    }
    if(peerccp == ccp3)
    {
        peerCa = ca3;
        adminIdentity = await wallet.get(ca3.getCaName());
    }
    if(peerccp == ccp4)
    {
        peerCa = ca4;
        adminIdentity = await wallet.get(ca4.getCaName());
    }
    if(adminIdentity == null)
    {
      console.log("Undesirable situation");
    }

    //console.log(peerCa);
    const adminUser = await provider.getUserContext(adminIdentity, peerCa.getCaName());
    const identityService = peerCa.newIdentityService();

    const identity = await identityService.getOne(email, adminUser);
    console.log(identity.result.attrs);
    let valid = false;
    identity.result.attrs.forEach(attr =>{
      if(attr.value == password)
      {
        valid = true;
      }
    }
      )
    return valid;
}


 


app.listen(3000, () => {
  console.log('REST Server listening on port 3000');
});
