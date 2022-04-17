import axios from "../axios";

const getAllCategoryById = (id) => {
  return axios.get(`/api/get-all-category-by-department?id=${id}`);
};

const createNewCategory = (data) => {
  return axios.post("/api/create-new-category", data);
};

const editCategoryService = (data) => {
  return axios.put("/api/edit-category", data);
};

const deleteCategoryService = (id) => {
  return axios.delete("/api/delete-category", { data: { id: id } });
};

const getAllCategory = () => {
  return axios.get("/api/get-all-category");
};

export {
  getAllCategory,
  getAllCategoryById,
  createNewCategory,
  editCategoryService,
  deleteCategoryService,
};
