import Discord from 'discord.js';
import auth from './auth.json';
import api from './api';
import fs from 'fs';

const client = new Discord.Client();
const file = 'items.txt';
const LOG_CHANNEL_ID = 597683206166413314;
const IMAGE_LINK = 'https://warframe.market/static/assets/';
const rps = 3;
let started = false;

let itemArray = [];
let buylist = [];
let selllist = [];
let index = 0;

const updateItems = async () => {
  try {
    const data = await api.getAllItems();

    for (let i=0; i<data.length; i++)
      itemArray[i] = data[i].url_name;
  } catch (e) { }
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const start = async msg => {
  try {
    while(started) {
      for (let i=0; i<rps; i++) {
        console.log('===================');
        console.log(`${itemArray[index]}`)
        const data = await api.getItemOrders(itemArray[index]);
        const icon = await api.getImage(itemArray[index]);

        for (let j=0; j<data.length; j++) {
          if (data[j].user.status === 'ingame') {
            if (data[j].order_type === 'buy') {
              buylist[buylist.length] = {
                name: data[j].user.ingame_name,
                plat: data[j].platinum,
                rank: data[j].mod_rank
              };
            }
            if (data[j].order_type === 'sell') {
              selllist[selllist.length] = {
                name: data[j].user.ingame_name,
                plat: data[j].platinum,
                rank: data[j].mod_rank
              };
            }
          }
          if (j === data.length-1) {
            selllist.sort((a,b) => (a.plat > b.plat) ? 1 : ((b.plat > a.plat) ? -1 : 0));
            buylist.sort((a,b) => (a.plat < b.plat) ? 1 : ((b.plat < a.plat) ? -1 : 0));


            if (buylist.length > 0 && selllist.length > 0) {
              if ((buylist[0].plat - selllist[0].plat) > 0) {
                console.log(`${selllist[0].name} selling for: ${selllist[0].plat}\n${buylist[0].name} buying for: ${buylist[0].plat}\nProfit: ${buylist[0].plat - selllist[0].plat}`);

                const logMessage = {
                  embed: {
                    color: 3447003,
                    title: itemArray[index],
                    url: `https://warframe.market/items/${itemArray[index]}`,
                    image: {
		                    url: `${IMAGE_LINK}${icon}`,
	                   },
                    fields: [
                      {
                        name: selllist[0].name,
                        value: `Selling for ${selllist[0].plat}\nMod Rank: ${selllist[0].rank}`,
                        inline: true
                      },
                      {
                        name: buylist[0].name,
                        value: `Buying for ${buylist[0].plat}\nMod Rank: ${buylist[0].rank}`,
                        inline: true
                      },
                      {
                        name: 'Profit',
                        value: buylist[0].plat - selllist[0].plat,
                        inline: true
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "© noobist"
                    }
                  }
                }

                msg.channel.send(logMessage);
              }
            }

            buylist = [];
            selllist = [];
          }
        }
        index++;

        if (index === itemArray.length-1)
          index = 0;
      }
      await wait(1000);
    }
  } catch (e) { }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    updateItems();
});

client.on('message', msg => {
  if (msg.content === '!starttrade') {
    started = true;
    console.log('\nStarting scan...');
    msg.reply('Bot Started!');

    start(msg);
  }

  if (msg.content === '!stoptrade') {
    if (started) {
      started = false;
      console.log('\nScan stopped!');
      msg.reply('Bot stopped!');
    }
    else
      msg.reply('Bot not started!');
  }
});

client.login(auth.token);
