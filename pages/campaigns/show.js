import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
const { abi } = require("../../ethereum/build/Campaign.json");
import { Card, Button, Grid, GridRow } from "semantic-ui-react";
let web3 = require("../../ethereum/web3");
import Web3 from "web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";
import { useRouter } from "next/router";

const CampaignShow = ({
  minimumContribution,
  balance,
  numRequest,
  approversCount,
  manager,
}) => {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const itemsClone = [
      {
        header: "Minimum Contribution",
        description: minimumContribution,
        meta: "Minimum amount of wei to donate to become an approver",
      },
      {
        header: "Balance",
        description: balance,
        meta: "Total Collected wei",
      },
      {
        header: "Number of Requests",
        description: numRequest,
        meta: "Total number of requests made",
      },
      {
        header: "Contributors",
        description: approversCount,
        meta: "Number of contributors for the campaign",
      },
      {
        header: "Manager Address",
        description: manager,
        meta: "metamask account address of manager",
        style: { overflowWrap: "break-word" },
      },
    ];
    setItems(itemsClone);
  }, [minimumContribution, balance, numRequest, approversCount, manager]);

  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${router.query.address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (context) => {
  if (!web3 || !web3.eth) {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://goerli.infura.io/v3/a46f33a696a04f4b977d064a6200b180"
      )
    );
  }
  const campaign = new web3.eth.Contract(abi, context.query.address);
  const summary = await campaign.methods.getSummary().call();
  console.log("Campaign loaded");
  console.log(summary);
  const minimumContribution = summary[0];
  const balance = summary[1];
  const numRequest = summary[2];
  const approversCount = summary[3];
  const manager = summary[4];

  return { minimumContribution, balance, numRequest, approversCount, manager };
};

export default CampaignShow;
