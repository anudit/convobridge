import { getAddress, isAddress } from 'ethers/lib/utils';
const mongoClientPromise = require('@/lib/mongo-db');

export default async (req, res) => {
    const bodyData = req.body;

    try {

        const { address } = bodyData;

        console.log(bodyData);

        const resp = await fetch(`https://tathya.uidai.gov.in/uidVerifyEmailMobile/api/ext/v1/generic/emailnmobile/verify`, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json', appID: 'MYAADHAAR'}),
            body: JSON.stringify({
                captchaTxnId: bodyData.captchaTxnId,
                captcha: bodyData.captcha,
                uidNumber: bodyData.uidNumber,
                verificationCode: bodyData.verificationCode,
                mobileNumber: bodyData.mobileNumber
            })
        });

        let respData = await resp.json();

        if (isAddress(address) === true && respData?.responseData?.status == 'Success' ){

            let storageData = {
                mobileNumber:  respData['responseData']['mobileNumber'], // masked
                uidNumber:  respData['responseData']['uidNumber'], // masked
                requestDate:  respData['responseData']['requestDate']
            };

            const client = await mongoClientPromise;
            let coll = client.db('convo').collection('bridge');

            let newDoc = {
                _id: getAddress(address),
                aadharData : storageData
            }
            await coll.updateOne(
                { _id : getAddress(address)},
                { $set: newDoc },
                { upsert: true }
            )

        }

        return res.status(200).json(respData);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error});
    }

};
