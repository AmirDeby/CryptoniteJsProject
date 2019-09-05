const state = {

    coins: [],

}

init();

async function init() {
    try {
        // you can replace "then" with "await" every time
        await saveCoinsToState();
        








    } catch (error) {
        console.error('caught error!', error);
    }
}

async function saveCoinsToState() {

    // since getCoinsFromApi returns a promise (async function), we can use await
    // to make this async function look like a sync function
    // this way, we don't have to deal with promises - we just get the resolve value from the promise directly
    const coins = await getCoinsFromApi();
    state.coins = coins;

}