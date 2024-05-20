let debounceTimers = [];
let allData = [];
let displayedData = [];
const PAGE_SIZE = 1000;  // Number of rows to load at a time
let currentPage = 0;
let currentSortColumn = '';
let currentSortDirection = 'asc';

// Define your different data files
const dataFiles = [
    'translation.dat',
    'Portcard_Module_Map.txt',
    'Powergroup_DCDC_Module_Map.txt'
];

// Function to fetch and display data
async function fetchData(datafile) {
    try {
		const response = await fetch(datafile);  // Ensure this is the correct file path
        //const response = await fetch('Portcard_Module_Map.txt');  // Ensure this is the correct file path
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        clearTable();
        const lines = data.trim().split('\n');
        const headers = lines[0].split(/\s+/);    
        allData = lines.slice(1).map(line => line.split(/\s+/));// seperate by space

        console.log('Headers:', headers);  // Debugging: Log headers

        // Create header and search row
        const headerRow = document.getElementById('headerRow');
        const searchRow = document.getElementById('searchRow');
        headers.forEach((header, index) => {
       		const input = document.createElement('input');
			const th = document.createElement('th');
        	if(index >0){//skipping the first column
		        th.innerText = header;
		        headerRow.appendChild(th);
                input.type = 'text';
		        input.placeholder = `Search ${header}`;   
                input.onkeyup = () => debounce(searchAllColumns, 300);
                th.appendChild(input);	
                searchRow.appendChild(th);	      
           	}
            
        });

        // Load initial data
        loadMoreData();

        // Attach scroll event for lazy loading
        document.getElementById('table-container').addEventListener('scroll', handleScroll);
    } catch (error) {
        console.error('Error fetching data:', error);  // Debugging: Log errors
    }
}

// Add event listeners to buttons
document.getElementById('button1').addEventListener('click', () =>  fetchData(dataFiles[0]));
document.getElementById('button2').addEventListener('click', () => fetchData(dataFiles[1]));
document.getElementById('button3').addEventListener('click', () => fetchData(dataFiles[2]));

// Function to handle scrolling for lazy loading
function handleScroll() {
    const container = document.getElementById('table-container');
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        loadMoreData();
    }
}

// Function to load more data
function loadMoreData() {
    const dataRows = document.getElementById('dataRows');
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const newRows = displayedData.slice(start, end);

    newRows.forEach(cells => {
        const tr = document.createElement('tr');
        cells.forEach(cell => {
            const td = document.createElement('td');
            td.innerText = cell;
            tr.appendChild(td);
        });
        dataRows.appendChild(tr);
    });

    currentPage++;
}

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
    clearTimeout(this.timer);
    this.timer = setTimeout(func, delay);
}

// Function to search in all columns
function searchAllColumns() {
    const inputs = document.querySelectorAll('#searchRow input');
    const filters = Array.from(inputs).map(input => input.value.toUpperCase());

    displayedData = allData.filter(row => {
        return row.every((cell, index) => {
            return cell.toUpperCase().indexOf(filters[index]) > -1;
        });
    });

    // Reset and reload data
    document.getElementById('dataRows').innerHTML = '';
    currentPage = 0;
    loadMoreData();
}

// Function to filter data based on search input
function filterData(colIndex, query) {
    displayedData = allData.filter(row => row[colIndex].toLowerCase().includes(query.toLowerCase()));
    document.getElementById('dataRows').innerHTML = '';
    currentPage = 0;
    loadMoreData();
}

// Function to clear existing table data
function clearTable() {
    document.getElementById('headerRow').innerHTML = '';
    document.getElementById('searchRow').innerHTML = '';
    document.getElementById('dataRows').innerHTML = '';
}

// Fetch and display data when the page loads
//window.onload = fetchData;
