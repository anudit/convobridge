import fetch, { Headers } from 'node-fetch';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {

  let SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
  let { code }  = req.query;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "2365887896900.2359697771138");
  urlencoded.append("client_secret", SLACK_CLIENT_SECRET);
  urlencoded.append("code", code);
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("redirect_uri", "https://5ff4c329614e.ngrok.io/api/slackcb");

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
    let {id_token : token} = result;

    let data = jwt.decode(token);

    res.status(200).json({ ...data });

  }

}
