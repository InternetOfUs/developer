---
title: Ask for Help
sidebar_label: Ask for Help
---

## Bot

:::important
Not the 100% of the application is open source. In fact, some of the required libraries are private of U-Hopper. These chatbot applications should be intended only for example on how to build an application using the WeNet platform.
:::

Open callers are provided with the possibility of leveraging the Ask4Help bot that has been developed in the context of the project. The bot will be configured and deployed by the **WeNet** team.

If you want to deploy an instance of the **AskForHelp Chatbot** in the context of an open call, first write an email to `support@internetofus.eu`. A new instance of the bot will be deployed and open callers will be provided with the following information:
- The bot Oauth2 callback url;
- The bot conversational url.

### Telegram configuration

The next step is creating a bot on the Telegram platform, you will find all the information on the [official documentation](https://core.telegram.org/bots). Optionally it is possible to configure the bot commands using the Telegram [BotFather](https://core.telegram.org/bots#6-botfather). You can use the following list:

```
start - Start the bot
help - Got stuck? Discover what you can do
info - Get some basic info about the commands of the bot
ask - Ask a question to the community
questions - Get some questions to which answer to
badges - Get insights on your badge status
cancel - Cancel the current operation
```


### WeNet Application configuration (WeNet Hub)

Then you have to create your own [App Logic](tech/conversation/app-logic.md). You will find an example [here](tech/usecase/ask-for-helpv2.md).


The next step is creating an application on the [Wenet Hub](https://internetofus.u-hopper.com) using the information we provide to you. During the Oauth2 configuration you have to select the following scopes:

- **read**:
    - `User ID`
    - `First name`
    - `Last name`
    - `Locale`
- **write**:
    - `Conversation`

In the **Community** box click the `edit` button and compile the norms field. You can find an example [here](tech/usecase/ask-for-helpv2.md#community-norm).


Remember to configure the **Conversational connector** in the **Settings** tab.


When your application is ready write an email with the following information:

- the `ID` of your application;
- the `Secret` of your application;
- The `Community ID` of your application;
- The `Task type ID` of your App logic;
- The `token` of your telegram bot; 