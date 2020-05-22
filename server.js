const express = require('express'),
	app = express();

app.use(express.static(__dirname + '/public'));
app.get('/bruh', (req, res) => { res.send('epicly you have hit /bruh'); console.log("bruh!"); return });

app.listen(3000, console.log('listening'));
