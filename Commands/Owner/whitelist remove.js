//permission: Owner;
//usage: <userResolve>;

// Make sure you're an owner.
if (isOwner(message.author))
{
    // User Resolve
	var userResolvable = getUserResolvable(args[0], message.guild.id, message);
	
    // Get the user information file.
	var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${userResolvable.id}.json`)));
    
	// Check if the user isn't already whitelisted.
	if (user["whitelisted"])
	{
	    // Set the user to whitelisted.
		user["whitelisted"] = false;
		
		// Write to file.
		fs.writeFileSync(`./././${config["local"]["userSettings"]}/${userResolvable.id.id}.json`, JSON.stringify(user));
		
		// Display a message.
		message.reply(`Successfully unwhitelisted \`${userResolvable.tag}\``);
	}
	else
	{
	    message.reply(`\`${userResolvable.id.tag}\` isn't whitelisted!`);
	}
}