export const customCommands = [
  /*{
    command: "oi",
    responses: [
      "Oiiii!! <3",
      "Oiiii!!"
    ],
    cooldown: 20,
    tags: [random, exclusiveForSubs, exclusiveForNonSubs, exclusiveForMods, exclusiveForBroadcaster],
  },

  {
    command: "oi",
    responses: [
      "Oiiii!! <3",
      "Oiiii!!"
    ],
    cooldown: 20,
    tags: [random, exclusiveForSubs, exclusiveForNonSubs, exclusiveForMods, exclusiveForBroadcaster],
  },

  */

  {
    command: ["!showdi", "!showdebola"],
    response: ["Ow! Segue lá o gato no instagr.am/gatinhoshowdebola", "Gente, segue o Showdi no instagr.am/gatinhoshowdebola. Ele é amigo de famoso kkkkkk."],
    tags: ["cooldown", "random", "exclusiveForSubs", "exclusiveForNonSubs", "exclusiveForMods", "exclusiveForBroadcaster"],
    cooldownSeconds: 20,
  },

  {
    command: ["twitch-follow"],
    response: ["Gente!! {user} começou a seguir o canal.", "Oxe! Mais um seguidor. Obrigado, {user}!", "Eita! {user} deu follow no canal. <3"],
    tags: ["ordered", "exclusiveForSubs", "exclusiveForNonSubs", "exclusiveForMods", "exclusiveForBroadcaster", "exclusiveForBot"],
    cooldownSeconds: 20,
  },

  {
    comando: ["twitch-follow"],
    resposta: ["Gente!! {user} começou a seguir o canal.", "Oxe! Mais um seguidor. Obrigado, {user}!", "Eita! {user} deu follow no canal. <3"],
    tags: ["ordenado", "aleatorio", "exclusivoParaSubs", "exclusivoParaNaoSubs", "exclusivoParaMods", "exclusivoParaDonoDoCanal", "exclusivoParaBot"],
    cooldownSeconds: 20,
  },

  {
    comando: ["random-periodic-message"],
    resposta: ["Gente!! {user} começou a seguir o canal.", "Oxe! Mais um seguidor. Obrigado, {user}!", "Eita! {user} deu follow no canal. <3"],
    tags: ["ordenado", "aleatorio", "exclusivoParaSubs", "exclusivoParaNaoSubs", "exclusivoParaMods", "exclusivoParaDonoDoCanal", "exclusivoParaBot"],
    cooldownSeconds: 20,
  },
]

//Teste de edição
