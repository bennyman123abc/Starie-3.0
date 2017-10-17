const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const inter = require('my-interface');
const em = inter.getInterface();
const config = JSON.parse(fs.readFileSync('./Config/config.json'));
console.log(JSON.stringify(config));
const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : config['mySQL']['host'],
  user     : config['mySQL']['username'],
  password : config['mySQL']['password'],
  database : config['mySQL']['database']
});
var defaultPrefix = "!";

client.on('ready', () => {
    console.log(`Started up as user ${client.user.username}!`);
    client.user.setGame("with the building blocks of life.");
});

client.on('message', (message) => {
    var msg = message.content;
	var msgLow = msg.toLowerCase();
	
	if (message.author.bot) return;
	
	var prefix = getUserPrefix(message.author.id, message.guild.id);
	console.log(prefix);
	
	if (msgLow.startsWith(prefix))
	{
	    var cmd = trimPrefix(msg,message.author.id,message.guild.id);
	    checkCommand(cmd,message,message.author);
	}
	
	try {
	connection.query(`INSERT INTO messageLog(content,user,guild,nickname,time) VALUES("${connection.escape(msg)}","${message.member.id}","${message.guild.id}","${connection.escape(message.member.displayName)}","${new Date()}");`, function (error, results, fields) {
	if (error) throw error;	
          console.log(msg);
	});
	
	}
	catch(e)
	{
	    console.log(e);
	}
});

client.on('messageReactionAdd', (message,user) => {
    if (message.emoji.name == "🚫")
	{
	    if (message.message.author.bot)
		{
		    message.message.delete();
		}
	}
}); 

function getUserPrefix(userID, guildID)
{
    var prefix = null;

	try {
	connection.query(`SELECT prefix FROM userPrefixes WHERE user="${userID}"`, function (error, results, fields) {
        if (results.length > 0)
        {		
		prefix = results[0].prefix;
	    }
	});
	}
	catch (e)
	{
	    console.log(e);
	}

	if (prefix == undefined)
	{
	    try {
	    connection.query(`SELECT prefix FROM serverSettings WHERE guildID="${guildID}"`, function (error, results, fields) {
		    if (results.length)
			{
		    prefix = results[0].prefix;
			}
		});
		}
		catch(e)
		{
		    console.log(e);
		}
	}
	
	if (prefix == undefined)
	{
	    prefix = defaultPrefix;
	}


    return prefix;
}

// Trim the prefix from the message.
function trimPrefix(message,user,guild)
{
    // Get the user's prefix.
    var prefix = getUserPrefix(user,guild);
	
	// Return the trimmed version.
	return message.slice(prefix.length, message.length);
}

function checkCommand(mess,message,user,other=null,other2=null) {
    // Log the message.
	console.log(mess)
	
	// Check if the message contains a colon.
	if (mess.toLowerCase().indexOf(':') != -1)
	{
	    // If it does, it cut at the colon.
		var command = mess.toLowerCase().slice(0, mess.toLowerCase().indexOf(':')-1);
	}
	else
	{
	    // If not, copy the entire message.
	    var command = mess;
	}
	
	// Collect all the arguments into a string.
	var arguments = mess.toLowerCase().slice(mess.toLowerCase().indexOf(':')+2, mess.toLowerCase().length);
	
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
		for(var i in folders)
		{
		    console.log(folders[i]);
			var f = String('Commands/'+String(folders[i])+'/'+command+'.js');
			
		    if (fs.existsSync(f))
			{
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
		console.log('Loaded command: '+command+'.js');
		console.log(contents);
	}
	catch(e) {
		console.log(e);
	}
	
	try {
	    // Run the command within the file.
	    eval(contents)

		// And log the use of the command.
		connection.query(`INSERT INTO commandLog(commandName,user,guild,nickname,time) VALUES("${connection.escape(command)}", "${user.id}", "${message.guild.id}", "${connection.escape(message.member.displayName)}", "${new Date()}");`, function (error, results, fields) {
		
		if (error) throw error;	
		});
		
	}
	catch(e)
	{
	   try {
		var d = new Date();
		

		connection.query(`INSERT INTO errorLog(info,time) VALUES("${e}","${d}");`, function (error, results, fields) {
		
		});
		}
		catch(e)
		{
		    console.log(e);
		}
		
		console.log(e)
	}
}

function canBypassPermissions(user)
{
    // Get the JSON with all the owners.
    var ownersJSON = JSON.parse(fs.readFileSync('Config/owners.json'));
	
	// Check if you are in it.
	if (ownersJSON[user] != undefined && ownersJSON[user] == true)
	{
	    return true;
	}
	else
	{
	    return false;
	}
}


client.login(config['basic']['token']);