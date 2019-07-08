var fs = require("fs");
var request = require("request");

request("https://api.warframe.market/v1/items", function(error, response, body) {
  var data  = JSON.parse(body);

  for (var i = 0; i < data.payload.items.length; i++) {
    fs.appendFile("items.txt", data.payload.items[i].url_name+"\n", (err) => {
      if (err) throw err;
    })
  }

  console.log("Successfully pulled items");
});
