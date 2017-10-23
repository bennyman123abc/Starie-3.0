# Starie-3.0
Matthe815's semi-famous starie now has her source code open source. But there's some things you must know.

## Setup
After downloading the file, open up your Command prompt(Windows) or Shell (Linux) with Node.JS (latest) installed.
And type `npm install`. Then run `node index` (Windows) or `npm start` (Linux). To start Starie. You will then be prompted to install Starie. Just follow her instructions on the console to install her.

## Commands
All of her commands are stored in the "Commands" directory, the commands can use any variables from the main file and anything sent to the command handler. If you want to add a command, it will be automatically processed and added to the help list.

## Index.js
Her data is stored in Index.js. You don't usually need to edit this besides for optimization.
The command handler is stored under the function called "checkCommand".

## Config
Most of Starie 3.0's information is stored within a mySQL database. However, her local configuration is stored under the "Config" directory.

## mySQL.
I will probably program an automatic mySQL setup, but for now you can find the mySQL queries required in the config directory under "mySQL.sql".

## Owners file (Legacy).
The owner file is stored in "Config/owners.json", there you can add owners to the list.

```json
{
    "OWNER_ID" : true,
    "OWNER_ID" : false
}
```

Depending on the setting there, you can choose whether or not you want the user to be able to bypass permissions.
If that is false, they will be listed as an owner, but will not be able to bypass permissions.

## User Information (Local Storage).
All information about a user is stored in the User's Information: "database/Users/userID.json", it is automatically created when the user first speaks in chat. If you open it up, you'll find...

```json
{"Whitelisted" : false, "Blacklisted" : false, "Permissions" : [], "Prefix" : "!", "Owner" : false, "canBypassPermissions" : false}
```

This can be modified manually whenever. But in order to not break anything, you should use the built in commands.

If Owner is true, then the user will show up as an owner, and will be able to perform Owner Only commands. However, if "canBypassPermissions" is true, then they can use any command -- regardless of permission level.

## My Interface.
Starie 3.0 comes with My Interface installed but not configured. You can find the documentation here:
https://npmjs.org/my-interface

My Interface allows you to type things into the Console and have it emitted to the bot itself.
