import api from "./api";

export const genresApi = {
  list: (mediaType) =>
    api
      .get(`/genres${mediaType ? `?mediaType=${mediaType}` : ""}`)
      .then((r) => r.data),
};
