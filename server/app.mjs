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
const data = fs.readFileSync(filePath, "utf-8");

const saveBookreview = (bookData) => {
  let reviews = [];

  try {
    const datat = fs.readFileSync('reviews.json', 'utf-8');

  if (data.trim()) {
    reviews = JSON.parse(data);
  }
} catch (error) {
    console.log('Skapar ny fil eller filen var tom');
}

  reviews.push(bookData); // Lägg till det nya meddelande-objektet sist i arrayen

  // Spara tillbaka hela arrayen till filen
  // JSON.stringify() konverterar JS till JSON-text
  // null, 2 gör JSON-filen lättläst med indentering
  fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
};

app.post("/save-bookreview", (req, res) => {
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
 