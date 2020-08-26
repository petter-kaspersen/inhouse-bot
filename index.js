require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const data = require('./data.json');
const fs = require('fs');

const reactions = {
  LeagueOfLegends: {
    role: 'LEGO LEGANDO',
    id: '746851263689261206',
  },
  AmongUs: {
    role: 'Among Us',
    id: '746852188650995763',
  },
  Valorant: {
    role: '(valorant) Counterwatch Weaboo Offensive',
    id: '746853730929868920',
  },
  ApexLegends: {
    role: 'Apex Legends',
    id: '746855465660448820',
  },
  terraria: {
    role: 'Terraria',
    id: '746857150571085896',
  },
  TFT: {
    role: 'TFT',
    id: '746860479158288464',
  },
  Minecraft: {
    role: 'Minecraft',
    id: '746862047752355951',
  },
};

client.on('ready', async () => {
  console.log(`Bot is ready for action.`);

  const channel = client.channels.get('748138032393355266');

  if (!data.hasSentMessage) {
    channel
      .send(
        `Hi, @everyone! \nPlease react to this bot to get the chosen role. If the bot fails to assign you a role, feel free to contact one of the head honchos (always ping Yoush). \n\nROLES: \n\n <:AmongUs:746852188650995763> Among Us \n\n<:LeagueOfLegends:746851263689261206> League of Legends \n\n<:Valorant:746853730929868920> Valorant \n\n<:ApexLegends:746855465660448820> Apex Legends \n\n<:terraria:746857150571085896> Terraria \n\n<:TFT:746860479158288464> TFT \n\n<:Minecraft:746862047752355951> Minecraft`
      )
      .then(async (msg) => {
        msg
          .react('746852188650995763')
          .then(() => msg.react('746851263689261206'))
          .then(() => msg.react('746853730929868920'))
          .then(() => msg.react('746855465660448820'))
          .then(() => msg.react('746857150571085896'))
          .then(() => msg.react('746860479158288464'))
          .then(() => msg.react('746862047752355951'));

        await fs.writeFileSync(
          'data.json',
          JSON.stringify(
            {...data, messageId: msg.id, hasSentMessage: true},
            'utf-8'
          )
        );

        channel.fetchMessage(msg.id).then((message) => {
          message.awaitReactions((reaction, user) => {});
        });
      });
  } else {
    const {messageId} = data;

    channel.fetchMessage(messageId).then((message) => {
      message.awaitReactions((reaction, user) => {});
    });
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  const file = fs.readFileSync('data.json');
  const fileJson = JSON.parse(file);

  const {message, emoji} = reaction;

  if (message.id !== fileJson.messageId || user.bot) {
    return;
  }

  if (!reactions[reaction.emoji.name]) {
    return message.reactions.forEach(
      (r) => r.emoji.name == reaction.emoji.name && r.remove(user.id)
    );
  }

  let _user = message.guild.members.find((x) => x.id == user.id);
  let _role = message.guild.roles.find(
    (role) => role.name == reactions[reaction.emoji.name].role
  );

  if (_role && _user) {
    const userHasRole = _user.roles.find((role) => role.id == _role.id);

    if (!userHasRole) {
      _user.addRole(_role.id);
    }
  }
});

client.on('messageReactionRemove', (reaction, user) => {
  const {message, emoji} = reaction;

  const file = fs.readFileSync('data.json');
  const fileJson = JSON.parse(file);

  if (
    message.id !== fileJson.messageId ||
    user.bot ||
    !reactions[reaction.emoji.name]
  ) {
    return;
  }

  let _user = message.guild.members.find((x) => x.id == user.id);
  let _role = message.guild.roles.find(
    (role) => role.name == reactions[reaction.emoji.name].role
  );

  if (_role && _user) {
    const userHasRole = _user.roles.find((role) => role.id == _role.id);

    if (userHasRole) {
      _user.removeRole(_role.id);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
