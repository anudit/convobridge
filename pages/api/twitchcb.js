import { updateAuthData } from '@/lib/bridge';
import fetch, { Headers } from 'node-fetch';

export default async (req, res) => {

    let { TWITCH_CLIENT_SECRET,  NEXT_PUBLIC_SITE_URL } = process.env;

    let { code }  = req.query;

    console.log(req.query);

    console.log(code);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "ghb2na9qbwpfvn2557fetvll6lxf1p");
    urlencoded.append("client_secret", TWITCH_CLIENT_SECRET);
    urlencoded.append("code", code);
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("redirect_uri", NEXT_PUBLIC_SITE_URL + "/api/twitchcb");

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

    console.log(result)

    let h2 = new Headers();
    h2.append("Authorization", `Bearer ${result?.access_token}`);

    let ro = {
        method: 'GET',
        headers: h2,
        redirect: 'follow'
    };

    let response2 = await fetch("https://api.twitch.tv/kraken/user", ro);
    let spotifyData = await response2.json();
    console.log(spotifyData)

    let { state : ethAddress } = req.query;
    // console.log(ethAddress);
    // console.log(spotifyData);

    await updateAuthData('twitch', ethAddress, spotifyData);
    return res.status(200).redirect('/');

};
