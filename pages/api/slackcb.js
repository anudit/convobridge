import fetch, { Headers } from 'node-fetch';
import jwt from 'jsonwebtoken';
import { updateAuthData } from '@/lib/bridge';

export default async (req, res) => {

  let {SLACK_CLIENT_SECRET, NEXT_PUBLIC_SITE_URL} = process.env;
  let { code }  = req.query;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "2365887896900.2359697771138");
  urlencoded.append("client_secret", SLACK_CLIENT_SECRET);
  urlencoded.append("code", code);
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("redirect_uri", NEXT_PUBLIC_SITE_URL + '/api/slackcb');

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

    await updateAuthData('slack', ethAddress, slackData);
    res.status(200).redirect('/');
  }

};
