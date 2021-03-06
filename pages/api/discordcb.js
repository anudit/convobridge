import { updateAuthData } from '@/lib/bridge';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Headers = (...args) => import('node-fetch').then(({Headers}) => new Headers(...args));

export default async (req, res) => {

    let { DISCORD_CLIENT_SECRET,  NEXT_PUBLIC_SITE_URL } = process.env;

    let { code }  = req.query;

    let myHeaders = Headers({ "Content-Type": "application/x-www-form-urlencoded" })

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "874563415228702751");
    urlencoded.append("client_secret", DISCORD_CLIENT_SECRET);
    urlencoded.append("code", code);
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("redirect_uri", NEXT_PUBLIC_SITE_URL + "/api/discordcb");

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    //https://discord.com/api/v8
    let response = await fetch("https://discord.com/api/v8/oauth2/token", requestOptions)
    let result = await response.json();

    let h2 = await Headers({
        "Authorization":`Bearer ${result?.access_token}`
    });

    let ro = {
        method: 'GET',
        headers: h2,
        redirect: 'follow'
    };

    let response2 = await fetch("https://discord.com/api/users/@me", ro);
    let discordData = await response2.json();

    let { state : ethAddress } = req.query;

    await updateAuthData('discord', ethAddress, discordData);
    return res.status(200).redirect('/');

};
