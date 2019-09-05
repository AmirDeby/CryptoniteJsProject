function getCoinsFromApi() {

  return $.get("https://api.coingecko.com/api/v3/coins/list");

}