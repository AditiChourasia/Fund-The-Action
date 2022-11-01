import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";
const { abi } = require("../../../ethereum/build/Campaign.json");
import { Router } from "../../../routes";
import Layout from "../../../components/Layout";

const CreateRequest = () => {
  const [value, setValue] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPositive, setIsPositive] = useState(false);
  const router = useRouter();

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
      const { address } = router.query;
      const campaign = new web3.eth.Contract(abi, address);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      try {
        await campaign.methods
          .createRequest(description, value, recipient)
          .send({ from: accounts[0] });
        console.log("Request created successfully");
        setIsPositive(true);
        setMessage("Successfully created a request!");
        Router.pushRoute(`/campaigns/${router.query.address}/requests`);
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
      <h3>Create a new Request to spend funds </h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Amount in wei</label>
          <Input
            value={value}
            label="wei"
            placeholder="0"
            labelPosition="right"
            type="number"
            onChange={(e) => setValue(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Input
            type="text"
            value={description}
            placeholder="0"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            type="text"
            value={recipient}
            label="address"
            placeholder="0"
            onChange={(e) => setRecipient(e.target.value)}
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

export default CreateRequest;
