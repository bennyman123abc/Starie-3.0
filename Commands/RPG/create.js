//permission: Everyone;
//usage: <Name>;
//module: RPG;

// Get the user by resolvable.
var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)))
	
// Check if you don't already have a character.
if (user["stats"] == undefined)
{
    // Make sure there's 1 argument.
	if (args.length == 1)
	{
	    // Create the character.
		if (args[0].length > 0)
		{
		    // Initalize a default character.
		    user["stats"] = {"name" : `${args[0]}`, "exp" : 0, "level" : 1,"equipment":{"Sword":null,"Helmet":null,"Amulet":null,"Chestplate":null,"Pants":null,"Boots":null}};
			
			// Save the character.
			fs.writeFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`, JSON.stringify(user));
		   
		    // Tell the user it was completed.
			message.reply(`Successfully created the character: ${args[0]}`);
		}
		else
		{
		    message.reply("The name field cannot be blank.");
		}
	}
	else
	{
		message.reply("Please enter a name for your character.");
	}
}
else
{
    message.reply("You already have a character!");
}