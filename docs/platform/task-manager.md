---
title: Task manager
sidebar_label: Task manager
---

The task manager component is the one responsible for storing and maintaining
the task and task types. The task types define the interaction protocols between users
and the task is an instance of this type.

The task type uses the [OpenAPI](https://swagger.io/specification/) to define
the possible attributes of a task, the actions or transactions that a user can do
in a task, and the messages or callbacks that can be posted to the application
from the task execution. Also, it has a set of norms that describe the behaviour
of the user on the task execution.

When a set of users want to be coordinated to do something one of them create a new task.
This task has associated a type that describes the behaviour of the user on this execution.
The creator of the task, if wants, can define new norms that can modify this default
behaviour. The task manager is also responsible for maintaining the state of this task execution.
For this reason on the task model are stored all the transactions that have been done
on it, and on this transaction are stored the messages that has been sent to the application
when this transaction is executed. As well, it provides services that can be used
to obtain the messages sent to the users by the application callbacks.
