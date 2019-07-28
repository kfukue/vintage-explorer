# Vintage-Explorer Security Tools / Common Attacks:

## Re-entrancy Attacks
Implemented the following to prevent re-entrancy attacks.
Code : 
```javascript
    function withdraw()
        public
        stopInEmergency()
        onlyWineProducer()
        returns(bool success)
    {
        uint wineProducerId = wineProducerIdLookup[msg.sender];
        uint balance = wineProducers[wineProducerId].balance;
        require(balance > 0, 'There is not enough balance');
        wineProducers[wineProducerId].balance = 0;
        emit LogWithdrawal(msg.sender, balance);
        msg.sender.transfer(balance);
        return true;
    }
```
* Use transfer instead of call function
```javascript
msg.sender.transfer(balance);
```
* Change the state variable 'wineProducers[wineProducerId].balance' to 0 before transferring the amount. Also there is a condition check of the balance or else it will not revert.
```javascript
    require(balance > 0, 'There is not enough balance');
    wineProducers[wineProducerId].balance = 0;
```

## Integer Overflow and Underflow
Arithmetic is handled by OpenZeppelin's "Safe Math" library which would help prevent integer overflow and underflow. As an example below for "buyWine" function, we use ".add" for addition, ".sub" for subtraction, and ".mul" for multiplication.
```javascript
    using SafeMath for uint256;
    ...
    function buyWine(uint _wineProducerId, uint _wineId, uint numberOfPurchasingWines)
        public
        payable
        stopInEmergency()
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
    {
        uint winePrice = (wineProducers[_wineProducerId].wines[_wineId].priceWei) * ONE_WEI;
        uint purchaseAmount = winePrice.mul(numberOfPurchasingWines);
        require(msg.value >= purchaseAmount,
            'not enough value sent to buy wines');
        require(wineProducers[_wineProducerId].wines[_wineId].totalSupply
            >= numberOfPurchasingWines, 'Not enough wines left');
        uint ownersWineAmount = wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender];
        wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender] = ownersWineAmount.add(numberOfPurchasingWines);
        uint totalSales = wineProducers[_wineProducerId].wines[_wineId].totalSales;
        wineProducers[_wineProducerId].wines[_wineId].totalSales = totalSales.add(numberOfPurchasingWines);
        uint totalSupply = wineProducers[_wineProducerId].wines[_wineId].totalSupply;
        wineProducers[_wineProducerId].wines[_wineId].totalSupply = totalSupply.sub(numberOfPurchasingWines);
        uint balance = wineProducers[_wineProducerId].balance;
        wineProducers[_wineProducerId].balance = balance.add(purchaseAmount);
        emit LogBuyWine(msg.sender, _wineProducerId, _wineId, numberOfPurchasingWines);
        uint changeAmount = msg.value.sub(winePrice.mul(numberOfPurchasingWines));
        if(changeAmount > 0){
            emit LogGetRefund(msg.sender, _wineProducerId, _wineId, changeAmount);
            msg.sender.transfer(changeAmount);
        }
    }
```

#DoS with (Unexpected) revert
Instead of having the contract directly send ether to the wine producer whenever a user buys wine, having a pull withdraw system allows the wine producer to be able to claim their balance independently.
```javascript
    function buyWine(uint _wineProducerId, uint _wineId, uint numberOfPurchasingWines)
        public
        payable
        stopInEmergency()
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
    {
        uint winePrice = (wineProducers[_wineProducerId].wines[_wineId].priceWei) * ONE_WEI;
        uint purchaseAmount = winePrice.mul(numberOfPurchasingWines);
        require(msg.value >= purchaseAmount,
            'not enough value sent to buy wines');
        require(wineProducers[_wineProducerId].wines[_wineId].totalSupply
            >= numberOfPurchasingWines, 'Not enough wines left');
        uint ownersWineAmount = wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender];
        wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender] = ownersWineAmount.add(numberOfPurchasingWines);
        uint totalSales = wineProducers[_wineProducerId].wines[_wineId].totalSales;
        wineProducers[_wineProducerId].wines[_wineId].totalSales = totalSales.add(numberOfPurchasingWines);
        uint totalSupply = wineProducers[_wineProducerId].wines[_wineId].totalSupply;
        wineProducers[_wineProducerId].wines[_wineId].totalSupply = totalSupply.sub(numberOfPurchasingWines);
        uint balance = wineProducers[_wineProducerId].balance;
        wineProducers[_wineProducerId].balance = balance.add(purchaseAmount);
        emit LogBuyWine(msg.sender, _wineProducerId, _wineId, numberOfPurchasingWines);
        uint changeAmount = msg.value.sub(winePrice.mul(numberOfPurchasingWines));
        if(changeAmount > 0){
            emit LogGetRefund(msg.sender, _wineProducerId, _wineId, changeAmount);
            msg.sender.transfer(changeAmount);
        }
    }
    function withdraw()
        public
        stopInEmergency()
        onlyWineProducer()
        returns(bool success)
    {
        uint wineProducerId = wineProducerIdLookup[msg.sender];
        uint balance = wineProducers[wineProducerId].balance;
        require(balance > 0, 'There is not enough balance');
        wineProducers[wineProducerId].balance = 0;
        emit LogWithdrawal(msg.sender, balance);
        msg.sender.transfer(balance);
        return true;
    }
```

#Floating Point and Precision
The front end application displays the price of the individual wine per ether but in the contract, the price field is in wei in the struct Wine. This will make the price more precise and prevent any erroneous results when there are multiplications.
```javascript
    struct Wine {
        string name;
        string description;
        string sku;
        uint vintage;
        uint totalSupply;
        mapping (address => uint) owners;
        uint priceWei;
        uint totalSales;
        bool exists;
    }
    function buyWine(uint _wineProducerId, uint _wineId, uint numberOfPurchasingWines)
        public
        payable
        stopInEmergency()
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
    {
        uint winePrice = (wineProducers[_wineProducerId].wines[_wineId].priceWei) * ONE_WEI;
        uint purchaseAmount = winePrice.mul(numberOfPurchasingWines);
        require(msg.value >= purchaseAmount,
            'not enough value sent to buy wines');
        require(wineProducers[_wineProducerId].wines[_wineId].totalSupply
            >= numberOfPurchasingWines, 'Not enough wines left');
        uint ownersWineAmount = wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender];
        wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender] = ownersWineAmount.add(numberOfPurchasingWines);
        uint totalSales = wineProducers[_wineProducerId].wines[_wineId].totalSales;
        wineProducers[_wineProducerId].wines[_wineId].totalSales = totalSales.add(numberOfPurchasingWines);
        uint totalSupply = wineProducers[_wineProducerId].wines[_wineId].totalSupply;
        wineProducers[_wineProducerId].wines[_wineId].totalSupply = totalSupply.sub(numberOfPurchasingWines);
        uint balance = wineProducers[_wineProducerId].balance;
        wineProducers[_wineProducerId].balance = balance.add(purchaseAmount);
        emit LogBuyWine(msg.sender, _wineProducerId, _wineId, numberOfPurchasingWines);
        uint changeAmount = msg.value.sub(winePrice.mul(numberOfPurchasingWines));
        if(changeAmount > 0){
            emit LogGetRefund(msg.sender, _wineProducerId, _wineId, changeAmount);
            msg.sender.transfer(changeAmount);
        }
    }
```