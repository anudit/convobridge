import nextConnect from 'next-connect';
import middleware from '@/middleware/database';
const handler = nextConnect();
handler.use(middleware);

export default handler.all(async (req, res) => {

    try {

        const { address } = req.query;
        if (req.method === "GET" && Boolean(address) === true) {

            const snapshot = await req.db.collection("bridge").find( {
                ethAddress: req.query?.address
            } ).toArray();
            if (snapshot.length > 0){
                res.status(200).json({
                    success: true,
                    discord: Object.keys(snapshot[0]).includes('discordData') === true ? (snapshot[0].discordData?.username + "#"  + snapshot[0].discordData?.discriminator) : false,
                    slack: Object.keys(snapshot[0]).includes('slackData') === true ? (snapshot[0].slackData?.name) : false,
                    telegram: Object.keys(snapshot[0]).includes('telegramData') === true ? (snapshot[0].telegramData?.username) : false
                });
            }
            else {
                res.status(200).json({ success: true});
            }

        }
        else if (req.method === "POST" ){

            const { type, ethAddress } = req.query;
            const telegramData = req.body;

            if (type === 'telegram') {
                const snapshot = await req.db.collection("bridge").find({ ethAddress }).toArray();

                if (snapshot.length === 0){

                    await req.db.collection("bridge").insertOne( {
                      ethAddress,
                      telegramData
                    } );
                    res.status(200).json({success : true});

                }
                else if(snapshot.length > 0 ) {

                    await req.db.collection("bridge").updateOne(
                        { ethAddress },
                        { $set: { telegramData } }
                    );
                    res.status(200).json({success : true});
                }
            }

        }
        else if (req.method === "DELETE" ){

            const { type, ethAddress } = req.query;

            const snapshot = await req.db.collection("bridge").find({ ethAddress }).toArray();

            if ( type === 'telegram' && Object.keys(snapshot[0]).includes('telegramData') === true) {

                await req.db.collection("bridge").updateOne(
                    { ethAddress },
                    { $unset: { telegramData: snapshot[0].telegramData } }
                );
                res.status(200).json({success : true});

            }
            else if ( type === 'slack' && Object.keys(snapshot[0]).includes('slackData') === true) {

                await req.db.collection("bridge").updateOne(
                    { ethAddress },
                    { $unset: { slackData: snapshot[0].slackData } }
                );
                res.status(200).json({success : true});

            }
            else if ( type === 'discord' && Object.keys(snapshot[0]).includes('discordData') === true) {

                await req.db.collection("bridge").updateOne(
                    { ethAddress },
                    { $unset: { discordData: snapshot[0].discordData } }
                );
                res.status(200).json({success : true});

            }
            else {
                res.status(200).json({success: false, type, ethAddress});
            }
        }
        else{
            res.status(400).json({
                success: false,
                message: "Invalid Request"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error});
    }

});
