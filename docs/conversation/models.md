---
title: Models
sidebar_label: Models
---

Conversations are possible thanks to 3 different models:

1. task
2. transaction
3. message

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
| `goal` | _dict_ | The wenet id of the task creator | `false` |
| `closeTs` | _int_ \| _null_ | The wenet id of the task creator | `true` |
| `norms` | _list_ | The list of norms associated to the task | `false` |
| `attributes` | _list_ | The list of specific attributes of the task | `false` |
| `transactions` | _list_ | The complete list of transactions that were applied to the task | `true` |
| `_creationTs` | _int_ | The UTC epoch timestamp representing the creation instant | `true` |
| `_lastUpdateTs` | _int_ | The UTC epoch timestamp representing the last update instant | `true` |

The Task goal is composed by the following parameters:

| Parameter | Type | Description | Read only | Nullable |
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
| `messages` | _list_ | The wenet id of the transaction creator | `false` |
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
