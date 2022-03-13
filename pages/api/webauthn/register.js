import { verifyRegistrationResponse } from '@simplewebauthn/server';
import base64url from "base64url";
import { MongoClient } from 'mongodb';

import { RP_ID, ORIGIN} from "@/utils/constants";
import { getAddress } from 'ethers/lib/utils';

let expectedOrigin = ORIGIN;

export default async function handler(req, res) {
  const body = req.body;
  let { ethAddress } = body;

  if (!ethAddress) {
    return res.status(400).json({error: "Request body is not valid"});
  }
  ethAddress = getAddress(ethAddress);

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  let db = client.db('convo');
  let coll = db.collection('bridge');
  let bridgeData = await coll.findOne({"_id" : ethAddress});

  // const bridgeData = await getBridgeData(ethAddress);

  if (Boolean(bridgeData?.biometric?.challenge) === false) {
    return res.status(400).json({error: "There is no pre-generated challenge"});
  }

  const expectedChallenge = bridgeData?.biometric?.challenge;

  let verification;
  try {
    const opts = {
      credential: body,
      expectedChallenge: expectedChallenge,
      expectedOrigin,
      expectedRPID: RP_ID,
    };
    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    return res.status(400).json({error: error.message});
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const newDeviceObj = {
      publicKey: base64url(credentialPublicKey),
      credId: base64url(credentialID),
      counter,
      transports: body.transports
    };

    console.log(newDeviceObj);
    let newDoc = {
      _id: getAddress(ethAddress),
      biometric : {
        device : newDeviceObj,
      }
    }
    await coll.updateOne(
      { _id : getAddress(ethAddress)},
      { $set: newDoc },
      { upsert: true }
    )

  }

  return res.send({ verified });
}
