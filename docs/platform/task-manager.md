---
title: Task manager
sidebar_label: Task manager
---

The task manager component is the one responsible for storing and maintaining
the task and task types. 

A task is used to coordinate a set of WeNet users to do something. It is defined
by the next fields:

 - __id__  identifier of the task.
 - __goal__  the objective to reach. In other words why the users cooperate.
 - __requesterId__  the identifier of the user that has created the task.
 - ___creationTs__  the difference, measured in seconds, between the time when the task
  is created and midnight, January 1, 1970 UTC.
 - ___lastUpdateTs__  the difference, measured in seconds, between the time when the task
  is updated and midnight, January 1, 1970 UTC.
 - __closeTs__  the difference, measured in seconds, between the time when the task
  is considered done (closed) and midnight, January 1, 1970 UTC.
 - __appId__  identifier of the application where the task is associated.
 - __communityId__  identifier of the community where the task is associated.
 - __taskTypeId__  identifier of the type. It defines the common behaviours
  allowed to the users when interacting on the task.
 - __attributes__  the JSON object with the values that instantiate the task.
  The possible values are defined by the type.
 - __norms__  that modify the default behaviour defined by the type. If you want
 to read more about how to define norms read the [WeNet developer documentation](https://internetofus.github.io/developer/docs/tech/conversation/norms)
 - __transactions__  the historic list of transactions that have been done in
  the task. Also, each transaction has the information of the application messages
  that have been sent to the users that are involved in the task.
 
On the other hand, the task type defines what the users can do in a task. For
this purpose has the next fields:

 - __id__  identifier of the task type.
 - __name__  of the type.
 - __description__  of the type.
 - __keywords__  used to define the type.
 - __attributes__  is a JSON object where the fields are the possible attributes
  of the task, and the value is the name is the OpenAPI description of the possible
  values for the attribute.
 - __transactions__  is a JSON object where the fields are the possible labels
 of the transactions that the users can do on the task, and the value is the
 OpenAPI description of the attributes for the transaction.
 - __callbacks__  is a JSON object where the fields are the possible labels
 of the messages that the norms can send to the application for a user, and
 the value is the OpenAPI description of the attributes for the message.
 - __norms__  that describe the possible behaviour can do in a task of this type.
  If you want to read more about how to define norms read the [WeNet developer documentation](https://internetofus.github.io/developer/docs/tech/conversation/norms)

The next JSON is an example of a task type that echo the received transaction
to the same user.

```json

{
   "id":"wenet_echo_v1",
   "name":"Echo",
   "description":"This tasks echo the transaction messages",
   "keywords":[
      "example",
      "test"
   ],
   "transactions":{
      "echo":{
         "type":"object",
         "description":"Send the echo message",
         "properties":{
            "message":{
               "type":"string",
               "description":"The message to echo"
            }
         }
      }
   },
   "callbacks":{
      "echo":{
         "type":"object",
         "properties":{
            "taskId":{
               "type":"string",
               "description":"The identifier of the task"
            },
            "communityId":{
               "type":"string",
               "description":"The identifier of the community"
            },
            "message":{
               "type":"string",
               "description":"The echo message"
            }
         }
      }
   },
   "norms":[
      {
         "whenever":"is_received_created_task()",
         "thenceforth":"add_created_transaction()"
      },
      {
         "whenever":"is_received_do_transaction('echo',Content)",
         "thenceforth":"add_message_transaction() and send_user_message('echo',Content)"
      }
   ]
}

```
