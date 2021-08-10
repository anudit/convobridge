import fetch, { Headers } from 'node-fetch';
import nextConnect from 'next-connect';
import middleware from '@/middleware/database';
const handler = nextConnect();
handler.use(middleware);

export default handler.get(async (req, res) => {

    let { DISCORD_CLIENT_SECRET,  NEXT_PUBLIC_SITE_URL } = process.env;

    let { code }  = req.query;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

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

    let h2 = new Headers();
    h2.append("Authorization", `Bearer ${result?.access_token}`);

    let ro = {
        method: 'GET',
        headers: h2,
        redirect: 'follow'
    };

    let response2 = await fetch("https://discord.com/api/users/@me", ro);
    let discordData = await response2.json();

    let { state : ethAddress } = req.query;

    const snapshot = await req.db.collection("bridge").find( { ethAddress } ).toArray();

    if (snapshot.length === 0){
        await req.db.collection("bridge").insertOne( {
            ethAddress,
            discordData
        } );
        res.status(200).redirect('/');
    }
    else if(snapshot.length > 0 ) {

        await req.db.collection("bridge").updateOne(
            { ethAddress },
            { $set: { discordData } }
        );
        res.status(200).redirect('/');

    }

});
