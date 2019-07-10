import Discord from 'discord.js';
import auth from './auth.json';
import guilds from './guilds.json';
import Trader from './trader';

const client = new Discord.Client();
let trader;

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    trader = new Trader();
});

client.on('message', msg => {
  if (msg.content === '!starttrade') {
    msg.reply('Starting scan...');
    trader.state = true;
    trader.start(msg);
  }

  if (msg.content === '!stoptrade') {
    msg.reply('Scan stopped!');
    trader.state = false;
  }
});

client.login(auth.token);
