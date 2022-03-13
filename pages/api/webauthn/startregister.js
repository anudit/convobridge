import { generateRegistrationOptions } from '@simplewebauthn/server';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { MongoClient } from 'mongodb';

import { RP_NAME, RP_ID } from "@/utils/constants";

export default async function handler( req, res ) {
  let {ethAddress} = req.query;
  if (Boolean(ethAddress) === false || isAddress(ethAddress) === false) {
    return res.status(400).json({error:"ethAddress is empty/invalid"});
  }

  ethAddress = getAddress(ethAddress);

  const opts = {
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: ethAddress,
    userName: ethAddress,
    timeout: 60000,
    attestationType: 'indirect',
    /**
     * Passing in a user's list of already-registered authenticator IDs here prevents users from
     * registering the same device multiple times. The authenticator will simply throw an error in
     * the browser if it's asked to perform registration when one of these ID's already resides
     * on it.
     */
    // excludeCredentials: devices.map(dev => ({
    //   @ts-ignore
      // id: dev.credentialID,
      // type: 'public-key',
      // @ts-ignore
      // transports: dev.transports,
    // })),
    /**
     * The optional authenticatorSelection property allows for specifying more constraints around
     * the types of authenticators that users to can use for registration
     */
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      // requireResidentKey: true,
      userVerification: 'required',
      // requireResidentKey: false,
    },
    /**
     * Support the two most common algorithms: ES256, and RS256
     */
    supportedAlgorithmIDs: [-7, -8, -257],
  };


  const options = generateRegistrationOptions(opts);

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  let db = client.db('convo');
  let coll = db.collection('bridge');

  let newDoc = {
    _id: getAddress(ethAddress),
    biometric : {
      challenge: options.challenge,
    }
  }
  await coll.updateOne(
    { _id : getAddress(ethAddress)},
    { $set: newDoc },
    { upsert: true }
  )

  return res.send(options);
}
