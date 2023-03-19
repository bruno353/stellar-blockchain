//1 - Criar Conta e Criar um asset
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");


async function main() {
    const issuerKeypair = StellarSdk.Keypair.random()
    console.log(issuerKeypair.secret())
    console.log(issuerKeypair.publicKey());
}


main();
