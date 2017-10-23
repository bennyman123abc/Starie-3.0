//permission: Moderator;
//usage: <userResolve> | <reason>

// Make sure there's two arguments.
if (args.length == 2)
{
	// If the user has moderator permissions.
	if (isMod(message.author.id, message.guild.id) || isAdmin(message.author.id, message.guild.id) || canBypassPermissions(message.author.id))
	{
	    // Get the guild member.
	    if(message.guild.members.get(getUserResolvable(args[0])) || message.guild.members.get(getUserResolvable(args[0]).id != "207989356059688962"))
		{
		    getUserResolvable(args[0]).send("You have been warned by " + message.author.username + " for " + argue2 + "! Please don't do it again!");
	     	var guild = message.guild;
            var emb = new Discord.RichEmbed();
            emb.setAuthor(message.author.username, message.author.avatarURL);
            emb.setColor("#ffaa00");
            emb.addField("User", user.username + "#" + user.discriminator);
            emb.addField("Action", "Warn");
            emb.addField("Reason", argue2);
			message.channel.send('Warned user!');
			
            var contents2 = JSON.parse(fs.readFileSync(modActionsChannel));
            var modChannel = contents2[message.guild.id];
            var channel = guild.channels.get(modChannel);
            channel.sendEmbed(embed);
		}
	}
	else
	{
	
	}
}