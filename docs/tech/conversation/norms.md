---
title: Norms
sidebar_label: Norms
---

A norm is a set of conditions that if they are satisfied provokes that has to do a set of actions,
and with this mechanism is controlled the interactions in the WeNet platform. These interactions
are modelled as messages between WeNet users or between a component and a WeNet user. The component
that do this is the WeNet interaction protocol engine. This component is formed by a set of norm engines,
where each one is responsible to get the norms to evaluate from the point of view of a user and to do
the actions of the norms that will be satisfied. In other words, each user on the WeNet platform has
its norm engine to evaluate the actions that a user do or the notification that it can receive.
The norms are defined on the profile of the user, on the community that the user is, into the task
that the user is involved in and in the same message. The norm engine of each user decided with norms
has to be evaluated depending on the interaction and the status of the user. These norm engines are
in rest mode and when a message is received, they collect the necessary norms evaluate them and do
the actions of the norms that are satisfied. The messages that start a norm engine are associated
with one of the next actions:

- **Create a task**: When a user wants to create a task.
- **Do transaction**: When a user wants to modify a task.
- **Send Incentive**: When the incentive server wants to send an incentive to a user.
- **Received a message**: When a norm engine receives a message from another norm engine.
- **Received an event**: When a norm engine notifies himself of an event.

On the other hand, the norms are formed by a set of conditions that if they are satisfied execute
a set of actions associated with it. A grosso modo the conditions check the action that has started
the norm engine or the status of the user, and the actions can send a message to the user associated
with the norm engine or send a message to the norm engine of another user.

