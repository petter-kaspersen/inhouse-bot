require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const data = require('./data.json');
const fs = require('fs');

const reactions = {
  top: {
    role: 'Toplane',
  },
  jungle: {
    role: 'Jungle',
  },
  mid: {
    role: 'Midlane',
  },
  adc: {
    role: 'ADC',
  },
  support: {
    role: 'Support',
  },
  coach: {
    role: 'Coach',
  },
};

client.on('ready', async () => {
  console.log(`Bot is ready for action.`);

  const channel = client.channels.get('673268283742617621');

  if (!data.hasSentMessage) {
    channel
      .send(
        `Hi @everyone! \nIf you don't have a role already, react to this message with the role you want, and the bot will add it to you automatically.\n\nIf the bot fails to grant you a role, send a message to <@133542635632721920>`
      )
      .then(async (msg) => {
        msg
          .react('675331270875676703')
          .then(() => msg.react('675331270884065290'))
          .then(() => msg.react('675331270858768403'))
          .then(() => msg.react('675331270846316545'))
          .then(() => msg.react('675331270514966540'))
          .then(() => msg.react('675352557920583690'));

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
    // Get the message sent.
    const {messageId} = data;

    channel.fetchMessage(messageId).then((message) => {
      message.awaitReactions((reaction, user) => {});
    });
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  const {message, emoji} = reaction;

  if (message.id !== data.messageId || user.bot) {
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

  if (
    message.id !== data.messageId ||
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
