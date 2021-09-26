import { updateAuthData } from '@/lib/bridge';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Headers = (...args) => import('node-fetch').then(({Headers}) => new Headers(...args));

export default async (req, res) => {

    const { TWITCH_CLIENT_SECRET,  NEXT_PUBLIC_SITE_URL } = process.env;
    // console.log(TWITCH_CLIENT_SECRET,  NEXT_PUBLIC_SITE_URL);

    let { code }  = req.query;

    let myHeaders = Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "ghb2na9qbwpfvn2557fetvll6lxf1p");
    urlencoded.append("client_secret", TWITCH_CLIENT_SECRET);
    urlencoded.append("code", code);
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("redirect_uri", NEXT_PUBLIC_SITE_URL + '/api/twitchcb');

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth
    let response = await fetch("https://id.twitch.tv/oauth2/token", requestOptions)
    let result = await response.json();
    // return res.status(200).json(result);

    // console.log(result);

    let h2 = Headers();
    h2.append("Accept", `application/vnd.twitchtv.v5+json`);
    h2.append("Authorization", `Bearer ${result?.access_token}`);
    h2.append("Client-Id", `ghb2na9qbwpfvn2557fetvll6lxf1p`);

    let ro = {
        method: 'GET',
        headers: h2,
        redirect: 'follow'
    };

    let response2 = await fetch("https://api.twitch.tv/helix/users", ro);
    let twitchData = await response2.json();
    // console.log(twitchData);

    let { state : ethAddress } = req.query;
    // console.log(ethAddress);

    await updateAuthData('twitch', ethAddress, twitchData['data'][0]);
    return res.status(200).redirect('/');

};
