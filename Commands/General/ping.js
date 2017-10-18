//permission: Everyone;
//usage: None;
var rembed = new Discord.RichEmbed();
rembed.setAuthor(client.user.username, client.user.avatarURL);
rembed.setDescription("Pong!");
rembed = rembed.addField("Ping", Math.floor(client.ping/12));
message.channel.send({ embed : rembed});
