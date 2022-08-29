import { deleteAuthData, getBridgeData, updateAuthData } from '@/lib/bridge';
import { isAddress } from 'ethers/lib/utils';
import { unstable_getServerSession } from 'next-auth';
import { getAuthOptions } from './auth/[...nextauth]';

export default async (req, res) => {

    try {

        let session = await unstable_getServerSession(req, res, getAuthOptions(req));

        if (session === null){
            return res.status(403).json({success : false, message: "Please Sign-In first."});
        }
        else if(Boolean(session?.user) === true && isAddress(session?.user?.name) === true){

            const address = session?.user?.name;
            if (req.method === "GET" && Boolean(address) === true) {

                const snapshot = await getBridgeData(address);
                return res.status(200).json(snapshot);

            }
            else if (req.method === "POST"){

                const { type } = req.query;
                const telegramData = req.body;

                if (type === 'telegram') {
                    await updateAuthData(type, address, telegramData);
                    return res.status(200).json({success : true});
                }

            }
            else if (req.method === "DELETE"){

                const { type } = req.query;

                let resp = await deleteAuthData(type, address)
                return res.status(200).json({success : resp});

            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Request"
                });
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Session State"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error});
    }

};
