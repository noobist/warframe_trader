import api from './api';

const IMAGE_LINK = 'https://warframe.market/static/assets/';
const URL_LINK = 'https://warframe.market/items/';

const calcModCost = (rarity, rank_start, rank_end) => {
  let cost = new Object();

  const endo = {
    'common': 10,
    'uncommon': 20,
    'rare': 30,
    'legendary': 40
  };

  const credit = {
    'common': 483,
    'uncommon': 966,
    'rare': 1449,
    'legendary': 1932
  };

  cost.endo = endo[rarity]*Math.pow(2, rank_start)*(Math.pow(2, rank_end-rank_start)-1);
  cost.credit = credit[rarity]*Math.pow(2, rank_start)*(Math.pow(2, rank_end-rank_start)-1);

  return cost;
}

const calcAyatanEndo = name => {
  const ayatan = {
    "Anasa Ayatan Sculpture":  3450,
    "Orta Ayatan Sculpture ": 2700,
    "Vaya Ayatan Sculpture": 1800,
    "Piv Ayatan Sculpture": 1725,
    "Valana Ayatan Sculpture": 1575,
    "Sah Ayatan Sculpture": 1500,
    "Ayr Ayatan Sculpture": 1425
  };

  return ayatan[name];
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

class Trader {
  constructor() {
    this._state = true;
  }

  set state(newState) {
    this._state = newState;
  }

  async start(msg) {
    const data = await api.getAllItems();
    const item_size = data.length; //data.length

    let index = 0;
    let fields = [];

    while (this._state) {
      try {
        const details = await api.getItem(data[index].url_name);
        const orders = await api.getItemOrders(data[index].url_name);

        console.log(data[index].url_name);

        if (details.tags.includes('arcane enhancements')) {
          index++;
          continue;
        }


        let buyList = [];
        let sellList = [];

        orders.forEach(function(order) {
          if (order.user.status === 'ingame' && order.user.region === 'en') {
            if (order.order_type === 'buy') {
              buyList[buyList.length] = {
                name: order.user.ingame_name,
                plat: order.platinum,
                rank: order.mod_rank,
              }
            }

            else if (order.order_type === 'sell') {
              sellList[sellList.length] = {
                name: order.user.ingame_name,
                plat: order.platinum,
                rank: order.mod_rank,
              }
            }
          }
        });

        //sellList.sort((a,b) => (a.plat > b.plat) ? 1 : ((b.plat > a.plat) ? -1 : 0));
        sellList.sort(function(a,b) {
          if (a.rank > b.rank)
            return -1;
          else if (a.rank < b.rank)
            return 1;

          if (a.plat > b.plat)
            return 1;
          else if (a.plat < b.plat)
            return -1;

          return 0;
        });
        //buyList.sort((a,b) => (a.plat < b.plat) ? 1 : ((b.plat < a.plat) ? -1 : 0));
        buyList.sort((a,b) => b.plat - a.plat);

        if (buyList.length > 0 && sellList.length > 0) {

          console.log(`${sellList[0].name} selling for ${sellList[0].plat}, Mod Rank: ${sellList[0].rank}`);
          console.log(`${buyList[0].name} buying for ${buyList[0].plat}, Mod Rank: ${buyList[0].rank}`);

          if ((buyList[0].plat - sellList[0].plat) > 0) {

            let logMessage;

            if (details.tags.includes('ayatan')) {
              const endo = calcAyatanEndo(data[index].item_name);

              logMessage = {
                embed: {
                  color: 3447003,
                  title: data[index].item_name,
                  url: `${URL_LINK}${data[index].url_name}`,
                  image: {
                    url: `${IMAGE_LINK}${data[index].thumb}`,
                  },
                  fields: [
                    {
                      name: sellList[0].name,
                      value: `Selling for ${sellList[0].plat} platinums\nMod Rank: ${sellList[0].mod_rank}`,
                      inline: true
                    },
                    {
                      name: buyList[0].name,
                      value: `Buying for ${buyList[0].plat} platinums\nMod Rank: ${buyList[0].mod_rank}`,
                      inline: true
                    },
                    {
                      name: "Profit",
                      value: buyList[0].plat - sellList[0].plat,
                      inline: true
                    },
                    {
                      name: "Endo/Profit Plat",
                      value: endo/(buyList[0].plat - sellList[0].plat),
                    }
                  ],
                  footer: {
                    text: "© noobist"
                  }
                }
              }
            }

            else if (details.tags.includes('mod') && !details.tags.includes('riven')) {
              let cost = new Object();

              if (sellList[0].rank < buyList[0].rank)
                cost = calcModCost(details.rarity, sellList[0].rank, buyList[0].rank);
              else {
                cost.endo = 0;
                cost.credit = 0;
              }

              logMessage = {
                embed: {
                  color: 3447003,
                  title: data[index].item_name,
                  url: `${URL_LINK}${data[index].url_name}`,
                  image: {
                    url: `${IMAGE_LINK}${data[index].thumb}`,
                  },
                  fields: [
                    {
                      name: sellList[0].name,
                      value: `Selling for ${sellList[0].plat} platinums\nMod Rank: ${sellList[0].rank}`,
                      inline: true
                    },
                    {
                      name: buyList[0].name,
                      value: `Buying for ${buyList[0].plat} platinums\nMod Rank: ${buyList[0].rank}`,
                      inline: true
                    },
                    {
                      name: "Profit",
                      value: buyList[0].plat - sellList[0].plat,
                      inline: true
                    },
                    {
                      name: "Cost",
                      value: `Endo: ${cost.endo}\nCredit: ${cost.credit}`,
                    }
                  ],
                  footer: {
                    text: "© noobist"
                  }
                }
              }
            }

            else {
              logMessage = {
                embed: {
                  color: 3447003,
                  title: data[index].item_name,
                  url: `${URL_LINK}${data[index].url_name}`,
                  image: {
                    url: `${IMAGE_LINK}${data[index].thumb}`,
                  },
                  fields: [
                    {
                      name: sellList[0].name,
                      value: `Selling for ${sellList[0].plat} platinums`,
                      inline: true
                    },
                    {
                      name: buyList[0].name,
                      value: `Buying for ${buyList[0].plat} platinums`,
                      inline: true
                    },
                    {
                      name: "Profit",
                      value: buyList[0].plat - sellList[0].plat,
                      inline: true
                    }
                  ],
                  footer: {
                    text: "© noobist"
                  }
                }
              }
            }

            msg.channel.send(logMessage);
          }
        }

        console.log('==================');

        index++;
        if (index === item_size)
          index = 0;

        await wait(1000);
      } catch (e) { console.log('err', e); }

    }
  }
}

export default Trader;
