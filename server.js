console.log('\n\n\n\n\nInitialized.')

import { customCommands } from './commands.js';

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

client.on("hosted", (channel, username, viewers, autohost) => {
    const variables = {
      user:username,
      viewers:viewers
    }
    client.say(channel, getResponseToEvent("hosted", variables));
    console.log('Sendo hospedado por ' + username + ' para ' + viewers + ' pessoas');
});

client.on("raided", (channel, username, viewers) => {
    const variables = {
      user:username,
      viewers:viewers
    }
    client.say(channel, getResponseToEvent("raided", variables));
    console.log('Sendo invadido por ' + username + ' com ' + viewers + ' pessoas');
});

client.on("subscription", (channel, username, method, message, userstate) => {
    const variables = {
      user:username
    }
    client.say(channel, getResponseToEvent("subscription", variables));
    console.log(username + ' se inscreveu no canal! (' + method + ')');
    //TODO: check if methos is Prime
});

client.on("resub", (channel, username, streakMonths, message, userstate, method) => {
    // if(userstate["msg-param-should-share-streak"]) {
    //   let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    // }
    // if(streakMonths > 0) {
    //   console.log(streakMonths + ' meses');
    // }
    const variables = {
      user:username
    }
    client.say(channel, getResponseToEvent("resub", variables));
    console.log(username + ' renovou sua inscri????o no canal! (' + methods + ')');
    //TODO: check if methos is Prime
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    // let senderCount = ~~userstate["msg-param-sender-count"];
    const variables = {
      user:username,
      outrouser:recipient
    }
    client.say(channel, getResponseToEvent("subgift", variables));
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    // let senderCount = ~~userstate["msg-param-sender-count"];
    const variables = {
      user:username,
      quantidade:numbOfSubs
    }
    client.say(channel, getResponseToEvent("submysterygift", variables));
});

client.on("cheer", (channel, userstate, message) => {
    const variables = {
      user:userstate['display-name'],
      quantidade:userstate.bits
    }
    console.log(userstate);

    if(userstate['display-name'].toLowerCase() == 'AnAnonymousCheerer'.toLowerCase()) {
      client.say(channel, getResponseToEvent("cheer-anonymous", variables));
      console.log("An??nimo mandou " + userstate.bits + " bits!");
    } else {
      client.say(channel, getResponseToEvent("cheer", variables));
      console.log(userstate['display-name'] + " mandou " + userstate.bits + " bits!");
    }
});

client.on('message', (channel, tags, message, self) => {
	if(self) return;

  let command = replaceAllAliases(message.toLowerCase().split(' ')[0]);
  //let command = replaceAllAliases(message.toLowerCase());
  //console.log('command: ' + command);
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
});

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
  //console.log('Error: response not found');
  return undefined;
}
function getCommands(isMod) {
  if(isMod) {
    return publicCommands.concat(privateCommands);
  } else {
    return publicCommands;
  }
}
function getResponseToEvent(eventName, variables) {
  for(let i = 0; i < events.length; i++) {
    if(eventName == events[i][0]) {
      let possibleResponses = events[i].slice();
      possibleResponses.splice(0, 1); //get only responses, remove command (first element in the array)
      const randomIndex = Math.floor(Math.random()*possibleResponses.length);
      let message = possibleResponses[randomIndex];
      if(message) {
        message = replaceAllVariables(message, variables);
        return message;
      }
    }
  }
  //console.log('Error: response not found');
  return undefined;
}

const publicCommands = [
  ["!oi", "Oiiii!! <3"],
  ["!beto", "Oiii {user}!!! <3 To aqui! Os comandos que voc?? pode usar no chat s??o: !twitter, !instagram, !showdi, !playlist, !colab e !luzes."],
  ["!twitter", "Gente, o twitter do Gabriel ?? twitter.com/moskito t???"],
  ["!instagram", "O insta do Gabriel ?? instagr.am/vondoscht mas ele quase nunca posta afffff"],
  ["!showdi", "Ow! Segue l?? o gato no instagr.am/gatinhoshowdebola", "Gente, segue o Showdi no instagr.am/gatinhoshowdebola. Ele ?? amigo de famoso kkkkkk."],
  ["!spotify", "Todas as playlists que o Gabriel toca nas lives est??o dispon??veis l?? no Spotify: bit.ly/spotscht"],
  ["!colab", "Quer sugerir uma m??sica? Participe da playlist colaborativa no Spotify: spoti.fi/3wJkQXT", "Todo mundo pode sugerir m??sicas pra tocar na live!! S?? indicar elas l?? no spoti.fi/3wJkQXT"],
  ["!luzes", "Oiiii!! Voc?? pode mudar a ilumina????o usando os comandos !sensual, !triste, !dark ou !acab. Mas esses comandos s?? funcionam pra quem ?? SUB do canal, t???", "Dica: Quem ?? SUB do canal pode ficar mudando as luzes a qualquer momento. ?? s?? usar os comandos !sensual, !triste, !dark ou !acab. Mas aten????o!!! A namors do Gabriel n??o gosta dessa pisca????o!!!"],
]
const privateCommands = [
  ["!so", "Gente, segue l?? o canal twitch.tv/{param} <3"],
]
const events = [
  ["hosted", "Gente!!! {user} t?? agora mesmo hospedando a live no canal dele."],
  ["raided", "Mano do c??u!!! {user} mandou uma RAID com {viewers} pessoas!"],
  ["subscription", "Eita, gente! Agora {user} ?? SUB do canal! Valeu!", "Ow!!! {user} deu SUB no canal! Valeu! <3"],
  ["subscription-prime", "Eita!!! {user} virou SUB com seu Prime. Valeu!", "Gente!!! {user} virou SUB com o Prime. <3"],
  ["resub", "C?? ?? louco? {user} renovou o SUB. Valeu demais!"],
  ["resub-prime", "C?? ?? louco? {user} renovou o SUB usando o Prime. Valeu!"],
  ["subgift", "Eita! {user} de um SUB de presente pra {outrouser}.", "Oxe! {outrouser} ganhou um SUB de presente de {user}."],
  ["submysterygift", "Mano do c??u!!! {user} t?? dando SUB de presente pro chat!"],
  ["cheer", "Eita!!! {user} mandou {quantidade} bits. Valeu demais!", "Gente!! tem mais {quantidade} bits chegando. Obrigado, {user}!", "Ow!!! {user} mandou {quantidade} bits. <3"],
  ["cheer-anonymous", "Oxe?! Um an??nimo deu {quantidade} bits. Quem foi??"],
  ["follow", "Gente!! {user} come??ou a seguir o canal.", "Oxe! Mais um seguidor. Obrigado, {user}!", "Eita! {user} deu follow no canal. <3"],
]
const aliases = [
  ["!showdi", "!showdebola"],
  ["!instagram", "!insta"],
  ["!spotify", "!playlist"],
]





/*
TODO:
- Follow Event
- Sorteio
- Responder luzes para n??o-subs
- Refatorar organiza????o do c??digo

*/
