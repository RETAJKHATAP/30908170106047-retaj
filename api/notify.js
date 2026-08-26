export default function handler(req, res) {
  const { name } = req.body || {};

  res.status(200).json({
    message: `Welcome ${name || "User"} to ShopSphere 🎉`
  });
}