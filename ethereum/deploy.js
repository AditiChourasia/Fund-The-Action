const HdWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = require("./config");
const Web3 = require("web3");

const {
  abi: CampaignFactoryAbi,
  evm: CampaignFactoryEvm,
} = require("./build/CampaignFactory.json");
const goerliTestNet =
  "https://goerli.infura.io/v3/a46f33a696a04f4b977d064a6200b180";

const provider = new HdWalletProvider(MNEMONIC, goerliTestNet);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const campaignFactory = await new web3.eth.Contract(CampaignFactoryAbi)
    .deploy({
      data: "0x" + CampaignFactoryEvm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "5000000",
    });

  console.log("Contract deployed to: ", campaignFactory.options.address);
  console.log(campaignFactory);
};

deploy();
