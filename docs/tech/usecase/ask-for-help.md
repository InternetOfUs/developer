---
title: Ask for Help
sidebar_label: Ask for Help
---

## Models

### Task

The Task of the _Ask for Help_ use case is characterised by the following parameters:

* `taskTypeId` set to `ask4help`;
* `goal.name` contains the question asked by an user,

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `kindOfAnswerer` | _enum_ [`different than me`, `similar to me`, `anyone`] | The type of user shoud answer the question |

### Transaction

The following transactions are supported.

* answer to a question
* ignore a question
* pick the best answer
* ask some more users
* report a question
* report an answer

#### Answer to a question

It is identified by the label `answerTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `answer` | _string_ | The answer to the question |

#### Ignore a question

It is identified by the label `notAnswerTransaction`.

#### Pick the best answer

It is identified by the label `bestAnswerTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `transactionId` | _string_ | The id of the picked answer transaction |
| `reason` | _string_ \| _null_ | The reason why the specific answer was picked |

#### Ask some more users

It is identified by the label `moreAnswerTransaction`.

#### Report question

It is identified by the label `reportQuestionTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `reason` | _string_ \| _null_ | The reason why the specific answer was picked |
| `comment` | _string_ \| _null_ | A specific comment by the reporting user |

#### Report answer

It is identified by the label `reportAnswerTransaction`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `transactionId` | _string_ | The id of the picked answer transaction |
| `reason` | _string_ \| _null_ | The reason why the specific answer was picked |
| `comment` | _string_ \| _null_ | A specific comment by the reporting user |

### Message

The following messages are supported.

* notify there is a new question to answer to
* notify there is a new answer to a question
* notify the provided answer has been marked as the preferred one

#### Question to answer

It is identified by the label `QuestionToAnswerMessage`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `taskId` | _string_ | The id of the task assiciated with the question |
| `question` | _string_ | The question to answer to |
| `userId` | _string_ | The id of the user who proposed the question |

#### Answer to question

It is identified by the label `AnsweredQuestionMessage`.

Its attributes are:

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `taskId` | _string_ | The id of the task assiciated with the question |
| `answer` | _string_ | The answer to the question |
| `transactionId` | _string_ | The id of the transaction associated to the answer |
| `userId` | _string_ | The id of the user who answered the question |

:::note
If access to the complete list of answers is required, this can be done by accessing the updated details of a task.
:::

#### Answer picked

It is identified by the label `AnsweredPickedMessage`.

| Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `taskId` | _string_ | The id of the task assiciated with the question |
| `transactionId` | _string_ | The id of the transaction associated to the answer |
