import { Link } from "../routes";
import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

export default class Header extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu style={{ marginTop: "2rem" }}>
        <Link legacyBehavior route="/">
          <a className="item">Fund The Action</a>
        </Link>

        <Menu.Menu position="right">
          <Link legacyBehavior route="/">
            <a className="item">Campaigns</a>
          </Link>
          <Link legacyBehavior route="/campaigns/new">
            <a className="item">+</a>
          </Link>
        </Menu.Menu>
      </Menu>
    );
  }
}
