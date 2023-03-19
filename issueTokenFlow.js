//1 - Criar Conta e Criar um asset
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");


async function main() {
    const issuerKeypair = StellarSdk.Keypair.random()
    const astroDollar = new StellarSdk.Asset('Soulprime', issuerKeypair.publicKey());

    console.log(issuerKeypair.publicKey);
    console.log(astroDollar);

    //2 - Criar uma conta que vai receber os assets (deve ser criado uma trustline):
    // This generates a random keypair
    const distributorKeypair = StellarSdk.Keypair.random()

    // This loads a keypair from a secret key you already have:
    //const distributorKeypair = StellarSdk.Keypair.fromSecret(‘SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4’

    const account = await server.loadAccount(distributorKeypair.publicKey());

    const transaction = await new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    // The `changeTrust` operation creates (or alters) a trustline
    // The `limit` parameter below is optional
    .addOperation(
        StellarSdk.Operation.changeTrust({
        asset: astroDollar,
        limit: "1000",
        source: distributorKeypair.publicKey(),
        }),
    );


    console.log(transaction);
}

main();
