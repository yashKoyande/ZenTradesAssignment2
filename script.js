    let jsonData;

    function handleFileUpload() {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                try {
                    jsonData = JSON.parse(content);
                    displayColumns(Object.keys(jsonData.products[Object.keys(jsonData.products)[0]]));
                } catch (error) {
                    alert('Error parsing JSON file.');
                }
            };
            reader.readAsText(file);
        }
    }

    function displayColumns(columns) {
        const availableColumns = document.getElementById('available-columns');
        availableColumns.innerHTML = '';

        columns.forEach(column => {
            const option = document.createElement('option');
            option.value = column;
            option.text = column;
            availableColumns.add(option);

            // Pre-select "Title" and "Price" if available in the JSON file
            if (column === 'Title' || column === 'Price') {
                option.selected = true;
            }
        });
    }

    function selectColumn() {
        const availableColumns = document.getElementById('available-columns');
        const selectedColumns = document.getElementById('selected-columns');

        const selectedOptions = Array.from(availableColumns.options).filter(option => option.selected);
        selectedOptions.forEach(option => {
            availableColumns.remove(option);
            selectedColumns.add(option);
        });
    }

    function removeColumn() {
        const availableColumns = document.getElementById('available-columns');
        const selectedColumns = document.getElementById('selected-columns');

        const selectedOptions = Array.from(selectedColumns.options).filter(option => option.selected);
        selectedOptions.forEach(option => {
            selectedColumns.remove(option);
            availableColumns.add(option);
        });
    }

    function processFile() {
        const selectedColumns = document.getElementById('selected-columns');
        const tableContainer = document.getElementById('table-container');

        if (!selectedColumns.options.length) {
            alert('Select at least one column.');
            return;
        }

        const selectedColumnNames = Array.from(selectedColumns.options).map(option => option.value);

        const sortedData = Object.values(jsonData.products).sort((a, b) => b.popularity - a.popularity);

        const table = document.createElement('table');
        table.border = '1';

        // Create table header
        const headerRow = document.createElement('tr');
        selectedColumnNames.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create table rows
        sortedData.forEach(row => {
            const tr = document.createElement('tr');
            selectedColumnNames.forEach(column => {
                const td = document.createElement('td');
                td.textContent = row[column];
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        // Display table
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }

    document.getElementById('file-input').addEventListener('change', handleFileUpload);