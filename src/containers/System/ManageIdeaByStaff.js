import React, { Component } from "react";
import { connect } from "react-redux";
import FileDownload from "js-file-download";
import moment from "moment";
import "./ViewIdeas.scss";
import * as actions from "../../store/actions";
import {
  downloadFile,
  getIdeasByUserTopic,
  deleteFileByIdea,
  updateFileIdea,
  deleteIdeaByUser,
} from "../../services/topicService";
import ModalComment from "./ModalComment";
import { flatMap } from "lodash";

class ManageIdeaByStaff extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      arrTopics: [],
      arrIdeas: [],
      newIdeas: [],
      userInfo: {},
      topicName: "",
      ideaId: "",
      topicId: "",
      formData: "",
      checkbox: false,
    };
  }

  componentDidMount() {
    this.props.getAllTopicRedux();
    this.setState({
      userInfo: this.props.userInfo,
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topics !== this.props.topics) {
      this.setState({
        arrTopics: this.props.topics,
        topicId: this.props.topics[0].id,
      });
      this.getAllIdeaByUserTopic(this.props.topics[0].id);
    }
    if (prevProps.userInfo !== this.props.userInfo) {
      console.log("Done");
      this.setState({
        userInfo: this.props.userInfo,
      });
    }
  }

  handleDownloadFile = async (filename) => {
    await downloadFile(filename).then((res) => {
      FileDownload(res, filename);
    });
  };

  getAllIdeaByUserTopic = async (topicId) => {
    let userId = this.state.userInfo.id;
    console.log("check: ", userId, topicId);
    let res = await getIdeasByUserTopic(userId, topicId);
    this.setState({
      arrIdeas: res.data,
      topicId: topicId,
    });
    console.log("OKi");
  };

  handleDeleteFile = async (ideaId, file_name, path) => {
    let res = await deleteFileByIdea({
      ideaId: ideaId,
      file_name: file_name,
      path: path,
    });
    this.getAllIdeaByUserTopic(this.state.topicId);
  };

  handleOnChangeFile = (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    this.setState({
      formData: formData,
    });
  };

  handleUpdateFileIdea = async (ideaId) => {
    let { formData, checkbox } = this.state;
    if (checkbox) {
      if (!formData) {
        console.log("Not file");
      } else {
        formData.append("ideaId", ideaId);
        this.setState({
          loadPage: !this.state.loadPage,
        });
        let res = await updateFileIdea(formData);
        this.getAllIdeaByUserTopic(this.state.topicId);
      }
    } else {
      alert("You have not selected the terms");
    }
  };

  handleOnChangeCheckbox = (e) => {
    this.setState({
      checkbox: !this.state.checkbox,
    });
    console.log(this.state.checkbox);
  };

  handleDeleteIdeaByUser = async (id, linkFile) => {
    if (!id) {
      console.log("Missing parameter!");
    } else {
      let res = await deleteIdeaByUser({ id: id, linkFile: linkFile });
      console.log(res);
      this.getAllIdeaByUserTopic(this.state.topicId);
    }
  };

  //   getCurrentIdeaPage = (currentPage) => {
  //     let arrIdeas = this.state.arrIdeas;
  //     let newIdeas = [];
  //     for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
  //       if (i >= arrIdeas.length) {
  //         break;
  //       } else {
  //         let obj = arrIdeas[i];
  //         newIdeas.push(obj);
  //       }
  //     }
  //     this.setState({
  //       newIdeas: newIdeas,
  //     });
  //   };

  //   handleClickPage = (data) => {
  //     let currentPage = data.selected + 1;
  //     this.getCurrentIdeaPage(currentPage);
  //   };

  render() {
    let userInfo = this.props.userInfo;
    let { topicId, arrTopics, arrIdeas } = this.state;
    console.log(this.state);
    return (
      <div className="view-ideas-contaner container">
        <div className="content-left">
          {arrTopics &&
            arrTopics.length > 0 &&
            arrTopics.map((item, index) => {
              return (
                <div
                  className={topicId == item.id ? "topic active" : "topic"}
                  onClick={() => {
                    this.getAllIdeaByUserTopic(item.id);
                  }}
                >
                  {item.topic_name}
                </div>
              );
            })}
        </div>
        <div className="content-right">
          {arrIdeas && arrIdeas.length == 0 && <div>Not idea</div>}
          {arrIdeas &&
            arrIdeas.length > 0 &&
            arrIdeas.map((item, index) => {
              let check = true;
              if (item.file_name == "") {
                check = false;
              }

              return (
                <div>
                  <div>
                    <button
                      onClick={() => {
                        this.handleDeleteIdeaByUser(item.id, item.linkFile);
                      }}
                    >
                      Delete Idea
                    </button>
                  </div>
                  <div className="title-idea">{item.idea_name}</div>
                  <div className="day-post">
                    Day post:
                    {moment(item.createdAt).format("YYYY-MM-DD")}
                  </div>
                  <div className="description">{item.description}</div>
                  <div className="file-box">
                    <div>{item.file_name}</div>
                    {check && (
                      <div>
                        <button
                          onClick={() => {
                            this.handleDeleteFile(
                              item.id,
                              item.file_name,
                              item.linkFile
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <div>
                      <input
                        type="checkbox"
                        value={true}
                        onClick={(e) => {
                          this.handleOnChangeCheckbox(e);
                        }}
                      />
                      Đồng ý với các điều khoản
                    </div>
                    {!check && (
                      <div>
                        <input
                          type="file"
                          name="file"
                          onChange={(e) => {
                            this.handleOnChangeFile(e);
                          }}
                          style={{ border: "none" }}
                        />

                        <button
                          onClick={() => {
                            this.handleUpdateFileIdea(item.id);
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    <di>
                      <button>Download</button>
                    </di>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    topics: state.topic.topics,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTopicRedux: () => dispatch(actions.fetchAllTopicStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageIdeaByStaff);
