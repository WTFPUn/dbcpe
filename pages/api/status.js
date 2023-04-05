export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      res.status(200).json({ status: currentStatus });
      break;
    case "POST":
      currentStatus = req.body.status; // update the status
      res.status(200).json({ status: currentStatus });
      break;
    default:
      res.status(405).end(); // method not allowed
      break;
  }
}