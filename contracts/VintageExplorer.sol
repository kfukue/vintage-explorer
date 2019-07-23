pragma solidity ^0.5.0;

import "./SafeMath.sol";

/*
    Vintage Explorer contract keeps track of wine producers and wines on the blockchain.
    Buyers can manage their inventory and buy wines.
*/
contract VintageExplorer{

    using SafeMath for uint256;
    /*
        Define an public owner variable. Set it to the creator of the contract when it is initialized.
    */
    address payable public owner;
    bool public stopped = false;
    address backendContract;
    address[] previousBackends;

    /*
        Define an public owner variable. Set it to the creator of the contract when it is initialized.
    */
    uint ONE_WEI = 1 wei;

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
        address wineProducer;
        uint numWines;
        mapping (uint => Wine) wines;
        bool exists;
    }

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

    mapping (address => bool) admins;
    /*
        Create a mapping to keep track of the events.
        The mapping key is an integer, the value is an Event struct.
        Call the mapping "events".
    */
    mapping (uint => WineProducer) wineProducers;
    mapping (address => bool) wineProducersExists;
    mapping (address => uint) wineProducerIdLookup;

    event LogWineProducerAdded(string name, address wineProducer, uint wineProducerId);
    event LogWineAdded(string name, address wineProducer, string sku, uint wineId);
    event LogWineReOpened(string name, address wineProducer, uint wineId);
    event LogWineClosed(string name, address wineProducer, uint wineId);
    event LogBuyWine(address buyer,uint wineProducerId, uint wineId, uint numWInes);
    event LogGetRefund(address buyer,uint wineProducerId, uint wineId, uint amountToRefund);

    /*
        Create a modifier that throws an error if the msg.sender is not the owner.
    */
    modifier onlyOwner { require(msg.sender == owner, 'msg.sender is not owner'); _; }
    modifier onlyAdmin { require(admins[msg.sender] == true, 'msg.sender is not admin'); _; }
    modifier stopInEmergency { require(!stopped); _;}
    modifier onlyInEmergency { require(stopped); _;}

    modifier verifyCaller (address _address) { require (msg.sender == _address, 'msg sender is not address'); _;}

    modifier onlyWineProducer () {
        require (wineProducersExists[msg.sender] == true, 'wine producer does not exist');
        uint wineProducerId = wineProducerIdLookup[msg.sender];
        require (wineProducers[wineProducerId].exists, 'wine producer does not exist');
        require (wineProducers[wineProducerId].wineProducer == msg.sender, 'wine producer address does not match');
        _;
    }

    modifier checkIfWineProducerAndWineExists(uint _wineProducerId, uint _wineId) {
        require(wineProducers[_wineProducerId].exists == true, 'wine producer does not exist');
        require(wineProducers[_wineProducerId].wines[_wineId].exists == true, 'wine does not exist');
        _;
    }

    modifier checkIfWineProducerIsNew(address wineProducer) {
        require(wineProducersExists[wineProducer] == false, 'wine producer already exists');
        _;
    }

    constructor() public {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    function addAdmin(address _a)
        public
        onlyAdmin()
        stopInEmergency()
        returns(bool)
    {
        admins[_a] = true;
        return true;
    }

    function stopForEmergency()
        public
        onlyOwner()
        returns(bool)
    {
        stopped = true;
        return true;
    }

    function turnOffEmergency()
        public
        onlyOwner()
        returns(bool)
    {
        stopped = false;
        return true;
    }

    function kill()
        public
        onlyOwner()
        onlyInEmergency()
    {
        selfdestruct(owner);
    }

    function changeBackend(address _newBackend) public
        onlyOwner()
        onlyInEmergency()
        returns (bool)
    {
        if(_newBackend != backendContract) {
            previousBackends.push(backendContract);
            backendContract = _newBackend;
            return true;
        }
        return false;
    }

    function checkIfAdmin()
        public
        view
        returns(bool)
    {
        return admins[msg.sender];
    }

    function checkIfWineProducer()
        public
        view
        returns(bool)
    {
        return wineProducersExists[msg.sender];
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

    function addWineProducer(string memory _name, string memory _website, address _wineProducer)
        public
        stopInEmergency()
        onlyAdmin()
        checkIfWineProducerIsNew(_wineProducer)
        returns(uint)
    {
        uint newId = numWineProducers;
        wineProducers[newId] = WineProducer({
            name : _name,
            website : _website,
            wineProducer : _wineProducer,
            numWines : 0,
            exists : true
        });
        wineProducersExists[_wineProducer] = true;
        wineProducerIdLookup[_wineProducer] = newId;
        emit LogWineProducerAdded(_name, _wineProducer, newId);
        numWineProducers++;
        return newId;
    }

    function addWine(uint _wineProducerId, string memory _name,
        string memory _description, string memory _sku, uint _vintage,
        uint _totalSupply, uint _priceWei)
        public
        stopInEmergency()
        onlyWineProducer()
        returns(uint)
    {
        uint newId = wineProducers[_wineProducerId].numWines;
        require(newId >= 0, "newId is not greater than or equal to 0");
        wineProducers[_wineProducerId].wines[newId] = Wine({
            name : _name,
            description : _description,
            sku : _sku,
            vintage : _vintage,
            totalSupply : _totalSupply,
            priceWei : _priceWei,
            totalSales : 0,
            exists : true
        });
        emit LogWineAdded(_name, msg.sender, _sku, newId);
        wineProducers[_wineProducerId].numWines++;
        return newId;
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
    function readWineProducerById(uint _wineProducerId)
        public
        view
        returns(string memory name, string memory website,
        uint numWines)
    {
        return (
            wineProducers[_wineProducerId].name,
            wineProducers[_wineProducerId].website,
            wineProducers[_wineProducerId].numWines
        );
    }

    function readWineProducerByAccount(address _wineProducer)
        public
        view
        returns(uint wineProducerId, string memory name, string memory website,
        uint numWines)
    {
        return (
            wineProducerIdLookup[_wineProducer],
            wineProducers[wineProducerIdLookup[_wineProducer]].name,
            wineProducers[wineProducerIdLookup[_wineProducer]].website,
            wineProducers[wineProducerIdLookup[_wineProducer]].numWines
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
    function readWineDescription(uint _wineProducerId, uint _wineId)
        public
        view
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
        returns(string memory name, string memory description,
        string memory sku, uint vintage
        )
    {
        return (
            wineProducers[_wineProducerId].wines[_wineId].name,
            wineProducers[_wineProducerId].wines[_wineId].description,
            wineProducers[_wineProducerId].wines[_wineId].sku,
            wineProducers[_wineProducerId].wines[_wineId].vintage
        );
    }

    function readWineSalesRelated(uint _wineProducerId, uint _wineId)
        public
        view
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
        returns(string memory name, uint totalSupply,
        uint price, uint totalSales)
    {
        return (
            wineProducers[_wineProducerId].wines[_wineId].name,
            wineProducers[_wineProducerId].wines[_wineId].totalSupply,
            wineProducers[_wineProducerId].wines[_wineId].priceWei,
            wineProducers[_wineProducerId].wines[_wineId].totalSales
        );
    }

    function checkIfWineIsOwned(uint _wineProducerId, uint _wineId)
        public
        view
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
        returns(string memory name, uint totalAmountOwned)
    {
        return (
            wineProducers[_wineProducerId].wines[_wineId].name,
            wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender]
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

    function buyWine(uint _wineProducerId, uint _wineId, uint numberOfPurchasingWines)
        public
        payable
        stopInEmergency()
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
    {
        uint winePrice = (wineProducers[_wineProducerId].wines[_wineId].priceWei) * ONE_WEI;
        require(msg.value >=
            winePrice * numberOfPurchasingWines,
            'not enough value sent to buy wines');
        require(wineProducers[_wineProducerId].wines[_wineId].totalSupply
            >= numberOfPurchasingWines, 'Not enough wines left');
        wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender] =
         wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender].add(numberOfPurchasingWines);
        wineProducers[_wineProducerId].wines[_wineId].totalSales =
            wineProducers[_wineProducerId].wines[_wineId].totalSales.add(numberOfPurchasingWines);
        wineProducers[_wineProducerId].wines[_wineId].totalSupply =
            wineProducers[_wineProducerId].wines[_wineId].totalSupply.sub(numberOfPurchasingWines);
        emit LogBuyWine(msg.sender, _wineProducerId, _wineId, numberOfPurchasingWines);
        if(msg.value -
            winePrice*numberOfPurchasingWines > 0
        ){
            uint amountToRefund = msg.value - winePrice * numberOfPurchasingWines * numberOfPurchasingWines;
            emit LogGetRefund(msg.sender, _wineProducerId, _wineId, amountToRefund);
            msg.sender.transfer(amountToRefund);
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

    function getRefund(uint _wineProducerId, uint _wineId)
        public
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
        returns(uint)
    {
        uint numberOfWines = wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender];
        uint winePrice = wineProducers[_wineProducerId].wines[_wineId].priceWei * ONE_WEI;
        require(numberOfWines > 0, 'not enough wines');
        uint amountToRefund = winePrice * numberOfWines;
        wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender] -= numberOfWines;
        wineProducers[_wineProducerId].wines[_wineId].totalSales -= numberOfWines;
        wineProducers[_wineProducerId].wines[_wineId].totalSupply += numberOfWines;
        emit LogGetRefund(msg.sender, _wineProducerId, _wineId, amountToRefund);
        msg.sender.transfer(amountToRefund);
        return amountToRefund;
    }

    // /*
    //     Define a function called getBuyerNumberTickets()
    //     This function takes one parameter, an event ID
    //     This function returns a uint, the number of tickets that the msg.sender has purchased.
    // */
    function getOwnersNumberOfWines(uint _wineProducerId, uint _wineId)
        public
        view
        checkIfWineProducerAndWineExists(_wineProducerId, _wineId)
        returns(uint purchasedWines)
    {
        return wineProducers[_wineProducerId].wines[_wineId].owners[msg.sender];
    }
}
