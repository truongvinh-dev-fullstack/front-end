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
  getStatusByUserIdAndTopic,
  getAllLikeByTopic,
  getAllDisLikeByTopic,
  getAllCommentByIdea,
  handlePostComment,
  handleEditComment,
  deleteCommentService,
  downloadFile,
  createNewIdea,
} from "../../services/topicService";
import ModalComment from "./ModalComment";
import ReactPaginate from "react-paginate";
import ModalIdea from "./ModalIdea";

class ViewIdeas extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      arrTopics: [],
      arrIdeas: [],
      newIdeas: [],
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
      isOpenModalIdea: false,
      topic: "",
      StartDate: "",
      EndDate: "",
      roleStaff: false,
    };
  }

  componentDidMount() {
    this.props.getAllTopicRedux();
    this.setState({
      userInfo: this.props.userInfo,
    });
    this.checkRoleStaff(this.props.userInfo.role);
  }

  checkRoleStaff = (role) => {
    if (role == "staff") {
      this.setState({
        roleStaff: true,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topics !== this.props.topics) {
      console.log("check props: ", this.props);
      this.setState({
        arrTopics: this.props.topics,
        topicId: this.props.topics[0].id,
        topic: this.props.topics[0],
        StartDate: this.props.topics[0].start_date,
        EndDate: this.props.topics[0].final_closure_date,
      });
    }
    if (prevState.topic !== this.state.topic) {
      this.getAllIdeasByTopic(this.state.topic);
    }
    if (prevState.arrIdeas !== this.state.arrIdeas) {
      this.getCurrentIdeaPage(1);
    }

    if (prevState.status !== this.state.status) {
      let userId = this.props.userInfo.id;
      let topicId = this.state.topicId;

      let data = await getStatusByUserIdAndTopic(userId, topicId);
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

  getAllIdeasByTopic = async (topic) => {
    this.setState({
      topicId: topic.id,
      topic: topic,
      StartDate: topic.start_date,
      EndDate: topic.final_closure_date,
    });
    if (topic) {
      let res = await getAllIdeasByTopic(topic.id);
      this.setState({
        arrIdeas: res.data,
      });

      let userId = this.props.userInfo.id;
      let data = await getStatusByUserIdAndTopic(userId, topic.id);
      this.setState({
        arrStatusByUser: data.data,
      });

      let getAllLike = await getAllLikeByTopic(topic.id);
      console.log("check getAllLike: ", getAllLike);
      if (getAllLike) {
        this.setState({
          arrAllLikeByTopic: getAllLike.data,
        });
      }

      let getAllDisLike = await getAllDisLikeByTopic(topic.id);
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

  getCurrentIdeaPage = (currentPage) => {
    let arrIdeas = this.state.arrIdeas;
    let newIdeas = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= arrIdeas.length) {
        break;
      } else {
        let obj = arrIdeas[i];
        newIdeas.push(obj);
      }
    }
    this.setState({
      newIdeas: newIdeas,
    });
  };

  handleClickPage = (data) => {
    let currentPage = data.selected + 1;
    this.getCurrentIdeaPage(currentPage);
  };

  handleCreateNewIdea = () => {
    this.setState({
      isOpenModalIdea: true,
    });
  };

  toggleModaIdea = () => {
    this.setState({
      isOpenModalIdea: !this.state.isOpenModalIdea,
    });
  };

  createNewIdea = async (data) => {
    if (data) {
      let res = await createNewIdea(data);
      console.log(res);
      this.getAllIdeasByTopic(this.state.topic);
    }
  };

  render() {
    let userInfo = this.props.userInfo;
    let {
      topicId,
      arrTopics,
      newIdeas,
      arrStatusByUser,
      isOpenModalIdea,
      topic,
      StartDate,
      EndDate,
      roleStaff,
    } = this.state;
    console.log("Check state: ", this.state);
    return (
      <div className="view-ideas-contaner container">
        <div className="content-left">
          {arrTopics &&
            arrTopics.length > 0 &&
            arrTopics.map((item, index) => {
              return (
                <div
                  className={topicId == item.id ? "topic active" : "topic"}
                  onClick={() => this.getAllIdeasByTopic(item)}
                >
                  {item.topic_name}
                </div>
              );
            })}
        </div>
        <div className="content-right">
          <div className="content-header">
            <div>
              <div>
                <span>
                  Start date: {moment(StartDate).format("YYYY-MM-DD")}
                </span>
                <span>End date: {moment(EndDate).format("YYYY-MM-DD")}</span>
              </div>
            </div>
            {roleStaff && (
              <div>
                <button
                  onClick={() => {
                    this.handleCreateNewIdea();
                  }}
                >
                  Add new Idea
                </button>
                <ModalIdea
                  isOpenModalIdea={isOpenModalIdea}
                  userId={userInfo.id}
                  toggleModal={this.toggleModaIdea}
                  topic={topic}
                  createNewIdea={this.createNewIdea}
                />
              </div>
            )}
          </div>

          {newIdeas &&
            newIdeas.length > 0 &&
            newIdeas.map((item, index) => {
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
                      topic={topic}
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
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            pageCount={20}
            marginPagesDisplayed={3}
            onPageChange={this.handleClickPage}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            previousClassName="page-item"
            nextClassName="page-item"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
          />
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
