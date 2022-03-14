import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { RP_NAME, RP_ID } from "../../../utils/constants";
import {Buffer} from "buffer";
import { getBridgeData, updateAuthData } from '@/lib/bridge';
import { getAddress, isAddress } from 'ethers/lib/utils';

export default async function handler(req, res) {

    let {ethAddress} = req.query;
    if (Boolean(ethAddress) === false || isAddress(ethAddress) === false) {
      return res.status(400).json({error:"ethAddress is empty/invalid"});
    }
    ethAddress = getAddress(ethAddress);

    let bridgeData = await getBridgeData(ethAddress);

  const opts = {
    timeout: 60000,
    allowCredentials: [{
      id: Buffer.from(bridgeData.biometric.device.credId, "base64"),
      type: 'public-key',
      transports: bridgeData.biometric.device.transports ?? ['usb', 'ble', 'nfc', 'internal'],
    }],
    /**
     * This optional value controls whether or not the authenticator needs be able to uniquely
     * identify the user interacting with it (via built-in PIN pad, fingerprint scanner, etc...)
     */
    userVerification: 'preferred',
    rpID: RP_ID,
  };

  const options = generateAuthenticationOptions(opts);
  try {
    await updateAuthData('biometric', ethAddress, {
        ...bridgeData.biometric, // carry forward the device already setup
        rpId: RP_ID,
        rpName: RP_NAME,
        challenge: options.challenge,
    });

  } catch (e) {
    // @ts-ignore
    res.status(500).json({error:"Writing database failed"});
  }

  res.status(200).json(options);
}
