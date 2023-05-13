require("dotenv").config();
let krogerToken;

// Get tokens
const getToken = async () => {
    console.log("getting new token");
    const authString = process.env.KROGER_AUTHSTRING;

    const settings = {
        "method": "POST",
        "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + authString
        },
        "body": "grant_type=client_credentials&scope=product.compact"
    };

    response = await fetch("https://api-ce.kroger.com/v1/connect/oauth2/token", settings);
    const json = await response.json();
    krogerToken = json.access_token;
}

// Generic Kroger GET
const getRequest = async (url) => {
    const settings = {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Authorization": `Bearer ${krogerToken}`
      }
    }
    const response = await fetch(url, settings);
    const json = await response.json();
  
    if (json.error == "API-401: Invalid Access Token") {
        await getToken();
        return await getRequest(url);
    }
    return json;
}

// Get locations using a zipcode, radius, and chain (store)
const getLocations = async (zipCode, radius, chain) => {
    let url = `https://api-ce.kroger.com/v1/locations?filter.zipCode.near=${zipCode}&filter.radiusInMiles=${radius}`;
    chain == "" ? url += "" : `&filter.chain=${chain}`;
    return await getRequest(url);
}

// Get products
const getProducts = async (name, locationId, start = 1) => {
    return await getRequest(`https://api-ce.kroger.com/v1/products?filter.locationId=${locationId}&filter.term=${name}&filter.limit=50&filter.start=${start}`);
  }

// Get names of all chains
const getChains = async () => {
    return await getRequest("https://api-ce.kroger.com/v1/chains");
}

module.exports = {
    getToken: getToken,
    getLocations: getLocations,
    getProducts: getProducts,
    getChains: getChains
}