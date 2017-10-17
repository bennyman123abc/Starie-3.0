# Starie-3.0
Matthe815's Starie now has her source code open source. But there's some things you must know.

## Commands
All of her commands are stored in the "Commands" directory, the commands can use any variables from the main file and anything sent to the command handler. If you want to add a command, it will be automatically processed and added to the help list.

## Index.js
Her data is stored in Index.js. You don't usually need to edit this besides for optimization.
The command handler is stored under the function called "checkCommand".

## Config
Most of Starie 3.0's information is stored within a mySQL database. However, her local configuration is stored under the "Config" directory.

## mySQL.
I will probably program an automatic mySQL setup, but for now you can find the mySQL queries required in the config directory under "mySQL.sql".

## Owners.
The owner file is stored in "Config/owners.json", there you can add owners to the list.

```js
{
    "OWNER_ID" : true,
    "OWNER_ID" : false
}
```

Depending on the setting there, you can choose whether or not you want the user to be able to bypass permissions.
If that is false, they will be listed as an owner, but will not be able to bypass permissions.

## My Interface.
Starie 3.0 comes with My Interface installed but not configured. You can find the documentation here:
https://npmjs.org/my-interface

My Interface allows you to type things into the Console and have it emitted to the bot itself.
