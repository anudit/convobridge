import fetch, { Headers } from 'node-fetch';
import jwt from 'jsonwebtoken';

import nextConnect from 'next-connect';
import middleware from '@/middleware/database';
const handler = nextConnect();
handler.use(middleware);

export default handler.get(async (req, res) => {

  let SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
  let { code }  = req.query;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "2365887896900.2359697771138");
  urlencoded.append("client_secret", SLACK_CLIENT_SECRET);
  urlencoded.append("code", code);
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("redirect_uri", "https://bridge.theconvo.space/api/slackcb");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  let response = await fetch("https://slack.com/api/openid.connect.token", requestOptions)
  let result = await response.json();

  if (Boolean(result?.ok) === false) {
    res.status(200).json({ ...result  });
  }
  else {
    let {id_token : token, state: ethAddress } = result;

    let slackData = jwt.decode(token);

    const snapshot = await req.db.collection("bridge").find( { ethAddress } ).toArray();

    if (snapshot.length === 0){
      await req.db.collection("bridge").insertOne( {
        ethAddress,
        slackData
      } );
      res.status(200).redirect('/');
    }
    else if(snapshot.length > 0 ) {

      await req.db.collection("bridge").updateOne(
        { ethAddress },
        { $set: { slackData } }
      );
      res.status(200).redirect('/');

    }
  }

});
