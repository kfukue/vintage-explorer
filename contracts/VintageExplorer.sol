pragma solidity ^0.5.0;

    /*
        The EventTicketsV2 contract keeps track of the details and ticket sales of multiple events.
     */
contract VintageExplorer{

    /*
        Define an public owner variable. Set it to the creator of the contract when it is initialized.
    */
    address payable public owner;
    bool public stopped = false;
    address backendContract;
    address[] previousBackends;

    uint   PRICE_TICKET = 100 wei;

    /*
        Create a variable to keep track of the wine ID numbers.
    */
    uint public numWineProducers;

    
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
        uint numWines;
        mapping (uint => Wine) wines;
        bool exists;
        bool isOpen;
    }

    struct Wine {
        string name;
        string description;
        string sku;
        uint vintage;
        uint totalSupply;
        mapping (address => uint) owners;
        uint price;
        uint totalSales;
        bool exists;
        bool isOpen;
    }

    mapping (address => bool) admins;
    /*
        Create a mapping to keep track of the events.
        The mapping key is an integer, the value is an Event struct.
        Call the mapping "events".
    */
    mapping (uint => WineProducer) wineProducers;

    event LogWineProducerAdded(string name, address wineProducerAddress, uint wineProducerId);
    event LogWineAdded(string name, address wineProducerAddress, string sku, uint wineId);
    event LogWineReOpened(string name, address wineProducerAddress, uint wineId);
    event LogWineClosed(string name, address wineProducerAddress, uint wineId);
    event LogBuyWine(address buyer,uint wineProducerId, uint wineId, uint numWInes);
    event LogGetRefund(address buyer,uint wineProducerId, uint wineId, uint amountToRefund);
    event LogEndSale(address wineProducerAddress,uint balance, uint wineProducerId, uint wineId);
    

    /*
        Create a modifier that throws an error if the msg.sender is not the owner.
    */
    modifier onlyOwner { require(msg.sender == owner, 'msg.sender is not owner'); _; }
    modifier onlyAdmin { require(admins[msg.sender] == true, 'msg.sender is not admin'); _; }
    modifier stopInEmergency { require(!stopped); _;}
    modifier onlyInEmergency { require(stopped); _;}

    modifier verifyCaller (address _address) { require (msg.sender == _address, 'msg sender is not address'); _;}

    modifier verifyWineProducer (uint _wineProducerId) {
        require (wineProducers[_wineProducerId].exists, 'wine producer does not exist');
        require (wineProducers[_wineProducerId].wineProducerAddress == msg.sender, 'wine producer address does not match');
        _;
    }

    modifier checkIfWineProducerAndWineExists(uint _wineProducerId, uint _wineId) {
        require(wineProducers[_wineProducerId].exists == true, 'wine producer does not exist');
        require(wineProducers[_wineProducerId].wines[_wineId].exists == true, 'wine does not exist');
        _;
    }

    modifier paidEnough(uint _price) { require(msg.value >= _price, 'msg value is not enough'); _;}

    constructor() public {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    function addAdmin(address _a)
        public
        onlyAdmin
        returns(bool)
    {
        admins[_a] = true;
        return true;
    }

    function kill()
        public
        onlyOwner
    {
        selfdestruct(owner);
    }

    function changeBackend(address newBackend) public
        onlyOwner()
        returns (bool)
    {
        if(newBackend != backendContract) {
            previousBackends.push(backendContract);
            backendContract = newBackend;
            return true;
        }
        return false;
    }

    /*
        Define a function called addEvent().
        This function takes 3 parameters, an event description, a URL, and a number of tickets.
        Only the contract owner should be able to call this function.
        In the function:
            - Set the description, URL and ticket number in a new event.
            - set the event to open
            - set an event ID
            - increment the ID
            - emit the appropriate event
            - return the event's ID
    */

    function addWineProducer(string memory _name, string memory _website, address _wineProducerAddress)
        public
        onlyAdmin()
        returns(uint)
    {
        uint newId = numWineProducers;
        wineProducers[newId] = WineProducer({
            name : _name,
            website : _website,
            wineProducerAddress : _wineProducerAddress,
            numWines : 0,
            exists : true,
            isOpen : true
        });
        emit LogWineProducerAdded(_name, _wineProducerAddress, newId);
        numWineProducers++;
        return newId;
    }

    function addWine(address _wineProducerAddress, uint wineProducerId, string memory _name,
        string memory _description, string memory _sku, uint _vintage, uint _totalSupply, uint _price)
        public
        verifyWineProducer(wineProducerId)
        returns(uint)
    {
        uint newId = wineProducers[wineProducerId].numWines;
        require(newId >= 0, "newId is not greater than or equal to 0");
        wineProducers[wineProducerId].wines[newId] = Wine({
            name : _name,
            description : _description,
            sku : _sku,
            vintage : _vintage,
            totalSupply : _totalSupply,
            price : _price,
            totalSales : 0,
            exists : true,
            isOpen : true
        });
        emit LogWineAdded(_name, _wineProducerAddress, _sku, newId);
        wineProducers[wineProducerId].numWines++;
        return newId;
    }

    function reOpenWine(address _wineProducerAddress, uint _wineProducerId, uint _wineId)
        public
        verifyWineProducer(_wineProducerId)
    {
        require(_wineId >= 0, "wineId is not greater than or equal to 0");
        wineProducers[_wineProducerId].isOpen = false;
        emit LogWineReOpened(wineProducers[_wineProducerId].name, _wineProducerAddress, _wineId);
    }

    function closeWine(address _wineProducerAddress, uint _wineProducerId, uint _wineId)
        public
        verifyWineProducer( _wineProducerId)
    {
        require(_wineId >= 0, "wineId is not greater than or equal to 0");
        wineProducers[_wineProducerId].isOpen = true;
        emit LogWineReOpened(wineProducers[_wineProducerId].name, _wineProducerAddress, _wineId);
    }

    /*
        Define a function called readEvent().
        This function takes one parameter, the event ID.
        The function returns information about the event this order:
            1. description
            2. URL
            3. ticket available
            4. sales
            5. isOpen
    */
    function readWineProducer(uint wineProducerId)
        public
        view
        returns(string memory name, string memory website,
        address wineProducerAddress, uint numWines, bool isOpen)
    {
        return (
            wineProducers[wineProducerId].name,
            wineProducers[wineProducerId].website,
            wineProducers[wineProducerId].wineProducerAddress,
            wineProducers[wineProducerId].numWines,
            wineProducers[wineProducerId].isOpen
        );
    }
    /*
        Define a function called readEvent().
        This function takes one parameter, the event ID.
        The function returns information about the event this order:
            1. description
            2. URL
            3. ticket available
            4. sales
            5. isOpen
    */
    function readWine(uint wineProducerId, uint wineId)
        public
        view
        returns(string memory name, string memory description,
        string memory sku, uint vintage, uint totalSupply, bool isOpen)
    {
        return (
            wineProducers[wineProducerId].wines[wineId].name,
            wineProducers[wineProducerId].wines[wineId].description,
            wineProducers[wineProducerId].wines[wineId].sku,
            wineProducers[wineProducerId].wines[wineId].vintage,
            wineProducers[wineProducerId].wines[wineId].totalSupply,
            wineProducers[wineProducerId].wines[wineId].isOpen
        );
    }
    
    
    /*
        Define a function called buyTickets().
        This function allows users to buy tickets for a specific event.
        This function takes 2 parameters, an event ID and a number of tickets.
        The function checks:
            - that the event sales are open
            - that the transaction value is sufficient to purchase the number of tickets
            - that there are enough tickets available to complete the purchase
        The function:
            - increments the purchasers ticket count
            - increments the ticket sale count
            - refunds any surplus value sent
            - emits the appropriate event
    */

    function buyWine(uint wineProducerId, uint wineId, uint numberOfPurchasingWines)
        public
        payable
        checkIfWineProducerAndWineExists(wineProducerId, wineId)
    {
        uint winePrice = wineProducers[wineProducerId].wines[wineId].price;
        require(msg.value >=
            winePrice * numberOfPurchasingWines,
            'not enough value sent to buy wines');
        require(wineProducers[wineProducerId].wines[wineId].totalSupply
            >= numberOfPurchasingWines, 'Not enough wines left');
        wineProducers[wineProducerId].wines[wineId].owners[msg.sender] += numberOfPurchasingWines;
        wineProducers[wineProducerId].wines[wineId].totalSales += numberOfPurchasingWines;
        wineProducers[wineProducerId].wines[wineId].totalSupply -= numberOfPurchasingWines;
        emit LogBuyWine(msg.sender, wineProducerId, wineId, numberOfPurchasingWines);
        if(msg.value -
            winePrice*numberOfPurchasingWines > 0
        ){
            uint amountToRefund = msg.value - winePrice * numberOfPurchasingWines * numberOfPurchasingWines;
            msg.sender.transfer(amountToRefund);
            emit LogGetRefund(msg.sender, wineProducerId, wineId, amountToRefund);
        }
    }

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

    function getRefund(uint wineProducerId, uint wineId)
        public
        checkIfWineProducerAndWineExists(wineProducerId, wineId)
    {
        uint numberOfWines = wineProducers[wineProducerId].wines[wineId].owners[msg.sender];
        uint winePrice = wineProducers[wineProducerId].wines[wineId].price;
        require(numberOfWines > 0, 'not enough wines');
        uint amountToRefund = winePrice * numberOfWines;
        msg.sender.transfer(amountToRefund);
        emit LogGetRefund(msg.sender, wineProducerId, wineId, amountToRefund);
        wineProducers[wineProducerId].wines[wineId].owners[msg.sender] -= numberOfWines;
        wineProducers[wineProducerId].wines[wineId].totalSales -= numberOfWines;
        wineProducers[wineProducerId].wines[wineId].totalSupply += numberOfWines;
    }

    // /*
    //     Define a function called getBuyerNumberTickets()
    //     This function takes one parameter, an event ID
    //     This function returns a uint, the number of tickets that the msg.sender has purchased.
    // */
    function getOwnersNumberOfWines(uint wineProducerId, uint wineId)
        public
        view
        checkIfWineProducerAndWineExists(wineProducerId, wineId)
        returns(uint purchasedWines)
    {
        return wineProducers[wineProducerId].wines[wineId].owners[msg.sender];
    }
    // /*
    //     Define a function called endSale()
    //     This function takes one parameter, the event ID
    //     Only the contract owner can call this function
    //     TODO:
    //         - close event sales
    //         - transfer the balance from those event sales to the contract owner
    //         - emit the appropriate event
    // */
    function endSale(uint wineProducerId, uint wineId)
        public
        verifyWineProducer(wineProducerId)
        checkIfWineProducerAndWineExists(wineProducerId, wineId)
    {
        wineProducers[wineProducerId].wines[wineId].isOpen = false;
        uint balance = address(wineProducers[wineProducerId].wineProducerAddress).balance;
        owner.transfer(balance);
        emit LogEndSale(msg.sender, balance, wineProducerId, wineId);
    }
}
