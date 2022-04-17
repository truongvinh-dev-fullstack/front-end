import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../../utils/emitter";
import "./DashboardAdmin.scss";
import Widget from "../Widget";
import { getAllUsers } from "../../../services/userService";
import { getAllDepartment } from "../../../services/departmentService";
import { getAllCategory } from "../../../services/categoryService";

class DashboardAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: "",
      dataDepartment: "",
      dataCategory: "",
      dataIdea: { title: "Total Ideas", count: 30 },
      loadPage: false,
    };
  }

  componentDidMount() {
    this.getAllUserFromReact();
    this.getAllDepartment();
    this.getAllCategory();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  getAllUserFromReact = async () => {
    let response = await getAllUsers("ALL");
    console.log("check res", response.users.length);
    let dataUser = { title: "Total Department", count: response.users.length };
    this.setState({
      dataUser: dataUser,
    });
  };

  getAllDepartment = async () => {
    let res = await getAllDepartment();
    let dataDepartment = { title: "Total Department", count: res.data.length };
    this.setState({
      dataDepartment: dataDepartment,
    });
  };

  getAllCategory = async () => {
    let res = await getAllCategory();
    let dataCategory = { title: "Total Category", count: res.data.length };
    this.setState({
      dataCategory: dataCategory,
    });
  };

  render() {
    let { dataUser, dataDepartment, dataCategory, dataIdea } = this.state;
    console.log(this.state);
    return (
      <div className="home">
        <div className="homeContainer">
          <div className="widgets">
            <Widget data={dataUser} />
            <Widget data={dataDepartment} />
            <Widget data={dataCategory} />
            <Widget data={dataIdea} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAdmin);
