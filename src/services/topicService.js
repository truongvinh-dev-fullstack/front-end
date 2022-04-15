import axios from "../axios";

const getAllTopics = () => {
  return axios.get("/api/get-all-topics");
};

const createNewTopic = (data) => {
  return axios.post("/api/create-new-topic", data);
};

const editTopicService = (data) => {
  return axios.put("/api/edit-topic", data);
};

const deleteTopicService = (id) => {
  return axios.delete("/api/delete-topic", { data: { id: id } });
};

const getAllIdeasByTopic = (topicId) => {
  return axios.get(`/api/get-all-ideas-by-topic?topicId=${topicId}`);
};

const handleLikeorDisLike = (data) => {
  return axios.post("/api/like-dislike-ideas", data);
};

const getStatusIsLike = (userId, ideaId) => {
  return axios.get(`/api/status-islike?userId=${userId}&ideaId=${ideaId}`);
};

const getStarusByUserIdAndTopic = (userId, topicId) => {
  return axios.get(
    `/api/getAllStatusByUserAndTopic?userId=${userId}&topicId=${topicId}`
  );
};

const getAllLikeByTopic = (topicId) => {
  return axios.get(`/api/getAllLikeByTopic?topicId=${topicId}`);
};

const getAllDisLikeByTopic = (topicId) => {
  return axios.get(`/api/getAllDisLikeByTopic?topicId=${topicId}`);
};

const handlePostComment = (data) => {
  return axios.post("/api/handlePostComment", data);
};

const getAllCommentByIdea = (ideaId) => {
  return axios.get(`/api/getAllCommentByIdea?ideaId=${ideaId}`);
};

const handleEditComment = (data) => {
  return axios.post("/api/handleEditComment", data);
};

const deleteCommentService = (id) => {
  return axios.delete("/api/delete-comment", { data: { id: id } });
};

const createNewIdea = (data) => {
  return axios.post("/api/creat-new-idea", data);
};

const downloadFile = (id) => {
  return axios.get(`/api/download-idea?id=${id}`, { responseType: "blob" });
};

export {
  getAllTopics,
  createNewTopic,
  editTopicService,
  deleteTopicService,
  getAllIdeasByTopic,
  handleLikeorDisLike,
  getStatusIsLike,
  getStarusByUserIdAndTopic,
  getAllLikeByTopic,
  getAllDisLikeByTopic,
  handlePostComment,
  getAllCommentByIdea,
  handleEditComment,
  deleteCommentService,
  createNewIdea,
  downloadFile,
};
