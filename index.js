// Initalize Discord.JS, and create a client.
const Discord = require('discord.js');
const client = new Discord.Client();

// Require the FS module.
const fs = require('fs');

// Require the My Interface module, and initalize it.
const inter = require('my-interface');
const em = inter.getInterface();

// Get the configuration file & log the stringified version.
const config = JSON.parse(fs.readFileSync('./Config/config.json'));
console.log(JSON.stringify(config));

// Require the mySQL module.
const mysql = require('mysql');

// Create a connection (if mySQL is selected).
if (config['basic']['storage'] == 'mysql') {
    var connection = mysql.createConnection({
        host: config['mySQL']['host'],
        user: config['mySQL']['username'],
        password: config['mySQL']['password'],
        database: config['mySQL']['database']
    });
}

// Default prefix for when the user & server doesn't have one.
var defaultPrefix = config['basic']['defaultPrefix'];

// Create the default directories if they don't exist & only in local mode.
if (config['basic']['storage'] == 'local')
{
    // Check if it doesn't exist.
    if (!fs.existsSync('database'))
	{
	    // Create it if it doesn't.
		fs.mkdirSync('database');
	}
    // Check if it doesn't exist.
    if (!fs.existsSync(config['local']['userSettings']))
	{
	    // Create it if it doesn't.
		fs.mkdirSync(config['local']['userSettings']);
	}
	// Check if it doesn't exist.
    if (!fs.existsSync(config['local']['serverSettings']))
	{
	    // Create it if it doesn't.
		fs.mkdirSync(config['local']['serverSettings']);
	}
	// Check if it doesn't exist.
    if (!fs.existsSync(config['local']['Logs']))
	{
	    // Create it if it doesn't.
		fs.mkdirSync(config['local']['Logs']);
	}
}

// Fired when the bot starts up.
client.on('ready', () => {
    console.log(`Started up as user ${client.user.username}!`);
    client.user.setGame(config['local']['game']);
	
    // Check if it doesn't exist.
    if (fs.existsSync('Install'))
    {
	// Make sure installer.js is there.
	if (fs.existsSync("Install/installer.js"))
	{
	    console.log("Installation required, please use the command !install to start the installation process.");    
	}
    }
});

// Fired when a message is posted.
client.on('message', (message) => {
    // Get the message content.
    var msg = message.content;
    var msgLow = msg.toLowerCase();

    // Don't let bots interact with Starie.
    if (message.author.bot) return;

    // Get the prefix of the poster.
    var prefix = getUserPrefix(message.member);
    console.log(prefix);

    // Quickly create the user config when someone new posts a message.
    if (!fs.existsSync(`${config['local']['userSettings']}/${message.author.id}.json`))
    {
	// Open the user's file (create it if it doesn't exist, error if it does).
	fs.open(`${config['local']['userSettings']}/${message.author.id}.json`, 'wx', () => {
	    // And write the default information to it.
	    fs.writeFileSync(`${config['local']['userSettings']}/${message.author.id}.json`, `{"Whitelisted" : false, "Blacklisted" : false, "Permissions" : [], "Prefix" : "!", "Owner" : false, "canBypassPermissions" : false}`);
	});
    }
	
    // If a message starts with the prefix, check the command.
    if (msgLow.startsWith(prefix)) {
        var cmd = trimPrefix(msg, message.member);
        checkCommand(cmd, message, message.author);
    }

    // Add to the message log.
    try {
        if (config['basic']['storage'] == 'mysql') {
            connection.query(`INSERT INTO messageLog(content,user,guild,nickname,time) VALUES("${connection.escape(msg)}","${connection.escape(message.member.id)}","${connection.escape(message.guild.id)}","${connection.escape(message.member.displayName)}","${connection.escape(new Date())}");`, function(error, results, fields) {
                if (error) throw error;
                console.log(msg);
            });
        } else if (config['basic']['storage'] == 'local') {
            fs.open(config['local']['Logs'] + "/" + config['local']['messageLog'], 'a+', () => {
                fs.appendFileSync(config['local']['Logs'] + "/" + config['local']['messageLog'], `[${message.member.displayName}]: ${message.content}\n\n`);
            });
        }

    } catch (e) {
        console.log(e);
    }
});

