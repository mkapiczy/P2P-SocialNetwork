function Node(id, ipAddr, port) {
  this.id = id;
  this.ipAddr = ipAddr;
  this.port = port;
};

Node.prototype.isValid = function() {
  if (this.id === undefined) {
    console.log("Node is invalid. Node id is undefined!");
    return false;
  } else if (this.ipAddr === undefined) {
    console.log("Node is invalid. Node ip addr is undefined!");
    return false;
  } else if (this.port === undefined) {
    console.log("Node is invalid. Node port is undefined!");
    return false;
  }
  return true;
};

module.exports = Node;
