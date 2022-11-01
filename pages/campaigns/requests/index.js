import React, { useEffect, useState } from "react";
import { Button, Grid, Table, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import { useRouter } from "next/router";
import detectEthereumProvider from "@metamask/detect-provider";
const { abi } = require("../../../ethereum/build/Campaign.json");
let web3 = require("../../../ethereum/web3");
import Web3 from "web3";

const Requests = ({ approversCount, requests }) => {
  const router = useRouter();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingFinalize, setLoadingFinalize] = useState(false);
  const [message, setMessage] = useState("");
  const [isPositive, setIsPositive] = useState(false);

  const onFinalize = async (index) => {
    setMessage("");
    setLoadingFinalize(true);
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    });

    if (provider && window) {
      console.log("MetaMask Ethereum provider successfully detected!");

      const { ethereum } = window;
      const web3 = new Web3(provider);
      const { address } = router.query;
      const campaign = new web3.eth.Contract(abi, address);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      try {
        await campaign.methods
          .finalizeRequest(index)
          .send({ from: accounts[0] });
        console.log("Request Finalized");
        setIsPositive(true);
        setMessage("Successfully finalized a request!");
        router.reload(window.location.pathname);
      } catch (error) {
        setIsPositive(false);
        setMessage(error.message);
        console.log(error.message);
      }
    }
    setLoadingFinalize(false);
  };

  const onApprove = async (index) => {
    setMessage("");
    setLoadingApprove(true);
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    });

    if (provider && window) {
      console.log("MetaMask Ethereum provider successfully detected!");

      const { ethereum } = window;
      const web3 = new Web3(provider);
      const { address } = router.query;
      const campaign = new web3.eth.Contract(abi, address);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      try {
        await campaign.methods
          .approveRequest(index)
          .send({ from: accounts[0] });
        console.log("Request Approved");
        setIsPositive(true);
        setMessage("Successfully approved a request!");
        router.reload(window.location.pathname);
      } catch (error) {
        setIsPositive(false);
        setMessage(error.message);
        console.log(error.message);
      }
    }
    setLoadingApprove(false);
  };

  useEffect(() => {
    console.log("Requests", requests);
    console.log("Approvers", approversCount);
  }, []);
  return (
    <Layout>
      <Grid>
        {" "}
        <Grid.Row>
          <Grid.Column>
            {message ? (
              <Message positive={isPositive} negative={!isPositive}>
                <Message.Header>
                  {isPositive ? "Success" : "Error"}
                </Message.Header>
                <p>{message}</p>
              </Message>
            ) : (
              ""
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={13}>Requests</Grid.Column>
          <Grid.Column width={3}>
            <Link
              legacyBehavior
              route={`/campaigns/${router.query.address}/requests/new`}
            >
              <a>
                <Button primary>Create Request</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {" "}
          <Grid.Column>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Recipient</Table.HeaderCell>
                  <Table.HeaderCell>Approval Count</Table.HeaderCell>
                  <Table.HeaderCell>Approve</Table.HeaderCell>
                  <Table.HeaderCell>Finalize</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {requests.map((r, index) => (
                  <Table.Row key={r[0]}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{r[0]}</Table.Cell>
                    <Table.Cell>{r[1]}</Table.Cell>
                    <Table.Cell>{r[2]}</Table.Cell>
                    <Table.Cell>{`${r[4]}/${approversCount}`}</Table.Cell>
                    <Table.Cell>
                      <Button
                        color="green"
                        loading={loadingApprove}
                        onClick={() => onApprove(index)}
                        disabled={r[3]}
                      >
                        Approve
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="red"
                        loading={loadingFinalize}
                        onClick={() => onFinalize(index)}
                        disabled={r[3]}
                      >
                        Finalize
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

Requests.getInitialProps = async (context) => {
  if (!web3 || !web3.eth) {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://goerli.infura.io/v3/a46f33a696a04f4b977d064a6200b180"
      )
    );
  }
  const campaign = new web3.eth.Contract(abi, context.query.address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  let requests = [];
  for (let i = 0; i < requestCount; i++) {
    const request = await campaign.methods.requests(i).call();
    requests.push(request);
  }
  return { approversCount, requests };
};

export default Requests;
