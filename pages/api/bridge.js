import nextConnect from 'next-connect';
import middleware from '@/middleware/database';
const handler = nextConnect();
handler.use(middleware);

export default handler.get(async (req, res) => {

    try {

        if (req.method === "GET" && req.query.includes('address') === true) {

            const snapshot = await req.db.collection("bridge").find( {
                ethAddress: req.query?.address
            } ).toArray();
            if (snapshot.length > 0){
                res.status(200).json({ success: true, ...snapshot[0]});
            }
            else {
                res.status(200).json({ success: true});
            }

        }
        else if (req.method === "POST" ){
            console.log('hey');
            res.status(200).json({ success: true});
        }
        else{
            res.status(400).json({ success: false, message: "Invalid Request"});
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error});

    }

});
