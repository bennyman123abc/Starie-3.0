//permission: Owner;
//usage: <userResolve>;

// Make sure you're an owner.
if (isOwner(message.author))
{
    // User Resolve
	var userResolvable = getUserResolvable(args[0], message.guild.id, message);
	
    // Get the user information file.
	var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${userResolvable.id}.json`)));
    
	// Check if the user isn't already blacklisted.
	if (user["blacklisted"])
	{
	    // Set the user to blacklisted.
		user["blacklisted"] = false;
		
		// Write to file.
		fs.writeFileSync(`./././${config["local"]["userSettings"]}/${userResolvable.id}.json`, JSON.stringify(user));
		
		// Display a message.
		message.reply(`Successfully unblacklisted \`${userResolvable.tag}\``);
	}
	else
	{
	    message.reply(`\`${userResolvable.tag}\` isn't blacklisted!`);
	}
}