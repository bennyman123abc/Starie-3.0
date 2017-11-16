//permission: Whitelisted;
//hidden;
//info: Look up user information.;
if (isOwner(message.author)) {
				console.log(args[0]);
				client.fetchUser(args[0]).then(fetchedUser => { 
					console.log(fetchedUser);
					var embed = new Discord.RichEmbed();
					embed.setAuthor(fetchedUser.username + "#" + fetchedUser.discriminator + ` [${fetchedUser.id}]`, fetchedUser.displayAvatarURL);
					embed.addField("Created At", fetchedUser.createdAt + `[${fetchedUser.createdTimestamp}]`);
					embed.addField("Avatar URL", fetchedUser.displayAvatarURL);
					embed.setFooter("User fetching system!");
					message.channel.sendEmbed(embed);
				}).catch(error => { console.log(error)});
			}
