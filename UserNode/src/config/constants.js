/* 
* Constants for the network, by req spec
*/
const ALPHA = 3; //the degree of parallelism - INIT 3, can be changed later
const B = 8; //the size of the ID space [0, 2B-1], as well as the number of buckets - can be 16 as well
const k = 10; //the maximum number of nodes allowed in a bucket - INIT 10, can be changed later
const timeout = 200; //time before errors
const tExpire = 86400; //the time after which a key/value pair expires in s
const tRefresh = 3600; //time after which an otherwise unaccessed bucket must be refreshed
const tReplicate = 3600; //the interval between Kademlia replication events, when a node is required to publish its entire database
const tRepublish = 86400; // the time after which the original publisher must republish a key/value pair
const BASE_NODE_ID = 0;
const BASE_NODE_IP_ADDR = "http://localhost";
const BASE_NODE_PORT = "8000";

module.exports = {
    'alpha': ALPHA,
    'B': B,
    'k': k,
    'timeout': timeout,
    'tExpire': tExpire,
    'tRefresh': tRefresh,
    'tReplicate': tReplicate,
    'tRepublish': tRepublish,
    'BASE_NODE_ID': BASE_NODE_ID,
    "BASE_NODE_IP_ADDR": BASE_NODE_IP_ADDR,
    "BASE_NODE_PORT": BASE_NODE_PORT
};