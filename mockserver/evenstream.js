var http = require("http");
var fs = require("fs");

var nodes = ["aa00", "bb11", "cc22", "dd33", "ee44", "ff55", "gg66", "hh77", "jj88", "kk99", "AA99","BB88"];

var conns = [];
for (var i=0;i<nodes.length;i++) {
  var src = i;
  var dest = i+1;
  if (dest >= nodes.length) {
    dest = 0;
  }
  conns.push({source: nodes[src], target: nodes[dest], id: nodes[src] + "-" + nodes[dest]});
}

var steps = [
  {action: "add", group:"nodes", id:nodes[0]},
  {action: "add", group:"nodes", id:nodes[1]},
  {action: "add", group:"nodes", id:nodes[2]},
  {action: "add", group:"nodes", id:nodes[3]},
  {action: "add", group:"nodes", id:nodes[4]},
  {action: "add", group:"nodes", id:nodes[5]},
  {action: "add", group:"nodes", id:nodes[6]},
  {action: "add", group:"nodes", id:nodes[7]},
  {action: "add", group:"nodes", id:nodes[8]},
  {action: "add", group:"nodes", id:nodes[9]},
  {action: "add", group:"nodes", id:nodes[10]},
  {action: "add", group:"nodes", id:nodes[11]},
  {action: "add", group:"edges", id:conns[0].id, source: conns[0].source, target: conns[0].target},
  {action: "add", group:"edges", id:conns[1].id, source: conns[1].source, target: conns[1].target},
  {action: "add", group:"edges", id:conns[2].id, source: conns[2].source, target: conns[2].target},
  {action: "add", group:"edges", id:conns[3].id, source: conns[3].source, target: conns[3].target},
  {action: "add", group:"edges", id:conns[4].id, source: conns[4].source, target: conns[4].target},
  {action: "add", group:"edges", id:conns[5].id, source: conns[5].source, target: conns[5].target},
  {action: "add", group:"edges", id:conns[6].id, source: conns[6].source, target: conns[6].target},
  {action: "add", group:"edges", id:conns[7].id, source: conns[7].source, target: conns[7].target},
  {action: "add", group:"edges", id:conns[8].id, source: conns[8].source, target: conns[8].target},
  {action: "add", group:"edges", id:conns[9].id, source: conns[9].source, target: conns[9].target},
  {action: "add", group:"edges", id:conns[10].id, source: conns[10].source, target: conns[10].target},
  {action: "add", group:"edges", id:conns[11].id, source: conns[11].source, target: conns[11].target},
  {action: "remove", group:"nodes", id:nodes[0]},
  {action: "remove", group:"nodes", id:nodes[2]},
  {action: "remove", group:"nodes", id:nodes[4]},
  {action: "remove", group:"nodes", id:nodes[6]},
  {action: "remove", group:"nodes", id:nodes[8]},
  {action: "remove", group:"nodes", id:nodes[10]},
  {action: "remove", group:"edges", id:conns[0].id},
  {action: "remove", group:"edges", id:conns[1].id},
  {action: "remove", group:"edges", id:conns[2].id},
  {action: "remove", group:"edges", id:conns[3].id},
  {action: "remove", group:"edges", id:conns[4].id},
  {action: "remove", group:"edges", id:conns[5].id},
  {action: "remove", group:"edges", id:conns[6].id},
  {action: "remove", group:"edges", id:conns[7].id},
  {action: "remove", group:"edges", id:conns[8].id},
  {action: "remove", group:"edges", id:conns[9].id},
  {action: "remove", group:"edges", id:conns[10].id},
  {action: "remove", group:"edges", id:conns[11].id}
];

http.createServer(function (req, res) {
  var index = "./sse.htm";
  var fileName;
  var interval;
  var cnt = 0;
  //var obj = {data: {id: cnt}, group : "nodes"};

  /*
  if (req.url === "/")
    fileName = "./stream";
  else
    fileName = "." + req.url;
    
  if (fileName === "./stream") {
  */
  console.log(req.url);
  console.log(req.method);
  if (req.url === "/" && req.method == "POST") {
    console.log("Backend initialized");
    res.writeHead(200, {"Access-Control-Allow-Origin":"*", "Content-Type":"application/json", "Cache-Control":"no-cache"});
    res.end("{}");
  } else if (req.url === "/0/" && req.method == "GET") {
    console.log("Setup event stream and start iterating"); 
    res.writeHead(200, {"Access-Control-Allow-Origin":"*", "Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
    res.write("retry: 10000\n");
    res.write("event: cyupdate\n");
    //res.write("data: " + (new Date()) + "\n\n");
    //res.write("data: " + (new Date()) + "\n\n");


    interval = setInterval(function() {
      console.log("new interval");
      /*
      cnt++;
      obj.data.id = cnt;
      var arr = {};
      var add = [];
      add.push(obj);
      var remove = [];
      var msg = [];
      arr.add = add;
      arr.remove = remove;
      arr.message = msg;
      console.log(JSON.stringify(arr));
      res.write("event: cyupdate\n");
      res.write("data: " + JSON.stringify(arr) + "\n\n");
      */
      var arr = {};
      var add = [];
      var remove = [];
      var msg = [];
      var step = steps[cnt];
      if (step.action == "add") {
        add.push({group: step.group, data: {id: step.id, source: step.source, target: step.target}});
      } else {
        remove.push({group: step.group, data: {id: step.id}});
      }
      arr.add = add;
      arr.remove = remove;
      arr.message = msg;
      console.log(JSON.stringify(arr));
      res.write("event: cyupdate\n");
      res.write("data: " + JSON.stringify(arr) + "\n\n");
      cnt++;
 
    }, 1000);
    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  } else if (fileName === index) {
    fs.exists(fileName, function(exists) {
      if (exists) {
        fs.readFile(fileName, function(error, content) {
          if (error) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(content, "utf-8");
          }
        });
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }

}).listen(8888, "127.0.0.1");
console.log("Server running at http://127.0.0.1:8888/");
