# WebBench
Drive Benchmark on web.

## How to

### Run in Node
- install Apache Bench (set appropriate execute path before use it)
- install Node 
- git clone https://github.com/napfy/WebBench
- cd WebBench 
- npm run build
- npm run start
- open browser url http://localhost:3000/

### Run in Docker 
- docker pull yuef/webbench
- docker run --rm -d -e PORT=$PORT -p $PORT:$PORT  yuef/webbench
- open browser url http://your_host_ip:$PORT/

