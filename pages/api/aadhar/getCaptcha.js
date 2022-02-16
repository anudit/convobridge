const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async (req, res) => {

    try {

        let resp = await fetch('https://tathya.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"langCode":"en","captchaLength":"3","captchaType":"2"}),
            redirect: 'follow'
        });
        let respData = await resp.json();

        return res.status(200).json(respData);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error});
    }

};
