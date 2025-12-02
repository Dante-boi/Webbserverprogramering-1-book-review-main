// ========================================
import axios from "axios"
// ========================================

// ========================================

// ========================================
const form = document.querySelector(".review-form");
const submitBtn = document.querySelector("button[type='submit']");


let bookTitle = form.elements.bookTitle.value // Läser in det som skrivs in i namn input
let author = form.elements.author.value 
let reviewer = form.elements.reviewer.value 
let rating = form.elements.rating.value 
let review = form.elements.review.value 

const API_URL = "http://localhost:3000";

/**
 * Kontrollerar om alla formulärfält är ifyllda
 */

const checkInputs = () => {
  bookTitle = form.elements.bookTitle.value;
  author = form.elements.author.value;
  reviewer = form.elements.reviewer.value;
  rating = form.elements.rating.value;
  review = form.elements.review.value;

  if (
    !bookTitle || 
    !author || 
    !reviewer || 
    rating < 0 ||
    rating > 5 || 
    !review
  ) { 
  submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
};

  // Lägg till event listeners för både radera och uppdatera

/**
 * Skapar HTML för stjärnbetyg
 */
const createStars = (rating) => {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star">⭐</span>';
    } else {
      stars += '<span class="star empty">☆</span>';
    }
  }
  return stars;
};

/**
 * Visar alla recensioner på sidan
 */
const displayReviews = (reviews) => {
  const reviewsContainer = document.querySelector(".reviews");
  reviewsContainer.innerHTML = "";

  if (reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <div class="empty-state">
        <h3>Inga recensioner ännu</h3>
        <p>Bli den första att skriva en recension!</p>
      </div>
    `;
    return;
  }

  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";

    const date = new Date(review.timestamp).toLocaleDateString("sv-SE");
    const stars = createStars(review.rating);

    reviewDiv.innerHTML = `
      <div class="review-header">
        <div class="book-info">
          <h3>${review.bookTitle}</h3>
          <p class="book-author">av ${review.author}</p>
        </div>
        <div class="rating">${stars}</div>
      </div>
      <div class="review-meta">
        <span class="reviewer">Recensent: ${review.reviewer}</span>
        <span class="date">${date}</span>
      </div>
      <p class="review-content">${review.review}</p>
      <button class="delete-btn" data-id="${review.id}">🗑️ Radera</button>
    `;

    reviewsContainer.appendChild(reviewDiv);
  });

    addDeleteEventListeners();
    addUpdateEventListeners();

};

/**
 * Hanterar radering av en recension
 */
const handleDelete = async (e) => {
  const reviewId = e.target.dataset.id;
  console.log({ reviewId: reviewId });

  try {
    const response = await axios.delete(
      `http://localhost:3000/messages/${reviewId}`
    );

    if (!response.data.success) {
      alert("Recensionen raderades!");

    await loadReviews();
    } else {
     alert("Kunde inte radera recensionen!");
    }
  } catch (error) {
    console.log("Fel vid radering:", error);
    
    if (error.response && error.response.status === 404) {
    alert("Recensionen hittades inte");
    } else {
     alert("Kunde inte radera recensionen");
    }
  } 
};

/**
 * Hämtar och visar alla recensioner från servern
 */
const loadReviews = async () => {
  try {
     const response = await axios.get(`${API_URL}/reviews`);

     console.log({ response: response.data.data });

    displayReviews(response.data.data);    
  } catch (error) {
    alert("Kunde ej hämta recensioner")
  } 
};

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Lyssna på ändringar i formuläret
 */
form.addEventListener("input", checkInputs);

/**
 * Hanterar när formuläret skickas
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let bookTitle = form.elements.bookTitle.value // Läser in det som skrivs in i namn input
  let author = form.elements.author.value 
  let reviewer = form.elements.reviewer.value 
  let rating = form.elements.rating.value 
  let review = form.elements.review.value 

  if (!bookTitle || !author || !reviewer || rating < 0 || rating > 5 || !review) 
    return alert("Fyll i alla fält");

  const bookData = {
    bookTitle : bookTitle, 
    author : author, 
    reviewer : reviewer, 
    rating : rating, 
    review : review
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/save-review",
      bookData
    );

    if (response.status === 201) {
      alert("Recensionen sparades!");
      form.reset();
    } else {
      alert("Ett fel uppstod!");
    }
  } catch (error) {
    console.error("Fel:", error);
    alert("Kunde inte skicka recensionen");
  }
});

/**
 * Laddar recensioner när sidan laddas
 */

window.addEventListener("load", async () => {
  loadReviews();
});