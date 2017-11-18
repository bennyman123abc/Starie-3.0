//permission: Everyone;
//usage: <userResolve>;
//module: RPG;
// Get the other user's resolvable.
var otherUser = getUserResolvable(args[0], message.guild.id, message);
var server = JSON.parse(String(fs.readFileSync(`${config['local']['serverSettings']}/${message.guild.id}.json`)));

// Get the user info files.
var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)));
if (otherUser.id != client.user.id) {
	var user2 = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${otherUser.id}.json`)));
}
else
{
    var p1Stats = JSON.stringify(user);
    var user2 = JSON.parse(p1Stats);
	console.log(p1Stats);
	console.log(JSON.stringify(user2));
	user2["stats"]["name"] = "Starie Bot";
	user2["Whitelisted"] = true;
	user2["Blacklisted"] = false;
	user2["Owner"] = true;
	user2["canBypassPermissions"] = true;
	var level = Math.floor(Math.random() * 10);
	console.log(level);
	console.log(user2["stats"]["level"])
	user2["stats"]["level"] += level;
}

// Check if you have a character.
if (user["stats"] != undefined) {
    if (otherUser.id != message.author.id) {
        // Make sure there's 1 argument.
        if (args.length == 1) {
            // Check if the other player has a character.
            if (otherUser != undefined) {
                var chances1 = getMight(user["stats"]);
				var chances2 = getMight(user2["stats"]);
				
                var emb = new Discord.RichEmbed();
                emb.setAuthor(user["stats"]["name"], message.author.displayAuthorUrl);
                emb.addField(`${user["stats"]["name"]}'s Might`, Math.floor(chances1), true);
                emb.addField(`${user2["stats"]["name"]}'s Might`, Math.floor(chances2), true);
                if (chances1 > chances2) {
                    emb.setDescription(`${user["stats"]["name"]} has a greater chance of Victory.`);
                }
                if (chances2 > chances1) {
                    emb.setDescription(`${user2["stats"]["name"]} has a greater chance of Victory.`);
                }
                emb.setFooter("Battle chances");
                message.channel.send("These are your chances, are you sure want to battle? __y__es? Or __n__o?", {
                    embed: emb
                });

                // Create a message collector
                const collector = message.channel.createMessageCollector(m => m.content.toLowerCase() == 'y' && m.author.id == message.author.id || m.content.toLowerCase() == 'n' && m.author.id == message.author.id, {
                    time: 15000
                });

                collector.on('collect', m => {
                    console.log(`Collected ${m.content}`);

                    collector.stop();
                    if (m.content.toLowerCase() == "y") {
					    console.log(`Starting fight with another user`);
                        if (chances1 >= chances2) {
                            var winChances = Math.floor(Math.floor(Math.random() * chances1 + (1 * (chances1 / 8))) + (chances1 / 6));
                        } else {
                            var winChances = Math.floor(Math.floor(Math.random() * chances2 + (1 * (chances2 / 8))) + (chances1 / 6));
                        }
                        console.log(winChances);

                        if (chances1 > chances2) {
                            if (winChances < chances2) {
                                message.reply(`They won... Try again next time! They won by ${Math.floor(chances1 - winChances)} [${winChances}].`);
                            } else {
                                var expEarned = getMight(user2["stats"]);
								var victoryInfo = `You won! Congratulations! You won by ${Math.floor(winChances - chances2)}. You earned \`${expEarned / 2}\` EXP, and \`${expEarned}\` Gold!`;
                                var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)))
                                user["stats"]["exp"] += expEarned / 2;
								if (server["modules"]["GLOBAL_ECONOMY"] == true)
								{
									user["money"] += expEarned;
								}
								else
								{
									if (server["economy"][message.author.id] == undefined)
									{
										server["economy"][message.author.id] = 0;
									}
									
									server["economy"][message.author.id] +=expEarned;
								}
								var leveled = false;
								
                                while(user["stats"]["exp"] >= 5 * user["stats"]["level"]) {
								    user["stats"]["exp"] -= 5 * user["stats"]["level"];
									user["stats"]["level"] += 1;
									leveled = true;
                                }
								
								if (leveled == true)
								{
								    victoryInfo = victoryInfo + ` You leveled up to level ${user["stats"]["level"]}`;
								}
								
								message.reply(victoryInfo);
								fs.writeFileSync(`./././${config["local"]["serverSettings"]}/${message.guild.id}.json`, JSON.stringify(server));
                                fs.writeFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`, JSON.stringify(user));
                            }
                        } else {
                            if (winChances < chances2) {
                                message.reply(`They won... Try again next time! They won by ${Math.floor(chances2 - winChances)} [${winChances}].`);
                            } else {
                                var expEarned = getMight(user2["stats"]);
								var victoryInfo = `You won! Congratulations! You won by ${Math.floor(winChances - chances2)}. You earned \`${expEarned / 2}\` EXP, and \`${expEarned}\` Gold!`;
                                var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)))
                                user["stats"]["exp"] += expEarned / 2;
								console.log(server["modules"]);
								if (server["modules"]["GLOBAL_ECONOMY"] == true)
								{
									user["money"] += expEarned;
								}
								else
								{
									if (server["economy"][message.author.id] == undefined)
									{
										server["economy"][message.author.id] = 0;
									}
									
									server["economy"][message.author.id] +=expEarned;
								}
								
								var leveled = false;
								
                                while(user["stats"]["exp"] >= 5 * user["stats"]["level"]) {
								    user["stats"]["exp"] -= 5 * user["stats"]["level"];
									user["stats"]["level"] += 1;
									leveled = true;
                                }
								
								if (leveled == true)
								{
								    victoryInfo = victoryInfo + ` You leveled up to level ${user["stats"]["level"]}`;
								}
								
								message.reply(victoryInfo);
								fs.writeFileSync(`./././${config["local"]["serverSettings"]}/${message.guild.id}.json`, JSON.stringify(server));
                                fs.writeFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`, JSON.stringify(user));
							}
						}
                    } else if (m.content.toLowerCase() == "n") {
                        message.reply("Cancelling.");
                        collector.stop();
                    }
                });
                collector.on('end', (collected, reason) => {
                    if (reason == "time") {
                        message.reply("Timed out.");
                    }
                    console.log(`Collected ${collected.size} items`)
                    console.log(reason);
                });
            } else {
                message.reply("You can't battle a user who doesn't have a character!");
            }
        } else {
            message.reply(`Who do you want to battle? Please tell me within the command. ${prefix}battle: <userResolve>`);
        }
    } else {
        message.reply("You cannot battle yourself!");
    }
} else {
    message.reply(`You don't have a character! Create one ${prefix}create: <name>`);
}
function getMight(userStats) {
    // Calculate might from gear, initalize at the user's level.
    var might = userStats["level"];
	var equip = userStats["equipment"];
    console.log(JSON.stringify(userStats));

    for (var i in equip) {
	    var slot = equip[i];
        console.log(slot);

        // If the value is null, skip it.
        if (slot != null) {
            console.log(slot["might"]);
            // Add the gear's might to the might stat.
            might += slot["might"];
        }
    }

    // Return the final might value.
    return might;
}