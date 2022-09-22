
<h1 align="center">Any Bot!</h1>  

<p align="center">  

<img src="https://github.com/MDCYT/Any-Bot/actions/workflows/pre-release.yml/badge.svg" alt="prerelease">  

<img src="https://github.com/MDCYT/Any-Bot/actions/workflows/codeql-analysis.yml/badge.svg">  

<img src="https://img.shields.io/github/downloads/MDCYT/Any-Bot/total?color=Green">  

<img src="https://img.shields.io/github/repo-size/MDCYT/Any-Bot">  

<img src="https://img.shields.io/badge/made%20by-MDC-purple.svg" >  

<img src="https://img.shields.io/github/v/release/MDCYT/Any-Bot?include_prereleases">  

<img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" >  

<img src="https://img.shields.io/github/stars/MDCYT/Any-Bot.svg?style=flat">  

<img src="https://img.shields.io/github/languages/top/MDCYT/Any-Bot.svg">  

<img src="https://img.shields.io/github/issues/MDCYT/Any-Bot.svg">  

<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">  
</p>  

<img src="./README/thumbail.png" width="100%">  

<h2 align="center"><a  href="https://discord.com/api/oauth2/authorize?client_id=733728002910715977&permissions=8&scope=applications.commands%20bot">Demostration</a></h2>

**Content**
- [Description](#Description)
- [Features](#Features)
- [Installation](#Installation)
- [Editing](#Editing)

**NEW ANTIPHISHING SYSTEM**

<p align="center">  
<img src="./README/phishing.gif" width="80%"></p>  



## Description


I am [**Any Bot**](https://top.gg/bot/733728002910715977), a multifunctional Discord bot which is a variation of [**Calypso Bot**](https://github.com/sabattle/CalypsoBot), this variation includes backup commands and some extra fun and useful commands that can be useful in any bot.

<p align="center">  

[![Discord Bots](https://top.gg/api/widget/status/733728002910715977.svg?noavatar=true)](https://top.gg/bot/733728002910715977)   
[![Discord Bots](https://top.gg/api/widget/servers/733728002910715977.svg?noavatar=true)](https://top.gg/bot/733728002910715977)   
[![Discord Bots](https://top.gg/api/widget/upvotes/733728002910715977.svg?noavatar=true)](https://top.gg/bot/733728002910715977)   
[![Discord Bots](https://top.gg/api/widget/owner/733728002910715977.svg?noavatar=true)](https://top.gg/bot/733728002910715977)

</p>  

# Features

The Bot has more than 190 commands and 16 categories with which you have a variety of useful and fun commands.

- Categories:
  - **Info**
  - **Fun**
  - **Utils**
  - **Internet**
  - **Voice**
  - **Animals**
  - **Color**
  - **Points**
  - **Levels**
  - **Misc**
  - **Games**
  - **Social**
  - **Mod**
  - **Admin**
  - **Music**
  - **Backup**
  - **Owner**
  - **Nsfw**


## Installation
You can add Any Bot to your server with [this](https://discordapp.com/oauth2/authorize?client_id=733728002910715977&scope=bot&permissions=8)  link! Alternatively, you can clone this repo and host the bot yourself.

```  
git clone https://github.com/MDCYT/Any-Bot.git  
```  
### Requirements
- [Discord Bot Token](https://discordapp.com/developers/applications/me)
- [Node 16 or higher](https://nodejs.org/en/download/)
- [Python 2.7.2](https://www.python.org/downloads/release/python-272/)
- Pray to god, or, if you're an atheist, cross your fingers.

After cloning, run an

```  
npm install
```

Now, edit the ` .env-example`

``` dotenv
APIURL="https://api.any-bot.xyz/api/v1" #You can crate you own API if you want to, check https://github.com/MDCYT/Any-Api
SUPPORTSERVERLINK= "https://discord.gg/efZ8bQYwnN" #This is the link to the support server
SERVERLOGID=Your_Server_Log_Channel_ID #This is the id of the channel where the server logs will be sent
BUGREPORTCHANNELID=Your_Bug_Report_Channel_ID
FEEDBACKCHANNELID=Your_Feedback_Channel_ID
BOTLIST=false # This will define if the bot will post the bot stats to the bot lists or not, you can edit the bot lists in the blapi.json file
GOOGLEAPI="API_KEY" # Obtain a key in https://console.developers.google.com/ (Only affect the Youtube Command)
FORTNITESHOPAPI="API_KEY" # Obtain a key in https://fnbr.co/api/docs (Only affect the Fortnite Shop Command)
FORTNITEAPI="API_KEY" # Obtain a key in https://fortnitetracker.com/site-api (Only affect the Fortnite Stats Command)
GEOMETRYDASHUSER="USERNAME" # Obtain a username in Geometry Dash (Only affect the Geometry Dash Command)
GEOMETRYDASHPASSWORD="PASSWORD" # Obtain a password in Geometry Dash (Only affect the Geometry Dash Command)
SOMERANDOMAPIKEY="API_KEY" # Obtain a key in https://some-random-api.ml/ (Only affect the Some Random API Command)
OPENWEATHERMAP="API_KEY" # Obtain a key in https://openweathermap.org/api (Only affect the Weather Command)
NASAAPI="API_KEY" # Obtain a key in https://api.nasa.gov/ (Only affect the NASA Command)
UBERDUCKAPI_KEY="API_KEY" # Obtain a key in https://api.uberduck.ai/ (Only affect the Uber Duck Command)
UBERDUCKAPI_SECRET="API_SECRET" # Obtain a secret in https://api.uberduck.ai/ (Only affect the Uber Duck Command)
OSUAPIKEY="API_KEY" # Obtain a key in https://osu.ppy.sh/p/api/ (Only affect the Osu Command)
CUSTOMAPIKEY="API_KEY" # Obtain a key in https://api.any-bot.xyz/ (Only affect the Custom API Command)
``` 
After editing the `.env-example` , rename to `.env`

start the bot with `node app` from the terminal
```  
node app
```  

Optional you can start the bot with `node shard` if your bot is in more than five hundred servers.
```  
node shard
```  


Make sure you have **PRESENCE INTENT** and **SERVER MEMBERS INTENT** enabled on your bot.
<p align="center">  
<img src="./README/intents.gif" width="80%"></p>  


## Need help?

You can enter the [Any Bot Support server](https://discord.gg/2FRpkNr)
