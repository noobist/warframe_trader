import Discord from 'discord.js';
import auth from './auth.json';
import api from './api';
import fs from 'fs';

const client = new Discord.Client();

const update = async () => {
  const file = 'items.txt';

  try {
    const data = await api.getAllItems();

    fs.truncate(file, 0, function() {
      console.log('File emptied')

      for (var i = 0; i < data.length; i++) {
        fs.appendFile(file, data[i].url_name+"\n", (err) => {
          if (err) throw err;
        })
        console.log(`${i+1} objects loaded`);
        if (i === data.length-1) {
          console.log("Successfully pulled new data");
          return true;
        }
      }
    });
  } catch (e) {
    return false;
  }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!update') {
    if(update())
      msg.reply('Updated!');
    else
      msg.reply('An error has occured!');
  }
});

client.login(auth.token);
