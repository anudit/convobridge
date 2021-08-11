import nextConnect from 'next-connect';
import middleware from '@/middleware/database';
const handler = nextConnect();
handler.use(middleware);

export default handler.all(async (req, res) => {

    let { type, id } = req.query;
    if ( type === 'telegram' ) {
        const snapshot = await req.db.collection("bridge").find({"telegramData.username": id }).toArray();
        if (snapshot.length === 0 ){
            res.status(200).json({ success: false, message: `${type} data not found.`});
        }
        else {
            res.status(200).json({
                success: true,
                discord: Object.keys(snapshot[0]).includes('discordData') === true ? (snapshot[0].discordData?.username + "#"  + snapshot[0].discordData?.discriminator) : false,
                slack: Object.keys(snapshot[0]).includes('slackData') === true ? (snapshot[0].slackData?.name) : false,
                telegram: Object.keys(snapshot[0]).includes('telegramData') === true ? (snapshot[0].telegramData?.username) : false
            });
        }
    }
    else if ( type === 'slack' ) {
        const snapshot = await req.db.collection("bridge").find({"slackData.name": id }).toArray();
        if (snapshot.length === 0 ){
            res.status(200).json({ success: false, message: `${type} data not found.`});
        }
        else {
            res.status(200).json({
                success: true,
                discord: Object.keys(snapshot[0]).includes('discordData') === true ? (snapshot[0].discordData?.username + "#"  + snapshot[0].discordData?.discriminator) : false,
                slack: Object.keys(snapshot[0]).includes('slackData') === true ? (snapshot[0].slackData?.name) : false,
                telegram: Object.keys(snapshot[0]).includes('telegramData') === true ? (snapshot[0].telegramData?.username) : false
            });
        }
    }
    else if ( type === 'discord' ) {
        let [ username, discriminator ] = decodeURIComponent(id).split('#');
        const snapshot = await req.db.collection("bridge").find({"discordData.username": username, "discordData.discriminator": discriminator }).toArray();
        if (snapshot.length === 0 ){
            res.status(200).json({ success: false, message: `${type} data not found.`});
        }
        else {
            res.status(200).json({
                success: true,
                discord: Object.keys(snapshot[0]).includes('discordData') === true ? (snapshot[0].discordData?.username + "#"  + snapshot[0].discordData?.discriminator) : false,
                slack: Object.keys(snapshot[0]).includes('slackData') === true ? (snapshot[0].slackData?.name) : false,
                telegram: Object.keys(snapshot[0]).includes('telegramData') === true ? (snapshot[0].telegramData?.username) : false
            });
        }
    }
    else {
        res.status(200).json({ success: false, message: "Invalid type or id."});
    }
});