The norm engine is developed in [SWI Prolog](https://www.swi-prolog.org/), so this is the language
that is used to define the norms. The norm and action as defined as predicates. A predicate is like
a function that starts with a lower case letter followed by letters, numbers or the underscore
and after that between parenthesis are the arguments of the action or the condition separated
by commas. For example:

```prolog
get_task_attribute_value(StartTime,'startTime')
```

The data model of a norm is defined in JSON, and it has the next fields:

- **whenever** is used to define the conditions that have to satisfy to fire the actions.
 	Each condition can be separated by the conjunctions **and**, **or** or **not**.
- **thenceforth** is used to define the actions to do if the conditions are satisfied.
 	Each action is separated by the conjunction **and**.
- **ontology** is used to define new prolog predicates that can be used in any condition
   or action of a norm. If the predicate can be used as an action you must define it as **dynamic**.

The next example is the JSON representation of a norm to send an error to the user if try to create a task
with the start time less than or equals to now.

```json
{
 "whenever": "is_received_created_task() and get_task_attribute_value(StartTime,startTime) and is_now_greater_than_or_equal_to(StartTime)",
 "thenceforth": "close_task() and send_error('cannot_create_task_with_bad_startTime')",
 "ontology": ":- dynamic send_error/1. send_error(Code) :- get_task_id(TaskId), send_user_message('Error',json([code=Code,taskId=TaskId]))."
}
```

As you can see the arguments of the conditions or the actions can be a **variable** or a value. A variable starts
with an upper case letter followed by letters, numbers or the underscore. ATTENTION, the variables
only be associated with a value. In other words, when a variable is associated with a value, it can not be changed
in all the norm. So, if you want to change the value of a variable you must define a new variable. The values
as argument of the predicate or a value of a variable can be:

- A **Boolean** value that can be ``true`` or ``false``.
- A **Number** value that can represent any integer or floating-point number. For example: ``-1.34`` or ``89``
- A **String** value is a sequence of any characters between single quotes (``'``) or a sequence of characters that
  starts with a lower case followed by letters, numbers or the underscore. For example: ``'String value'`` or ``id``.
- An **Array** value is a list of values between quadratus and separated by commas. For example: ``['One',2,[3,'three']]``
- A **Json** value that is mapped as the predicate ``json`` and with an array as an argument where its elements
  are pairs of field name and value separated by an equals. For example: ``json([id='1',goal=json([name='Eat together'])])``.
  You can read more about the conversion from JSON to a predicate [here](https://www.swi-prolog.org/pldoc/doc_for?object=json_read/2).
  Attention if the field name does not start with a lower case followed for letters, numbers or the underscore,
  it must be written as a string between single quotes. For example: ``json(['Action'='Questions 1','Message'=''])``
- An underscore (``_``) to mark that it accepts any value. In other words, that the value that matches
  this position is ignored.

As you have read before the norms are defined in different data models in the WeNet platform. The norms that affect
any interaction that a user is involved in are defined on the profile of the user. You can modify these norms by doing
an HTTP CRUD request over the WeNet profile manager. For the interaction that does any user in a community, the norms
are defined on the community profile. You can modify these norms by doing an HTTP CRUD request over the WeNet profile manager.
For modifying the logic that is involved in a task you must modify the norms defined on the task and its type using
HTTP CRUD requests over the task manager.


## Protocol actions

Before you have read that the norm engine is activated for one of the five possible actions, now you can read more about
what happens when each of these actions happens.

### Create a task

When a user wants to create a task to do interact with the user interface of the application. This converts this
into an HTTP request to the WeNet service component. This component checks the authentication and authorization
of the user that runs the application. If it is valid the service component calls the WeNet task manager with the task
to create. This component checks that the new task is valid and if it is then the task is stored and finally it calls
the WeNet interaction protocol engine to inform that a task is created. This last one gets the norms of the user that
create the task, the norms of the community where is defined the task, the norms of the task type associated with the task,
and the norms of the task, and start a new norm engine to validate this tasks. From this point what happens depends
on the fired norms and their associated actions. But normally what happens is that will be fired a set of norms that decide
which of the WeNet users will collaborate to do the created task. These actions normally send a message to each norm engine
of the selected users. Then each norm engine collects the norms of the user, the community, the task type, and the task
and decides the message to send to the user. When is decided this message is posted as an HTTP to the message callback
of the application where the task is created. An then the user interface of the application show that it is selected
to participate in the task.

The task validation by the WeNet task manager consists of verifying:

- If an identifier is set that is not already defined and it has less than 255 characters. If it is not set
  the task manager will set a unique identifier to the task.
- That it has a task type, that this type exists and that the attributes of the task follow the possible attributes
  defined on the type.
- That the user that wants to create the task (requester) has a profile on the WeNet platform.
- That the application associated with the task exists.
- That the community associated with the task exists, or if it is not set it assigns the default community
  of the application where the task is added.
- That the user defines the name of the goal. It can not be larger than 255 characters. If you want to write something
  larger you can add this extra information on the goal description that its maximum is 1023 characters.


### Do a task transaction

When a user wants to interact in a task it has to do a task transaction. This begins with an interaction on the user
interface of the application, that is converted into an HTTP request to the WeNet service component. This component
checks the authentication and authorization of the user that runs the application. If it is valid the service component
calls the WeNet task manager with the transaction to do. This component checks that the transaction is valid and if it is
calls the WeNet interaction protocol engine to inform about the transaction to do. This last one gets the norms of the user
that do the transaction, the norms of the community of the task, the norms of the task type associated with the task,
and the norms of the task and start a new norm engine to validate this transaction. From this point what happens depends
on the fired norms and their associated actions. But normally what happens is that will be fired a set of norms that
changes the state of the user or the task and notify of these changes to the norm engines of the other users that
participate in the task. The notified norm engines get again the norms by with the norms of the user that represents
and as result send a callback message to the user, that will be converted into an event on the user interface of the user
application.


The task transaction validation by the WeNet task manager consists of verifying:

- That the task associated with the transaction is defined.
- That the agent that does the transaction has a profile on the WeNet platform.
- That the label and attributes of the transaction match any of the possibles defined by the task type associated
  with the task of the transaction.


### Send an incentive

When the WeNet incentive server wants to send an incentive to a user it posted an HTTP request to the WeNet interaction
protocol engine with the incentive to send to the user. This component validates the incentive and if it is valid gets
the norms of the user and the norms of the community of the application with in the incentive. And after that
start the norm engine to decide what to do next depending on the norms that will be fired. Normally this norms
converts the incentive into a callback message that is sent to the application of the user, which converts the message
into an event on the user interface of the user.

The incentive validation by the WeNet interaction protocol engine consists of verifying:

- That the task associated with the transaction is defined.
- That the agent that does the transaction has a profile on the WeNet platform.
- That the label and attributes of the transaction match any of the possibles defined by the task type associated
  with the task of the transaction.


### Received message

When a norm engine wants to notify the norm engine of another user it posted an HTTP request to the WeNet interaction
protocol engine, which validates the message and passes it through to the norm engine of the user. It obtains the norms
associated with the message and validates them to known with actions to do next, as you can read on the previous actions.


### Received event

An event is a message that a norm engine is sent to itself after a delay in seconds. It is used to activate the norm
engine and evaluate again the norms. For example: imagine a task that you want to close after a day, then you may define a
norm that when the task is created send an event to be delivered after a day, and another norm to close the task when
this event is received.


## Conditions

The norms are formed by a list of conditions separated by the conjunctions ``and`` or ``or``, or negated using
the predicate ``not(Condition)``. You can use any predicate defined by the [SWI Prolog](https://www.swi-prolog.org/).
The next sections show the most common conditions that have been provided to help to the norm definition.


### Message conditions

The next conditions are used to check the protocol message that has started the norm engine.

- ``is_received_created_task()``
  This condition is **true** when the message informs that a task is created.
- ``is_received_do_transaction(Label,Attributes)``
  This condition is **true** when the message informs that a user wants to do a transaction.
    * ``Label``  _Output_  string with the transaction label.
    * ``Attributes``  _Output_  JSON model with the transaction attributes.
- ``is_received_send_incentive(Incentive)``
  This condition is **true** when the message is sent by the incentive server to notify a user.
    * ``Incentive``  _Output_  JSON model with the incentive to notify to the user.
- ``is_received(SenderId,Particle,Content)``
  This condition is **true** when the message is from another norm engine.
    * ``SenderId``  _Output_  string with the user identifier that has sent the message.
    * ``Particle``  _Output_  string with the message particle.
    * ``Content`` _Output_  JSON model with the message content.
- ``is_received_event(Particle,Content)``
  This condition is **true** when the received message is an event.
    * ``Particle``  _Output_  string with the event particle.
    * ``Content`` _Output_  JSON model with the event content.


### Users conditions

The next conditions are used to manage the users that can be involved in a task. On this condition **me** refers
to the user of the norm engine that has been started.

- ``get_app_users(Users)``
  This condition is used to obtain the users that are on the application.
    * ``Users``  _Output_  array of strings with the identifiers of the users that are in the application.
- ``get_app_users_except_me(Users)``
  This condition is used to obtain the users that are on the application removing the identifier of the user
  associated with the norm engine.
    * ``Users``  _Output_  array of strings with the identifiers of the users.
- ``get_closest_users_to_me(Users)``
    This condition is used to obtain the users, maximum 10, that are closest to the user associated
    to the norm engine.
    * ``Users``  _Output_  array of strings with the identifiers of the users.
- ``get_closest_users_to_me(Users,NumUsers)``
  This condition is used to obtain the users that are closest to the user associated with the norm engine.
    * ``Users``  _Output_  array of strings with the identifiers of the users.
    * ``NumUsers``  _Input_  number maximum of users to return.
- ``get_app_users_near_me(Users,Min,Max)``
  This condition is used to obtain the users on the application that are in a range to the user associated with
  the norm engine. Thus, it returns the application users that are in a distance **[Min, Max]** to me.
    * ``Users``  _Output_  array of strings with the identifiers of the users.
    * ``Min``  _Input_  number the minimum distance in meters to the user associated with the norm engine.
    * ``Max``  _Input_  number the maximum distance in meters to the user associated with the norm engine.


### Me conditions

The next conditions are over the user associated with the norm engine (**me**).

- ``get_profile_id(Me)``
  This condition is used to obtain the identifier to the user associated with the norm engine.
    * ``Me``  _Output_  string with the identifier of the user.
- ``get_profile(Profile)``
  This condition is used to obtain the profile of the user associated with the norm engine at the moment it is started.
    * ``Profile``  _Output_   JSON model with the profile.
- ``get_user_state(State)``
  This condition obtains the state of the user. This state is shared by all the norm engines
  associated with **me**.
    * ``State``  _Output_  JSON model with the user state.
- ``get_user_state_attribute(Value,Key)``
  This condition obtains the value of a user state attribute. If it is not defined this predicate fails.
    * ``Value``  _Output_  value associated with the attribute.
    * ``Key``  _Input_  string with the name of the attribute.
- ``get_user_state_attribute(Value,Key,DefaultValue)``
  This condition obtains the value of a user state attribute, or a default value if it is not defined.
    * ``Value``  _Output_  value associated with the attribute or the default one if it is not defined.
    * ``Key``  _Input_  string with the name of the attribute.
    * ``DefaultValue``  _Input_  value to return if the attribute is not defined.
- ``get_relationships(Relationships)``
  This condition obtains the best 1k social network relationships of the current user repect
  the other application users. value of a user state attribute, or a default value if it is not defined.
    * ``Relationships``  _Output_  array of JSON models with my social network relationships.


### Application conditions

The next conditions are over the application associated with the norm engine.

- ``get_app_id(AppId)``
  This condition is used to obtain the identifier to the application associated with the norm engine.
    * ``AppId``  _Output_  string with the identifier of the application.
- ``get_app(App)``
  This condition obtains the model data of the application associated with the norm engine. The data model
  is obtained the first time this condition is called, after that the value is fixed.
    * ``App``  _Output_  JSON model with the application data.
- ``get_app_message_callback_url(Url)``
  This condition obtains the URL to post the messages to send to the user into the application
  associated with the norm engine. The URL is obtained the first time this condition is called, after that
  the value is fixed.
    * ``Url``  _Output_  string to the URL to post the callback messages.


### Community conditions

The next conditions are over the community associated with the norm engine.

- ``get_community_id(CommunityId)``
  This condition is used to obtain the identifier to the community associated with the norm engine.
    * ``CommunityId``  _Output_  string with the identifier of the community.
- ``get_community(Community)``
  This condition obtains the model data of the community associated with the norm engine. The data model
  is obtained the first time this condition is called, after that the value is fixed.
    * ``Community``  _Output_  JSON model with the community data.
- ``get_community_state(State)``
  This condition obtains the state of the user in the community associated with the norm engine.
  This state is shared by all the norm engines associated with the user for the same community.
    * ``State``  _Output_  JSON model with the community user state.
- ``get_community_state_attribute(Value,Key)``
  This condition obtains the value of a community user state attribute. If it is not defined this predicate fails.
    * ``Value``  _Output_  value associated with the attribute.
    * ``Key``  _Input_  string with the name of the attribute.
- ``get_community_state_attribute(Value,Key,DefaultValue)``
  This condition obtains the value of a community user state attribute, or a default value if it is not defined.
    * ``Value``  _Output_  value associated with the attribute or the default one if it is not defined.
    * ``Key``  _Input_  string with the name of the attribute.
    * ``DefaultValue``  _Input_  value to return if the attribute is not defined.


### Task conditions

The next conditions are over the task associated with the norm engine.

- ``get_task_id(TaskId)``
  This condition is used to obtain the identifier to the task associated with the norm engine.
    * ``TaskId``  _Output_  string with the identifier of the task.
- ``get_task(Task)``
  This condition is used to obtain the task associated with the norm engine at the moment it is started.
    * ``Task``  _Output_   JSON model with the task.
- ``get_task_requester_id(RequesterId)``
  This condition obtains the requester identifier of the task associated with the norm engine.
    * ``RequesterId``  _Output_  string with the task requester identifier.
- ``get_task_goal_name(Name)``
  This condition obtains the goal name of the task associated with the norm engine.
    * ``Name``  _Output_  string with the task goal name.
- ``is_task_closed()``
  This condition is **true** when the task associated with the norm engine is closed.
- ``get_task_attribute_value(Value,Key)``
  This condition obtains the value of a task attribute. If it is not defined this predicate fails.
    * ``Value``  _Output_  value associated with the attribute.
    * ``Key``  _Input_  string with the name of the attribute.
- ``get_task_state(State)``
  This condition obtains the state of the user in the task associated with the norm engine.
  This state is shared by all the norm engines associated with the user for the same task.
    * ``State``  _Output_  JSON model with the task user state.
- ``get_task_state_attribute(Value,Key)``
  This condition obtains the value of a task user state attribute. If it is not defined this predicate fails.
    * ``Value``  _Output_  value associated with the attribute.
    * ``Key``  _Input_  string with the name of the attribute.
- ``get_task_state_attribute(Value,Key,DefaultValue)``
  This condition obtains the value of a task user state attribute, or a default value if it is not defined.
    * ``Value``  _Output_  value associated with the attribute or the default one if it is not defined.
    * ``Key``  _Input_  string with the name of the attribute.
    * ``DefaultValue``  _Input_  value to return if the attribute is not defined.
- ``get_task_type_id(TaskTypeId)``
  This condition obtains the type identifier for the task associated with the task of the norm engine.
    * ``TaskTypeId``  _Output_   string with the task type identifier.
- ``get_task_type(TaskType)``
  This condition is used to obtain the type of task associated with the norm engine at the moment it is started.
    * ``TaskType``  _Output_   JSON model with the task type.
- ``get_transaction_id(TransactionId)``
  This condition is used to obtain the identifier of the transaction associated with the norm engine or the identifier
  of the last transaction added to the task associated with the norm engine.
    * ``TransactionId``  _Output_  string transaction identifier.
- ``get_transaction(Transaction)``
  This condition is used to obtain the task transaction associated with the norm engine at the moment it is started,
  or return the last transaction added to the task associated with the norm engine.
    * ``Task``  _Output_   JSON model with the task.
- ``get_transaction(Transaction,TransactionId)``
  This condition is used to obtain the task transaction defined into the task associated with the norm engine.
    * ``Transaction``  _Output_  JSON model with the transaction
    * ``TransactionId``  _Input_  string identifier of the task transaction to obtain.
- ``filter_transactions(Result,Test,Map)``
  This condition is used to obtain a sub set of the transactions that has been done in the task
  and map them to a new value. In other words, for each transaction of the current task if
  ``call(Test,Transaction)`` is True, it transforms the transaction with ``call(Map,Value,Transaction)``
  and it adds the obtained Value to the result list.
    * ``Result``  _Output_  anything the filtered and mapped task transactions.
    * ``Test``  _Input_  predicate to call to known if the transaction is accepted.
    * ``Map``  _Input_  predicate to call to convert the accepted transaction.


### Social context builder conditions

The next conditions are used to interact with the social context builder.

- ``get_social_explanation(Explanation,UserId)``
  This condition obtains the explanation of why a user has to be chosen to be a volunteer.
    * ``Explanation``  _Output_  JSON model with the explanation provided by the social context builder.
    * ``UserId``  _Input_  string identifier of the user to obtain the explanation.
- ``normalized_social_closeness(Socialness,Users)``
  Calculate the socialness of the current users respects some others.
    * ``Socialness``  _Output_  JSON model list with the userId and value on the range [0,1] with the social closeness.
    * ``Users``  _Input_  string list with the identifiers of the users to calculate the social closeness respect the current user.


### Personal context builder conditions

The next conditions are used to interact with the personal context builder.
This component can obtain the location of the user if you provide this information
to the platform using the iLog application.

- ``normalized_closeness(Closeness,Users,MaxDistance)``
  Calculate the closeness (in distance) of the current user to some others.
    * ``Closeness``  _Output_  JSON model list with the userId and value on the range [0,1] with the close in distance to the user. Where 1 is at the same location and on the 0 is too far away.
    * ``Users``  _Input_  string list with the identifiers of the users to calculate the closeness respect the current user.
    * ``MaxDistance``  _Input_  number  the maximum distance that a user can be.
- ``get_current_location(Location)``
  Obtain the current location of the user.
    * ``Location``  _Output_  JSON model with the user identifier, the latitude and longitude where the user is.
- ``get_current_location(Latitude,Longitude)``
  Obtain the current location of the user.
    * ``Latitude``  _Output_  number with the latitude where the user of the norm engine is.
    * ``Longitude``  _Output_  number with the longitude where the user of the norm engine is.
- ``is_current_location_near(Latitude,Longitude)``
  Check if the current location of the user is less than 1 Kilometer over the specified location.
    * ``Latitude``  _Input_  number with the latitude of the location where the user has to near.
    * ``Longitude``  _Input_  number with the longitude of the location where the user has to near.
- ``is_current_location_near(Latitude,Longitude,MaxDistance)``
  Check if the current location of the user is less than 1 Kilometer over the specified location.
    * ``Latitude``  _Input_  number with the latitude of the location where the user has to near.
    * ``Longitude``  _Input_  number with the longitude of the location where the user has to near.
    * ``MaxDistance``  _Input_  number with the maximum distance between the user location and the specified location. It is in meters.
- ``is_current_location_near_relevant(Name)``
  Check if the current location of the user is less than 1 Kilometer over a relevant location defined on the profile.
    * ``Name``  _Input_  string name or identifier of the relevant location to check if the user is near.
    * ``Longitude``  _Input_  number with the longitude of the location where the user has to near.
- ``is_current_location_near_relevant(Name,MaxDistance)``
  Check if the current location of the user is less than 1 Kilometer over the specified location.
    * ``Name``  _Input_  string name or identifier of the relevant location to check if the user is near.
    * ``MaxDistance``  _Input_  number with the maximum distance between the user location and the relevant location. It is in meters.


### Diversity conditions

The next conditions are used to manage the diversity of some users.

- ``normalized_diversity(Diversity,Users,Attributes)``
  Calculate the diversity of the current user over some other users.
    * ``Diversity``  _Output_  JSON model list with the userId and value on the range [0,1] with the diversity of the user. Where 1 is the maximum diversity and 0 that the user is similar to.
    * ``Users``  _Input_  string list with the identifiers of the users to calculate the diversity respect the current user.
    * ``Attributes``  _Input_  string list  with the names of the attributes of the profile to calculate the diversity.
- ``my_profile_attributes_similars_to(Attributes,Text,MinSimilarity)``
  Obtain the attributes of my profile that has a similarity to a text equal or greater than the minimum.
    * ``Attributes``  _Output_  string list  with the name of the profile attributes that are similar to the text.
    * ``Text``  _Input_  string  to compare the profile attributes.
    * ``MinSimilarity``  _Input_  number  a value in the range [0,1] that define the minimum similarity to take an attribute.


### Time conditions

The next conditions are over the constant **now**, that it is the difference, measured in seconds,
between the time the norm engine is started and midnight, January 1, 1970, UTC.

- ``is_now_less_than(Time)``
  This condition is **true** when **now** is less than a value.
    * ``Time``  _Input_  integer time in seconds to check.
- ``is_now_less_than_or_equal_to(Time)``
  This condition is **true** when **now** is less than or equal to a value.
    * ``Time``  _Input_  integer time in seconds to check.
- ``is_now_greater_than(Time)``
  This condition is **true** when **now** is greater than a value.
    * ``Time``  _Input_  integer time in seconds to check.
- ``is_now_greater_than_or_equal_to(Time)``
  This condition is **true** when **now** is greater than or equal to a value.
    * ``Time``  _Input_  integer time in seconds to check.
- ``is_now_equal_to(Time)``
  This condition is **true** when **now** is equal to a value.
    * ``Time``  _Input_  integer time in seconds to check.
- ``is_now_on_week_day(WeekDay)``
  Check if **now** is on the specified week day.
    * ``WeekDay``  _Input_  integer with the week day that has to be **now**. It is a value on the range [1,7]
    where 1 => Monday ... 7=> Sunday.
- ``is_now_one_of_week_days(WeekDays)``
  Check if **now** is on the specified week day.
    * ``WeekDays``  _Input_  array of integer with the week days that can be **now**.
    A weekday is a value on the range [1,7] where 1 => Monday ... 7=> Sunday.
- ``is_now_on_monday()``
  Check if **now** is on Monday.
- ``is_now_on_tuesday()``
  Check if **now** is on Tuesday.
- ``is_now_on_wednesday()``
  Check if **now** is on Wednesday.
- ``is_now_on_thursday()``
  Check if **now** is on Thursday.
- ``is_now_on_friday()``
  Check if **now** is on Friday.
- ``is_now_on_saturday()``
  Check if **now** is on Saturday.
- ``is_now_on_sunday()``
  Check if **now** is on Sunday.
- ``is_now_before_time(Time)``
  Check if now is before the specified time.
    * ``Time``  _Input_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
- ``is_now_before_time_or_equals(Time)``
  Check if now is before or equals to the specified time.
    * ``Time``  _Input_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
- ``is_now_after_time(Time,String)``
  Check if now is after the specified time.
    * ``Time``  _Input_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
- ``is_now_after_time_or_equals(Time)``
  Check if now is after or equals to the specified time.
    * ``Time``  _Input_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
- ``is_now_between_times(Lower,Upper)``
  heck if now is between the specified times.
    * ``Lower``  _Input_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
    * ``Upper``  _Input_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.


### JSON conditions

The next conditions are used to manage JSON models.

- ``get_attribute(Value,Key,Json)``
  This condition obtains an attribute (field) of a JSON model. If the attribute is not defined
  this condition fails.
    * ``Value``  _Output_  value of the attribute.
    * ``Key``  _Input_  string name of the attribute.
    * ``Json``  _Input_  JSON model to obtain the attribute.
- ``get_attribute(Value,Key,DefaultValue,Json)``
  This condition obtains an attribute (field) of a JSON model. If the attribute is not defined
  it returns the default value.
    * ``Value``  _Output_  value of the attribute or the default value is not defined.
    * ``Key``  _Input_  string name of the attribute.
    * ``DefaultValue``  _Input_  value to return if it is not defined.
    * ``Json``  _Input_  JSON model to obtain the attribute.


## Actions

The norms to do when the conditions of a norm are predicates separated by the conjunction ``and``. You can use
any predicate defined by the [SWI Prolog](https://www.swi-prolog.org/), but before you have to mark it as ``dynamic``
on the ontology of the norm. The next sections show the most common actions that have been provided to help
to the norm definition.


### User actions

These actions are done over the user that is associated with the norm engine, thus the receiver user of the message.

- ``send_user_message(Label,Content)``
  This action posts a callback message to the user.
  If it is done over an active transaction it is stored in it and notify
  the incentive server and the social context builder that the message is sent.
    * ``Label`` _Input_  string with the message label.
    * ``Content`` _Input_  JSON model with the message content.
- ``merge_user_state(State)``
  This action merges the current state of the user.
    * ``State``  _Input_  JSON model with the new state of the user.
- ``put_user_state_attribute(Key,Value)``
  This action changes an attribute of the state of the user.
    * ``Key``  _Input_  string with the name of the state attribute.
    * ``Value``  _Input_  value to put to the attribute of the state.


### Community actions

These actions are done over the community that is associated with the received message.

- ``merge_community_state(State)``
  This action merges the current state of the user for the community.
    * ``State``  _Input_  JSON model with the new state of the user on the community.
- ``put_community_state_attribute(Key,Value)``
  This action changes an attribute of the state of the user for the community.
    * ``Key``  _Input_  string with the name of the state attribute.
    * ``Value``  _Input_  value to put to the attribute of the state.


### Task actions

These actions are done in the task that is associated with the received message.

- ``add_created_transaction()``
 This action adds a new transaction to the task that represents that the creation
 of the task.
 It also notifies the incentive server that the task is created.
- ``add_message_transaction()``
  This action adds the transaction defined on the received message into the task.
  It also notifies the incentive server that the transaction is done.
- ``put_task_attribute(Key,Value)``
  This action changes an attribute of the current task model.
    * ``Key``  _Input_  string with the name of the task attribute.
    * ``Value``  _Input_  value to put to the task attribute.
- ``merge_task(Task)``
  This action modifies the current task model.
    * ``Task``  _Input_  JSON model with the new values for the task.
- ``close_task()``
  This action marks the task associated with the norm engine as closed.
- ``merge_task_state(State)``
  This action merges the current state of the user for the task.
    * ``State``  _Input_  JSON model with the new state of the user on the task.
- ``put_task_state_attribute(Key,Value)``
  This action changes an attribute of the state of the user for the task.
    * ``Key``  _Input_  string with the name of the state attribute.
    * ``Value``  _Input_  value to put to the attribute of the state.


### Interact with WeNet components

These actions interact with the other components of the WeNet platform.

- ``send_messages(Users,Particle,Content)``
  This action sends messages to the norm engines of some users.
    * ``Users``  _Input_  array of strings of the users to receive a message.
    * ``Particle``  _Input_  string with the message particle.
    * ``Content``  _Input_  JSON model with the message content.
- ``send_message(UserId,Particle,Content)``
  This action sends a message to the norm engines of a user.
    * ``UserId``  _Input_  strings identifier of the user to receive the message.
    * ``Particle``  _Input_  string with the message particle.
    * ``Content``  _Input_  JSON model with the message content.
- ``notify_incentive_server_task_created()``
  This action notifies the incentive server that a user has created a task.
  The number of times the task is created is counted by the user, task type and community.
- ``notify_incentive_server_transaction_done(Label)``
  This action notifies the incentive server that a task transaction is done.
  The number of times the transaction is done is counted by the user, task type and community.
    * ``Label``  _Input_  string with the label of the transaction that has been done.
- ``notify_incentive_server_transaction_done(Label,Count)``
  This action notifies the incentive server that a task transaction is done Count times in the community.
    * ``Label``  _Input_  string with the label of the transaction that has been done.
    * ``Count``  _Input_  integer the number of times the user has done the transaction on the community for the current task type.
- ``notify_incentive_server_message_sent(Label)``
  This action notifies the incentive server that a message is sent to the user.
  The number of times the message is sent to the user is counted by the user, task type and community.
    * ``Label``  _Input_  string with the label of the sent message.
- ``notify_incentive_server_transaction_done(Label,Count)``
  This action notifies the incentive server that a message is sent to the user Count times in the community.
    * ``Label``  _Input_  string with the label of the sent message.
    * ``Count``  _Input_  integer the number of times the message is sent to the user on the community for the current task type.
- ``volunteers_ranking(Ranking,Volunteers)``
  This action calls the social context builder to obtain a ranking for some volunteers.
    * ``Ranking``  _Output_  array of strings with the ranked volunteers.
    * ``Volunteers``  _Input_  array of strings with the user identifiers that has volunteer.
- ``answers_ranking(Ranking,UserAnswers)``
  This action calls the social context builder to obtain a ranking for some answers.
    * ``Ranking``  _Output_  array of strings with the ranked answers.
    * ``UserAnswers``  _Input_  array of JSON models with the user answers. This array elements
    can be created using the ``wenet_new_user_answer``.
- ``selected_answer_from_last_ranking(UserAnswer)``
  This action notify the social context builder the selected answers of the last answer ranking result.
    * ``UserAnswers``  _Input_  JSON models with the selected user answer.
- ``notify_social_context_builder_message_sent(Message)``
  This action notifies the social context builder that a message is sent to the user.
    * ``Message``  _Input_  JSON model with the sent message.


## Other Useful Norms predicates

We provide other predicates that can be used to help to define the conditions and the actions of any norm.

### Facts

The next predicates refer to facts (constants) that have been set when the norm engine has been started.

- ``get_message(Message)``
  The fact with the received message that has started the norm engine.
    * ``Message``  _Output_  JSON model of the received protocol message.
- ``get_now(Time)``
  The fact with the difference, measured in seconds, between the time the norm engine is started and
  midnight, January 1, 1970, UTC.
    * ``Time``  _Output_  number with the started time in seconds.
- ``wenet_profile_manager_api_url(URL)``
  The fact with the URL to the profile manager component.
    * ``URL``  _Output_  string with the profile manager API URL.
- ``wenet_task_manager_api_url(URL)``
  The fact with the URL to the task manager component.
    * ``URL``  _Output_  string with the task manager API URL.
- ``wenet_interaction_protocol_engine_api_url(URL)``
  The fact with the URL to the interaction protocol engine component.
    * ``URL``  _Output_  string with the tinteraction protocol engine API URL.
- ``wenet_social_context_builder_api_url(URL)``
  The fact with the URL to the social context builder component.
    * ``URL``  _Output_  string with the social context builder API URL.
- ``wenet_service_api_url(URL)``
  The fact with the URL to the service component.
    * ``URL``  _Output_  string with the service API URL.
- ``wenet_incentive_server_api_url(URL)``
  The fact with the URL to the incentive server component.
    * ``URL``  _Output_  string with the incentive server API URL.
- ``wenet_personal_context_builder_api_url(URL)``
  The fact with the URL to the personal context builder component.
    * ``URL``  _Output_  string with the personal context builder API URL.


### User value models

The next predicates are used to manipulate the JSON user-value models.

- ``wenet_new_user_value(UserValue,UserId,Value)``
  Create a new user value JSON model.
    * ``UserValue``  _Output_  JSON  user-value model.
    * ``UserId``  _Input_  string  identifier of the user.
    * ``Value``  _Input_  number  on the range [0,1] with the vlaue associated to the user.
- ``wenet_user_id_from_user_value(UserId,UserValue)``
  Get the user identifier of the JSON user value model.
    * ``UserId``  _Output_  string  with the user identifier defined on the model.
    * ``UserValue``  _Input_  JSON  user-value model.
- ``wenet_value_from_user_value(Value,UserValue)``
  Get the value of the JSON user value model.
    * ``Value``  _Output_  number  with the value defined on the model.
    * ``UserValue``  _Input_  JSON  user-value model.
- ``wenet_initialize_user_values(List,Users,Value)``
  Create a list of user values for some users with the same value.
    * ``List``  _Output_  JSON list  with the user-value models.
    * ``Users``  _Input_  string list  with the user identfifiers to create the models.
    * ``Value``  _Input_  number  on  the range [0,1] with the value to set for all the models.
- ``wenet_negate_user_value(Target,Source)``
  Apply for each model-value model the operation 1 - Value.
    * ``Target``  _Output_  JSON list with the user-value models where each value is negated (1 - value).
    * ``Source``  _Input_  JSON list  with the user-value models to negate their value.
- ``wenet_user_values_to_value_user_id_pairs(Target,Source)``
  Convert a list of JSON user values to a list of pairs. A pair is UserId-Value.
    * ``Target``  _Output_  strig list with the pairs.
    * ``Source``  _Input_  JSON list  with the user-value models to convert.
- ``wenet_value_user_id_pairs_to_user_values(Target,Source)``
  Convert a list of pairs to a list of JSON user values. A pair is UserId-Value.
    * ``Target``  _Output_  JSON list with the user-value models.
    * ``Source``  _Input_  string list  with the pairs  to convert.
- ``wenet_sort_user_values_by_value(Target,Source)``
  Sort a list user values.
    * ``Target``  _Output_  JSON list that is sorted by the value.
    * ``Source``  _Input_  JSON list of the user-value models to sort.
- ``wenet_user_values_to_user_ids(Target,Source)``
  Convert a list of user values to a list of user identifiers.
    * ``Target``  _Output_  JSON list that is sorted by the value.
    * ``Source``  _Input_  JSON list of the user-value models to sort.
- ``wenet_product_user_values(Product,A,B)``
  Do the product of the value of the same user in both lists. If a user is present on A and not preset on B the product is 0. If a user is present on B and not preset on A it is ignored.
    * ``Product``  _Output_  JSON list  with the product of the value of the same user identifier.
    * ``A``  _Input_  JSON list  with the user-value models to multiplicate.
    * ``B``  _Input_  JSON list  with the user-value models to multiplicate.


### Logs messages

The next predicates are used to add messages to the logging files of the norm engine.

- ``wenet_log_trace(Text)``
  This predicate adds a message to the trace log.
    * ``Text``  _Input_  string with the trace log message.
- ``wenet_log_trace(Text,Terms)``
  This predicate adds a message to the trace log with values.
    * ``Text``  _Input_  string with the trace log message.
    * ``Terms`` _Input_ value to append to the end of the message.
- ``wenet_log_error(Text)``
  This predicate adds a message to the error log.
    * ``Text``  _Input_  string with the error log message.
- ``wenet_log_error(Text,Terms)``
  This predicate adds a message to the error log with values.
    * ``Text``  _Input_  string with the error log message.
    * ``Terms`` _Input_ value to append to the end of the message.
- ``wenet_log_error(Text,Terms,Error)``
  This predicate adds a message to the error log with an exception.
    * ``Text``  _Input_  string with the error log message.
    * ``Terms`` _Input_ value to append to the end of the message.
    * ``Error`` _Input_ exception to append to the end of the message.


### HTTP interaction

The next predicates are used to do HTTP request into an URL.

- ``wenet_get_json_from_url(Json,Url)``
  Get a model from an URL.
    * ``Json``  _Output_  JSOM model of the received model.
    * ``Url``  _Input_  string with the URL to get the model.
- ``wenet_post_json_to_url(Json, Url, Body)``
  Post a model into an URL.
    * ``Json``  _Output_  JSOM model of the posted model.
    * ``Url``  _Input_  string with the URL to post the model.
    * ``Body``  _Input_  JSON model with the model to post.
- ``wenet_put_json_to_url(Json, Url, Body)``
  Put a model into an URL.
    * ``Json``  _Output_  JSOM model of the puted model.
    * ``Url``  _Input_  string with the URL to put the model.
    * ``Body``  _Input_  JSON model with the model to put.
- ``wenet_patch_json_to_url(Json, Url, Body)``
  Patch a model into an URL.
    * ``Json``  _Output_  JSOM model of the patched model.
    * ``Url``  _Input_  string with the URL to patch the model.
    * ``Body``  _Input_  JSON model with the model to patch.
- ``wenet_delete_to_url(Url)``
  Delete a model from an URL.
    * ``Url``  _Input_  string with the URL to delete the model.


### Time

- ``timestamp_to_week_day(WeekDay,Timestamp)``
  Obtain the week day from a time stamp.
    * ``WeekDay``  _Output_  integer with the week day. It is a value on the range [1,7]
    where 1 => Monday ... 7=> Sunday.
    * ``Timestamp``  _Input_  integer with the seconds from the midnight, January 1, 1970, UTC.
- ``string_to_time(Time,String)``
  Return the time associated to a string.
    * ``Time``  _Output_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
    * ``String``  _Input_  string with the time to extract.
- ``normalized_time(Time,String)``
  Return the normalized time
    * ``Time``  _Output_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
    * ``String``  _Input_  string to normalize.
- ``timestamp_to_time(Time,Timestamp)``
  Return the time associated to a time stamp.
    * ``Time``  _Output_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.
    * ``Timestamp``  _Input_  integer  with the epoch time since January 1, 1970 in seconds.
- ``now_to_time(Time)``
  Return the time associated to now.
    * ``Time``  _Output_  string on the format H:M where H is between 00 and 23, and MM between 00 and 59.


### Utils

- ``wenet_remove(Result,Element,List)``
  This predicate removes an element from an array.
    * ``Result``  _Output_  array of values without the element.
    * ``Element``  _Input_  value to remove.
    * ``List``  _Input_  array of values to remove the element.
- ``wenet_add(Result,Element,List)``
  This predicate adds an element to the end of an array.
    * ``Result``  _Output_  array of values where the element is added.
    * ``Element``  _Input_  value to add.
    * ``List``  _Input_  array of values to add the element.
- ``wenet_format(Msg,WeNetFormat,Arguments)``
  This predicate is used to create an string from a pattern. For the pattern **{}** are replaced with
  the argument on the same position. For example: ``wenet_format('Value One and 2','Value {} and {}',['One',2])``
    * ``Msg``  _Output_  string where are replaced the values of the pattern.
    * ``WeNetFormat``  _Input_  string with the pattern to replace **{}** with values.
    *  ``Arguments`` _Input_  array of values to be replaced on the pattern.
- ``wenet_math(Result,Expr)``
  This predicate evaluates an arithmetical expression. You can read more about the arithmetical expressions
  [here](https://www.swi-prolog.org/pldoc/man?section=functions). For example: ``wenet_format(4,2+2)``
    * ``Result``  _Output_  number with the result of the arithmetical expression.
    * ``Expr``  _Input_  mathematical expression to evaluate.


### Profile manager

The next predicates are used to interact with the profile manager component.

- ``wenet_profile_manager_api_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the profile manager.
  For example if ``ProfileId = '2'`` and the URL of the profile manager API is
  **https://wenet.u-hopper.com/prod/profile_manager** then ``wenet_profile_manager_api_url_to(Url,['/profiles/',ProfileId])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/profile_manager/profiles/2'``.
    * ``Url``  _Output_  string of the API point to the profile manager.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_profile_manager_get_profile(Profile,Id)``
  This predicate is used to obtain a profile.
    * ``Profile``  _Output_  JSON model with the obtained profile.
    * ``Id ``  _Input_  string with the identifier of the profile to obtain.
- ``wenet_profile_manager_get_community(Community,Id)``
  This predicate is used to obtain a community.
    * ``Profile``  _Output_  JSON model with the obtained community.
    * ``Id ``  _Input_  string with the identifier of the community to obtain.
- ``wenet_id_of_profile(Id, Profile)``
  This predicate obtains the identifier of a profile.
    * ``Id``  _Output_  string with the identifier of the profile.
    * ``Profile``  _Input_  JSON model of the profile to obtain the identifier.
- ``wenet_id_of_community(Id, Community)``
  This predicate obtains the identifier of a community.
    * ``Id``  _Output_  string with the identifier of the community.
    * ``Community``  _Input_  JSON model of the community to obtain the identifier.
- ``wenet_profile_manager_get_social_network_relationships_page(Page,AppId,SourceId,TargetId,Type,WeightFrom,WeightTo,Order,Offset,Limit)``
  This predicate searches for some social network relationships.
    * ``Page``  _Output_  JSON model with the relationships that match the query parameters.
    * ``AppId``  _Input_  string with the application identifier for the relationships to return.
    * ``SourceId``  _Input_  string with the user identifier that is the source of the relationships to return.
    * ``TargetId``  _Input_  string with the user identifier that is the target of the relationships to return.
    * ``Type``  _Input_  string the type of the relationships to return.
    * ``WeightFrom``  _Input_  number minimum, inclusive, weight of the relationships to return.
    * ``WeightTo``  _Input_  number maximum, inclusive, weight of the relationships to return.
    * ``Order``  _Input_  string with the order to return the relationships.
    * ``Offset``  _Input_  number with the index of the first relationship to return.
    * ``Limit``  _Input_  number with the maximum relationships to return.
- ``wenet_relationships_of_page(Relationships,Page)``
  This predicate returns the relationships defined on a page.
    * ``Relationships``  _Output_  array of JSON models with the relationships defined on the page.
    * ``Page``  _Input_  JSON model with the relationships to get.
- ``wenet_relevant_locations_of_profile(RelevantLocations, Profile)``
  Obtain the relevant locations of a profile.
    * ``RelevantLocations``  _Output_  array of JSON model with the relevant locations.
    * ``Profile``  _Input_  JSON model of the profile to obtain the relevant locations.
- ``wenet_id_of_relevant_location(Id, RelevantLocation)``
  Obtain the identifier of a relevant location.
    * ``Id``  _Output_  string with the relevant location identifier.
    * ``RelevantLocation``  _Input_  JSON model of the relevant location to obtain the identifier.
- ``wenet_label_of_relevant_location(Label, RelevantLocation)``
    Obtain the label of a relevant location.
    * ``Label``  _Output_  string with the relevant location label.
    * ``RelevantLocation``  _Input_  JSON model of the relevant location to obtain the label.
- ``wenet_longitude_of_relevant_location(Longitude, RelevantLocation)``
    Obtain the longitude of a relevant location.
    * ``Longitude``  _Output_  number with the relevant location longitude.
    * ``RelevantLocation``  _Input_  JSON model of the relevant location to obtain the longitude.
- ``wenet_latitude_of_relevant_location(Latitude, RelevantLocation)``
    Obtain the latitude of a relevant location.
    * ``Latitude``  _Output_  number with the relevant location latitude.
    * ``RelevantLocation``  _Input_  JSON model of the relevant location to obtain the latitude.


### Task manager

The next predicates are used to interact with the task manager component.

- ``wenet_task_manager_api_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the task manager.
  For example if ``TaskId = '2'`` and the URL of the task manager API is
  **https://wenet.u-hopper.com/prod/task_manager** then ``wenet_task_manager_api_url_to(Url,['/tasks/',TaskId])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/task_manager/tasks/2'``.
    * ``Url``  _Output_  string of the API point to the task manager.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_task_manager_get_task(Task,Id)``
  This predicate is used to obtain a task.
    * ``Task``  _Output_  JSON model with the obtained task.
    * ``Id ``  _Input_  string with the identifier of the task to obtain.
- ``wenet_task_manager_merge_task(MergedTask,TaskId,Task)``
  This predicate modifies a task model.
    * ``MergedTask``  _Output_  JSON model with the updated task.
    * ``TaskId``  _Input_  string with the identifier of the task to modify.
    * ``Task``  _Input_  JSON model of the task to merge with the current one.
- ``wenet_task_manager_add_transaction_into_task(AddedTaskTransaction,TaskId,Transaction)``
 This predicate is used to add a transaction into a task.
    * ``AddedTaskTransaction``  _Output_  JSON model with the added transaction.
    * ``TaskId``  _Input_  string with the identifier of the task to add the transaction.
    * ``Transaction``  _Output_  JSON model of the transaction to add.
- ``wenet_task_manager_add_message_into_transaction(AddedTransactionMessage,TaskId,TransactionId,Message)``
  This predicate is used to add a message into a transaction of a task.
    * ``AddedTransactionMessage``  _Output_  JSON model with the added message.
    * ``TaskId``  _Input_  string with the identifier of the task where is the transaction.
    * ``TransactionId``  _Input_  string with the identifier of the transaction to add the message.
    * ``Message``  _Input_  JSON model with the message to add into the transaction.
- ``wenet_id_of_task(Id, Task)``
  This predicate obtains the identifier of a task.
    * ``Id``  _Output_  string with the identifier of the task.
    * ``Task``  _Input_  JSON model of the task to obtain the identifier.
- ``wenet_task_type_id_of_task(Id, Task)``
  This predicate obtains the task type identifier of a task.
    * ``Id``  _Output_  string with the identifier of the task type.
    * ``Task``  _Input_  JSON model of the task to obtain the task type identifier.
- ``wenet_app_id_of_task(Id, Task)``
  This predicate obtains the application identifier of a task.
    * ``Id``  _Output_  string with the identifier of the application.
    * ``Task``  _Input_  JSON model of the task to obtain the application identifier.
- ``wenet_community_id_of_task(Id, Task)``
  This predicate obtains the community identifier of a task.
    * ``Id``  _Output_  string with the identifier of the community.
    * ``Task``  _Input_  JSON model of the task to obtain the community identifier.
- ``wenet_requester_id_of_task(Id, Task)``
  This predicate obtains the requester identifier of a task.
    * ``Id``  _Output_  string with the identifier of the requester.
    * ``Task``  _Input_  JSON model of the task to obtain the requester identifier.
- ``wenet_goal_of_task(Goal, Task)``
  This predicate obtains the goal of a task.
    * ``Goal``  _Output_  JSON model with the task goal.
    * ``Task``  _Input_  JSON model of the task to obtain the goal.
- ``wenet_goal_name_of_task(GoalName, Task)``
  This predicate obtains the goal name of a task.
    * ``GoalName``  _Output_  string with the task goal name.
    * ``Task``  _Input_  JSON model of the task to obtain the goal name.
- ``wenet_goal_description_of_task(GoalDescription, Task)``
  This predicate obtains the goal description of a task.
    * ``GoalDescription``  _Output_  string with the task goal description.
    * ``Task``  _Input_  JSON model of the task to obtain the goal description.
- ``wenet_goal_keywords_of_task(GoalKeywords, Task)``
  This predicate obtains the goal keywords of a task.
    * ``GoalKeywords``  _Output_  array of strings with the task goal keywords.
    * ``Task``  _Input_  JSON model of the task to obtain the goal keywords.
- ``wenet_is_closed_task(Task)``
  This predicate is **true** if the task is closed.
    * ``Task``  _Input_  JSON model of the task to check if it is closed.
- ``wenet_close_ts_of_task(CloseTs, Task)``
  This predicate obtains the time-stamp when the task is closed.
    * ``CloseTs``  _Output_  integer with the difference, in seconds, between the time when the task is closed
    and midnight, January 1, 1970, UTC.
    * ``Task``  _Input_  JSON model of the task to obtain the close time-stamp.
- ``wenet_attributes_of_task(Attributes, Task)``
  This predicate obtains the attributes of a task.
    * ``Attributes``  _Output_  JSON model with the task attributes.
    * ``Task``  _Input_  JSON model of the task to obtain the attributes.
- ``wenet_transactions_of_task(Transactions, Task)``
  This predicate obtains the transaction of a task.
    * ``Transactions``  _Output_  array of JSON models with the task transactions.
    * ``Task``  _Input_  JSON model of the task to obtain the transactions.
- ``wenet_id_of_transaction(Id, Transaction)``
  This predicate obtains the identifier of a transaction.
    * ``Id``  _Output_  string with the transaction identifier.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the identifier.
- ``wenet_task_id_of_transaction(TaskId, Transaction)``
  This predicate obtains the task identifier of a transaction.
    * ``TaskId``  _Output_  string with the task identifier.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the task identifier.
- ``wenet_label_of_transaction(Label, Transaction)``
  This predicate obtains the label of a transaction.
    * ``Label``  _Output_  string with the transaction label.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the label.
- ``wenet_attributes_of_transaction(Attributes, Transaction)``
  This predicate obtains the attributes of a transaction.
    * ``Attributes``  _Output_  JSON model with the transaction attributes.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the attributes.
- ``wenet_actioneer_id_of_transaction(ActioneerId, Transaction)``
  This predicate obtains the user that does a transaction.
    * ``ActioneerId``  _Output_  string with the transaction actioneer. Thus, the identifier
    of the user that has done the transaction.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the identifier.
- ``wenet_creation_ts_of_transaction(CreationTs, Transaction)``
  This predicate obtains the creation timestamp of a transaction.
    * ``CreationTs``  _Output_  integer with the transaction creation timestamp.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the timestamp.
- ``wenet_last_update_ts_of_transaction(LastUpdateTs, Transaction)``
  This predicate obtains the last update timestamp of a transaction.
    * ``LastUpdateTs``  _Output_  onteger with the transaction last update timestamp.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the timestamp.
- ``wenet_messages_of_transaction(Messages, Transaction)``
  This predicate obtains the messages of a transaction.
    * ``Messages``  _Output_  array of JSON models with the transaction messages.
    * ``Transaction``  _Input_  JSON model of the transaction to obtain the messages.


### Interaction protocol engine

The next predicates are used to interact with the interaction protocol engine component.

- ``wenet_interaction_protocol_engine_api_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the interaction protocol engine.
  For example if ``UserId = '2'`` and the URL of the interaction protocol engine API is
  **https://wenet.u-hopper.com/prod/interaction_protocol_engine** then
  ``wenet_interaction_protocol_engine_api_url_to(Url,['/states/users/',UserId])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/interaction_protocol_engine/states/users/2'``.
    * ``Url``  _Output_  string of the API point to the interaction protocol engine.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_interaction_protocol_engine_send_message(Sent,Message)``
  This predicate is used to send a message to the interaction protocol engine of another user.
    * ``Sent``  _Output_  JSON model with the sent message.
    * ``Message``  _Input_  JSON model with the message to send.
- ``wenet_interaction_protocol_engine_get_task_user_state(State,TaskId,UserId)``
  This predicate is used to obtain the state of a user in a task.
    * ``State``  _Output_  JSON model with the state of the user on the task.
    * ``TaskId``  _Input_  string identifier of the task to get the state.
    * ``UserId``  _Input_  string identifier of the user to get the state.
- ``wenet_interaction_protocol_engine_merge_task_user_state(MergedState,TaskId,UserId,NewState)``
  This predicate is used to change the state of a user in a task.
    * ``MergedState``  _Output_  JSON model with the modified state of the user on the task.
    * ``TaskId``  _Input_  string identifier of the task to modify the state.
    * ``UserId``  _Input_  string identifier of the user to modify the state.
    * ``NewState``  _Input_  JSON model with the new values for the state.
- ``wenet_interaction_protocol_engine_get_community_user_state(State,CommunityId,UserId)``
  This predicate is used to obtain the state of a user in a community.
    * ``State``  _Output_  JSON model with the state of the user on the community.
    * ``CommunityId``  _Input_  string identifier of the community to get the state.
    * ``UserId``  _Input_  string identifier of the user to get the state.
- ``wenet_interaction_protocol_engine_merge_community_user_state(MergedState,CommunityId,UserId,NewState)``
  This predicate is used to change the state of a user in a community.
    * ``MergedState``  _Output_  JSON model with the modified state of the user on the community.
    * ``CommunityId``  _Input_  string identifier of the community to modify the state.
    * ``UserId``  _Input_  string identifier of the user to modify the state.
    * ``NewState``  _Input_  JSON model with the new values for the state.
- ``wenet_interaction_protocol_engine_get_user_state(State,UserId)``
  This predicate is used to obtain the state of a user.
    * ``State``  _Output_  JSON model with the state of the user.
    * ``UserId``  _Input_  string identifier of the user to get the state.
- ``wenet_interaction_protocol_engine_merge_user_state(MergedState,UserId,NewState)``
  This predicate is used to change the state of a user.
    * ``MergedState``  _Output_  JSON model with the modified state of the user.
    * ``UserId``  _Input_  string identifier of the user to modify the state.
    * ``NewState``  _Input_  JSON model with the new values for the state.
- ``wenet_app_id_of_protocol_message(AppId, Message)``
  This predicate is used to obtain the identifier of the application of a message.
    * ``AppId``  _Output_  string with the application identifier of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_community_id_of_protocol_message(CommunityId, Message)``
  This predicate is used to obtain the identifier of the community of a message.
    * ``CommunityId``  _Output_  string with the community identifier of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_task_id_of_protocol_message(TaskId, Message)``
  This predicate is used to obtain the identifier of the task of a message.
    * ``TaskId``  _Output_  string with the task identifier of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_transaction_id_of_protocol_message(TransactionId, Message)``
  This predicate is used to obtain the identifier of the transaction of a message.
    * ``TransactionId``  _Output_  string with the transaction identifier of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_sender_of_protocol_message(Sender, Message)``
  This predicate is used to obtain the sender of a message.
    * ``SenderComponent``  _Output_  JSON model with the sender of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_sender_component_of_protocol_message(SenderComponent, Message)``
  This predicate is used to obtain the sender component of a message.
    * ``SenderComponent``  _Output_  string with the sender component of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_sender_id_of_protocol_message(SenderId, Message)``
  This predicate is used to obtain the sender identifier of a message.
    * ``SenderId``  _Output_  string with the sender identifier of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_receiver_of_protocol_message(Receiver, Message)``
  This predicate is used to obtain the receiver of a message.
    * ``ReceiverComponent``  _Output_  JSON model with the receiver of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_receiver_component_of_protocol_message(ReceiverComponent, Message)``
  This predicate is used to obtain the receiver component of a message.
    * ``ReceiverComponent``  _Output_  string with the receiver component of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_receiver_id_of_protocol_message(ReceiverId, Message)``
  This predicate is used to obtain the receiver identifier of a message.
    * ``ReceiverId``  _Output_  string with the receiver identifier of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_particle_of_protocol_message(Particle, Message)``
  This predicate is used to obtain the particle of a message.
    * ``Particle``  _Output_  string with the particle of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_content_of_protocol_message(Content, Message)``
  This predicate is used to obtain the content of a message.
    * ``Content``  _Output_  JSON model with the content of the message.
    * ``Message``  _Input_  JSON model with the message.
- ``wenet_new_protocol_message(Message,AppId,CommunityId,TaskId,TransactionId,SenderComponent,SenderUserId,ReceiverComponent,ReceiverUserId,Particle,Content)``
  This predicate is used to create a protocol message.
    * ``Message``  _Output_  JSON model with the created protocol message.
    * ``AppId``  _Input_  string with the application identifier for the message.
    * ``CommunityId``  _Input_  string with the community identifier for the message.
    * ``TaskId``  _Input_  string with the task identifier for the message.
    * ``TransactionId``  _Input_  string with the transaction identifier for the message.
    * ``SenderComponent``  _Input_  string with the component for the message sender.
    * ``SenderUserId``  _Input_  string with the identifier for the message sender.
    * ``ReceiverComponent``  _Input_  string with the component for the message receiver.
    * ``ReceiverUserId``  _Input_  string with the identifier for the message receiver.
    * ``Particle``  _Input_  string with the particle for the message.
    * ``Content``  _Input_  JSON model with the content for the message.
- ``wenet_interaction_protocol_engine_send_event(Sent,Event)``
  This predicate is used to send an event.
    * ``Sent``  _Output_  JSON model with the sent event.
    * ``Event``  _Input_  JSON model with the event to send.
- ``wenet_interaction_protocol_engine_delete_event(Id)``
  This predicate is used to cancel the send on an event.
    * ``Id``  _Input_  string with the identifier of the event to delete.
- ``wenet_id_of_protocol_event(Id, Event)``
  This predicate is used to obtain the identifier of an event.
    * ``Id``  _Output_  string with the identifier of the event.
    * ``Event``  _Input_  JSON model with the event.
- ``wenet_new_protocol_event(Event,AppId,CommunityId,TaskId,TransactionId,UserId,Delay,Particle,Content)``
  This predicate is used to create a protocol event.
    * ``Event``  _Output_  JSON model with the created protocol event.
    * ``AppId``  _Input_  string with the application identifier for the event.
    * ``CommunityId``  _Input_  string with the community identifier for the event.
    * ``TaskId``  _Input_  string with the task identifier for the event.
    * ``TransactionId``  _Input_  string with the transaction identifier for the event.
    * ``UserId``  _Input_  string with the component for the event sender.
    * ``Delay``  _Input_  number with the seconds to wait before sending the event.
    * ``Particle``  _Input_  string with the particle for the event.
    * ``Content``  _Input_  JSON model with the content for the event.
- ``wenet_new_interaction(Interaction,AppId,CommunityId,TaskTypeId,TaskId,SenderId,ReceiverId,TransactionLabel,TransactionAttributes,TransactionTs,MessageLabel,MessageAttributes,MessageTs)``
  This predicate is used to create a new interaction.
    * ``Interaction``  _Output_  JSON model with the created interaction.
    * ``AppId``  _Input_  string with the application identifier for the interaction.
    * ``CommunityId``  _Input_  string with the community identifier for the interaction.
    * ``TaskTypeId``  _Input_  string with the task type identifier for the interaction.
    * ``TaskId``  _Input_  string with the task identifier for the interaction.
    * ``SenderId``  _Input_  string with the identifier of the user that starts the interaction.
    * ``ReceiverId``  _Input_  string withthe identifier of the user that ends the interaction.
    * ``TransactionLabel``  _Input_  string with the label of the transaction that has started the interaction.
    * ``TransactionAttributes``  _Input_  JSON with the attributes of the transaction that has started the interaction.
    * ``TransactionTs``  _Input_  integer with the UTC epoch timestamp representing the time when the transaction has been done.
    * ``MessageLabel``  _Input_  string with the label of the message that has started the interaction.
    * ``MessageAttributes``  _Input_  JSON with the attributes of the message that has started the interaction.
    * ``MessageTs``  _Input_  integer with the UTC epoch timestamp representing the time when the message has been done.
- ``wenet_interaction_protocol_engine_add_interaction(Interaction)``
  This predicate is used to add a new interaction.
    * ``Interaction``  _Input_  JSON model with the interaction to add.


### Service

The next predicates are used to interact with the service component.

- ``wenet_service_api_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the service.
  For example if ``AppId = '2'`` and the URL of the service API is
  **https://wenet.u-hopper.com/prod/service** then ``wenet_service_api_url_to(Url,['/app/',AppId])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/service/app/2'``.
    * ``Url``  _Output_  string of the API point to the service.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_service_manager_get_app(App,Id)``
  This predicate is used to obtain an application.
    * ``App``  _Output_  JSON model with the obtained application data.
    * ``Id ``  _Input_  string with the identifier of the application to obtain.
- ``wenet_id_of_app(Id, App)``
  This predicate obtains the identifier of an application.
    * ``Id``  _Output_  string with the identifier of the application.
    * ``App``  _Input_  JSON model of the application to obtain the identifier.
- ``wenet_message_callback_url_of_app(Url, App)``
  This predicate obtains the URL to post the callback messages of an application.
    * ``Url``  _Output_  string with the URL to post the callback messages.
    * ``App``  _Input_  JSON model of the application to obtain the callback URL.
- ``wenet_service_get_app_users(Users,Id)``
  This predicate is used to obtain the users that are in an application.
    * ``Users``  _Output_  array of strings with the identifiers of users defined in the application.
    * ``Id``  _Input_  string with the identifier of the application to obtain the users.
- ``wenet_service_get_app_users(Users,App)``
  This predicate is used to obtain the users that are in an application.
    * ``Users``  _Output_  array of strings with the identifiers of users defined in the application.
    * ``App``  _Input_  JSON model with the application model.
- ``wenet_new_message(Callback,AppId,ReceiverId,Label,Attributes)``
  This predicate is used to create a callback message to send to an application.
    * ``Callback``  _Output_  JSON model of strings with the identifiers of users defined in the application.
    * ``AppId``  _Input_  string with the identifier of the application to post the message.
    * ``ReceiverId``  _Input_  string with the user identifier to post the message.
    * ``Label``  _Input_  string with the label of the message.
    * ``Attributes``  _Input_  JSON model with the attributes of the message.
- ``wenet_app_id_of_message(Id, Message)``
  This predicate obtains the application identifier of a message.
    * ``Id``  _Output_  string with the identifier of the application.
    * ``Task``  _Input_  JSON model of the message to obtain the application identifier.
- ``wenet_receiver_id_of_message(Id, Message)``
  This predicate obtains the receiver identifier of a message.
    * ``Id``  _Output_  string with the identifier of the receiver.
    * ``Task``  _Input_  JSON model of the message to obtain the receiver identifier.
- ``wenet_label_of_message(Label, Message)``
  This predicate obtains the label of a message.
    * ``Label``  _Output_  string with the label.
    * ``Task``  _Input_  JSON model of the message to obtain the label.
- ``wenet_attributes_of_message(Attributes, Message)``
  This predicate obtains the attributes of a message.
    * ``Attributes``  _Output_  JSON model with the attributes.
    * ``Task``  _Input_  JSON model of the message to obtain the attributes.


### Incentive server


The next predicates are used to interact with the incentive server component.

- ``wenet_incentive_server_api_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the incentive server.
  For example if the URL of the incentive server API is
  **https://wenet.u-hopper.com/prod/incentive_server** then ``wenet_incentive_server_api_url_to(Url,['/Tasks/TaskStatus/'])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/incentive_server/Tasks/TaskStatus/'``.
    * ``Url``  _Output_  string of the API point to the incentive server.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_incentive_server_update_task_transaction_status(Updated,Status)``
  This predicate is used to update the transaction status.
    * ``Updated``  _Output_  JSON model with the updated status.
    * ``Status``  _Input_  JSON model with the transaction status to update.
- ``wenet_incentive_server_update_task_transaction_status(Status,UserId,CommunityId,AppId,TaskTypeId,Label,Count)``
  This predicate is used to create the transaction status.
    * ``Status``  _Output_  JSON model with the status.
    * ``UserId``  _Input_  string with the user identifier of the status.
    * ``CommunityId``  _Input_  string with the community identifier of the status.
    * ``AppId``  _Input_  string with the application identifier of the status.
    * ``TaskTypeId``  _Input_  string with the task type identifier of the status.
    * ``Label``  _Input_  string with the label of the done transaction.
    * ``Count``  _Input_  integer with the times the transaction is done by the user, for the task type in the community.
- ``wenet_incentive_server_update_task_type_status(Updated,Status)``
  This predicate is used to update the task type status.
    * ``Updated``  _Output_  JSON model with the updated status.
    * ``Status``  _Input_  JSON model with the transaction status to update.
- ``wenet_new_task_type_status(Status,UserId,CommunityId,AppId,TaskTypeId,Count)``
  This predicate is used to create the task type status.
    * ``Status``  _Output_  JSON model with the status.
    * ``UserId``  _Input_  string with the user identifier of the status.
    * ``CommunityId``  _Input_  string with the community identifier of the status.
    * ``AppId``  _Input_  string with the application identifier of the status.
    * ``TaskTypeId``  _Input_  string with the task type identifier of the status.
    * ``Count``  _Input_  integer with the times a task for the task type is created by the user in the community.


### Social context builder

The next predicates are used to interact with the social context builder component.

- ``wenet_social_context_builder_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the social context builder.
  For example if the URL of the social context builder API is
  **https://wenet.u-hopper.com/prod/social_context_builder** , ``UserId = '2'`` and ``TaskId = '1'``
  then ``wenet_social_context_builder_url_to(Url,['/social/explanations/',UserId,'/',TaskId,'/'])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/social_context_builder/social/explanations/2/1'``.
    * ``Url``  _Output_  string of the API point to the social context builder.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_social_context_builder_post_preferences(Ranking,UserId,TaskId,Users)``
  Post the preferences of a user. This is used to calculate the ranking of the volunteers.
    * ``Ranking``  _Output_  array of string with the rabked user identifier.
    * ``UserId``  _Input_  string with the user identifier.
    * ``TaskId``  _Input_  string with the task identifier.
    * ``Users``  _Input_  array of string with the identifiers of the preferred users.
- ``wenet_social_context_builder_retrieve_social_explanation(SocialExplanation,UserId,TaskId)``
  This predicate is used to get the social explanation to choose a user.
    * ``SocialExplanation``  _Output_  JSON model with the social explanation.
    * ``UserId``  _Input_  string with the user identifier.
    * ``TaskId``  _Input_  string with the task identifier.
- ``wenet_description_of_social_explanation(Description, SocialExplanation)``
  This predicate is used to get the description of the social explanation.
    * ``Description``  _Output_  string with the description of the explanation.
    * ``SocialExplanation``  _Input_  JSON model with the social explanation.
- ``wenet_summary_of_social_explanation(Summary, SocialExplanation)``
  This predicate is used to get the summary of the social explanation.
    * ``Summary``  _Output_  string with the summary of the explanation.
    * ``SocialExplanation``  _Input_  JSON model with the social explanation.
- ``wenet_social_context_builder_post_preferences_answers(Ranking,UserId,TaskId,UserAnswers)``
  Post the preferences answers of a user. This is used to calculate the ranking of the answers.
    * ``Ranking``  _Output_  array of JSON models with the ranked user answers.
    * ``UserId``  _Input_  string with the user identifier.
    * ``TaskId``  _Input_  string with the task identifier.
    * ``UserAnswers``  _Input_  array of Json models sith the user and answers to rank.
- ``wenet_social_context_builder_put_preferences_answers_update(UserId,TaskId,Selected,Ranking)``
  This predicate is used to create a user message that can be used to notify about the interaction between users.
    * ``UserId``  _Input_  string with the user that has selected teh answer.
    * ``TaskId``  _Input_  string with the identifier of the task where the answer is selected.
    * ``Selected``  _Input_  integer with the index of the selected answer of the ranking. It starts with 0.
    * ``Ranking``  _Input_  array of JSON models with the ranked user answers where is the selected one.
- ``wenet_user_id_of_user_answer(UserId, UserAnswer)``
  This predicate is used to get the user identifier of a user answer.
    * ``UserId``  _Output_  string with the user identifier.
    * ``UserAnswer``  _Input_  JSON model with the user answer.
- ``wenet_answer_of_user_answer(Answer, UserAnswer)``
  This predicate is used to get the answer of a user answer.
    * ``Answer``  _Output_  string with the answer.
    * ``UserAnswer``  _Input_  JSON model with the user answer.
- ``wenet_new_user_answer(UserAnswer, UserId, Answer)``
  This predicate is used to create a new user answer.
    * ``UserAnswer``  _Output_  JSON model with the user answer.
    * ``UserId``  _Input_  string model with the user identifier.
    * ``Answer``  _Input_  string with the answer.
- ``wenet_social_context_builder_post_social_notification(Message)``
  This predicate is used to notify the social context builder about an interaction between users.
    * ``Message``  _Input_  JSON model with the interaction message between users.
- ``wenet_new_user_message(UserAnswer, UserId, Answer)``
  This predicate is used to create a user message that can be used to notify about the interaction between users.
    * ``UserMessage``  _Output_  JSON model with the interaction message between the users.
    * ``TaskId``  _Input_  string with the identifier of the task where the interaciton is done.
    * ``TransactionId``  _Input_  string with the identifier of the task transaction.
    * ``Timestamp``  _Input_  number with the UTC epoch timestamp when the interaction is done.
    * ``SenderId``  _Input_  string with the identifier of the user that started the interaction.
    * ``Message``  _Input_  JSON model with the message that is sent to the user.


### Personal context builder

The next predicates are used to interact with the personal context builder component.

- ``wenet_personal_context_builder_url_to(Url,Paths)``
  This predicate is used to obtain the URL to interact with the API of the personal context builder.
  For example if the URL of the personal context builder API is
  **https://wenet.u-hopper.com/prod/personal_context_builder** , ``Latitude = 0.2`` , ``Longitude = 0.1``
  and ``NumUsers = 4``
  then ``wenet_personal_context_builder_url_to(Url,['/closest/?latitude=',Latitude,'&longitude=',Longitude,'&nb_user_max=',NumUsers])``
  will produce ``URL = 'https://wenet.u-hopper.com/prod/personal_context_builder/closest/?latitude=0.2&longitude=0.1&nb_user_max=4'``.
    * ``Url``  _Output_  string of the API point to the personal context builder.
    * ``Paths``  _Input_  array of values used to build the API point.
- ``wenet_personal_context_builder_locations(Locations,Users)``
  This predicate is used to obtain the locations of a set of users.
    * ``Locations``  _Output_  array of JSON models with the locations of the users.
    * ``Users``  _Input_  array of strings with the identifiers of the users to get the locations.
- ``wenet_user_id_of_location(UserId,Location)``
  This predicate is used to obtain the user identifier of a location.
    * ``UserId``  _Output_  string with the user identifier of the location.
    * ``Location``  _Input_  JSON model with the location to get the user identifier.
- ``wenet_users_of_locations(Users,Locations)``
  This predicate is used to obtain the user identifiers of some locations.
    * ``Users``  _Output_  array of strings with the user identifiers of the locations.
    * ``Locations``  _Input_  array of JSON model with the locations to get the user identifiers.
- ``wenet_longitude_of_location(Longitude,Locations)``
  This predicate is used to obtain the longitude of a location.
    * ``Longitude``  _Output_  number with the longitude of the location.
    * ``Location``  _Input_  JSON model with the location to get the longitude.
- ``wenet_latitude_of_location(Latitude,Locations)``
  This predicate is used to obtain the latitude of a location.
    * ``Latitude``  _Output_  number with the latitude of the location.
    * ``Location``  _Input_  JSON model with the location to get the latitude.
- ``wenet_personal_context_builder_closest(ClosestUsers,Latitude,Longitude,NumUsers)``
  This predicate is used to obtain the closest users into a location.
    * ``ClosestUsers``  _Output_  array of JSON models with the closest users into a location.
    * ``Latitude``  _Input_  number with the location latitude.
    * ``Longitude``  _Input_  number with the location longitude.
    * ``NumUsers``  _Input_  number with the number maximum users to get.
- ``wenet_user_id_of_closest(UserId,ClosestUser)``
  This predicate is used to obtain the identifier of the user in the closest user location.
    * ``UserId``  _Output_  string with the user identifier of the closest user.
    * ``ClosestUser``  _Input_  JSON model with the closest user.
- ``wenet_distance_of_closest(Distance,ClosestUser)``
  This predicate is used to obtain the distance in the closest user location.
    * ``Distance``  _Output_  number distance in meters of the closest user to the location.
    * ``ClosestUser``  _Input_  JSON model with the closest user.
- ``wenet_users_of_closest(Users,ClosestUsers)``
  This predicate is used to obtain the user identifiers of a set of closest users.
    * ``Users``  _Output_  array of string with the user identifier of the closest users.
    * ``ClosestUsers``  _Input_  array of JSON models with the closest users.
- ``wenet_distance_between_locations(Distance,Source,Target)``
  This predicate is used to calculate the haversine distance between two locations.
    * ``Distance``  _Output_  number with the distance between the locations in meters.
    * ``Source``  _Input_  JSON model with the location as source to calculate the distance.
    * ``Target``  _Input_  JSON model with the location as target to calculate the distance.
- ``wenet_distance_between_locations(Distance,SourceLatitude,SourceLongitude,TargetLatitude,TargetLongitude)``
  This predicate is used to calculate the haversine distance between two locations.
    * ``Distance``  _Output_  number with the distance between the locations in meters.
    * ``SourceLatitude``  _Input_  number with the source latitude to calculate the distance.
    * ``SourceLongitude``  _Input_  number with the source longitude to calculate the distance.
    * ``TargetLatitude``  _Input_  number with the target latitude to calculate the distance.
    * ``TargetLongitude``  _Input_  number with the target longitude to calculate the distance.
- ``wenet_filter_locations_by_distance(Filtered,Source,Locations,Min,Max)``
  This predicate filters a set of locations if they are on a range to another location.
    * ``Filtered``  _Output_  array of JSON models with the locations that are in the range distance.
    * ``Source``  _Input_  JSON model with the location to calculate the distance to.
    * ``Locations``  _Input_  array of JSON models with the locations to filter.
    * ``Min``  _Input_  number with the minimum distance in meters to the source location. The distance is inclusive.
    * ``Max``  _Input_  number with the maximum distance in meters to the source location. The distance is inclusive.


## Deprecated predicates

The  predicates of this section are only for backward compatibility, but you should avoid
to use them.

- ``notify_incentive_server(Action,Message)``
  This action notifies the incentive server about a change of the task.
  This function is no more available on the incentive server API. So nothings do.
    * ``Action``  _Input_  string with the action that has changed the task.
    * ``Message``  _Input_  string that explains the change.

- ``wenet_incentive_server_update_task_status(Updated,Status)``
  This predicate is used to update the task status.
  This function is no more available on the incentive server API. So nothings do.
    * ``Updated``  _Output_  JSON model with the updated status.
    * ``Status``  _Input_  JSON model with the task status to update.

- ``wenet_new_task_status(Status,AppId,UserId,CommunityId,TaskId,Action,Message)``
  This predicate is used to create the task status.
  This data model is no more used.
    * ``Status``  _Output_  JSON model with the status.
    * ``AppId``  _Input_  string with the application identifier of the status.
    * ``UserId``  _Input_  string with the user identifier of the status.
    * ``CommunityId``  _Input_  string with the community identifier of the status.
    * ``TaskId``  _Input_  string with the task identifier of the status.
    * ``Action``  _Input_  string with the action of the status.
    * ``Message``  _Input_  string with the message of the status.

- ``wenet_social_context_builder_update_preferences(UserId,TaskId,Users)``
  This predicate is deprecated use wenet_social_context_builder_post_preferences instead.
    * ``UserId``  _Input_  string with the user identifier.
    * ``TaskId``  _Input_  string with the task identifier.
    * ``Users``  _Input_  array of string with the identifiers of the preferred users.

- ``notify_volunteers_to_social_context_builder(Volunteers,UserId)``
  This predicate is deprecated use volunteers_ranking instead.
    * ``Volunteers``  _Input_  array of strings with the user identifiers that has volunteer to do a task.
    * ``UserId``  _Input_  string user identifier to be a volunteer.

- ``wenet_relationships_of_profile(Relationships,Profile)``
  The profile does not have mpore relationships use get_relationships instead.
    * ``Relationships``  _Output_  array of JSON models with the relationships of the profile.
    * ``Profile`` _Input_  JSON model to get the relationships.

- ``wenet_user_id_of_relationship(UserId, Relationship)``
  The relationship define new fields and teh userId is changes to targetId.
  Use wenet_target_id_of_relationship instead.
    * ``UserId``  _Output_  string eith the user identifier of the relationship.
    * ``Relationship``  _Input_  JSON model to get the user identifier.
