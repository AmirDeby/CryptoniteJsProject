const state = {

    coins: [],
    selectedCoins: [],
    candidateCoin: null,
    timerId: null,
}

const CHART_COLORS = ['blue', 'red', 'black', 'orange', 'yellow'];

const ELEMENTS = {
    $screen: $('#screen'),
    $coinsList: $('#coins-list'),
    $searchForm: $('#search-form'),
    $loader: $('#loader'),
    $modal: $('#cModal'),
    $modalBody: $('.modal-body'),
    $reports: $('#reports'),
    $chart: $('#myChart'),
    $empty: $('#empty-list'),
}

const NUM_OF_COINS = 100;
const MAX_SELECTED_COINS = 5;



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

    $('#reports-btn').on('click', async function () {
        ELEMENTS.$chart = $('#myChart');
        if (!state.selectedCoins.length) {
            $(".no-coins").show();
            ELEMENTS.$chart.hide();
            return;
        }

        $(".no-coins").hide();
        ELEMENTS.$chart.show();

        const data = await getCurrencyValues();

        // re-draw the chart
        const chart = new Chart(ELEMENTS.$chart, {
            // i want a line chart
            type: 'line',
            // i want a title
            options: {
                title: {
                    display: true,
                    text: 'Cryptocurrencies in USD'
                }
            },
            data: {
                // first data point
                labels: [formatDate(new Date())],
                datasets: Object.keys(data).map((symbol, index) => ({
                    label: symbol,
                    backgroundColor: CHART_COLORS[index],
                    borderColor: CHART_COLORS[index],
                    fill: false,
                    data: [data[symbol].USD],
                }))
            },
        });

        state.timerId = setInterval(async function () {
            const data = await getCurrencyValues();
            chart.data.labels.push(formatDate(new Date()));
            Object.keys(data).forEach((symbol, i) => {
                chart.data.datasets[i].data.push(data[symbol].USD);
            })
            // update chart drawing
            chart.update();
        }, 2000);


    });

    $('#home-btn,#about-btn').on('click', function () {
        clearInterval(state.timerId);
    });
    // END OF EVENT LISTENERS
}


function formatDate(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

async function saveCoinsToState() {

    // since getCoinsFromApi returns a promise (async function), we can use await
    // to make this async function look like a sync function
    // this way, we don't have to deal with promises - we just get the resolve value from the promise directly
    const coins = await getCoinsFromApi();


    state.coins = coins.slice(0, NUM_OF_COINS);


}

async function getCurrencyValues() {
    const symbols = state.selectedCoins.map(symbol => symbol.toUpperCase());

    const conversionValues = await getCurrencyValuesFromApi(symbols);
    return conversionValues;

}

async function getMoreInfo(coinId) {

    const coin = await getMoreInfoFromApi(coinId);

    const coinIndex = state.coins.findIndex(coin => coin.id === coinId);

    state.coins[coinIndex] = coin;
}

function drawCoins() {

    state.coins.forEach(drawCoin);

}

function drawCoin(coin) {

    const elementId = `coin-${coin.symbol}`;
    const $coin = $(`
    <div class="coin-container col-12 col-md-4" data-symbol="${coin.symbol}">
        <div class="coin card"> 
            <div>${coin.symbol}</div>
            <div class="coin-mrg">${coin.name}</div>
            <input type="checkbox" class="toggle-btn" data-style="ios">
            <p>
                <button class="more-info-btn btn btn-primary" type="button" data-toggle="collapse" data-target="#${elementId}" aria-expanded="false" aria-controls="collapseExample">
                More Info
                </button>
            </p>
            <div class="collapse" id="${elementId}">
                <div class="card card-body">
                <div class="loader loader-dis lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="info"></div>
                </div>
            </div>
        </div>
    </div>
    `)

    ELEMENTS.$coinsList.append($coin);

    const $toggleButton = $coin.find('.toggle-btn');
    //  initialize the toggle checkbox with the bootstrap toggle style
    // $toggleButton.bootstrapToggle();

    const $moreInfoButton = $coin.find(".more-info-btn");
    $moreInfoButton.on('click', async function () {

        $coin.find('.loader').show();
        await getMoreInfo(coin.id);
        const coinInfo = state.coins.find(c => c.symbol === coin.symbol);
        const $moreInfo = createMoreInfoHTML(coinInfo);
        $coin.find('.loader').hide();
        $coin.find('.info').html($moreInfo);
    })

    $toggleButton.on('click', function (e) {

        const isToggled = toggleCoin(coin.symbol);
        if (!isToggled) {
            e.preventDefault();
        }
    })

}


function searchCoinInState(symbol) {

    const coin = state.coins.find(coin => coin.symbol === symbol);

    return coin;

}

function showCoins() {

    $('.coin-container').show();

}

function hideCoins() {

    $('.coin-container').hide();

}


function showEmptySearchMsg() {

    ELEMENTS.$empty.show()

}

function hideEmptySearchMsg() {

    ELEMENTS.$empty.hide()


}


function filterCoin(symbol) {

    hideEmptySearchMsg()
    hideCoins();

    if (!symbol) {
        showCoins();

        return;
    }


    const coin = searchCoinInState(symbol);

    coin ? showCoin(symbol) : showEmptySearchMsg();
    // equivalent to:
    // if (coin) {
    //     showCoin(symbol)
    // }
    // else {
    //     showError()
    // }
}


function createMoreInfoHTML(coin) {

    const { usd, eur, ils } = coin.market_data.current_price

    return $(`
    <div><img src="${coin.image.small}"/></div>
    <div>${usd} $ </div>
    <div>${eur} € </div>
    <div>${ils} ₪ </div>
    `);
}


function toggleCoin(symbol) {
    const { selectedCoins } = state;

    const index = selectedCoins.indexOf(symbol);
    if (index > -1) {
        selectedCoins.splice(index, 1);
        return true;
    }
    const canSelectCoin = selectedCoins.length < MAX_SELECTED_COINS;

    if (canSelectCoin) {
        selectedCoins.push(symbol);
        return true;
    } else {
        state.candidateCoin = symbol;
        openModal()
        return false;
    }
}


function drawCoinsForModal() {

    state.selectedCoins.forEach(symbol => {

        drawCoinInModal(symbol)
    })

}


function drawCoinInModal(symbol) {

    const $coin = $(`
    <div class="replace-coin-container">
        <div class="replace-coin-id">
         ${symbol}
        </div>
        <button class="replace btn btn-danger" >Replace</button>
    </div>
    `);

    ELEMENTS.$modalBody.append($coin);

    $coin.find('.replace').on('click', function () {

        replaceCoinInModal(symbol);

    })

}


function openModal() {

    ELEMENTS.$modalBody.empty()

    drawCoinsForModal();

    ELEMENTS.$modal.modal('show');

}


function closeModal() {

    ELEMENTS.$modal.modal('hide');

}


function replaceCoinInModal(symbol) {

    toggleCoin(symbol);
    toggleCoin(state.candidateCoin);
    closeModal();
    $(`[data-symbol=${symbol}] .toggle-btn`).prop('checked', false);
    $(`[data-symbol=${state.candidateCoin}] .toggle-btn`).prop('checked', true);
    getCurrencyValues();
}


function showCoin(symbol) {

    $(`[data-symbol=${symbol}]`).show();

}

