import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";
const { abi } = require("../ethereum/build/Campaign.json");

const ContributeForm = () => {
  const [contribution, setContribution] = useState(0);
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
          .contribute()
          .send({ from: accounts[0], value: contribution });
        console.log("Contributed to campaign successfully");
        setIsPositive(true);
        setMessage("Successfully contributed to this Campaign!");
        router.reload(window.location.pathname);
      } catch (error) {
        setIsPositive(false);
        setMessage(error.message);
        console.log(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Contribute to this Campaign </h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Contribution in wei</label>
          <Input
            value={contribution}
            label="wei"
            placeholder="0"
            labelPosition="right"
            type="number"
            onChange={(e) => setContribution(e.target.value)}
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
          Contribute!
        </Button>
      </Form>
    </div>
  );
};

export default ContributeForm;
