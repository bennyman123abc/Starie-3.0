//permission: Everyone;
//usage: None;

var totalCount = 0;
var embString = "";
var emb = new Discord.MessageEmbed();

client.guilds.forEach((server) => {
    totalCount += server.memberCount;
    embString += `${server.name} | ${server.memberCount} user(s)\n`;
})

emb.addField("Servers", embString);
emb.setFooter(`Serving ${totalCount} user(s) in ${client.guilds.size} server(s).`)
emb.setColor("GREEN");

message.channel.send({ embed : emb });
