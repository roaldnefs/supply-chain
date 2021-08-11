import Web3 from "web3";
import supplyChainArtifact from "../../build/contracts/SupplyChain.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = supplyChainArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        supplyChainArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.fetchEvents();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  fetchRaw: async function() {
    // Retrieve UPC from form
    const upc = document.getElementById('upc').value;

    // Call fetchItemBufferRaw on the smart contract
    const { fetchItemBufferRaw } = this.meta.methods;
    const result = await fetchItemBufferRaw(upc).call();

    // Show results on the screen
    document.getElementById('sku').value = result.itemSKU;
    document.getElementById('ownerID').value = result.ownerID;
    document.getElementById('originFisherID').value = result.originFisherID;
  },

  fetchProcessed: async function() {
    // Retrieve UPC from form
    const upc = document.getElementById('upc').value;

    // Call fetchItemBufferProcessed on the smart contract
    const { fetchItemBufferProcessed } = this.meta.methods;
    const result = await fetchItemBufferProcessed(upc).call();

    // Determine the product state
    let state = "Unknown";
    switch (result.itemState) {
      case "0":
        state = "Fished";
        break;
      case "1":
        state = "For Sale";
        break;
      case "2":
        state = "Sold";
        break;
      case "3":
        state = "Processed";
        break;
      case "4":
        state = "Packed";
        break;
      case "5":
        state = "Shipped";
        break;
      case "6":
        state = "Received";
        break;
      case "7":
        state = "Purchased";
        break;
    }

    // Show results on the screen
    document.getElementById('productNotes').value = result.productNotes;
    document.getElementById('productPrice').value = result.productPrice;
    document.getElementById('distributorID').value = result.distributorID;
    document.getElementById('retailerID').value = result.retailerID;
    document.getElementById('consumerID').value = result.consumerID;
    document.getElementById('itemState').value = state;
  },

  // Fetch events from smart contract
  fetchEvents: async function() {
    const { allEvents } = this.meta.events;
    let events = await allEvents();

    events.on('data', function(event){
      var element = document.getElementById('ftc-events');

      if (! element.innerHTML.includes(event.transactionHash)) {
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(event.event + ' - ' + event.transactionHash));
        element.appendChild(entry);
      }
    });
  },

  fishItem: async function () {
    const upc = document.getElementById('upc').value;
    const fisherID = this.account;
    const fisherName = document.getElementById('originFisherName').value;
    const fisherInformation = document.getElementById('originFisherInformation').value;
    const fisherLatitude = document.getElementById('originFisherLatitude').value;
    const fisherLongitude = document.getElementById('originFisherLongitude').value;
    const productNotes = document.getElementById('productNotes').value;

    const { fishItem } = this.meta.methods;
    await fishItem(
      upc,
      fisherID,
      fisherName,
      fisherInformation,
      fisherLatitude,
      fisherLongitude,
      productNotes
    ).send({ from: this.account });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  sellItem: async function() {
    const upc = document.getElementById('upc').value;
    const price = document.getElementById('productPrice').value;

    const { sellItem } = this.meta.methods;
    await sellItem(upc, price).send({ from: this.account });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  buyItem: async function() {
    const upc = document.getElementById('upc').value;
    const price = document.getElementById('productPrice').value;

    const { buyItem } = this.meta.methods;
    await buyItem(upc).send({ from: this.account, value: this.web3.utils.toWei(price, "ether") });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  processItem: async function() {
    const upc = document.getElementById('upc').value;

    const { processItem } = this.meta.methods;
    await processItem(upc).send({ from: this.account });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  packItem: async function() {
    const upc = document.getElementById('upc').value;

    const { packItem } = this.meta.methods;
    await packItem(upc).send({ from: this.account });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  shipItem: async function() {
    const upc = document.getElementById('upc').value;

    const { shipItem } = this.meta.methods;
    await shipItem(upc).send({ from: this.account });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  receiveItem: async function() {
    const upc = document.getElementById('upc').value;

    const { receiveItem } = this.meta.methods;
    await receiveItem(upc).send({ from: this.account });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  },

  purchaseItem: async function() {
    const upc = document.getElementById('upc').value;
    const price = document.getElementById('productPrice').value;

    const { purchaseItem } = this.meta.methods;
    await purchaseItem(upc).send({ from: this.account, value: this.web3.utils.toWei(price, "ether") });

    // Update raw product details
    this.fetchRaw();
    this.fetchProcessed();
    this.fetchEvents();
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
