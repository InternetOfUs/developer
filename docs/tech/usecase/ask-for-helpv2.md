---
title: Ask for Help v2
sidebar_label: Ask for Help v2
---

## Models

### Task

The Task of the _Ask for Help v2_ use case is characterised by the following parameters:

<!-- * `taskTypeId` will be defined soon; -->
* `goal.name` contains the question asked by a user.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `domain` | _enum_ [`studying_career`, `local_university`, `local_things`, `physical_activity`, `cultural_interests`, `food_and_cooking`, `cinema_theatre`, `music`, `arts_and_crafts`, `life_ponders`, `varia_misc`] | The chosen domain of the question |
| `domainInterest` | _enum_ [`similar`, `indifferent`, `different`] | The kind of interest in the domain the user should have to receive the question |
| `beliefsAndValues` | _enum_ [`similar`, `indifferent`, `different`] | The kind of similarity in beliefs and values the user should have to receive the question |
| `sensitive` | _boolean_ | Whether the question is sensitive or not, if it is sensitive the bot will let other people know to take extra care in answering the question |
| `anonymous` | _boolean_ | Whether to ask the question anonymously or not, if anonymous is chosen then the name of the user will not be shown |
| `socialCloseness` | _enum_ [`similar`, `indifferent`, `different`] | The kind of social closeness the user should have to receive the question |
| `positionOfAnswerer` | _enum_ [`nearby`, `anywhere`] | How close the users should be to receive the question, if nearby is chosen the question has not the possibility to be postponed because the question requires a fast answer |

### Transaction

The following transactions are supported:

* answer to a question;
* ignore a question;
* report a question;
* pick the best answer;
* ask some more users;
* report an answer.

#### Answer to a question

It is identified by the label `answerTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `answer` | _string_ | The answer given by the user to the question |
| `anonymous` | _boolean_ | Whether to answer the question anonymously or not, if anonymous is chosen then the name of the user will not be shown |

#### Ignore a question

It is identified by the label `notAnswerTransaction`.

#### Report a question

It is identified by the label `reportQuestionTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `reason` | _enum_ [`abusive`, `spam`] | The reason why the question was reported |

#### Pick the best answer

It is identified by the label `bestAnswerTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `transactionId` | _string_ | The id of the picked answer transaction |
| `reason` | _string_ | The reason why the specific answer was picked |
| `helpful` | _enum_ [`1`, `2`, `3`, `4`, `5`] | How well the bot is good in connecting with users following intentions |

#### Ask some more users

It is identified by the label `moreAnswerTransaction`.

#### Report an answer

It is identified by the label `reportAnswerTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `transactionId` | _string_ | The id of the answer transaction that was reported |
| `reason` | _enum_ [`abusive`, `spam`] | The reason why the specific answer was reported |

### Message

The following messages are supported:

* notify there is a new question to answer to;
* notify there is a new answer to a question;
* notify the provided answer has been marked as the preferred one.

#### Question to answer

It is identified by the label `QuestionToAnswerMessage`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `taskId` | _string_ | The id of the task associated with the question |
| `question` | _string_ | The question to answer to |
| `userId` | _string_ | The id of the user who proposed the question |
| `sensitive` | _boolean_ | Whether the question is sensitive or not, if it is sensitive the bot will let other people know to take extra care in answering the question |
| `anonymous` | _boolean_ | Whether to ask the question anonymously or not, if anonymous is chosen then the name of the user will not be shown |
| `positionOfAnswerer` | _enum_ [`nearby`, `anywhere`] | The position of user should answer the question |

#### Answer to question

It is identified by the label `AnsweredQuestionMessage`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `taskId` | _string_ | The id of the task associated with the question |
| `question` | _string_ | The question to answer to |
| `transactionId` | _string_ | The id of the transaction associated to the answer |
| `answer` | _string_ | The answer to the question |
| `userId` | _string_ | The id of the user who answered the question |
| `anonymous` | _boolean_ | Whether the user prefers to answer the question anonymously or not, if anonymous is chosen then the name of the user will not be shown |

:::note
If access to the complete list of answers is required, this can be done by accessing the updated details of a task.
:::

#### Answer picked

It is identified by the label `AnsweredPickedMessage`.

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `taskId` | _string_ | The id of the task associated with the question |
| `question` | _string_ | The question for which was picked the answer |
| `transactionId` | _string_ | The id of the transaction associated to the answer |
