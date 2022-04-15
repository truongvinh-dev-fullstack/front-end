import React, { Component } from "react";
import { connect } from "react-redux";
import FileDownload from "js-file-download";
import moment from "moment";
import "./ViewIdeas.scss";
import * as actions from "../../store/actions";
import {
  getAllIdeasByTopic,
  handleLikeorDisLike,
  getStatusIsLike,
  getStarusByUserIdAndTopic,
  getAllLikeByTopic,
  getAllDisLikeByTopic,
  getAllCommentByIdea,
  handlePostComment,
  handleEditComment,
  deleteCommentService,
  downloadFile,
} from "../../services/topicService";
import ModalComment from "./ModalComment";

class ViewIdeas extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      arrTopics: [],
      arrIdeas: [],
      userInfo: {},
      arrStatusByUser: [],
      topicName: "",
      status: true,
      arrAllLikeByTopic: [],
      arrAllDisLikeByTopic: [],
      isOpenModal: false,
      ideaId: "",
      allComment: [],
      newComments: [],
      topicId: "",
    };
  }

  componentDidMount() {
    this.props.getAllTopicRedux();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topics !== this.props.topics) {
      this.setState({
        arrTopics: this.props.topics,
        topicId: this.props.topics[0].id,
      });
      this.getAllIdeasByTopic(this.props.topics[0].id);
    }
    if (prevProps.userInfo !== this.props.userInfo) {
      this.setState({
        userInfo: this.props.userInfo,
      });
    }

    if (prevState.status !== this.state.status) {
      let userId = this.props.userInfo.id;
      let topicId = this.state.topicId;

      let data = await getStarusByUserIdAndTopic(userId, topicId);
      this.setState({
        arrStatusByUser: data.data,
      });

      let getAllLike = await getAllLikeByTopic(topicId);
      console.log("check getAllLike: ", getAllLike);
      if (getAllLike) {
        this.setState({
          arrAllLikeByTopic: getAllLike.data,
        });
      }

      let getAllDisLike = await getAllDisLikeByTopic(topicId);
      if (getAllDisLike) {
        this.setState({
          arrAllDisLikeByTopic: getAllDisLike.data,
        });
      }
    }
  }

  getAllIdeasByTopic = async (id) => {
    this.setState({
      topicId: id,
    });
    if (id) {
      let res = await getAllIdeasByTopic(id);
      this.setState({
        arrIdeas: res.data,
      });

      let userId = this.props.userInfo.id;
      let data = await getStarusByUserIdAndTopic(userId, id);
      this.setState({
        arrStatusByUser: data.data,
      });

      let getAllLike = await getAllLikeByTopic(id);
      console.log("check getAllLike: ", getAllLike);
      if (getAllLike) {
        this.setState({
          arrAllLikeByTopic: getAllLike.data,
        });
      }

      let getAllDisLike = await getAllDisLikeByTopic(id);
      if (getAllDisLike) {
        this.setState({
          arrAllDisLikeByTopic: getAllDisLike.data,
        });
      }
    }
  };

  handleLikeOrDisLike = async (data) => {
    let { userInfo } = this.props;

    data.userId = userInfo.id;
    let res = await handleLikeorDisLike(data);
    this.setState({
      status: !this.state.status,
    });
  };

  handleGetStatusIsLike = async (ideaId) => {
    if (ideaId) {
      let userId = this.props.userInfo.id;
      let res = await getStatusIsLike(userId, ideaId);
      if (res) {
        return res.status;
      } else {
        return 3;
      }
    } else {
      return 3;
    }
  };

  getCurrentLikeByIdea = (ideaId) => {
    let { arrAllLikeByTopic } = this.state;
    let current = 0;
    arrAllLikeByTopic.map((item, index) => {
      if (item.ideaId == ideaId) {
        current = current + 1;
      }
    });

    return current;
  };

  getCurrentDisLikeByIdea = (ideaId) => {
    let { arrAllDisLikeByTopic } = this.state;
    let current = 0;
    arrAllDisLikeByTopic.map((item, index) => {
      if (item.ideaId == ideaId) {
        current = current + 1;
      }
    });

    return current;
  };

  handleOpenModelComment = (ideaId) => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
      ideaId: ideaId,
    });
    this.handleGetAllComment(ideaId);
  };

  toggleModalComment = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  };

  handleGetAllComment = async (ideaId) => {
    if (ideaId) {
      let res = await getAllCommentByIdea(ideaId);
      this.setState({ allComment: res.data });
      this.getCurrentCommentPage(1);
    }
  };

  handlePostComment = async (userId, ideaId, comment) => {
    if (!userId || !ideaId || !comment) {
      console.log("Missing parameter");
    } else {
      let res = await handlePostComment({
        userId: userId,
        ideaId: ideaId,
        comment: comment,
      });
      this.handleGetAllComment(ideaId);
    }
  };

  handleEditComment = async (commentId, commentEdit) => {
    let { ideaId } = this.state;
    if (!commentId || !commentEdit) {
      console.log("Missing parameter");
    } else {
      let res = await handleEditComment({
        commentId: commentId,
        commentEdit: commentEdit,
      });
      this.handleGetAllComment(ideaId);
    }
  };

  handleDeleteComment = async (id) => {
    if (id) {
      let { ideaId } = this.state;
      await deleteCommentService(id);
      this.handleGetAllComment(ideaId);
    }
  };

  getCurrentCommentPage = (currentPage) => {
    let allComment = this.state.allComment;
    let newComments = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= allComment.length) {
        break;
      } else {
        let obj = allComment[i];
        newComments.push(obj);
      }
    }
    this.setState({
      newComments: newComments,
    });
  };

  handleDownloadFile = async (filename) => {
    await downloadFile(filename).then((res) => {
      FileDownload(res, filename);
    });
  };

  render() {
    let userInfo = this.props.userInfo;
    let { topicId, arrTopics, arrIdeas, arrStatusByUser, arrAllLikeByTopic } =
      this.state;
    return (
      <div className="view-ideas-contaner container">
        <div className="content-left">
          {arrTopics &&
            arrTopics.length > 0 &&
            arrTopics.map((item, index) => {
              return (
                <div
                  className={topicId == item.id ? "topic active" : "topic"}
                  onClick={() => this.getAllIdeasByTopic(item.id)}
                >
                  {item.topic_name}
                </div>
              );
            })}
        </div>
        <div className="content-right">
          {arrIdeas &&
            arrIdeas.length > 0 &&
            arrIdeas.map((item, index) => {
              let status = 3;
              arrStatusByUser.map((item2, index2) => {
                if (item2.ideaId == item.id) {
                  status = item2.isLike;
                }
              });

              let currentLike = this.getCurrentLikeByIdea(item.id);
              let currentDisLike = this.getCurrentDisLikeByIdea(item.id);

              return (
                <div className="ideas">
                  <div className="idea-title">{item.idea_name}</div>
                  <div className="idea-description">{item.description}</div>
                  <div>
                    Post day: {moment(item.createdAt).format("YYYY-MM-DD")}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        this.handleDownloadFile(item.file_name);
                      }}
                    >
                      Download
                    </button>
                  </div>
                  <div className="like-dislike">
                    <div className="like">
                      <i
                        className={
                          status === 1
                            ? "fas fa-thumbs-up active"
                            : "fas fa-thumbs-up icon"
                        }
                        onClick={() => {
                          this.handleLikeOrDisLike({
                            ideaId: item.id,
                            action: 1,
                          });
                        }}
                      ></i>
                      <span>{currentLike}</span>
                    </div>
                    <div className="dislike">
                      <i
                        className={
                          status === 0
                            ? "fas fa-thumbs-down active"
                            : "fas fa-thumbs-down icon"
                        }
                        onClick={() => {
                          this.handleLikeOrDisLike({
                            ideaId: item.id,
                            action: 0,
                          });
                        }}
                      ></i>
                      <span>{currentDisLike}</span>
                    </div>
                  </div>
                  <div className="comment-container">
                    <button
                      onClick={() => this.handleOpenModelComment(item.id)}
                    >
                      Comment
                    </button>
                    <ModalComment
                      isOpen={this.state.isOpenModal}
                      ideaId={this.state.ideaId}
                      userId={userInfo.id}
                      allComment={this.state.newComments}
                      toggleModal={this.toggleModalComment}
                      GetAllComment={this.handleGetAllComment}
                      postComment={this.handlePostComment}
                      EditComment={this.handleEditComment}
                      deleteComment={this.handleDeleteComment}
                      getCurrentCommentPage={this.getCurrentCommentPage}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewIdeas);
