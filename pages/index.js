import React, { Component, useEffect } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import { Link } from "../routes";
import Layout from "../components/Layout";

const NewCampaign = ({ deployedCampaigns }) => {
  useEffect(() => {
    console.log(deployedCampaigns);
  }, [deployedCampaigns]);

  const renderCampaigns = () => {
    const items = deployedCampaigns.map((c) => ({
      header: c,
      description: (
        <Link legacyBehavior route={`/campaigns/${c}`}>
          <a className="item">View Campagin</a>
        </Link>
      ),
      fluid: true,
    }));
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link legacyBehavior route="/campaigns/new">
        <a className="item">
          <Button
            content="Create Campaign"
            icon="add circle"
            primary
            floated="right"
          />
        </a>
      </Link>
      {renderCampaigns()}
    </Layout>
  );
};

NewCampaign.getInitialProps = async () => {
  let deployedCampaigns = [];
  if (typeof factory != "undefined") {
    deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  }
  return { deployedCampaigns };
};
export default NewCampaign;
