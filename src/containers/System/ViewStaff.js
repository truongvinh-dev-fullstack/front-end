import React, { Component } from "react";
import { connect } from "react-redux";
import "./ViewIdeas.scss";
import FileDownload from "js-file-download";
import moment from "moment";
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
  createNewIdea,
  downloadFile,
} from "../../services/topicService";
import ModalComment from "./ModalComment";
import ModalIdea from "./ModalIdea";
import ReactPaginate from "react-paginate";

class ViewStaff extends Component {
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
      isOpenModalComment: false,
      isOpenModalIdea: false,
      ideaId: "",
      allComment: [],
      newComments: [],
      topicId: "",
      topic: "",
    };
  }

  componentDidMount() {
    this.props.getAllTopicRedux();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topics !== this.props.topics) {
      this.setState({
        arrTopics: this.props.topics,

        topic: this.props.topics[0],
      });
    }
    if (prevState.arrTopics !== this.state.arrTopics) {
      this.getAllIdeasByTopic(this.state.arrTopics[0]);
    }
    if (prevState.arrIdeas !== this.state.arrIdeas) {
      this.getCurrentIdeaPage(1);
    }
    if (prevProps.userInfo !== this.props.userInfo) {
      this.setState({
        userInfo: this.props.userInfo,
      });
    }

    if (prevState.status !== this.state.status) {
      let userId = this.props.userInfo.id;
      let topic_name = this.state.topicName;
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
      topicName: topic.topic_name,
      topic: topic,
    });
    if (topic.id) {
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
      isOpenModalComment: !this.state.isOpenModalComment,
      ideaId: ideaId,
    });
    this.handleGetAllComment(ideaId);
  };

  toggleModalComment = () => {
    this.setState({
      isOpenModalComment: !this.state.isOpenModalComment,
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
    }
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

  handleDownloadFile = async (filename) => {
    await downloadFile(filename).then((res) => {
      FileDownload(res, filename);
    });
  };

  render() {
    let userInfo = this.props.userInfo;
    let {
      isOpenModalIdea,
      topic,
      arrTopics,
      newIdeas,
      arrStatusByUser,
      arrAllLikeByTopic,
    } = this.state;

    return (
      <div className="view-ideas-contaner container">
        <div className="content-left">
          {arrTopics &&
            arrTopics.length > 0 &&
            arrTopics.map((item, index) => {
              return (
                <div
                  className={topic.id == item.id ? "topic active" : "topic"}
                  onClick={() => this.getAllIdeasByTopic(item)}
                >
                  {item.topic_name}
                </div>
              );
            })}
        </div>
        <div className="content-right">
          <div className="content-header">
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
                      isOpen={this.state.isOpenModalComment}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewStaff);
