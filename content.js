// content.js
// Content script for storing the words in a database
// using IndexedDB API and implements the highlight feature

// Get the button element by its ID
var storeButton = document.getElementById("storeButton");

// Add a click event listener to the button
storeButton.addEventListener("click", function() {
    storeButton.classList.toggle("clicked");
    storeButton.innerText = "Saved!";
});

// Create the database
const dbName = "words_db";

const request = indexedDB.open(dbName, 1);

request.onerror = (event) => {
    console.error("IndexedDB error");
    console.log(event)
};

request.onupgradeneeded = function() {
  const db = request.result;

  // primary key: the word (will be unique)
  const objectStore = db.createObjectStore("words", { keyPath: "word" });

  // create other indexes
  objectStore.createIndex("definition", { unique: false });
  objectStore.createIndex("discovered_at", { unique: false });
  objectStore.createIndex("sentence_ex", { unique: false });
  objectStore.createIndex("date_found", { unique: false });
};

request.onsuccess = function () {
  const db = request.result;
  const transaction = db.transaction("words", "readwrite");
  const words = transaction.objectStore("words");
  const wordDefinition = words.index("definition");
  const wordOriginLink = words.index("discovered_at");
  const wordInSentence = words.index("sentence_ex");
  const dateFound = words.index("date_found");

  // add words to database
  words.put({word: "indefatigable", definition: "(of a person or their efforts) persisting tirelessly.", 
               discovered_at: "https://examplewebsite.com", sentence_ex: "She was an indefatigable defender of human rights",
               date_found : "2024-01-13"});

  // retrieve word from database: lookup by id
  const wordQuery = words.get("indefatigable");

  // retrieve word from database: lookup by index
  const dateQuery = dateFound.getAll(["2024-01-13"]);

  // evaluate on success of queries
  wordQuery.onsuccess() = function() {
    console.log('wordQuery', wordQuery.result);
  };

  dateQuery.onsuccess() = function() {
    console.log('dateQuery', dateQuery.result);
  };

};