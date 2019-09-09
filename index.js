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

async function saveMoreInfoToState(coinId) {

    const coin = await getMoreInfoFromApi(coinId);

    const coinIndex = state.coins.findIndex(coin => coin.id === coinId);

    state.coins[coinIndex] = coin;
}

function drawCoins() {

    state.coins.forEach(drawCoin);

}

function drawCoin(coin) {

    const elementId = `coin-${coin.id}`;
    const $coin = $(`
    <div class="card"> 
        <div>${coin.symbol}</div>
        <div>${coin.name}</div>
        <p>
            <button class="more-info-btn btn btn-primary" type="button" data-toggle="collapse" data-target="#${elementId}" aria-expanded="false" aria-controls="collapseExample">
            More Info
            </button>
        </p>
        <div class="collapse" id="${elementId}">
            <div class="card card-body info">
               
                </div>
            </div>
        </div>
    </div>
    `)

    ELEMENTS.$coinsList.append($coin);

    const $moreInfoButton = $coin.find(".more-info-btn");
    $moreInfoButton.on('click', async function () {

        await saveMoreInfoToState(coin.id);
        const coinInfo = state.coins.find(c => c.id === coin.id);
        const $moreInfo = createMoreInfoHTML(coinInfo);
        $coin.find('.info').html($moreInfo);
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

function createMoreInfoHTML(coin) {

    const $moreInfo = $(`
    <div><img src="${coin.image.small}"/></div>
    <div>${coin.market_data.current_price.usd} 💲</div>
    <div>${coin.market_data.current_price.eur} € </div>
    <div>${coin.market_data.current_price.ils} ₪ </div>

    `);

    return $moreInfo;
}