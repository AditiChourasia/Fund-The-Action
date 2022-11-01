const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// getting path of the solidity file inbox.sol through path.resolve(__dirname, <directory name>, <file name along with extention>)
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "Contracts", "Campaign.sol");

// reading contents of Campaign.sol
const source = fs.readFileSync(campaignPath, "utf8");
var input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];
const campaign = output.Campaign;
const campaignFactory = output.CampaignFactory;

fs.ensureDirSync(buildPath);

fs.outputJSONSync(path.resolve(buildPath, "Campaign.json"), campaign);
fs.outputJSONSync(
  path.resolve(buildPath, "CampaignFactory.json"),
  campaignFactory
);
