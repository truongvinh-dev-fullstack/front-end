import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../../utils/emitter";
import moment from "moment";
import "./ManageTopics.scss";
import * as actions from "../../../store/actions";
import {
  getAllTopics,
  createNewTopic,
  editTopicService,
  deleteTopicService,
} from "../../../services/topicService";
import ModalTopic from "./ModalTopic";
import _ from "lodash";

class ManageTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: "",
      arrTopics: [],
      isOpenModalTopic: false,
      isOpenModalEditTopic: false,
      editTopic: {},
    };
  }

  async componentDidMount() {
    this.props.getAllTopicRedux();
  }

  handleCreateNewTopic = () => {
    this.setState({
      isOpenModalTopic: true,
    });
  };

  toggleModalTopic = () => {
    this.setState({
      isOpenModalTopic: !this.state.isOpenModalTopic,
    });
  };
  toggleModaEditTopic = () => {
    this.setState({
      isOpenModalEditTopic: !this.state.isOpenModalEditTopic,
    });
  };

  handleEditTopic = async (item) => {
    this.setState({
      isOpenModalEditTopic: true,
      editTopic: item,
    });
  };

  createNewTopic = async (data) => {
    try {
      let response = await createNewTopic(data);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        this.props.getAllTopicRedux();
        this.setState({
          isOpenModalTopic: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteTopic = async (id) => {
    try {
      let response = await deleteTopicService(id);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        this.props.getAllTopicRedux();
        this.setState({
          isOpenModalTopic: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  DoEditTopic = async (data) => {
    try {
      let response = await editTopicService(data);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        this.props.getAllTopicRedux();
        this.setState({
          isOpenModalEditTopic: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topics !== this.props.topics) {
      this.setState({
        arrTopics: this.props.topics,
      });
    }
  }

  render() {
    let arrTopics = this.state.arrTopics;
    console.log("check datetime: ", this.state.datetime);

    return (
      <div className="user-container">
        <ModalTopic
          isOpenAdd={this.state.isOpenModalTopic}
          toggleModalTopic={this.toggleModalTopic}
          createNewTopic={this.createNewTopic}
        />
        {this.state.isOpenModalEditTopic === true && (
          <ModalTopic
            isOpenEdit={this.state.isOpenModalEditTopic}
            toggleModalTopic={this.toggleModaEditTopic}
            DoEditTopic={this.DoEditTopic}
            editTopic={this.state.editTopic}
          />
        )}

        <div className="title text-center">Manage Topic</div>
        <div className="mx-3">
          <button
            className="btn btn-primary px-3"
            onClick={() => {
              this.handleCreateNewTopic();
            }}
          >
            <i className="fas fa-plus"></i> Create New Topic
          </button>
        </div>
        <div className="user-table mt-3 mx-3">
          <table id="customers">
            <tbody>
              <tr>
                <th>Topic Name</th>
                <th>Description</th>
                <th>Start date</th>
                <th>First closure date</th>
                <th>Final closure date</th>
                <th>Actions</th>
              </tr>
              {arrTopics &&
                arrTopics.map((item, indext) => {
                  return (
                    <>
                      <tr>
                        <td>{item.topic_name}</td>
                        <td>{item.description}</td>
                        <td>
                          {moment(item.start_date).format("YYYY-MM-DD h:mm")}
                        </td>
                        <td>
                          {moment(item.first_closure_date).format(
                            "YYYY-MM-DD h:mm"
                          )}
                        </td>
                        <td>
                          {moment(item.final_closure_date).format(
                            "YYYY-MM-DD h:mm"
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn-edit"
                            onClick={() => this.handleEditTopic(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => this.handleDeleteTopic(item.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    topics: state.topic.topics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTopicRedux: () => dispatch(actions.fetchAllTopicStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTopics);
