var exec = require('child_process').exec, child;

// Get configuration from file.
var fs = require('fs'),
configPath = './config.js';
var httpConfig = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// Get configuration from environment.
var vcap_services = JSON.parse(process.env.VCAP_SERVICES);

// Get redis service name
if (process.env.VCAP_SERVICES.includes("p-redis")) {
  var redisService = "p-redis";
} else if (process.env.VCAP_SERVICES.includes("p.redis")) {
  var redisService = "p.redis";
} else {
  console.error("ERROR: No Redis service instance found in app's vcap_services environment variable.");
}

// Build launch command. 
var cmd = "./node_modules/.bin/redis-commander";
cmd += " --redis-port " + vcap_services[redisService][0].credentials.port;
cmd += " --redis-host " + vcap_services[redisService][0].credentials.host;
cmd += " --redis-password " + vcap_services[redisService][0].credentials.password;
cmd += " --http-auth-username " + httpConfig.user;
cmd += " --http-auth-password " + httpConfig.password;
cmd += " --port " + process.env.PORT;

// console.log('cmd: ' + cmd);

child = exec(cmd,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  }
);
