var redis = require('redis'),
    RDS_PORT = 6379,
    RDS_HOST = 'localhost',
    RDS_OPTS = {},
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

var sessionStore = {
    "host" : "127.0.0.1",
    "port" : "6379"
};

client.on('ready',function(res){
    console.log('redis connect...');
});

exports.sessionStore = sessionStore;