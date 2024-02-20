// Get the input field
const searchInput = document.getElementById('searchInput');

// Define table IDs and their respective function names
const tables = [
    { id: 'reports', name: 'reports' },
    { id: 'FinishedCard', name: 'Finished Card' },
    { id: 'businessClearanceCard', name: 'Business Clearance Card' },
    { id: 'othersCard', name: 'Others Card' },
    { id: 'ResidencyCard', name: 'Residency Card' },
    { id: 'residentsBarangayClearance', name: 'Residents Barangay Clearance' }
];

// Function to highlight occurrences within a specific table
function highlightOccurrencesInTable(tableId, searchText) {
    console.log(`Highlighting occurrences within ${tableId}...`);
    const elements = document.querySelectorAll(`#${tableId} td`);

    elements.forEach(element => {
        const elementText = element.textContent;
        const newText = elementText.replace(new RegExp(searchText, 'gi'), match => `<mark style="background-color: yellow; position: relative; z-index: 999;">${match}</mark>`);
        element.innerHTML = newText;
    });
    console.log(`Highlighting within ${tableId} completed.`);
    
    // Scroll to the first occurrence of the search text
    const firstOccurrence = document.querySelector(`#${tableId} mark`);
    if (firstOccurrence) {
        firstOccurrence.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Add event listener for input event
searchInput.addEventListener('input', () => {
    console.log('Input event triggered');
    const searchText = searchInput.value.trim(); // Get the search text
    console.log('Search text:', searchText);
    
    // Highlight occurrences and scroll to them within each table
    tables.forEach(table => {
        highlightOccurrencesInTable(table.id, searchText);
    });
});
