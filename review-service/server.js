const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Fake database
let reviews = [
  { id: 1, productId: 1, text: "Great product!" }
];

// 🔹 Health check (مهم للـ deploy)
app.get("/", (req, res) => {
  res.send("Review Service is running 🚀");
});

// 🔹 GET all reviews
app.get("/reviews", (req, res) => {
  res.json(reviews);
});

// 🔹 GET reviews by productId
app.get("/reviews/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);

  const filtered = reviews.filter(r => r.productId === productId);

  res.json(filtered);
});

// 🔹 POST new review
app.post("/reviews", (req, res) => {
  const { productId, text } = req.body;

  if (!productId || !text) {
    return res.status(400).json({
      error: "productId and text are required"
    });
  }

  const newReview = {
    id: reviews.length + 1,
    productId,
    text
  };

  reviews.push(newReview);

  res.status(201).json(newReview);
});

// 🔹 DELETE review (extra feature)
app.delete("/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id);

  reviews = reviews.filter(r => r.id !== id);

  res.json({ message: "Review deleted" });
});

// 🔹 Dynamic port (مهم للـ Render)
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Review Service running on port ${PORT}`);
});