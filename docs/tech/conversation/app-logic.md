---
title: Application logic
sidebar_label: App logic
---

On the hub, you define the logic of an application describing
the type of tasks that can be done on it. You can read about the
model at [the models' section on the developer documentation](https://internetofus.github.io/developer/docs/tech/conversation/models).
To help you understand this structure in the next sections,
you can find different examples that may help you.

## Echo

A simple application that replies to the same user with the message that is sent.
For this purpose, we need to define the action or transaction with the message to reply.
So, you need to edit the transactions section of the logic and add:

```json
{
	"echo": {
			"type": "object",
			"description": "Send the echo message",
			"properties": {
				"message": {
					"type": "string",
					"description": "The message to echo"
				}
			}
	}
}
```

On this code is described a transaction with the label __echo__ that has an attribute
named __message__ with the text to reply. As a result of this action, the application will
receive a message or callback. This kind of data is defined in the callbacks section
of the logic. For this example it will be:

```json
{
	"echo": {
			"type": "object",
			"properties": {
				"taskId": {
					"type": "string",
					"description": "The identifier of the task"
				},
				"message": {
					"type": "string",
					"description": "The echo message"
				}
			}
	}
}
```

This code defines that the application will receive a message with the label __echo__ and
with the attributes __taskId__ with the task identifier, and __message__ with the reply message.
Finally, we need to define the __norms__ that describe the behaviour of the users. For this example
you must write the next code on the norms section of the logic.

```json
[
	{
		"whenever": "is_received_created_task()",
		"thenceforth": "add_created_transaction()"
	},
	{
		"whenever": "is_received_do_transaction('echo',Content) and get_profile_id(Me)",
		"thenceforth": "add_message_transaction() and send_message(Me,'echo',Content)"
	},
	{
		"whenever": "is_received(_,'echo',Content) and get_task_id(TaskId) and get_attribute(Message,message,@(null),Content)",
		"thenceforth": "send_user_message('echo',json([taskId=TaskId,message=Message]))"
	}
]
```

The first norm is used to store on the task a transaction to mark when the task is created.
The second norm is activated when the user tries to do the __echo__ transaction and as result,
it sends a message of the norm engine of the user with the message to reply. The last norm
is activated when is received message create the callback message and notify the application.
You can not notify directly to the user, because the user can have private norms that filter
the messages that it can receive.


## Ask for Help

Imagine a simple application that allows a user to ask for help from another one.
The first thing to do is define which information has to be provided by the user
that wants help.  A [task model](https://internetofus.github.io/developer/docs/tech/conversation/models)
has the attribute __goal__ that we can use to describe which want the user wants.
But this is not enough, we need to limit the number of users that you can ask
for help to not annoy all the users of the application. For this, we need
to define some attributes on the logic. They are defined as an object using
the [OpenAPI specification](https://swagger.io/specification/). In the next
example, you can see the attributes with the property __maxUsers__ that define
the number maximum of users to ask for help. It is a value on the range [1,7].
So, when a user will create a new task to ask for help it has to define the goal
with the needed description and with the attribute __maxUsers__ with the number
maximum of other users to ask for help.


```json
{
	"type": "object",
	"properties": {
			"maxUsers": {
				"description": "The maximum number of users to ask",
				"type": "integer",
				"nullable": false,
				"minimum": 1,
				"maximum": 7
			}
	},
	"required": [
		"maxUsers"
	]
}
```

After that, we need to define the actions that the users can do on the task and
the messages that the users can receive from others on the task. In both cases,
they are defined as a JSON object where the key is the label of the action/message
and the value is a JSON object that describes the attributes of the action/message
using the [OpenAPI specification](https://swagger.io/specification/).
The actions that a user can do on the task are defined on the __transactions__
field of the application logic. Also, they are mapped to the task transaction
data [model](https://internetofus.github.io/developer/docs/tech/conversation/models).
Following the example, we need to add the actions to accept or decline to help.
On the last one, we need to add an optional attribute that allows explaining why
it wants to help. The next JSON object is how to define this.

```json
{
	"acceptToHelp": {
			"title": "Accept to help the requester",
			"type": "object",
			"nullable": true
	},
	"denyToHelp": {
			"title": "Deny to help the requester",
			"type": "object",
			"properties": {
				"reason": {
					"description": "The reason why cannot help",
					"type": "string",
					"nullable": true
				}
			}
	}
}
```

For the messages that the users can receive from others, we need to define
the __callbacks__ of the application logic. We need to notify some users
if they want to help, also need to notify the requester if the user accepts or
not to help. The definition of these callbacks follows the same structure
that the transactions as you can see on the next JSON object.

```json
{
	"doYouWantToHelp": {
			"title": "Ask to the user if wants to help",
			"type": "object",
			"nullable": true
	},
	"foundVolunteer": {
			"title": "Inform that found a volunteer to help",
			"type": "object",
			"properties": {
				"userId": {
					"description": "The identifier of the user that want to help",
					"type": "string",
					"nullable": false
				}
			},
			"required": [
				"userId"
			]
	},
	"cannotHelp": {
			"title": "Inform that a user cannot help",
			"type": "object",
			"properties": {
				"userId": {
					"description": "The identifier of the user that cannot help",
					"type": "string",
					"nullable": false
				},
				"reason": {
					"description": "The reason why cannot help",
					"type": "string",
					"nullable": true
				}
			},
			"required": [
				"userId"
			]
	}
}
```

Finally, we need to create the __norms__ that define how the interactions
between the users can be done. For the example, we need to define the next norms:

 * When the task is created notify some users if they want to help.
 * When a user wants to provide help notify the requester user.
 * When a user does not want to help notify the requester user.

The definition of these norms is more complex and you can read more about
how to do it in the [norms section](https://internetofus.github.io/developer/docs/tech/conversation/norms).
The next JSON array shows the possible definition of them for the application
logic.


```json
[
	{
		"description": "When the task is created choose some random users and notify them",
		"whenever": "is_received_created_task() and get_users_to_ask(Users)",
		"thenceforth": "add_created_transaction() and send_messages(Users,'notifyAskForHelp',json([]))",
		"ontology": ":- use_module(library(random)). :- dynamic get_users_to_ask/1. get_users_to_ask(Users) :- get_app_users_except_me(UsersExceptMe), random_permutation(AppUsers,UsersExceptMe),get_task_attribute_value(MaxUsers,'maxUsers'),append(Users,_,AppUsers), length(Users,MaxUsers)."
	},
	{
		"description": "Notify user if it can help",
		"whenever": "is_received(_,'notifyAskForHelp',_)",
		"thenceforth": "send_user_message('doYouWantToHelp',json([]))"
	},
	{
		"description": "Accept to provide help",
		"whenever": "is_received_do_transaction('acceptToHelp',_) and get_task_requester_id(RequesterId) and get_profile_id(Me)",
		"thenceforth": "add_message_transaction() and send_message(RequesterId,'notifyAcceptHelp',json([userId=Me]))"
	},
	{
		"description": "Notify user taht someone want to help",
		"whenever": "is_received(_,'notifyAcceptHelp',Attributes)",
		"thenceforth": "send_user_message('foundVolunteer',Attributes)"
	},
	{
		"description": "Do not want to help",
		"whenever": "is_received_do_transaction('denyToHelp',Attributes) and get_task_requester_id(RequesterId) and get_profile_id(Me) and get_attribute(Reason,reason,@null,Attributes)",
		"thenceforth": "add_message_transaction() and send_message(RequesterId,'notifyDenyToHelp',json([userId=Me,reason=Reason]))"
	},
	{
		"description": "Notify tayt a user cannot help",
		"whenever": "is_received(_,'notifyDenyToHelp',Attributes)",
		"thenceforth": "send_user_message('cannotHelp',Attributes)"
	}
]
```

