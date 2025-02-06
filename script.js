const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', search);

function search() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Search across multiple pages
        searchAcrossPages(searchTerm);
    }
}

function searchAcrossPages(searchTerm) {
    // Get all pages (you can use an array of page URLs or a JSON file)
    const pages = [
        'comedy.html',
        'fiction.html',
        'mystery.html',
        'non_fiction.html',
        'novel.html',
        'romance.html',
        'self_help.html',
        'thriller.html'

        //... add more pages...
    ];

    // Loop through each page and search for the term
    pages.forEach((page) => {
        fetch(page)
           .then((response) => response.text())
           .then((html) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const results = doc.body.textContent.toLowerCase().includes(searchTerm.toLowerCase());
                if (results) {
                    // Display search results (e.g., show a list of matching pages)
                    console.log(`Found search term on page: ${page}`);
                    //... display search results...
                }
            });
    });
}