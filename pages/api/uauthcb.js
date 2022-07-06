import { Client } from '@uauth/node';
import Resolution from '@unstoppabledomains/resolution';
const resolution = new Resolution();

// export default async (req, res) => {

//     const developmentCredentials = {
//         clientID: `3e99b06b-679a-4706-87b0-15dff22e5122`,
//         clientSecret: process.env.UAUTH_SECRET,
//         scope: "openid wallet email:optional humanity_check:optional",
//         redirectUri: 'https://78dd-122-161-53-160.ngrok.io/api/auth/callback',
//         resolution,
//       };

//       let uauthClient = new Client(developmentCredentials);

//     //   uauthClient.validateAuthorization(,developmentCredentials.scope.split(' '));

//     console.log(req.query, req.body);

//     return res.status(200).redirect('/');

// }


// https://78dd-122-161-53-160.ngrok.io/api/uauthcb#code=hxUZ3BVFkxec9kq1q4xslEuwMSua6SqFeHaAKPc5uGM.o6WEWULUZa2FEQRyWM0YGS8bnsrqf_BFlIFYQWia8bk&state=0g8108-unG62NK2UVYTxI9ch8QFI4xqJVXxgKdZW7rs.&scope=openid%20wallet

const jwt = require ( 'jsonwebtoken' );
const jwksClient = require ( 'jwks-rsa' );
const client = jwksClient({ jwksUri : 'https://auth.unstoppabledomains.com/.well-known/jwks.json' });

const getKey = (header, callback) => {
  console.log('header', header);
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    })
}

export default async (req, res) => {
    console.log(req.query);
    jwt.verify(req.query?.code, getKey, {}, async function ( err, decoded ) {
        res.json({err, decoded})
    });

}
