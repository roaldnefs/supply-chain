const SupplyChain = artifacts.require("SupplyChain");
const truffleAssertions = require('truffle-assertions');
const truffleAssert = require('truffle-assertions');

contract("SupplyChain", accounts => {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1;
    var upc = 1;
    const ownerID = accounts[0];
    const originFisherID = accounts[1];
    const originFisherName = "John Doe";
    const originFisherInformation = "Yarray Valley";
    const originFisherLatitude = "-38.239770";
    const originFisherLongitude = "144.341490";
    var productID = sku + upc;
    const productNotes = "Shrimply the best";
    const productPrice = web3.utils.toWei('1', "ether");
    var itemState = 0;
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];
    const emptyAddress = '0x00000000000000000000000000000000000000';

    // Print some additional inforamtion on the screen
    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Fisher: accounts[1] ", accounts[1]);
    console.log("Distributor: accounts[2] ", accounts[2]);
    console.log("Retailer: accounts[3] ", accounts[3]);
    console.log("Consumer: accounts[4] ", accounts[4]);

    it("Testing smart contract function fishItem() that allows a fisher to fish an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Mark an item as Fished by calling function fishItem()
        let tx = await instance.fishItem(upc, originFisherID, originFisherName, originFisherInformation, originFisherLatitude, originFisherLongitude, productNotes);

        // Check the emmited event Fished()
        truffleAssertions.eventEmitted(tx, 'Fished', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferRaw = await instance.fetchItemBufferRaw.call(upc);
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferRaw[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferRaw[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferRaw[2], originFisherID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferRaw[3], originFisherID, 'Error: Missing or Invalid originFisherID');
        assert.equal(resultBufferRaw[4], originFisherName, 'Error: Missing or Invalid originFisherName');
        assert.equal(resultBufferRaw[5], originFisherInformation, 'Error: Missing or Invalid originFisherInformation');
        assert.equal(resultBufferRaw[6], originFisherLatitude, 'Error: Missing or Invalid originFisherLatitude');
        assert.equal(resultBufferRaw[7], originFisherLongitude, 'Error: Missing or Invalid originFisherLongitude');
        assert.equal(resultBufferProcessed[5], 0, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function sellItem() that allows a fisher to sell an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the account that will be calling the sellItem() function as a fisher
        await instance.addFisher(originFisherID);
        
        // Mark an item as ForSale by calling function sellItem()
        let tx = await instance.sellItem(upc, productPrice, {from: originFisherID});

        // Check the emmited event ForSale()
        truffleAssertions.eventEmitted(tx, 'ForSale', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        // const resultBufferRaw = await instance.fetchItemBufferRaw.call(upc);
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferProcessed[5], 1, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function buyItem() that allows a distributor to buy an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the account that will be calling the buyItem() function as a distributor
        await instance.addDistributor(distributorID);
        
        // Mark an item as Sold by calling function buyItem()
        let tx = await instance.buyItem(upc, {from: distributorID, value: web3.utils.toWei('1', "ether")});

        // Check the emmited event Sold()
        truffleAssertions.eventEmitted(tx, 'Sold', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferRaw = await instance.fetchItemBufferRaw.call(upc);
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferRaw[2], distributorID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferProcessed[5], 2, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function processItem() that allows a distributor to process an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;
        
        // Mark an item as Processed by calling function processItem()
        let tx = await instance.processItem(upc, {from: distributorID});

        // Check the emmited event Processed()
        truffleAssertions.eventEmitted(tx, 'Processed', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferProcessed[5], 3, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function packItem() that allows a distributor to pack an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;
        
        // Mark an item as Packed by calling function packItem()
        let tx = await instance.packItem(upc, {from: distributorID});

        // Check the emmited event Packed()
        truffleAssertions.eventEmitted(tx, 'Packed', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferProcessed[5], 4, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function shipItem() that allows a distributor to ship an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;
        
        // Mark an item as Shipped by calling function shipItem()
        let tx = await instance.shipItem(upc, {from: distributorID});

        // Check the emmited event Shipped()
        truffleAssertions.eventEmitted(tx, 'Shipped', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferProcessed[5], 5, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function receiveItem() that allows a retailer to receive an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the account that will be calling the receiveItem() function as a retailer
        await instance.addRetailer(retailerID);
        
        // Mark an item as Received by calling function receiveItem()
        let tx = await instance.receiveItem(upc, {from: retailerID});

        // Check the emmited event Received()
        truffleAssertions.eventEmitted(tx, 'Received', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferRaw = await instance.fetchItemBufferRaw.call(upc);
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferRaw[2], retailerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferProcessed[5], 6, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[7], retailerID, 'Error: Missing or Invalid retailerID');
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function purchaseItem() that allows a consumer to purchase an item", async () => {
        const instance = await SupplyChain.deployed();

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the account that will be calling the purchaseItem() function as a consumer
        await instance.addConsumer(consumerID);
        
        // Mark an item as Purchased by calling function purchaseItem()
        let tx = await instance.purchaseItem(upc, {from: consumerID, value: web3.utils.toWei('1', "ether")});

        // Check the emmited event Purchased()
        truffleAssertions.eventEmitted(tx, 'Purchased', (ev) => {
            eventEmitted = true;
            return true;
        });

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferRaw = await instance.fetchItemBufferRaw.call(upc);
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferRaw[2], consumerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferProcessed[5], 7, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[8], consumerID, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, "Invalid event emitted");
    });

    it("Testing smart contract function fetchItemBufferRaw() that allows anyone to fetch item details from blockchain", async () => {
        const instance = await SupplyChain.deployed();

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferRaw = await instance.fetchItemBufferRaw.call(upc);

        // Verify the result set
        assert.equal(resultBufferRaw[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferRaw[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferRaw[2], consumerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferRaw[3], originFisherID, 'Error: Missing or Invalid originFisherID');
        assert.equal(resultBufferRaw[4], originFisherName, 'Error: Missing or Invalid originFisherName');
        assert.equal(resultBufferRaw[5], originFisherInformation, 'Error: Missing or Invalid originFisherInformation');
        assert.equal(resultBufferRaw[6], originFisherLatitude, 'Error: Missing or Invalid originFisherLatitude');
        assert.equal(resultBufferRaw[7], originFisherLongitude, 'Error: Missing or Invalid originFisherLongitude');
    });

    it("Testing smart contract function fetchItemBufferProcessed() that allows anyone to fetch item details from blockchain", async () => {
        const instance = await SupplyChain.deployed();

        // Retrieve the saved item from the blockchain by calling the fetchItem() functions
        const resultBufferProcessed = await instance.fetchItemBufferProcessed.call(upc);

        // Verify the result set
        assert.equal(resultBufferProcessed[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferProcessed[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferProcessed[2], productID, 'Error: Missing or Invalid productID');
        assert.equal(resultBufferProcessed[3], productNotes, 'Error: Missing or Invalid productNotes');
        assert.equal(resultBufferProcessed[4], productPrice, 'Error: Missing or Invalid productPrice');
        assert.equal(resultBufferProcessed[5], 7, 'Error: Invalid item State');
        assert.equal(resultBufferProcessed[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferProcessed[7], retailerID, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferProcessed[8], consumerID, 'Error: Missing or Invalid consumerID');
    });
});