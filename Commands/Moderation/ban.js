//permission: Moderator;
//usage: <userResolve> | <reason> || <userResolve> | <reason> | -<flag>;
if (args.length == 2)
{
    // If the user has moderator permissions.
	if (isMod(message.author.id, message.guild.id) || isAdmin(message.author.id, message.guild.id))
	{
	    // Prevent the baning of yourself.
        if (getUserResolvable(args[0], message.guild.id).id != message.author.id)
        {
            // Check if the user can be baned.
			if (message.guild.members.get(getUserResolvable(args[0], message.guild.id).id).bannable)
			{
			    // Post the embed.
				var emb = new Discord.RichEmbed();
				emb.setAuthor(message.author.tag, message.author.avatarURL);
				emb.addField("User", getUserResolvable(args[0], message.guild.id).tag + `[${getUserResolvable(args[0], message.guild.id).id}]`);
				emb.addField("Action", "Ban");
				emb.addField("Reason", args[1]);
				emb.setColor("#ee0000");
				message.channel.send({ embed : emb });
				message.channel.send("Would you like to ban this user? __y__es or __n__o?");
				
				// Create a message collector
				const collector = message.channel.createMessageCollector(m => m.content == 'y' && m.author.id == message.author.id || m.content == 'n' && m.author.id == message.author.id, { time: 15000 });
				
				collector.on('collect', m => { console.log(`Collected ${m.content}`); 
				
				collector.stop(); 
				if (m.content == "y")
				{
				message.guild.members.get(getUserResolvable(args[0], message.guild.id).id).ban();
				
				message.reply("Successfully banned " + getUserResolvable(args[0], message.guild.id).tag);
                }
				else if (m.content == "n")
				{
				    message.reply("Cancelling.");
				    collector.stop();
				}
				});
				collector.on('end', (collected, reason) => {
				    if (reason == "time")
					{
					    message.reply("Timed out.");
					}
					console.log(`Collected ${collected.size} items`)
					console.log(reason);
				});
			}
			else
			{
			    // Error if the user cannot be baned.
			    message.reply(`I cannot ban user \`${getUserResolvable(args[0], message.guild.id).tag}\``);
			}
        }
       	else
		{
		    message.reply("You cannot ban yourself.");
		}
	}
	else
	{
	    message.reply(`You do not have permission to do this. You must be a \`Moderator\`.`);
	}
}
else if (args.length == 3)
{
    // If the user has moderator permissions.
	if (isOwner(message.author))
	{
         // Prevent the baning of yourself.
        if (getUserResolvable(args[0], message.guild.id).id != message.author.id)
        {
            // Check if the user can be baned.
			if (message.guild.members.get(getUserResolvable(args[0], message.guild.id).id).bannable)
			{
			    // Post the embed.
				var emb = new Discord.RichEmbed();
				emb.setAuthor(message.author.tag, message.author.avatarURL);
				emb.addField("User", getUserResolvable(args[0], message.guild.id).tag + `[${getUserResolvable(args[0], message.guild.id).id}]`);
				emb.addField("Action", "Ban");
				emb.addField("Reason", args[1]);
				emb.setColor("#ee0000");
				if (args[2] != "-y")
				{
					message.channel.send({ embed : emb });
					message.channel.send("Would you like to ban this user? __y__es or __n__o?");
				
					// Create a message collector
					const collector = message.channel.createMessageCollector(m => m.content == 'y' && m.author.id == message.author.id || m.content == 'n' && m.author.id == message.author.id, { time: 15000 });
				
					collector.on('collect', m => { console.log(`Collected ${m.content}`); 
				
					collector.stop(); 
					if (m.content == "y")
					{
					message.guild.members.get(getUserResolvable(args[0], message.guild.id).id).ban();
				
					message.reply("Successfully banned " + getUserResolvable(args[0], message.guild.id).tag);
					}
					else if (m.content == "n")
					{
						message.reply("Cancelling.");
						collector.stop();
					}
					});
					collector.on('end', (collected, reason) => {
				
					console.log(`Collected ${collected.size} items`)
					console.log(reason);
					});
				}
				else
				{
					message.guild.members.get(getUserResolvable(args[0], message.guild.id).id).ban();
				
					message.reply("Successfully banned " + getUserResolvable(args[0], message.guild.id).tag);
				}
			}
			else
			{
			    // Error if the user cannot be banned.
			    message.reply(`I cannot ban user \`${getUserResolvable(args[0], message.guild.id).tag}\``);
			}
        }
       	else
		{
		    message.reply("You cannot ban yourself.");
		}
	}
	else
	{
	    message.reply(`You do not have permission to do this. You must be an \`Owner\` to use flags.`);
	}
}