const env = require("./env");

const stamp = () => new Date().toISOString();

const format = (level, args) =>
  `[${stamp()}] [${level}] ${args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ")}`;

const logger = {
  info:  (...args) => console.log(format("INFO",  args)),
  warn:  (...args) => console.warn(format("WARN",  args)),
  error: (...args) => console.error(format("ERROR", args)),
  debug: (...args) => { if (!env.isProd) console.log(format("DEBUG", args)); },
};

module.exports = logger;
