const state = {

    coins: [],

}

const ELEMENTS = {
    $coinsList: $('#coins-list'),
    $searchForm: $('#search-form'),
}
const NUM_OF_COINS = 100;

init();

async function init() {
    try {
        // you can replace "then" with "await" every time
        await saveCoinsToState();

        drawCoins();





    } catch (error) {
        console.error('caught error!', error);
    }
    // START OF EVENT LISTENERS
    ELEMENTS.$searchForm.on('submit', function (event) {

        event.preventDefault();
        const form = event.target;
        const symbol = form.search.value;

        filterCoin(symbol);
    })
    // END OF EVENT LISTENERS
}

async function saveCoinsToState() {

    // since getCoinsFromApi returns a promise (async function), we can use await
    // to make this async function look like a sync function
    // this way, we don't have to deal with promises - we just get the resolve value from the promise directly
    const coins = await getCoinsFromApi();
    state.coins = coins.slice(0, NUM_OF_COINS);

}

function drawCoins() {

    state.coins.forEach(drawCoin);

}

function drawCoin(coin) {

    const $coin = $(`
    <div class="card"> 
    <div>${coin.symbol}</div>
    <div>${coin.name}</div>
    <div><button class="more-info btn btn-danger">More Info</button></div>
    </div>
    `)

    ELEMENTS.$coinsList.append($coin);

    const $moreInfo = $coin.find(".more-info");
    $moreInfo.on('click', async function () {

        const moreInfo = await getMoreInfoFromApi(coin.id);
        console.log(moreInfo);

    })

}

function searchCoinInState(symbol) {

    const coin = state.coins.find(coin => coin.symbol === symbol);

    return coin;

}

function clearCoinsFromHtml() {

    ELEMENTS.$coinsList.empty();

}

function drawError() {

    clearCoinsFromHtml()
    ELEMENTS.$coinsList.append(`
    <h2>Coin not Found</h2>
    `)

}

function filterCoin(symbol) {

    const coin = searchCoinInState(symbol);
    clearCoinsFromHtml();
    if (coin) {
        drawCoin(coin)
    }
    else {
        drawError()
    }
    // equivalent to:
    // coin ? drawCoin(coin) : drawError();
}

