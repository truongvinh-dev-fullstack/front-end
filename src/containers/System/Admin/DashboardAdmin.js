import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../../utils/emitter";
import "./DashboardAdmin.scss";
import Widget from "../Widget";
import { getAllUsers } from "../../../services/userService";
import { getAllDepartment } from "../../../services/departmentService";
import { getAllCategory } from "../../../services/categoryService";
import {
  getAllIdea,
  getIdeaLikeMost,
  getIdeaNewPost,
} from "../../../services/topicService";
import ViewIdeas from "../ViewIdeas";

class DashboardAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: "",
      dataDepartment: "",
      dataCategory: "",
      dataIdea: "",
      IdeaMostLike: "",
      CountLikeMost: "",
      TopPoster: "",
      IdeaNewPost: "",
      NewPoster: "",
    };
  }

  componentDidMount() {
    this.getAllUserFromReact();
    this.getAllDepartment();
    this.getAllCategory();
    this.getAllIdea();
    this.getIdeaLikeMost();
    this.getIdeaNewPost();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  getAllUserFromReact = async () => {
    let response = await getAllUsers("ALL");

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

  getAllIdea = async () => {
    let res = await getAllIdea();
    let dataIdea = { title: "Total Ideas", count: res.data.length };
    this.setState({
      dataIdea: dataIdea,
    });
  };

  getIdeaLikeMost = async () => {
    let res = await getIdeaLikeMost();
    this.setState({
      IdeaMostLike: res.data,
      CountLikeMost: res.count,
      TopPoster: res.data.User,
    });
  };

  getIdeaNewPost = async () => {
    let res = await getIdeaNewPost();
    this.setState({
      IdeaNewPost: res.data,
      NewPoster: res.data.User,
    });
  };

  render() {
    let {
      dataUser,
      dataDepartment,
      dataCategory,
      dataIdea,
      IdeaMostLike,
      CountLikeMost,
      TopPoster,
      IdeaNewPost,
      NewPoster,
    } = this.state;
    let role = this.props.userInfo.role;

    return (
      <>
        <div className="home">
          <div className="homeContainer">
            <div className="widgets">
              {role == "admin" && <Widget data={dataUser} />}

              {role == "admin" && <Widget data={dataDepartment} />}
              {role == "manage" && <Widget data={dataDepartment} />}

              {role == "manage" && <Widget data={dataCategory} />}
              {role == "admin" && <Widget data={dataCategory} />}

              {role == "manage" && <Widget data={dataIdea} />}
              {role == "admin" && <Widget data={dataIdea} />}
            </div>
          </div>
        </div>
        <div className="top-idea container">
          <div className="most-idea">
            <div className="title">Idea nhiều like nhất</div>
            <div>
              <div>
                Poster: {TopPoster.lastname + " " + TopPoster.firstname}
              </div>
              <div>{CountLikeMost} lượt thích</div>
            </div>
            <div>Name: {IdeaMostLike.idea_name}</div>
            <div>Descripton: {IdeaMostLike.description}</div>
          </div>
          <div className="most-idea">
            <div className="title">Idea mới nhất</div>
            <div>
              <div>
                Poster: {NewPoster.lastname + " " + NewPoster.firstname}
              </div>
            </div>
            <div>Name: {IdeaNewPost.idea_name}</div>
            <div>Descripton: {IdeaNewPost.description}</div>
          </div>
        </div>
        <div>
          <div className="title">All Idea</div>
          <ViewIdeas />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAdmin);
