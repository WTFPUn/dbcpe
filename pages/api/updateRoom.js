export default function handler(req, res) {


  const json = JSON.parse(req.body)
  const currentvalue = json.value
  res.status(200).json({ value: currentvalue+1, message: "update success"})
  // res.status(200).json({ value: currentvalue+1, message: "update success"})
}