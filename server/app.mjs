import cors from "cors";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = dirname(__filename);

const app = express();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const filePath = `${__dirname}/bookreviews.json`;

const getReviews = () => {
  const data = fs.readFileSync(filePath, "utf-8"); // Läser filens innehåll som text

  try {
    if (fs.existsSync(filePath)) return JSON.parse(data)

      console.log();
      

      return [];
  } catch (error) {
    console.error("Error reading reviews:", error)

    return [];
  }
}

const saveBookreview = (bookData) => {
  let reviews = [];

  const data = fs.readFileSync(filePath, "utf-8"); // Läser filens innehåll som text

  if (data.trim()) {
    try {
     
       reviews = JSON.parse(data); // Gör om texten till JavaScript-format (oftast en array)

       // Om filen inte innehåller en array, återställ den till en tom array
       if (!Array.isArray(reviews)) reviews = []
    } catch (error) {
      // Om JSON är trasig eller något går fel -> nollställ reviews
      console.error("Error during read of reviews.json:", error)
      reviews = []
    }
  }

  reviews.push(bookData); // Lägg till det nya meddelande-objektet sist i arrayen

  try {
    console.log({ reviews: reviews });

  // Sparar tillbaka alla recensioner till reviews.json
  fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
  } catch (error) {
  // Skriv ut error meddelande i terminalen
  console.log("Error writing to reviews.json");
  }
};

app.get("/reviews", (req, res) => {
  try {
    const reviews = getReviews();

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error reading file:", error);

    res.status(500).json({ success: false });
  }
});

app.delete("/reviews/:id", (req, res) => {
  console.log("radera recensionen");
  const reviewId = req.params.id;

  console.log({ ID: reviewId });
  
  try {
    const deleted = deleteReview(reviewId);

    if (deleted) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({ success: false });
  }
});

app.post("/save-review", (req, res) => {
  const {   bookTitle, 
    author, 
    reviewer, 
    rating, 
    review } = req.body;
  console.log("hejsan");

  const id = uuidv4();

  try {
    const bookData = {
      bookTitle,  
      author, 
      reviewer,
      rating,
      review,
      timestamp: new Date().toISOString(),
      id,
    };

    saveBookreview(bookData);

    res.status(201).json("Saved successfully");
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json("Inernal server error");
  }
});
 
export default app;