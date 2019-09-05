const state = {

    coins: [],

}

init();

function init() {
    
    const getCoinsPromise = getCoinsFromApi();

    getCoinsPromise.then(console.log);

}