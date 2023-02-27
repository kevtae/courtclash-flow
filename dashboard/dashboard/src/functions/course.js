import axios from "axios";

export const getCourse = async (module, course) => {
  return await axios.get(
    `https://khu.cambitapp.com//api/get-course/?module=${module}&course=${course}`
  );
};

export const getModule = async (module) => {
  return await axios.get(
    `https://khu.cambitapp.com//api/get-course/?module=${module}`
  );
};

export const getAllModule = async () => {
  return await axios.get(`https://khu.cambitapp.com/api/get-course/?module=0`);
};
