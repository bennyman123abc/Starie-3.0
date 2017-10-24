//permission: Administrator;
//usage: <modName> || Nothing;

// Make sure only admins can perform this command.
if (isAdmin(message.author.id, message.guild.id) || canBypassPermissions(message.author))
{
	// Check the number of arguments.
	if (args != null && args.length == 1)
	{
		// Obtain server info.
		var server = JSON.parse(String(fs.readFileSync(`././${config['local']['serverSettings']}/${message.guild.id}.json`)));
	
		// Obtain the modules list.
		var mods = JSON.parse(String(fs.readFileSync("././database/valid_mods.json")));
	
		// Convert the sent argument into a valid module identifier.
		var iden = args[0].toUpperCase();
		iden.replace(/ /g, "_");
	
		// Log the converted version.
		console.log(iden);
	
		// Check if the module is in the valid mods list.
		if (mods[iden] != undefined && mods[iden]["allowed"] == true)
		{
			// Make sure the module isn't already enabled on the server.
			if (server["modules"][iden] == undefined || server["modules"][iden] == false)
			{
				server["modules"][iden] = true;
				fs.writeFileSync(`././${config['local']['serverSettings']}/${message.guild.id}.json`, JSON.stringify(server));
			    message.reply("Enabled module: " + args[0]);
			}
			else
			{
			    message.reply("This module is already enabled.");
			}
		}
		else
		{
			message.reply("Invalid Module.");
		}
	}
	else
	{
		// Obtain the list of mods.
		var mods = JSON.parse(String(fs.readFileSync("./././database/valid_mods.json")));
	
		// Create an empty list variable.
		var list = "";
	
		// Loop through each one and put it in a list.
		for (var i in mods)
		{
			// No comma if first module.
			if (list.length == 0)
			{
				// Don't add it to the list if it's disabled.
				if (mods[i]['allowed'] == true)
				{
					list = list + mods[i]['name'];
				}
			}
			else
			{
				if (mods[i]['allowed'] == true)
				{
					list = list + ", " + mods[i]['name'];
				}
			}
		}
	
		// DM the user a list.
		message.author.send("```" + list + "```");
		message.reply("A list of the avaliable modules have been sent to your DMs.");
	}
}
else
{
    message.reply("Sorry, only `Administrators` can manage modules!" );
}