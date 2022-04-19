var inquirer = require('inquirer');
var binance = require('node-binance-api')().options({});
var colors = require('colors');

async function main(){
    var { currency, symbol } = await inquirer.prompt([
        {
            type: 'input',
            name: 'symbol',
            message: 'Enter the symbol of the crypto you want to watch: ',
            default: 'BTC'
        },
        {
            type: 'input',
            name: 'currency',
            message: 'Enter the currency you want to watch in: ',
            default: 'GBP'
        }
    ]);

    var pair = `${symbol}${currency}`;
    var lastPrice = 0;
    // use node-binance-api spot websocket api and print live price
    binance.websockets.trades([pair], (trades) => {
        let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
        if(lastPrice < price){
            console.info(symbol+" trade update. price: "+colors.green(price)+", quantity: "+quantity+", maker: "+maker);
        }
        else if(lastPrice > price){
            console.info(symbol+" trade update. price: "+colors.red(price)+", quantity: "+quantity+", maker: "+maker);
        }
        else{
            console.info(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
        }
        lastPrice = price;

      });

    console.log(symbol);
}

main().catch(err => {
    console.error(colors.red(err));
});
