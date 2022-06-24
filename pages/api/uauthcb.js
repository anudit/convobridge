export default async (req, res) => {

    console.log(req.query, req.body);

    return res.status(200).json({q: req.query, b: req.body})

}
