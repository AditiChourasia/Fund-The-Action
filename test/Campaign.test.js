const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider()); // connecting web3 to local test network ganache
const {
  abi: CampaignAbi,
  evm: CampaignEvm,
} = require("../ethereum/build/Campaign.json");
const {
  abi: CampaignFactoryAbi,
  evm: CampaignFactoryEvm,
} = require("../ethereum/build/CampaignFactory.json");

let accounts;
let campaign;
let campaignFactory;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await new web3.eth.Contract(CampaignFactoryAbi)
    .deploy({
      data: "0x" + CampaignFactoryEvm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "10000000" });

  await campaignFactory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  const deployedCampaigns = await campaignFactory.methods.getCampaigns().call();
  const deployedCampaignAddress = deployedCampaigns[0];

  campaign = await new web3.eth.Contract(CampaignAbi, deployedCampaignAddress);
});

describe("Campaign", () => {
  it("Deploys the Factory Contract and campaign contract", () => {
    assert.ok(campaignFactory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Marks caller as the campaign manager", async () => {
    let manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("Is conributor marked as approver ? ", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], gas: "1000000", value: "200" });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("Allows a manager to create request", async () => {
    await campaign.methods
      .createRequest("payment", "100", accounts[2])
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.value, "100");
  });

  it("Processes request ", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      gas: "1000000",
      value: web3.utils.toWei("3", "ether"),
    });

    await campaign.methods
      .createRequest("payment", web3.utils.toWei("1", "ether"), accounts[2])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1000000" });
    const initialBalance = await web3.eth.getBalance(accounts[2]);

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    const finalBalance = await web3.eth.getBalance(accounts[2]);

    assert.equal(finalBalance - initialBalance, web3.utils.toWei("1", "ether"));
  });
});
