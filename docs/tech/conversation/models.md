---
title: Models
sidebar_label: Models
---

Conversations are possible thanks to 5 different models:

1. task type
2. norm
3. task
4. transaction
5. message

## Task type

The task type defines what the users can do in a task.

| Parameter | Type | Description | Read only |
| ------------- | ---- | ----------- | -----: |
| `id` | _string_ | The unique identifier of the task type | `true` |
| `name` | _string_ \| _null_ | The name of the task type | `false` |
| `description` | _string_ \| _null_ | The description of the task type | `false` |
| `keywords` | _string array \| _null_ | keywords to define the task type | `false` |
| `attributes` | _object_ \| _null_ | It is a JSON object where the fields are the possible attributes of the task, and the value is the name is the OpenAPI description of the possible values for the attribute. | `false` |
| `transactions` | _object_ \| _null_ | It is a JSON object where the fields are the possible labels of the transactions that the users can do on the task, and the value is the OpenAPI description of the attributes for the transaction | `false` |
| `callbacks` | _object_ \| _null_ | It is a JSON object where the fields are the possible labels of the messages that the norms can send to the application for a user, and the value is the OpenAPI description of the attributes for the message | `false` |
| `norms` | _object array_ \| _null_ | that describe the possible behaviour can do in a task of this type. If you want to read more about how to define norms read the [norms section on the developer documentation](https://internetofus.github.io/developer/docs/tech/conversation/norms) | `false` |

## Norm

A norm is a set of conditions that if they are satisfied provokes that has to do a set of actions, and with this mechanism is controlled the interactions in the WeNet platform.
If you want to read more about how to define norms read the [norm section on the developer documentation](https://internetofus.github.io/developer/docs/tech/conversation/norms)

| Parameter | Type | Description | Read only |
| ------------- | ---- | ----------- | -----: |
| `whenever` | _string_  | The conditions that active the norm | `false` |
| `thenceforth` | _string_ | The actions to do when the conditions are satisfied | `false` |
| `ontology` | _string_ \| _null_ | The extra code that is used on the conditions or the actions | `false` |
| `description` | _string_ \| _null_ | The description of the norm | `false` |


## Task

A task represents a particular request that a user can publish within the platform.
It may be a question as well as an invite to a public event.

Tasks are created by user within a specific application.
Once created, their updated state can be requested.

The currently supported use cases are about:

* asking for help;
* organising a social event.

The Task model is made of by the following parameters:

| Parameter | Type | Description | Read only |
| ------------- | ---- | ----------- | -----: |
| `id` | _string_ | The unique identifier of the task | `true` |
| `taskTypeId` | _string_ | The identifier of the task type | `false` |
| `appId` | _string_ | The id of the app in which the task was generated | `false` |
| `communityId` | _string_ \| _null_ | The identifier of a community the task is meant for | `false` |
| `requesterId` | _string_ | The wenet id of the task creator | `false` |
| `goal` | _dict_ | The Task Goal object about the task. See below for more details | `false` |
| `closeTs` | _int_ \| _null_ | The UTC epoch timestamp representing the instant of the end of the task | `true` |
| `norms` | _list_ | The list of norms associated to the task | `false` |
| `attributes` | _list_ | The list of specific attributes of the task | `false` |
| `transactions` | _list_ | The complete list of transactions that were applied to the task | `true` |
| `_creationTs` | _int_ | The UTC epoch timestamp representing the creation instant | `true` |
| `_lastUpdateTs` | _int_ | The UTC epoch timestamp representing the last update instant | `true` |

The Task goal is composed by the following parameters:

| Parameter | Type | Description | Read only |
| ------------- | ----------- | ----- | -----: |
| `name` | _string_ \| _null_ | The goal name | `false` |
| `description` | _string_ \| _null_ | TThe goal descriptione | `false` |
| `keywords` | _list_ | A list of keywords describing and defining the task | `false` |

## Transaction

A Transaction represents a specific action that was applied on a task by either the task creator of by another user participating to the task lifecycle.

A Transaction may be applicable only to a Task with a very specific state.

The Transaction model is made of by the following parameters:

| Parameter | Type | Description | Read only |
| ------------- | ----------- | -----: | -----: |
| `id` | _string_ | The unique identifier of the transaction | `true` |
| `taskId` | _string_ | The identifier of the associated task | `false` |
| `label` | _string_ | The identifier of the transaction type | `false` |
| `attributes` | _list_ | The list of specific attributes of the transaction | `false` |
| `actioneerId` | _string_ | The wenet id of the transaction creator | `false` |
| `messages` | _list_ | The list of messages generated due to the transaction | `false` |
| `_creationTs` | _int_ | The UTC epoch timestamp representing the creation instant | `true` |
| `_lastUpdateTs` | _int_ | The UTC epoch timestamp representing the last update instant | `true` |

## Message

A Message is used by the platform for sending back messages to applications and users.

The Message model is made of by the following parameters:

| Parameter | Type | Description | Read only |
| ------------- | ----------- | -----: | -----: |
| `appId` | _string_ | The identifier of the application the message is meant for | `true` |
| `receiverId` | _string_ | The identifier of the wenet user the message is meant for | `true` |
| `label` | _string_ | The identifier of the message type | `true` |
| `attributes` | _list_ | The list of specific attributes of the message | `true` |
