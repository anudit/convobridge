import { updateAuthData } from '@/lib/bridge';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Headers = (...args) => import('node-fetch').then(({Headers}) => new Headers(...args));

export default async (req, res) => {

    let { SPOTIFY_CLIENT_SECRET,  NEXT_PUBLIC_SITE_URL } = process.env;

    let { code }  = req.query;

    let myHeaders = Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "bd08b95348ab43a8ae061c0a28379642");
    urlencoded.append("client_secret", SPOTIFY_CLIENT_SECRET);
    urlencoded.append("code", code);
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("redirect_uri", NEXT_PUBLIC_SITE_URL + "/api/spotifycb");

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    // https://developer.spotify.com/documentation/general/guides/authorization-guide/
    let response = await fetch("https://accounts.spotify.com/api/token", requestOptions)
    let result = await response.json();
    // return res.status(200).json(result);

    let h2 = Headers();
    h2.append("Authorization", `Bearer ${result?.access_token}`);

    let ro = {
        method: 'GET',
        headers: h2,
        redirect: 'follow'
    };

    let response2 = await fetch("https://api.spotify.com/v1/me", ro);
    let spotifyData = await response2.json();

    let { state : ethAddress } = req.query;
    // console.log(ethAddress);
    // console.log(spotifyData);

    await updateAuthData('spotify', ethAddress, spotifyData);
    return res.status(200).redirect('/');

};
