import React, { createFactory, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { Router } from "../../routes";
const { abi } = require("../../ethereum/build/CampaignFactory.json");
const CONTRACT_FACTORY_DEPLOYED_ADDRESS = require("../../ethereum/contractFactoryAddress");

const NewCampaign = () => {
  const [minContribution, setMinContribution] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPositive, setIsPositive] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    });

    if (provider && window) {
      console.log("MetaMask Ethereum provider successfully detected!");

      const { ethereum } = window;
      const web3 = new Web3(provider);

      const factory = new web3.eth.Contract(
        abi,
        CONTRACT_FACTORY_DEPLOYED_ADDRESS
      );
      const accounts = await ethereum.request({ method: "eth_accounts" });
      try {
        await factory.methods
          .createCampaign(minContribution)
          .send({ from: accounts[0] });
        console.log("New Campaign deployed");
        setIsPositive(true);
        setMessage("Successfully created a new Campaign!");
        Router.pushRoute("/");
      } catch (error) {
        setIsPositive(false);
        setMessage(error.message);
        console.log(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a campaign </h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minContribution}
            label="wei"
            placeholder="0"
            labelPosition="right"
            type="number"
            onChange={(e) => setMinContribution(e.target.value)}
          />
        </Form.Field>

        {message ? (
          <Message positive={isPositive} negative={!isPositive}>
            <Message.Header>{isPositive ? "Success" : "Error"}</Message.Header>
            <p>{message}</p>
          </Message>
        ) : (
          ""
        )}

        <Button type="submit" loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default NewCampaign;
