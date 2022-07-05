import { Client } from '@uauth/node';
import Resolution from '@unstoppabledomains/resolution';
const resolution = new Resolution();

export default async (req, res) => {

    const developmentCredentials = {
        clientID: `3e99b06b-679a-4706-87b0-15dff22e5122`,
        clientSecret: process.env.UAUTH_SECRET,
        scope: "openid wallet email:optional humanity_check:optional",
        redirectUri: 'https://e6a0-122-161-53-160.ngrok.io/api/auth/callback',
        resolution,
      };

      let uauthClient = new Client(developmentCredentials);

    //   uauthClient.validateAuthorization(,developmentCredentials.scope.split(' '));

    console.log(req.query, req.body);

    return res.status(200).redirect('/');

}

// https://e6a0-122-161-53-160.ngrok.io/api/uauthcb?scope=email:optional%20openid%20wallet&code=d4wyUB7Ybxi6vQrADrbfh75RzJv1-a4cM4lP0p-RaV8.itpC41jrEU5AhNIxcs1sEEtFvQPgj8lm5fb9qtlcBpg&state=aTWie41tb9k_YaWzeqbFlyuMGkrTq5cLBN2N1Up5Cws.
