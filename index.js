const http = require('http');
const url = require('url');

let serverResponse;
let serverRequest;

const getFormUpdateComponent = (city = '') => (`
  <h1>Show the weather in the city:</h1>
  <form method="GET" action="/">
    <input name="city" type="text" value="${city}" />
    <button type="submit">
      Go
    </button>
  </form>
`);

const getWeatherDataInHTML = data => (`
  <h2>${data.location.country}, ${data.location.region}, ${data.location.name}</h2>
  <div>Local time: ${data.location.localtime}</div>
  <div>Temperature: ${data.current.temperature}</div>
  <div>Temperature (feels like): ${data.current.feelslike}</div>
  <div>UV index: ${data.current.uv_index}</div>
  <img src="${data.current.weather_icons[0]}" width="100" />
`);

const pullWeatherRequest = (city) => {
  const accessAPIKey = process.env.API_ACCESS_KEY;
  const url = `http://api.weatherstack.com/current?access_key=${accessAPIKey}&query=${city}`;

  http
    .get(url, response => {
      const statusCode = response.statusCode;

      if (statusCode !== 200) {
        console.error(`Error with status code: ${statusCode}`);
        return;
      }

      response.setEncoding('utf8');

      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        let parsedData = JSON.parse(data);

        if (parsedData.success === false) {
          if (parsedData.error.code === 615 || parsedData.error.code === 601) {
            serverResponse.write('<div>Keyword is invalid. City is not found. Please, try again.</div>');
          } else {
            serverResponse.write(parsedData.error.info);
          }
        } else {
          serverResponse.write(getWeatherDataInHTML(parsedData));
        }

        serverResponse.end();
      });
    })
    .on('error', err => {
      console.error(err);
      return;
    });
};

const server = http.createServer((req, res) => {
  serverResponse = res;
  serverRequest = req;

  const urlParsed = url.parse(serverRequest.url, true);
  const { query, pathname } = urlParsed;

  serverResponse.setHeader('Content-Type', 'text/html; charset=utf-8;');

  if (pathname === '/') {
    serverResponse.write(getFormUpdateComponent(query.city));
    if (query.city) {
      pullWeatherRequest(query.city);
    } else {
      serverResponse.end();
    }
  } else {
    serverResponse.statusCode = 404;
    serverResponse.write(`<h2>404 | Not found</h2>`);
    serverResponse.end();
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running, go to http://localhost:${process.env.PORT}/`);
});