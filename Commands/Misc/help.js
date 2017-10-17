//permissions: Everyone;
//usage: Finds all commands.
//hidden;

// Obtain the command list.
var folders = fs.readdirSync('Commands');

// Create a rich embed.
var emb = new Discord.RichEmbed();

// Get the user's prefix.
var prefix = getUserPrefix(message.author.id, message.guild.id);

// Loop through the folders and see what's there.
for (var i in folders)
{
    // Skip var.
        var skip = false;

    // Category perms file.
        var perms = String(fs.readFileSync('Commands/' + String(folders[i]) + '/category.permission'));

    // Make sure you have permission to view the category.
        if (perms.startsWith('MODERATOR') && !message.member.hasPermission('MANAGE_MESSAGES') && !canBypassPermissions(message.author.id))
        {
            skip = true;
        }
        else if (perms.startsWith('ADMINISTRATOR') && !message.member.hasPermission('ADMINISTRATOR') && !canBypassPermissions(message.author.id))
        {
            skip = true;
        }
        else
        {
            skip = false;
        }

        // Make sure it isn't skipping.
        if (!skip)
        {
                // Create a field header.
                var header = String(folders[i]);

                // Log the header name.
                console.log(header);

                // Get the files within the folder.
                var files = fs.readdirSync('Commands/' + folders[i]);

                // Create an empty variable with all the commands.
                var list = "";

                // Loop through all the files within the folder.
                for (var f in files)
                {
						
                        if (String(files[f]) != "category.permission")
                        {
                        // Trim the file extension off.
                        files[f] = String(files[f]).slice(0,-3);

                        // Get the internal variables.
                                // Check the usage.
                                        var con = String(fs.readFileSync('Commands/' + String(folders[i]) + '/' + files[f] + ".js"));
                                        if (con.includes("usage:"))
                                        {
                                                // Get the usage.
                                                var usage = con.slice(con.indexOf(':', con.search('//usage:')+7)+2, con.indexOf(';', con.search('//usage:')+7));

                                                // Log the usage.
                                                console.log(usage);

                                                // Copy what the usage says (if not none).
                                                if (usage == "None")
                                                {
                                                        usage = "";
                                                }
                                        }

                        // Add them to our list variable, but only add it if it's hidden.
                        if (!con.includes('//hidden;'))
                        {
							if (con.search('//usage:') != -1)
							{
                             list += prefix + String(files[f]) + " " + usage + "\n";
							 }
							 else
							 {
							 list += prefix + String(files[f]) + " " + "\n";
							 }

                        // Log the file.
                        console.log(String(files[f]));
                        }
                        }
               }
			   if (list == "")
			   {
			       list = "Nothing.";
			   }
			    emb.addField(header, list);
        }
}
// Once done, send it.
message.member.send({ embed : emb });
message.reply("I have DMed you a list of commands.");