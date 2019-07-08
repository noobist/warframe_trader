import api from './api';
import fs from 'fs';

const file = 'items.txt';

const fetchData = async () => {
  try {
    let data = await api.getAllItems();

    fs.truncate(file, 0, function() {
      console.log('File emptied')

      for (var i = 0; i < data.payload.items.length; i++) {
        fs.appendFile(file, data.payload.items[i].url_name+"\n", (err) => {
          if (err) throw err;
        })

        if (i === data.payload.items.length-1)
          console.log("Successfully pulled new data");
      }
    });
  } catch (e) { }
}

console.log('Updating items...\n');
fetchData();
