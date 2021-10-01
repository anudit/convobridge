import { updateAuthData } from '@/lib/bridge';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Headers = (...args) => import('node-fetch').then(({Headers}) => new Headers(...args));

export default async (req, res) => {

    let { ZOOM_CLIENT_SECRET, NEXT_PUBLIC_ZOOM_CLIENT_ID,  NEXT_PUBLIC_SITE_URL } = process.env;

    let { code }  = req.query;

    let myHeaders = Headers({ "Content-Type": "application/x-www-form-urlencoded" })

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", NEXT_PUBLIC_ZOOM_CLIENT_ID);
    urlencoded.append("client_secret", ZOOM_CLIENT_SECRET);
    urlencoded.append("code", code);
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("redirect_uri", NEXT_PUBLIC_SITE_URL + "/api/zoomcb");

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    //https://marketplace.zoom.us/docs/guides/auth/oauth
    let response = await fetch("https://zoom.us/oauth/token", requestOptions)
    let result = await response.json();
    // res.status(200).json(result);

    let h2 = await Headers({"Authorization":`Bearer ${result?.access_token}`});

    let ro = {
        method: 'GET',
        headers: h2,
        redirect: 'follow'
    };

    let response2 = await fetch("https://api.zoom.us/v2/users/me", ro);
    let zoomData = await response2.json();

    let { state : ethAddress } = req.query;
    // console.log(ethAddress);
    // console.log(zoomData);

    await updateAuthData('zoom', ethAddress, zoomData);
    return res.status(200).redirect('/');

};
