const
	express = require('express'),
	app = express(),
	handlebars = require('express-handlebars').create({ defaultLayout: 'main' }),
	{ weatherToken } = require('./config.js'),
	fortunes = require('./lib/fortune.js'),
	moment = require('moment'),
	requests = require('./lib/requests.js'),
	port = 3000;
;

let ip, items = {
	currency: { name: 'United States Dollars', symbol: '$' },
	entries: [
		{ name: 'Old TV', desc: 'Epic old TV bruv man', added: '2020-05-23T01:57:41-05:00', pid: 1000 },
		{ name: 'Mac SE', desc: '1980\'s era Macintosh', added: '2020-04-23T01:57:41-05:00', pid: 1001 },
		{ name: 'Mattress', desc: 'twin size mattress', added: '2020-05-20T01:57:41-05:00', pid: 1002 },
		{ name: 'iPhone 6 Plus', desc: 'Perfect condition iPhone 6 plus running iOS 9.1.2', added: '2020-05-19T02:37:41-05:00', price: 120, pid: 2000 },
		{ name: 'JavaScript Programming Book', desc: 'O\'Riley ES5 programming book', added: '2020-05-10T23:00:12-05:00',  price: 15, pid: 2001 },
		{ name: 'nVIDIA GeForce RTX 2080ti', desc: 'lightly used graphics card, never abused', added: '2020-01-10T23:00:12-05:00', price: 650, pid: 2002 },
		{ name: 'Custom built PC', desc: 'Ryzen 3 1200, GTX 1060 3GB, 16GB Vengeance LPX DDR4 Memory', added: '2020-04-24T23:00:12-05:00', price: 500, pid: 2003 }
	]
};

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));
app.use('/css/vendor/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js/vendor/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js/vendor/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use((req, res, next) => {
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/about', (req, res) => {
	generateText = () => { let ret = "new function generated text"; return ret; };
	res.render('about', { li: generateText(), para: "foo bar paragraph", pageTestScript: '/qa/tests-about.js' });
});

app.get('/items', (req, res) => {
	res.render('items', items);
	items.entries.forEach((e) => {
		console.log(moment(e.added).fromNow());
	});
});

app.get('/items/:pid', (req, res) => {
	let item = items.entries.find(({ pid }) => pid == req.params.pid );
	try { res.render('detail', { pid: item.pid, name: item.name, desc: item.desc }); }
	catch { res.render('404', { invalidPid: true }); }
});

app.get('/fortunes', (req, res) => {
	res.render('fortunes', { fortuneList: fortunes.get(30) });
	fortunes.clear();
}); 

// Client system OS resolution endpoint API
app.get('/headers', (req, res) => {
	var s = '';
	for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	res.send(s);
});

app.get('/syscheck', (req, res) => {
	let operatingSystem = req.headers["user-agent"];
	res.send(operatingSystem);
});

app.get('/weather', (req, res) => {
	const options = { host: 'api.weatherapi.com', port: 80, path: `/v1/current.json?key=${weatherToken}&q=${req.query.zip}`, method: 'GET' }
	ip = req.ip;
	requests.getJSON(options, (code, data) => {
		if (code === 200) {
			console.log(`Weather data for ${data.location.name}, ${data.location.region} was requested from ${ip}.`);
			res.render('weather', { name: data.location.name, region: data.location.region, country: data.location.country, temp: data.current.temp_f, feelslike: data.current.feelslike_f, icon: data.current.condition.icon });
		} else {
			console.log(`Attempting to get weather URL of ${options.path} returned a non-200 HTTP status of ${code}`);
			res.render('weather', { name: 'Invalid zip' });
		}
	});
});

app.use((req, res, next) => {
	res.status(404);
	res.render('404');
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(port, console.log(`listening on ${port}`));
