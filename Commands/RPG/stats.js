//permission: Everyone;
//usage: Nothing || <userResolve>;
//module: RPG;

// Check how many arguments there are.
if (args == null)
{
    // Check RPG stats.
	var stats = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)))["stats"];
	
	// Check if you have a character.
	if (stats != undefined)
	{
	    // Create an embed.
	    var emb = new Discord.RichEmbed();
	    emb.setAuthor(stats["name"], message.author.displayAvatarURL);
	    emb.addField("Name", stats["name"]);
	    emb.addField("Level", stats["level"], true);
	    emb.addField("EXP", `${stats["exp"]} / ${5 * stats["level"]}`, true);
		emb.addField("Equipment", `${getEquipment(stats)}`);
		emb.addField("Might", `${getMight(stats)}`);
	    emb.setFooter(`Your RPG character, ${stats["name"]}!`);
	    message.channel.send({ embed : emb });
    }
	else
	{
	    message.reply(`You don't have an RPG character, create one with ${prefix}create: <name>`);
	}
}
else if (args.length == 1)
{
    // Get the user by resolvable.
    var user = getUserResolvable(args[0], message.guild.id, message);
	
	// Check RPG stats.
	var ustats = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)))["stats"];
	
    // Check RPG stats.
	if (user.id != client.user.id) {
		var stats = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`)))["stats"];
	}
	else
	{
		var p1Stats = JSON.stringify(ustats);
		var stats = JSON.parse(p1Stats);
		console.log(p1Stats);
		console.log(JSON.stringify(stats));
		stats["name"] = "Starie Bot";
		var level = Math.floor(Math.random() * 10);
		console.log(level);
		console.log(stats["level"])
		stats["level"] += level;
	}


    // Check if you have a character.
	if (stats != undefined)
	{
		// Create an embed.
		var emb = new Discord.RichEmbed();
		emb.setAuthor(stats["name"], user.displayAvatarURL);
		emb.addField("Name", stats["name"]);
		emb.addField("Level", stats["level"], true);
		emb.addField("EXP", `${stats["exp"]} / ${5 * stats["level"]}`, true);
		emb.addField("Equipment", `${getEquipment(stats)}`);
		emb.addField("Might", `${getMight(stats)}`);
		emb.setFooter(`${user.tag}'s RPG character, ${stats["name"]}!`);
		message.channel.send({ embed : emb });
	}
	else
	{
	    message.reply(`${user.tag} doesn't have a character.`);
	}
}

function getEquipment(userStats)
{
    // Equipment list.
	var list = "";
	var equip = userStats["equipment"];
	
	// Loop through equipment.
	for (var i in equip)
	{
	    // Make sure slot name is a string, and get the slot.
	    var slotName = String(i);
		var slot = equip[i];
		
	    // Check if there's something in the slot.
	    if (slot != null)
		{
			// Get name, uppercase the first later, and add it.
			slotName = slotName.charAt(0).toUpperCase() + slotName.slice(1, slotName.length);
			
			list += `${slotName}: ${slot["name"]},\n`;
	    }
		else
		{
			// Get name, uppercase the first later, and add it.
			slotName = slotName.charAt(0).toUpperCase() + slotName.slice(1, slotName.length);
			
			list += `${slotName}: Nothing,\n`;
		}
	}
	
	return list;
}

function getMight(userStats)
{
    // Calculate might from gear, initalize at the user's level.
	var might = userStats["level"];
	var equip = userStats["equipment"];
	var sources = ` [Level: ${might}`;
	console.log(JSON.stringify(userStats));
	
	for (var i in equip)
	{
	    // Get the slot area.
	    var slot = equip[i];
		
	    // If the value is null, skip it.
		if (slot != null)
		{
		    // Cache the item.
			var item = slot;
			
			// Add the gear's might to the might stat.
			might += item["might"];
			
			// Add it to THE list.
			sources = sources + `, ${item["name"]}: ${item["might"]}`;
	    }
	}
	
	// Return the final might value.
	return might + sources + "]";
}