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
                ethAddress: snapshot[0]?.ethAddress
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
                ethAddress: snapshot[0]?.ethAddress
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
                ethAddress: snapshot[0]?.ethAddress
            });
        }
    }
    else {
        res.status(200).json({ success: false, message: "Invalid type or id."});
    }
});
