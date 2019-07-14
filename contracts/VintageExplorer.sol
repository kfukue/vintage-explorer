pragma solidity ^0.5.0;

    /*
        The EventTicketsV2 contract keeps track of the details and ticket sales of multiple events.
     */
contract VintageExplorer {

    /*
        Define an public owner variable. Set it to the creator of the contract when it is initialized.
    */
    address payable public owner;
    uint   PRICE_TICKET = 100 wei;

    /*
        Create a variable to keep track of the wine ID numbers.
    */
    uint public idGenerator;
    
    /*
        Define an Event struct, similar to the V1 of this contract.
        The struct has 6 fields: description, website (URL), totalTickets, sales, buyers, and isOpen.
        Choose the appropriate variable type for each field.
        The "buyers" field should keep track of addresses and how many tickets each buyer purchases.
    */

    struct WineProducer {
        string name;
        string website;
        address wineProducerAddress;
        mapping (address => Wine) wines;
        bool isOpen;
    }

    struct Wine {
        string name;
        WineProducer wineProducer;
        string sku;
        uint vintage;
        uint totalSupply;
        mapping (address => uint) owners;
        bool isOpen;
    }

    /*
        Create a mapping to keep track of the events.
        The mapping key is an integer, the value is an Event struct.
        Call the mapping "events".
    */
    mapping (address => WineProducer) wineProducers;

    event LogWineProducerAdded(string name, address wineProducerAddress);
    event LogWineAdded(string name, address wineProducerAddress, string sku);
    event LogBuyWine(address buyer, uint wineId, uint numWInes);

    /*
        Create a modifier that throws an error if the msg.sender is not the owner.
    */
    // modifier isOwner { require(msg.sender == owner, 'msg.sender is not owner'); _; }

    // modifier verifyCaller (address _address) { require (msg.sender == _address, 'msg sender is not address'); _;}

    // modifier verifyWineProducer (address _address) { 
    //     require (msg.sender == _address, 'msg sender is not address');
    //     require (wineProducers[_address], 'wine producer does not exist');
    //     _;
    // }

    // modifier paidEnough(uint _price) { require(msg.value >= _price, 'msg value is not enough'); _;}

    // constructor() public {
    //     owner = msg.sender;
    // }

    // /*
    //     Define a function called addEvent().
    //     This function takes 3 parameters, an event description, a URL, and a number of tickets.
    //     Only the contract owner should be able to call this function.
    //     In the function:
    //         - Set the description, URL and ticket number in a new event.
    //         - set the event to open
    //         - set an event ID
    //         - increment the ID
    //         - emit the appropriate event
    //         - return the event's ID
    // */

    // function addWineProducer(string memory _name, string memory _website, address _wineProducerAddress)
    //     public
    //     isOwner()
    // {
    //     wineProducers[_wineProducerAddress] = WineProducer({
    //         name : _name,
    //         website : _website,
    //         owner : _wineProducerAddress,
    //         isOpen : true
    //     });
    //     emit LogWineProducerAdded(_name, _wineProducerAddress);
    // }

    // function addWine(address _wineProducerAddress, string memory _name, string memory _sku, uint _vintage, uint _totalSupply)
    //     public
    //     verifyWineProducer(_wineProducerAddress)
    // {
    //     wineProducers[_wineProducerAddress] = Wine({
    //         name : _name,
    //         sku : _sku,
    //         vintage : _vintage,
    //         totalSupply : _totalSupply,
    //         isOpen : true
    //     });
    //     emit LogWineAdded(_name, _wineProducerAddress, _sku);
    // }

    // function removeWine(address _wineProducerAddress, string memory _name, string memory _sku, uint _vintage, uint _totalSupply)
    //     public
    //     verifyWineProducer(_wineProducerAddress)
    // {
    //     wineProducers[_wineProducerAddress] = Wine({
    //         name : _name,
    //         sku : _sku,
    //         vintage : _vintage,
    //         totalSupply : _totalSupply,
    //         isOpen : true
    //     });
    //     emit LogWineAdded(_name, _wineProducerAddress, _sku);
    // }

    // /*
    //     Define a function called readEvent().
    //     This function takes one parameter, the event ID.
    //     The function returns information about the event this order:
    //         1. description
    //         2. URL
    //         3. ticket available
    //         4. sales
    //         5. isOpen
    // */     
    // function readEvent(uint eventId)
    //     public
    //     view 
    //     returns(string memory description, string memory website, uint totalTickets, uint sales, bool isOpen) 
    // {
    //     return (
    //         events[eventId].description,
    //         events[eventId].website,
    //         events[eventId].totalTickets,
    //         events[eventId].sales,
    //         events[eventId].isOpen
    //     );
    // }
    // /*
    //     Define a function called buyTickets().
    //     This function allows users to buy tickets for a specific event.
    //     This function takes 2 parameters, an event ID and a number of tickets.
    //     The function checks:
    //         - that the event sales are open
    //         - that the transaction value is sufficient to purchase the number of tickets
    //         - that there are enough tickets available to complete the purchase
    //     The function:
    //         - increments the purchasers ticket count
    //         - increments the ticket sale count
    //         - refunds any surplus value sent
    //         - emits the appropriate event
    // */

    // function buyTickets(uint eventId, uint numberOfPurchasingTickets)
    //     public
    //     payable
    // {
        
    //     require(events[eventId].isOpen == true, 'isOpen is false');
    //     require(msg.value >= PRICE_TICKET * numberOfPurchasingTickets, 'not enough value sent to buy tickets');
    //     require(events[eventId].totalTickets >= numberOfPurchasingTickets, 'Not enough tickets left');
    //     events[eventId].buyers[msg.sender] += numberOfPurchasingTickets;
    //     events[eventId].sales += numberOfPurchasingTickets;
    //     events[eventId].totalTickets -= numberOfPurchasingTickets;
    //     emit LogBuyTickets(msg.sender, eventId, numberOfPurchasingTickets);
    //     if(msg.value - PRICE_TICKET*numberOfPurchasingTickets > 0){
    //         uint amountToRefund = msg.value - PRICE_TICKET * numberOfPurchasingTickets;
    //         msg.sender.transfer(amountToRefund);
    //         emit LogGetRefund(msg.sender, eventId, amountToRefund);
    //     }
    // }

    // /*
    //     Define a function called getRefund().
    //     This function allows users to request a refund for a specific event.
    //     This function takes one parameter, the event ID.
    //     TODO:
    //         - check that a user has purchased tickets for the event
    //         - remove refunded tickets from the sold count
    //         - send appropriate value to the refund requester
    //         - emit the appropriate event
    // */

    // function getRefund(uint eventId)
    //     public
    // {
    //     uint numberOfTickets = events[eventId].buyers[msg.sender];
    //     require(numberOfTickets > 0, 'not enough tickets');
    //     uint amountToRefund = PRICE_TICKET * numberOfTickets;
    //     msg.sender.transfer(amountToRefund);
    //     emit LogGetRefund(msg.sender, eventId, amountToRefund);
    //     events[eventId].buyers[msg.sender] -= numberOfTickets;
    //     events[eventId].sales -= numberOfTickets;
    //     events[eventId].totalTickets += numberOfTickets;
    // }

    // /*
    //     Define a function called getBuyerNumberTickets()
    //     This function takes one parameter, an event ID
    //     This function returns a uint, the number of tickets that the msg.sender has purchased.
    // */
    // function getBuyerNumberTickets(uint eventId)
    //     public
    //     view 
    //     returns(uint purchasedTickets) 
    // {
    //     return events[eventId].buyers[msg.sender];
    // }
    // /*
    //     Define a function called endSale()
    //     This function takes one parameter, the event ID
    //     Only the contract owner can call this function
    //     TODO:
    //         - close event sales
    //         - transfer the balance from those event sales to the contract owner
    //         - emit the appropriate event
    // */
    // function endSale(uint eventId)
    //     public
    //     isOwner()
    // {
    //     events[eventId].isOpen = false;
    //     uint balance = address(this).balance;
    //     owner.transfer(balance);
    //     emit LogEndSale(msg.sender, balance, eventId);
    // }
}
