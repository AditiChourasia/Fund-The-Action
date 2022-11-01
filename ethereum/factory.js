let web3 = require("./web3");
const Web3 = require("web3");
const { abi } = require("./build/CampaignFactory.json");
const CONTRACT_FACTORY_DEPLOYED_ADDRESS = require("./contractFactoryAddress");

let instance;
if (!web3 || !web3.eth) {
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://goerli.infura.io/v3/a46f33a696a04f4b977d064a6200b180"
    )
  );
} else {
  console.log("Metamask");
}
instance = new web3.eth.Contract(abi, CONTRACT_FACTORY_DEPLOYED_ADDRESS);

export default instance;
