const Enum = require("enum");

const NodeState = new Enum({ ALIVE: "ALIVE", NOT_ALIVE: "NOT_ALIVE" });

module.exports = NodeState;
