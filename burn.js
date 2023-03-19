
//2 - Mandar coins para uma carteira (lembrar q antes a carteira precisa ser funded e precisa estabelecer o trust line)
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");


async function main() {
    // This loads a keypair from a secret key you already have:
    const distributorKeypair = StellarSdk.Keypair.fromSecret('SCI2MQZ2EX2CYBEV7PBUHH2E7IYB6T2E7KD3ECHFQ5TBFR32SGIKBOWM')

    const soulprime = new StellarSdk.Asset('Soulprime', distributorKeypair.publicKey());

    server
  .loadAccount(distributorKeypair.publicKey())
  .then(function (account) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET}).addOperation(StellarSdk.Operation.clawback({
      from: 'GBESJKHECFUURNQS3TASBYZ6UPBMUNECYHE7B57SBSWN2RFCRDHTHMVX',
      asset: soulprime,
      amount: '250',
    }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(distributorKeypair);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
}

main();
