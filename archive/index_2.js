const IOTA = require('iota.lib.js');

const { provider, trytes } = require('./config');

const seed = "UFLKWXVHYTPDBAOJS9CQMGNRZEI";
const iota = new IOTA({
  provider,
});

//Sadly this won't work with the lambda proxy. 30s is just too short to complete POW :(
//We could make a new method that invokes the lambda for JUST the PoW (which is better anyway)
//That way we wouldn't need to use ApiGateway, or proxy any requests.
iota.api.getNewAddress(seed, {}, (error, address) => {
    console.log("ADDRESS:", address)
    if (error) throw error;
    let transfers = [{
        'address': address,
        // 'message': iota.utils.toTrytes("testing"),
        'message': trytes,
        'value': 0,
        'tag': 'SURJIKAL'
    }]
    iota.api.sendTransfer(seed, 5, 14, transfers, (error, results) => {
        if (error) throw error;
        console.log("RESULTS:", results)
    });
});
