import { updateAuthData } from '@/lib/bridge';

const jwt = require ( 'jsonwebtoken' );
const jwksClient = require ( 'jwks-rsa' );
const client = jwksClient({ jwksUri : 'https://developer.worldcoin.org/api/v1/jwks' });

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    })
}

export default async (req, res) => {

    jwt.verify(req.query?.verification_jwt, getKey, {}, async function ( err, decoded ) {
        if (err){
            console.log('worldcoin verification error', err);
            return res.status(200).redirect('/');
        }
        else if('verified' in decoded && decoded?.verified === true) {
            await updateAuthData('worldcoin', decoded?.signal, decoded);
            return res.status(200).redirect('/');
        }
    });

}
