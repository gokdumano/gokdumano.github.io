const container = document.getElementById('ticket-prices-table-container');
fetch(
    "https://api.ibb.gov.tr/MetroIstanbul//api/MetroMobile/V2/GetTicketPrice/TR", {
    method: "GET",
    headers: {
        Accept: "application/json",
        Host: "api.ibb.gov.tr",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
    },
})
.then((response) => {
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
})
.then((data) => {
    if (!data.Success) {
        throw new Error("Network response was not ok " + data.Error);
    }

    const table = document.createElement('table');
    table.setAttribute('id', 'ticket-prices-table');

    const tbody = document.createElement('tbody');

    data.Data.forEach(ticket => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
		
        th.setAttribute('id', 'ticket-prices-table-header');
        th.setAttribute('colspan', '2')

        th.textContent = ticket.Type;

        tr.appendChild(th);
        tbody.appendChild(tr);

        ticket.TicketPrices.forEach(price => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdPrice = document.createElement('td');

            tdName.setAttribute('id', 'ticket-prices-table-name-cell');
            tdPrice.setAttribute('id', 'ticket-prices-table-price-cell');
			
            tdName.textContent = price.Name;
            tdPrice.textContent = price.Price;

            tr.appendChild(tdName);
            tr.appendChild(tdPrice);
            tbody.appendChild(tr);
        });

        console.log(ticket);
    });
    table.appendChild(tbody);

    // const caption = document.createElement('caption');
    // caption.textContent = "Güncel bilet fiyatları";
    // table.appendChild(caption);

    container.appendChild(table);
    document.getElementById('ticket-prices-progress-bar').remove();
})
.catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
});