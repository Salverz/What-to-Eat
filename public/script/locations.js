document.querySelector('#search-button').addEventListener('click', searchLocations);

async function searchLocations() {
    const zip = document.querySelector('#zip-code').value;
    const radius = document.querySelector('#radius').value;
    const chain = document.querySelector('#store-chain').value;

    if (zip == "") {
        document.querySelector('#error-message').innerHTML = "Please enter a zip code";
        return;
    }

    document.querySelector('#error-message').innerHTML = "";
    console.log("success!");
    
    const response = await fetch(`/locations/search?zip=${zip}&radius=${radius}&chain=${chain}`);
    const locations = await response.json();
    console.log(locations.data);

    locations.data.forEach(location => {
        document.querySelector('#search-results').innerHTML +=
        `<li>
            <p>${location.name}</p>
            <p>${location.address.addressLine1}, ${location.address.city}, ${location.address.state} ${location.address.zipCode}</p>
            <button>Choose this location</button>
        </li>`;
    });
}