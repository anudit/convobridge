import { deleteAuthData, getBridgeData, updateAuthData } from '@/lib/bridge';

export default async (req, res) => {

    try {

        const { address } = req.query;
        if (req.method === "GET" && Boolean(address) === true) {

            const snapshot = await getBridgeData(req.query?.address);
            return res.status(200).json(snapshot);

        }
        else if (req.method === "POST"){

            const { type, ethAddress } = req.query;
            const telegramData = req.body;

            if (type === 'telegram') {
                await updateAuthData(type, ethAddress, telegramData);
                return res.status(200).json({success : true});
            }

        }
        else if (req.method === "DELETE"){

            const { type, ethAddress } = req.query;

            let resp = await deleteAuthData(type, ethAddress)
            return res.status(200).json({success : resp});

        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Request"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error});
    }

};
