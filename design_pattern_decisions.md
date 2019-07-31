# Vintage-Explorer Design Pattern Requirements

## Implement a circuit breaker
Added public variable "stopped" and two modifiers to implement circuit breakers.
```javascript
    bool public stopped = false;
    modifier stopInEmergency { require(!stopped); _;}
    modifier onlyInEmergency { require(stopped); _;}
```

## Implement Mortal
Added function kill to self destruct the contract to destroy and remove it from the blockchain. This can only be called by the owner of the contract and the circuit breaker needs to be on (stopped needs to be true).
```javascript
    function kill()
        public
        onlyOwner()
        onlyInEmergency()
    {
        selfdestruct(owner);
    }
```

## Fail early and fail loud
Used "require" instead of "if" for checking condition in the contract so that the function will throw an exception as soon as the condition is not met.
There are many parts of the code that use this and this is an example where require is used to check for the contract caller's value to see if it satisfies the amount when buying wine. 
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
```

## Pull over Push Payments (also known as the Withdrawal Pattern)
User will need to withdraw (pull) for collecting the balance from the contract. This contract does not push Ether amount to the wine producers.
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
## Design Patterns That Were Not Used
* Speed Bump
    * Since this is more of a market place, users can withdraw the amount as soon as they ship the shipments to their clients.
    * In the future, it could be useful to put some speed bump of when the wine producer can withdraw their balance and if there is a refund function, it can give the buyer some time window to request for a refund.
* State Machine
    * This could be more useful for auctions so maybe in the future I can implement this design.