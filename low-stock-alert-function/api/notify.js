import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { productName, stock, threshold = 5 } = req.body;

    if (!productName || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "productName and stock are required",
      });
    }

    if (Number(stock) > Number(threshold)) {
      return res.status(200).json({
        success: true,
        alerted: false,
        message: "Stock level is above the threshold, no alert sent",
      });
    }

    // Ethereal provides a disposable test mailbox, so no real email account is needed.
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"ShopSphere Inventory" <no-reply@shopsphere.test>',
      to: "admin@shopsphere.test",
      subject: `Low Stock Alert - ${productName}`,
      text: `"${productName}" has only ${stock} unit(s) left (threshold: ${threshold}).`,
      html: `<p><b>${productName}</b> has only <b>${stock}</b> unit(s) left (threshold: ${threshold}).</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    res.status(200).json({
      success: true,
      alerted: true,
      previewUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to send low stock alert",
    });
  }
}
