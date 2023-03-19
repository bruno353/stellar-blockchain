
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");


async function main() {
    await create();
}

//Este flow passa pela criação de um issuer, criação de uma conta exemplo de usuário(receiver), mintagem e queima de tokens para o usuário.
//Todas as partes de .FromSecret devem serem atualizadas com a key do user criado.

//1 - Criar uma conta que será a issuer (irá mintar e queimar os tokens):
//Todas contas criadas devem ser funded com pelo menos 1 XLM, para que assim sejam ativadas (https://laboratory.stellar.org/#account-creator?network=test)
async function create() {
    const issuerKeypair = StellarSdk.Keypair.random()
    console.log(issuerKeypair.secret())
    console.log(issuerKeypair.publicKey());
}

//2 - Setar a conta distribuotr para ser clawbackEnabled (ela terá a capacidade de queimar tokens que mintar):
async function setAccountClawbackEnabled() {
    // This loads a keypair from a secret key you already have:
    const issuerKeypair = StellarSdk.Keypair.fromSecret('SCI2MQZ2EX2CYBEV7PBUHH2E7IYB6T2E7KD3ECHFQ5TBFR32SGIKBOWM')
    server
  .loadAccount(issuerKeypair.publicKey())
  .then(function (account) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET}).addOperation(StellarSdk.Operation.setOptions({
      setFlags: StellarSdk.AuthClawbackEnabledFlag | StellarSdk.AuthRevocableFlag
    }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuerKeypair);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
}

//3 - Criar a conta de usuário exemplo, lembrando que ela também precisa ser funded para funcionar (1 XLM):
async function createUser() {
    const receiverKeypair = StellarSdk.Keypair.random()
    console.log(receiverKeypair.secret())
    console.log(receiverKeypair.publicKey());
}

//4 - Setando uma trustline entre a conta do usuário e o issuer:
async function setTrustline() {
    // This loads a keypair from a secret key you already have:
    const issuerKeypair = StellarSdk.Keypair.fromSecret('SCI2MQZ2EX2CYBEV7PBUHH2E7IYB6T2E7KD3ECHFQ5TBFR32SGIKBOWM')
    const receiverKeypair = StellarSdk.Keypair.fromSecret('SDXKUV7HA72KAYK2URTIGLV7WYHH563UIDUFFX3EOGVNFR3MNNDRJILN')

    const soulprime = new StellarSdk.Asset('Soulprime', issuerKeypair.publicKey());

    server
  .loadAccount(receiverKeypair.publicKey())
  .then(function (account) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET}).addOperation(StellarSdk.Operation.changeTrust({
        asset: soulprime,
    }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(receiverKeypair);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
}

//5 - mintando tokens para o usuário:
async function send() {
    // This loads a keypair from a secret key you already have:
    const issuerKeypair = StellarSdk.Keypair.fromSecret('SCI2MQZ2EX2CYBEV7PBUHH2E7IYB6T2E7KD3ECHFQ5TBFR32SGIKBOWM')

    const soulprime = new StellarSdk.Asset('Soulprime', distributorKeypair.publicKey());

    server
  .loadAccount(issuerKeypair.publicKey())
  .then(function (account) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET}).addOperation(StellarSdk.Operation.payment({
      //passar public key da conta que deseja mintar os tokens para:
      destination: 'GBESJKHECFUURNQS3TASBYZ6UPBMUNECYHE7B57SBSWN2RFCRDHTHMVX',
      asset: soulprime,
      amount: '1340',
      source: issuerKeypair.publicKey()
    }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuerKeypair);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
}

//6 - fazendo burn de tokens mintados para o user:
async function burn() {
    // This loads a keypair from a secret key you already have:
    const issuerKeypair = StellarSdk.Keypair.fromSecret('SCI2MQZ2EX2CYBEV7PBUHH2E7IYB6T2E7KD3ECHFQ5TBFR32SGIKBOWM')

    const soulprime = new StellarSdk.Asset('Soulprime', issuerKeypair.publicKey());

    server
  .loadAccount(issuerKeypair.publicKey())
  .then(function (account) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET}).addOperation(StellarSdk.Operation.clawback({
      //passar a public key do usuário que deseja fazer burn dos tokens
      from: 'GBESJKHECFUURNQS3TASBYZ6UPBMUNECYHE7B57SBSWN2RFCRDHTHMVX',
      asset: soulprime,
      amount: '250',
    }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuerKeypair);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
}

main();


