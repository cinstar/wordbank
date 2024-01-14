
document.addEventListener('DOMContentLoaded', function() {
  var addWordButton = document.getElementById('addWordButton');
  addWordButton.addEventListener('click', function() {
    var word = prompt('Enter the word:');
    var definition = prompt('Enter the definition:');

    if (word && definition) {
      // Open a connection to the "dictionary" database
      var request = indexedDB.open('dictionary', 1);

      // Setup the database structure if it doesn't exist
      request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore('words', { keyPath: 'word' });
      };

      // Perform the database operations
      request.onsuccess = function(event) {
        var db = event.target.result;

        // Start a new transaction
        var transaction = db.transaction(['words'], 'readwrite');

        // Access the object store
        var objectStore = transaction.objectStore('words');

        // Add the new word and definition
        objectStore.add({ word: word, definition: definition });

        // Close the transaction
        transaction.oncomplete = function() {
          alert('Word added successfully!');
        };

        // Close the connection to the database
        db.close();
      };
    }
  });
});
