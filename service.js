function getCoinsFromApi() {

    return $.get("https://api.coingecko.com/api/v3/coins/list");

}

function getMoreInfoFromApi(coinId) {

    return $.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);

}

function getCurrencyValuesFromApi(symbols) {
    // expecting symbols to be an array, so the string interpolation automatically joins the symbols with a ","
    return $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`);
    // expected response:
    /*

        {
        "42": {
        "USD": 19223.72
        },
        "ZRX": {
        "USD": 0.1952
        }
        }
    */
}