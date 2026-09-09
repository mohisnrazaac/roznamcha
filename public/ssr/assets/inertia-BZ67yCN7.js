import { r as router3 } from "../ssr.js";
const deleteResource = (url, options = {}) => {
  const { data, ...visitOptions } = options ?? {};
  return router3.post(url, data ?? {}, visitOptions);
};
export {
  deleteResource as d
};
