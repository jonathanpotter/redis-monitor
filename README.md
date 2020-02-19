# Monitoring Redis
Due to networking contrains, PCF services such as Redis cannot be accessed from workstations outside of PCF. Without the ability to run tools like redis-cli, app teams may want to run an instance of the Redis Commander web management tool to monitor and manage their Redis instance.

This repo contains a cloud-foundry-packaged version of Redis Commander that runs on PCF.

Learn more about Redis Commander to see if it fits your need.
- http://joeferner.github.io/redis-commander/
- https://github.com/joeferner/redis-commander

## Usage
Clone repo, modify config.js, target a PCF space, create Redis instance if you don't have one already, modify manifest to include Redis instance, push app.

```
git clone https://github.com/jonathanpotter/redis-monitor.git
vi config.js                                     ### CHANGE THE PASSWORD
cf target -o MY_ORG -s MY_SPACE                  ### Use your org/space names
cf create-service p.redis 1gb MY_REDIS_INSTANCE  ### Use your Redis instance name
vi manifest.yml                                  ### Modify the manifest to bind Redis \
                                                 ###   Commander to your Redis instance name
cf push                                          ### Deploys the Redis Commander app to PCF
```

Now that you've pushed Redis Commander, view it in a web browser. You'll need to enter the credentials you set in config.js file.

## Limitations
Redis Commander does not provide a Continuous Stats Mode. The redis-cli tool can provide a subset of INFO results every 1 second in Continuous Stats Mode (`redis-cli --stat`). Redis Commander will provide the INFO results, but to see them refreshed every 1 second, you may want to write your own tool.

Redis Commander does not provide the MONITOR command (`redis-cli monitor`). This command can greatly impact Redis performance and is not provided by Redis Commander.

## More Redis Fun
```
$ cf create-service p.redis 1gb myredis

$ cf create-service-key myredis rediskey

$ cf service-key myredis rediskey

Getting key rediskey for service instance myredis...

{
 "host": "10.123.156.15",  <--------------------- Use IP, passwd, port below
 "password": "1234567859ABCDEFG=",
 "port": 6379
}

$ cf ssh myapp

vcap@40f20a89-6601-42e8-6722-b7f4:~$ nc 10.123.156.15 6379 <--- From above

AUTH 1234567859ABCDEFG= <-------------------------------------- From above
+OK

PING
+PONG

INFO <--------------------------- Lots of information on the Redis Server
$2837
# Server
redis_version:4.0.11
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:9ef51ca1e9cfe4ad
redis_mode:standalone
os:Linux 4.15.0-39-generic x86_64
arch_bits:64
multiplexing_api:epoll
atomicvar_api:atomic-builtin
gcc_version:5.4.0
process_id:1
run_id:51952cc87437a1a818689518971ebd0d95351677
tcp_port:6379
uptime_in_seconds:533119
uptime_in_days:6
hz:10
lru_clock:7889251
executable:/var/vcap/packages/redis/bin/redis-server
config_file:/var/vcap/jobs/redis/config/redis.conf

# Clients
connected_clients:1
client_longest_output_list:0
client_biggest_input_buf:0
blocked_clients:0

# Memory
used_memory:373368
used_memory_human:364.62K
used_memory_rss:4562944
used_memory_rss_human:4.35M
...
...
...

FLUSHALL <------- DANGER!!!! This will flush all keys from the Redis Server
+OK

QUIT
+OK
```
