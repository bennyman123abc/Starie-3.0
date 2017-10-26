//permission: Everyone;
//usage: Nothing || <userResolve>;
//module: ECONOMY;

// Get the server.
var server = JSON.parse(String(fs.readFileSync(`./././${config["local"]["serverSettings"]}/${message.guild.id}.json`)));

// Check if it's enabled.
if (server["modules"]["GLOBAL_ECONOMY"] == true)
{
    // Check how many arguments there are.
    if (args != null && args.length == 1)
	{
	    var user = getUserResolvable(args[0], message.guild.id);
		
		// Get the user.
        var userInfo = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`)));
		
	    if (userInfo["money"] == undefined)
		{
		   userInfo["money"] = 0;
		   fs.writeFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`, JSON.stringify(userInfo));
		}
		
	    console.log(userInfo["money"]);
		message.reply(`${user.tag} has $${userInfo["money"]} in their vault.`);
	}
	else if (args == null)
	{
		// Get the user.
		var userInfo = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)))
		
	    if (userInfo["money"] == undefined)
		{
		   userInfo["money"] = 0;
		   fs.writeFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`, JSON.stringify(userInfo));
		}
		
	    console.log(server["economy"][message.author.id]);
		message.reply(`${message.author.tag} has $${userInfo["money"]} in their vault.`);
	}
}
