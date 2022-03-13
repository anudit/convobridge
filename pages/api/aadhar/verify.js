import { updateAuthData } from '@/lib/bridge';
import { getAddress, isAddress } from 'ethers/lib/utils';

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

            await updateAuthData('aadhar', getAddress(address), storageData);

        }

        return res.status(200).json(respData);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error});
    }

};
