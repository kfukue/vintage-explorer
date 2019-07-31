const VintageExplorer = artifacts.require("./VintageExplorer.sol");
const truffleAssert = require('truffle-assertions');

contract("VintageExplorer", accounts => {
  it("...should add wine producer name: test website : test.com ", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed();

    // Add wine producer
    const wineProducerName = 'Test Wine Producer';
    const wineProducerWebsite = 'https://www.test.com';
    const wineProducerAddress = accounts[0];

    await vintageExplorerInstance.addWineProducer(wineProducerName,
      wineProducerWebsite,wineProducerAddress, { from: accounts[0] });

    // Get wine producer name
    const wineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress);
    assert.equal(wineProducer.name, wineProducerName, `The name ${wineProducerName} was not stored.`);
    assert.equal(wineProducer.website, wineProducerWebsite, `The website ${wineProducerWebsite} was not stored.`);
  });
  it("...Add test wine ", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });

    // Add wine producer
    const wineProducerName = 'Test Wine Producer';
    const wineProducerWebsite = 'https://www.test.com';
    const wineProducerAddress = accounts[1];
    await vintageExplorerInstance.addWineProducer(wineProducerName,
      wineProducerWebsite,wineProducerAddress, { from: accounts[0] });
    const wineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress);
    const wineProducerId = wineProducer.wineProducerId;

    const wineName= 'test';
    const wineDescription = 'test description';
    const wineSku = 'test sku';
    const wineVintage = 1999;
    const wineTotalSupply = 100;
    const winePrice = web3.utils.toWei('5','ether');

    await vintageExplorerInstance.addWine(wineProducerId, wineName, wineDescription,
      wineSku,wineVintage,wineTotalSupply,winePrice, { from: accounts[1] });
    const updatedWineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress);
    const wineId = updatedWineProducer.numWines -1;
  
    console.log(`got wine id : ${JSON.stringify(wineId)}`);
    //Get wine name
    const wineDescriptionResults = await vintageExplorerInstance.readWineDescription(wineProducerId, wineId);
    const wineSalesResults = await vintageExplorerInstance.readWineSalesRelated(wineProducerId, wineId);
    assert.equal(wineDescriptionResults.name, wineName, `The name ${wineName} was not stored.`);
    assert.equal(wineDescriptionResults.description, wineDescription, `The description ${wineDescription} was not stored.`);
    assert.equal(wineDescriptionResults.sku, wineSku, `The sku ${wineSku} was not stored.`);
    assert.equal(wineDescriptionResults.vintage, wineVintage, `The vintage ${wineVintage} was not stored.`);
    assert.equal(wineSalesResults.totalSupply, wineTotalSupply, `The totalSupply ${wineTotalSupply} was not stored.`);
    assert.equal(wineSalesResults.price, winePrice, `The priceWei ${winePrice} was not stored.`);
  });
  it("...Ensure that you can't add wine producer with non admin account", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });
    // Add wine producer
    const wineProducerName = 'Test Wine Producer';
    const wineProducerWebsite = 'https://www.test.com';
    const wineProducerAddress = accounts[3];
    await truffleAssert.fails(
      vintageExplorerInstance.addWineProducer(wineProducerName,
        wineProducerWebsite,wineProducerAddress, { from: accounts[3] }),
      truffleAssert.ErrorType.REVERT
    );
  });
  it("...Ensure that you can't add more than one wine producer with same wine producer address", async () => {
      const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });
      // Add wine producer
      const wineProducerName = 'Test Wine Producer';
      const wineProducerWebsite = 'https://www.test.com';
      const wineProducerAddress = accounts[1];
      await truffleAssert.fails(
        vintageExplorerInstance.addWineProducer(wineProducerName,
          wineProducerWebsite,wineProducerAddress, { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT
      );
  });
  it("...Buy wine and ensure owner has the correct number of wines", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });
    const wineProducerAddress = accounts[1];
    const wineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress);
    const wineProducerId = wineProducer.wineProducerId;
    const updatedWineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress);
    const wineId = updatedWineProducer.numWines -1;
    console.log(`got wine id : ${JSON.stringify(wineId)}`);
    const numWine = 1;
    const sentValue = web3.utils.toWei('10','ether');

    await vintageExplorerInstance.buyWine(wineProducerId, wineId, numWine,
    {
      from : accounts[4],
      value : sentValue
    });
    const wineOwned = await vintageExplorerInstance.getOwnersNumberOfWines(wineProducerId, wineId,{
      from : accounts[4]
    });
    assert.equal(wineOwned, numWine, `The num wine ${numWine} was not stored.`);
  });
  it("...Ensure withdraw function transfer proper balance", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });
    const wineProducerAddress = accounts[1];
    const wineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress)    
    const oldBalance = await web3.eth.getBalance(accounts[1]);
    await vintageExplorerInstance.withdraw(
    {
      from : accounts[1],
    });
    const updatedWineProducer = await vintageExplorerInstance.readWineProducerByAccount(wineProducerAddress);
    const zeroBalance = updatedWineProducer.balance;
    assert.equal(zeroBalance, 0, `The balance is not set to zero ${zeroBalance}`);
    const updatedBalance = await web3.eth.getBalance(accounts[1]);
    console.log(`old balance ${oldBalance}, updated balance ${updatedBalance}`)
    assert(+oldBalance < +updatedBalance, `Old balance ${oldBalance} is greater than current balance ${updatedBalance}`);
  });
  it("...Ensure kill can not be called other than owner", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });
    vintageExplorerInstance.stopForEmergency({ from: accounts[0] });
    await truffleAssert.fails(
      vintageExplorerInstance.kill({ from: accounts[3] }),
      truffleAssert.ErrorType.REVERT
    );
  })
  it("...Ensure kill can be called by owner when stopped", async () => {
    const vintageExplorerInstance = await VintageExplorer.deployed({ from: accounts[0] });
    vintageExplorerInstance.kill({ from: accounts[0] });
  })
});
