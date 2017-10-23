//permission: Everyone;
//usage: None;

// Create the embed.
var rembed = new Discord.RichEmbed();

// Set author, description, and add a field.
rembed.setAuthor(client.user.username, client.user.displayAvatarURL);
rembed.setDescription("Pong!");
rembed = rembed.addField("Ping", Math.floor(client.ping));

// Post it.
message.channel.send({ embed : rembed});
