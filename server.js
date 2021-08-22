console.log('\n\n\n\n\nInitialized.')

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);
app.use(express.static('public'));

import tmi from 'tmi.js';

const botUsername = 'assistentebeto';
const botAccessToken = process.env.ACCESS_TOKEN;
// const botRefreshToken = process.env.REFRESH_TOKEN;
// const botClientId = process.env.CLIENT_ID;
const channelName = 'vondoscht';
const cooldownTime = 20000;

let commandsRecentlyUsed = [];

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: botUsername,
		password: botAccessToken
	},
	channels: [ channelName ]
});
client.connect();
client.on('message', (channel, tags, message, self) => {
	if(self) return;
  handleReplyToCommands(channel, tags, message, self);
});
client.on("hosted", (channel, username, viewers, autohost) => {
    console.log('Sendo hospedado por ' + username + ' para ' + viewers + ' pessoas');
});
client.on("raided", (channel, username, viewers) => {
    console.log('Sendo invadido por ' + username + ' com ' + viewers + ' pessoas');
});
client.on("subscription", (channel, username, method, message, userstate) => {
    console.log(username + ' se inscreveu no canal! (' + method + ')');
});
client.on("resub", (channel, username, streakMonths, message, userstate, method) => {
    // if(userstate["msg-param-should-share-streak"]) {
    //   let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    // }
    console.log(username + ' renovou sua inscrição no canal! (' + methods + ')');
    if(streakMonths > 0) {
      console.log(streakMonths + ' meses');
    }
});
client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    // let senderCount = ~~userstate["msg-param-sender-count"];
});
client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    // let senderCount = ~~userstate["msg-param-sender-count"];
});
client.on("cheer", (channel, userstate, message) => {
    console.log(userstate['display-name'] " mandou " + userstate.bits + " bits!");
});



function handleReplyToCommands(channel, tags, message, self)  {
  let command = replaceAllAliases(message.toLowerCase().split(' ')[0]);
  //let command = replaceAllAliases(message.toLowerCase());
  console.log('command: ' + command);
  if(!command) return;
  if(isCommandInCooldown(command)) {
    console.log('Command ' + command + ' is in cooldown');
    return;
  }

  const variables = {
    user: '@' + tags['display-name'],
    param: message.split(' ')[1],
  }

  const isMod = (tags['mod'] || isBroadcaster(tags.username));
  const isSub = (tags['subscriber'] || isBroadcaster(tags.username));
  let response = getResponse(command, variables, isMod);
  if(!response) return;
  client.say(channel, response);
  registerCooldown(command);
  return;
}
function registerCooldown(command) {
  commandsRecentlyUsed.push(command);
  setTimeout(() => {
    for(let i = commandsRecentlyUsed.length-1; i >= 0; i--) {
      if(commandsRecentlyUsed[i] == command) {
        commandsRecentlyUsed.splice(i, 1);
      }
    }
  }, cooldownTime);
}
function isCommandInCooldown(command) {
  return commandsRecentlyUsed.includes(command);
}

function isBroadcaster(username) {
  return username.toLowerCase() == channelName.toLowerCase();
}

function replaceAllVariables(text, variables) {
  let resultText = text;
  for(const v in variables) {
    const variableCode = '{' + v + '}';
    const searchRegExp = new RegExp(variableCode,"g");
    resultText = resultText.replace(searchRegExp, variables[v]);
  }
  return resultText;
}

function replaceAllAliases(text) {
  let resultText = text;
  for(let i = 0; i < aliases.length; i++) {
    const source = aliases[i][1];
    const alias = aliases[i][0];
    const searchRegExp = new RegExp(source,"g");
    resultText = resultText.replace(searchRegExp, alias);
  }
  return resultText;
}

function getResponse(command, variables, isMod) {
  const commands = getCommands(isMod);
  for(let i = 0; i < commands.length; i++) {
    if(command == commands[i][0]) {
      let possibleResponses = commands[i].slice();
      possibleResponses.splice(0, 1); //get only responses, remove command (first element in the array)
      const randomIndex = Math.floor(Math.random()*possibleResponses.length);
      let message = possibleResponses[randomIndex];
      if(message) {
        message = replaceAllVariables(message, variables);
        return message;
      }
    }
  }
  console.log('Error: response not found');
  return undefined;
}

function getCommands(isMod) {
  if(isMod) {
    return publicCommands.concat(privateCommands);
  } else {
    return publicCommands;
  }
}

const publicCommands = [
  //["!comando", "resposta"],
  //["!comando", "resposta1", "resposta2", "resposta3", ...],
  ["!oi", "Oiiii!! <3"],
  ["!beto", "Oiii {user}!!! <3 To aqui! Os comandos que você pode usar no chat são: !twitter, !instagram, !showdi, !playlist, !colab e !luzes."],
  ["!twitter", "Gente, o twitter do Gabriel é twitter.com/moskito tá?"],
  ["!instagram", "O insta do Gabriel é instagr.am/vondoscht mas ele quase nunca posta afffff"],
  ["!showdi", "Ow! Segue lá o gato no instagr.am/gatinhoshowdebola", "Gente, segue o Showdi no instagr.am/gatinhoshowdebola. Ele é amigo de famoso kkkkkk."],
  ["!spotify", "Todas as playlists que o Gabriel toca nas lives estão disponíveis lá no Spotify: bit.ly/spotscht"],
  ["!colab", "Quer sugerir uma música? Participe da playlist colaborativa no Spotify: spoti.fi/3wJkQXT", "Todo mundo pode sugerir músicas pra tocar na live!! Só indicar elas lá no spoti.fi/3wJkQXT"],
  ["!luzes", "Oiiii!! Você pode mudar a iluminação usando os comandos !sensual, !triste, !dark ou !acab. Mas esses comandos só funcionam pra quem é SUB do canal, tá?", "Dica: Quem é SUB do canal pode ficar mudando as luzes a qualquer momento. É só usar os comandos !sensual, !triste, !dark ou !acab. Mas atenção!!! A namors do Gabriel não gosta dessa piscação!!!"],
]
const privateCommands = [
  ["!so", "Gente, segue lá o canal twitch.tv/{param} <3"],
]
const aliases = [
  ["!showdi", "!showdebola"],
  ["!instagram", "!insta"],
  ["!spotify", "!playlist"],
]
