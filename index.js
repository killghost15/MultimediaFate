const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/play',function(req,res){
  res.sendFile(path.join(__dirname + '/Play.html'));

});

app.get("/answers", function(req, res) {
	sceneName = req.query.sceneName;
	underscoreLessSceneName = sceneName.replace(/_/g, " "); 
	var choices;
	fs.readFile('./CHOICES_TREE.txt', "utf8", 
	function (err,data) {
		if (err) 
		{
			return console.log(err);
		}
		dataString = data.toString('ascii', 0, data.length);
		var lines = dataString.split("\n");
		console.log(lines.length);
		for(var i=0;i<lines.length;i++)
		{
			var splited = lines[i].split("-");
			console.log(lines[0]);
			if(splited[0] == underscoreLessSceneName)
			{
				console.log("yey " + splited[1]);
				res.send(splited[1])
				return;
			}
		}
		return;	
	});
	return;
	
})

app.get('/video', function(req, res) {
	fileName = req.query.file + ".mp4";
	console.log(fileName);
  const path = 'scenes/'+fileName; //change for the diferent video get with id='something' then path = 'assets/'+id+'.mp4'
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1;

    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});