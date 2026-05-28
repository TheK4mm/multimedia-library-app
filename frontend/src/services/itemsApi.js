import api from "./api";

const buildQuery = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : "";
};

export const itemsApi = {
  list:   (params = {}) => api.get(`/items${buildQuery(params)}`).then((r) => r.data),
  get:    (id) =>          api.get(`/items/${id}`).then((r) => r.data),
  create: (payload) =>     api.post("/items", payload).then((r) => r.data),
  update: (id, payload) => api.put (`/items/${id}`, payload).then((r) => r.data),
  remove: (id) =>          api.delete(`/items/${id}`).then((r) => r.data),
  stats:  () =>            api.get("/items/stats").then((r) => r.data),
};