// Fired when a reaction is added to a cached message.
client.on('messageReactionAdd', (message, user) => {
    // If reaction is no_entry_sign.
    if (message.emoji.name == "ðŸš«") {
	// Make sure a bot posted the message.
        if (message.message.author.bot) {
            // Delete the message.
            message.message.delete();
        }
    }
});

// Obtain the user's prefix.
function getUserPrefix(user){
    var prefix = null;

    try {
        if (config['basic']['storage'] == 'mysql') {
            connection.query(`SELECT prefix FROM userPrefixes WHERE user="${connection.escape(user.id)}"`, function(error, results, fields) {
                if (results.length > 0) {
                    prefix = results[0].prefix;
                }
            });
        } else if (config['basic']['storage'] == 'local') {
            var userSettings = JSON.parse(fs.readFileSync(`${config['local']['userSettings']}/${user.id}.json`));
            var serverSettings = JSON.parse(fs.readFileSync(`${config['local']['serverSettings']}/${user.guild.id}.json`));

            if (userSettings["prefix"] != undefined) {
                var userPrefix = userSettings["prefix"];
                return userPrefix;
            } else if (serverSettings["prefix"] != undefined) {
                var serverPrefix = serverSettings["prefix"];
                return serverPrefix;
            } else {
                return defaultPrefix;
            }
        }
    } catch (e) {
        console.log(e);
    }

    // If it's null, check the server prefix.
    if (prefix == null) {
        try {
            if (config['basic']['storage'] == 'mysql') {
                connection.query(`SELECT prefix FROM serverSettings WHERE guildID="${connection.escape(user.guild.id)}"`, function(error, results, fields) {
                    if (results.length) {
                        prefix = results[0].prefix;
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    // If it's null by the end, just use defaultPrefix. 
    if (prefix == null) {
        prefix = defaultPrefix;
    }


    // Return what was found.
    return prefix;
}

// Trim the prefix from the message.
function trimPrefix(message, user) {
    // Get the user's prefix.
    var prefix = getUserPrefix(user);

    // Return the trimmed version.
    return message.slice(prefix.length, message.length);
}

function checkCommand(mess, message, user, other = null, other2 = null) {
    // Log the message.
    console.log(mess)

    // Check if the message contains a colon.
    if (mess.toLowerCase().indexOf(':') != -1) {
        // If it does, it cut at the colon.
        var command = mess.toLowerCase().slice(0, mess.toLowerCase().indexOf(':'));
    } else {
        // If not, copy the entire message.
        var command = mess;
    }

    // Collect all the arguments into a string.
    var arguments = mess.slice(mess.toLowerCase().indexOf(':') + 2, mess.toLowerCase().length);

    // Convert it into an array.
    var args = arguments.split(" | ");

    // Then log both the command and the number of arguments.
    console.log(args.length)
    console.log(command);

    // Try/Catch the contents.
    try {
        // Sniff through the various folders, and find the one you want.
        var folders = fs.readdirSync('Commands');

        // Create an empty variable for the command name.
        var file;

        // Loop through all the folders, and see if it's there.
        for (var i in folders) {
            console.log(folders[i]);
            var f = String('Commands/' + String(folders[i]) + '/' + command + '.js');

            if (fs.existsSync(f)) {
                file = f;
                console.log(f);
                break;
            }
        }

        // Log the file name.
        console.log(file);

        // Read the file.
        var contents = String(fs.readFileSync(f));

        // Log various things.
        console.log('Loaded command: ' + command + '.js');
        console.log(contents);
    } catch (e) {
        console.log(e);
    }

    try {
        // Run the command within the file.
        eval(contents)

        // And log the use of the command.
        if (config['basic']['storage'] == 'mysql') {
            connection.query(`INSERT INTO commandLog(commandName,user,guild,nickname,time) VALUES("${connection.escape(command)}", "${connection.escape(user.id)}", "${connection.escape(message.guild.id)}", "${connection.escape(message.member.displayName)}", "${connection.escape(new Date())}");`, function(error, results, fields) {

                if (error) throw error;
            });
        }
    } catch (e) {
        try {
            var d = new Date();


            if (config['basic']['storage'] == 'mysql') {
                connection.query(`INSERT INTO errorLog(info,time) VALUES("${connection.escape(e)}","${connection.escape(d)}");`, function(error, results, fields) {

                });
            } else if (config['basic']['storage'] == 'local') {
                fs.open(config['local']['Logs'] + "/" + config['local']['errorLog'], 'a+', () => {
                    fs.appendFileSync(config['local']['Logs'] + "/" + config['local']['errorLog'], `${e}`);
                });
            }
        } catch (e) {
            console.log(e);
        }

        console.log(e)
    }
}

function canBypassPermissions(user) {
    // Get the JSON with all the owners.
	fs.open(`${config['local']['userSettings']}/${user.id}.json`, 'r+', () => {})
    var userSettings = JSON.parse(fs.readFileSync(`${config['local']['userSettings']}/${user.id}.json`));

    // Check if you are in it.
    if (userSettings['canBypassPermissions'] != undefined && userSettings['canBypassPermissions'] == true) {
        return true;
    } else {
        return false;
    }
}

// Get a user object from a resolvable.
function getUserResolvable(user, guild)
{
    console.log(user);
    // Check if the username exists
	if (client.users.find('username', user))
	{
	    return client.users.find('username', user);
	}
	// If it's not a username, check if it's a nickname.
	else if (client.guilds.get(guild).members.find('nickname', user))
	{
	    return client.guilds.get(guild).members.find('nickname', user).user;
	}
	// If not a nickname, check if it's an ID.
	else if (client.users.get(user))
	{
	    return client.users.get(user);
	}
	// If not an ID, check if it's a tag.
	else if (client.users.find('tag', user))
	{
	    return client.users.find('tag', user);
	}
	
	// If none of these apply, return null.
	return null;
}

// Checks the user resolvable to see if the user is a Moderator.
function isMod(user, guild)
{
    // Get the user from any resolvable string.
    var userResolve = getUserResolvable(user, guild);
	
	// Make sure there was actually a user found.
	if (userResolve != null)
	{
	    // Get the member object for the guild.
	    var mem = client.guilds.get(guild).members.get(userResolve.id);
		
		// Check if the user can either bypass permissions or has moderator permissions.
		if (canBypassPermissions(userResolve) || mem.hasPermission("MANAGE_MESSAGES"))
		{
		    // Since they ARE a moderator in Starie's eyes, return true.
		    return true;
		}
		else
		{
		    // Not a moderator, return false.
			return false;
		}
	}
}

// Checks if the user resolvable to see if the user is an Admin.
function isAdmin(user, guild)
{
    // Get the user from any resolvable string.
    var userResolve = getUserResolvable(user, guild);
	
	// Make sure there was actually a user found.
	if (userResolve != null)
	{
	    // Get the member object for the guild.
	    var mem = client.guilds.get(guild).members.get(userResolve.id);
		
		// Check if the user can either bypass permissions or has admin permissions.
		if (canBypassPermissions(userResolve) || mem.hasPermission("ADMINISTRATOR"))
		{
		    // Since they ARE an Administrator in Starie's eyes, return true.
		    return true;
		}
		else
		{
		    // Not a moderator, return false.
			return false;
		}
	}
}

// Checks if the user resolvable to see if the user is an Owner.
function isOwner(user)
{
    // Get the JSON with all the owners.
    fs.open(`${config['local']['userSettings']}/${user.id}.json`, 'r+', () => {})
    var userSettings = JSON.parse(fs.readFileSync(`${config['local']['userSettings']}/${user.id}.json`));

    // Check if you are in it.
    if (userSettings['Owner'] != undefined && userSettings['Owner'] == true) {
        return true;
    } else {
        return false;
    }
}


client.login(config['basic']['token']);
