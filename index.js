const state = {

    coins: [],

}

const ELEMENTS = {
    $coinsList: $('#coins-list')
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
    
    ELEMENTS.$coinsList.append(`
    <div class="card"> 
    <div>${coin.symbol}</div>
    <div>${coin.name}</div>
    </div>
    `)

}