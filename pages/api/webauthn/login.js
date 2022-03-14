import base64url from 'base64url';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import {ORIGIN, RP_ID} from "../../../utils/constants";
import { getAddress } from 'ethers/lib/utils';
import { getBridgeData } from '@/lib/bridge';

let expectedOrigin = ORIGIN;

export default async function handler(req, res) {
  const body = req.body;
  let { ethAddress } = body;

  if (!ethAddress) {
    return res.status(400).json({error: "Request body is not valid"});
  }
  ethAddress = getAddress(ethAddress);

  let bridgeData = await getBridgeData(ethAddress);

  if (Boolean(bridgeData?.biometric?.challenge) === false) {
    return res.status(400).json({error: "There is no pre-generated challenge"});
  }

  const expectedChallenge = bridgeData?.biometric?.challenge;


  let dbAuthenticator;
  if (bridgeData?.biometric?.device?.credId === body.rawId) {
    dbAuthenticator = bridgeData?.biometric?.device;
  }

  if (!dbAuthenticator) {
    return res.status(400).send("Device is not registered");
  }

  let verification;
  try {
    const opts = {
      credential: body,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: RP_ID,
      authenticator: {
        credentialPublicKey: base64url.toBuffer(dbAuthenticator.publicKey),
        credentialID: base64url.toBuffer(dbAuthenticator.credId),
        counter: dbAuthenticator.counter,
        transports: dbAuthenticator.transports
      }
    };
    verification = await verifyAuthenticationResponse(opts);
  } catch (error) {
    const _error = error;
    // @ts-ignore
    return res.status(400).send(_error.message);
  }

  // console.log(authenticationInfo);
  // if (verified && authenticationInfo) {
  //   try {
  //     await prisma.device.update({
  //       where: {
  //         id: dbAuthenticator.id,
  //       },
  //       data: {
  //         ...dbAuthenticator,
  //         counter: authenticationInfo.newCounter
  //       }
  //     });
  //   } catch (e) {
  //     // @ts-ignore
  //     return res.status(500).send(e.message);
  //   }
  // }

  res.send(verification);
}
