function getCoinsFromApi() {

    return $.get("https://api.coingecko.com/api/v3/coins/list");

}

function getMoreInfoFromApi(coinId) {

    return $.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);

}

function getCurrencyValuesFromApi(symbols) {
    // expecting symbols to be an array, so the string interpolation automatically joins the symbols with a ","
    return $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`);

}

// לבנות פונקציה שתחבר את המטבעות שבחרו ל איי פי אי
// לעשות שזה יקרה כל 2 שניות
// SETINTERVAL
// להפסיק את הלופ הנוכחי ולהתחיל לופ חדש עם המצב המעודכן 
// לבדוק איך עוצרים אינטרוול ואיך מתחילים אחד חדש