import { bridgeReverseLookup } from '@/lib/bridge';

export default async (req, res) => {

    let { type, id } = req.query;
    const resp = await bridgeReverseLookup(type, id);
    return res.status(200).json(resp);

};
