//permission: Owner;
//usage: <userResolve>;

// Make sure you're an owner.
if (isOwner(message.author.id))
{
    // User Resolve
	var userResolvable = getUserResolvable(args[0], message.guild.id);
	
    // Get the user information file.
	var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${userResolvable.id}.json`)));
    
	// Check if the user isn't already blacklisted.
	if (!user["blacklisted"])
	{
	    // Set the user to blacklisted.
		user["blacklisted"] = true;
		
		// Write to file.
		fs.writeFileSync(`./././${config["local"]["userSettings"]}/${userResolvable.id}.json`);
	}
	else
	{
	    message.reply(`\`${userResolvable.tag}\` is already blacklisted!`);
	}
}