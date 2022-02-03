---
title: Ask for Help v2
sidebar_label: Ask for Help v2
---

## Models

### Task

The Task of the _Ask for Help v2_ use case is characterised by the following parameters:

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
| `maxUsers` | _integer_ | The maximum number of users to which propose the question and also in the case the user requests to ask to more users |

The app logic defined in the hub contains in the section `Attributes`:

```json
{
  "type": "object",
  "properties": {
    "domain": {
      "description": "The chosen domain of the question",
      "type": "string",
      "nullable": false,
      "enum": {
        "0": "studying_career",
        "1": "local_university",
        "2": "local_things",
        "3": "physical_activity",
        "4": "cultural_interests",
        "5": "food_and_cooking",
        "6": "cinema_theatre",
        "7": "music",
        "8": "arts_and_crafts",
        "9": "life_ponders",
        "10": "varia_misc"
      }
    },
    "domainInterest": {
      "description": "The kind of interest in the domain the user should have to receive the question",
      "type": "string",
      "nullable": false,
      "enum": {
        "0": "similar",
        "1": "indifferent",
        "2": "different"
      }
    },
    "beliefsAndValues": {
      "description": "The kind of similarity in beliefs and values the user should have to receive the question",
      "type": "string",
      "nullable": false,
      "enum": {
        "0": "similar",
        "1": "indifferent",
        "2": "different"
      }
    },
    "sensitive": {
      "description": "Whether the question is sensitive or not, if it is sensitive the bot will let other people know to take extra care in answering the question",
      "type": "boolean",
      "default": "false",
      "nullable": false
    },
    "anonymous": {
      "description": "Whether to ask the question anonymously or not, if anonymous is chosen then the name of the user will not be shown",
      "type": "boolean",
      "default": "false",
      "nullable": false
    },
    "socialCloseness": {
      "description": "The kind of social closeness the user should have to receive the question",
      "type": "string",
      "nullable": false,
      "enum": {
        "0": "similar",
        "1": "indifferent",
        "2": "different"
      }
    },
    "positionOfAnswerer": {
      "description": "How close the users should be to receive the question, if nearby is chosen the question has not the possibility to be postponed because the question requires a fast answer",
      "type": "string",
      "nullable": false,
      "enum": {
        "0": "nearby",
        "1": "anywhere"
      }
    },
    "maxUsers": {
      "description": "The maximum number of users to which propose the question and also in the case the user requests to ask to more users",
      "type": "integer",
      "nullable": false,
      "minimum": 1,
      "default": "5"
    }
  },
  "required": {
    "0": "domain",
    "1": "domainInterest",
    "2": "beliefsAndValues",
    "3": "sensitive",
    "4": "anonymous",
    "5": "socialCloseness",
    "6": "positionOfAnswerer",
    "7": "maxUsers"
  }
}
```

### Transaction

The following transactions are supported:

* answer to a question;
* ignore a question;
* report a question;
* pick the best answer;
* ask some more users;
* report an answer.

The app logic defined in the hub contains in the section `Transactions`:

```json
{
  "answerTransaction": {
    "title": "Answer to a question",
    "type": "object",
    "properties": {
      "answer": {
        "type": "string",
        "description": "The answer given by the user to the question"
      },
      "anonymous": {
        "description": "Whether to answer the question anonymously or not, if anonymous is chosen then the name of the user will not be shown",
        "type": "boolean",
        "default": "false",
        "nullable": false
      }
    },
    "required": {
      "0": "answer",
      "1": "anonymous"
    }
  },
  "notAnswerTransaction": {
    "title": "Ignore a question",
    "type": "object",
    "nullable": true
  },
  "reportQuestionTransaction": {
    "title": "Report a question",
    "type": "object",
    "properties": {
      "reason": {
        "description": "The reason why the question was reported",
        "type": "string",
        "nullable": false,
        "enum": {
          "0": "abusive",
          "1": "spam"
        }
      }
    },
    "required": {
      "0": "reason"
    }
  },
  "bestAnswerTransaction": {
    "title": "Pick the best answer",
    "type": "object",
    "properties": {
      "transactionId": {
        "description": "The id of the picked answer transaction",
        "type": "string",
        "nullable": false
      },
      "reason": {
        "description": "The reason why the specific answer was picked",
        "type": "string",
        "nullable": false
      },
      "helpful": {
        "description": "How well the bot is good in connecting with users following intentions",
        "type": "string",
        "nullable": false,
        "enum": {
          "0": "notAtAllHelpful",
          "1": "slightlyHelpful",
          "2": "somewhatHelpful",
          "3": "veryHelpful",
          "4": "extremelyHelpful"
        }
      }
    },
    "required": {
      "0": "transactionId",
      "1": "reason",
      "2": "helpful"
    }
  },
  "moreAnswerTransaction": {
    "title": "Ask some more users",
    "type": "object",
    "nullable": true
  },
  "reportAnswerTransaction": {
    "title": "Report an answer",
    "type": "object",
    "properties": {
      "transactionId": {
        "description": "The id of the answer transaction that was reported",
        "type": "string",
        "nullable": false
      },
      "reason": {
        "description": "The reason why the specific answer was reported",
        "type": "string",
        "nullable": false,
        "enum": {
          "0": "abusive",
          "1": "spam"
        }
      }
    },
    "required": {
      "0": "transactionId",
      "1": "reason"
    }
  }
}
```

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
| `helpful` | _enum_ [`notAtAllHelpful`, `slightlyHelpful`, `somewhatHelpful`, `veryHelpful`, `extremelyHelpful`] | How helpful is the bot in connecting with users following intentions |

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

The app logic defined in the hub contains in the section `Callbacks`:

```json
{
  "QuestionToAnswerMessage": {
    "title": "Question to answer",
    "type": "object",
    "properties": {
      "taskId": {
        "description": "The id of the task associated with the question",
        "type": "string",
        "nullable": false
      },
      "question": {
        "description": "The question to answer to",
        "type": "string",
        "nullable": false
      },
      "userId": {
        "description": "The id of the user who proposed the question",
        "type": "string",
        "nullable": false
      },
      "sensitive": {
        "description": "Whether the question is sensitive or not, if it is sensitive the bot will let other people know to take extra care in answering the question",
        "type": "boolean",
        "default": "false",
        "nullable": false
      },
      "anonymous": {
        "description": "Whether to ask the question anonymously or not, if anonymous is chosen then the name of the user will not be shown",
        "type": "boolean",
        "default": "false",
        "nullable": false
      },
      "positionOfAnswerer": {
        "description": "How close the users should be to receive the question, if nearby is chosen the question has not the possibility to be postponed because the question requires a fast answer",
        "type": "string",
        "nullable": false,
        "enum": {
          "0": "nearby",
          "1": "anywhere"
        }
      }
    },
    "required": {
      "0": "taskId",
      "1": "question",
      "2": "userId",
      "3": "sensitive",
      "4": "anonymous",
      "5": "positionOfAnswerer"
    }
  },
  "AnsweredQuestionMessage": {
    "title": "Answer to question",
    "type": "object",
    "properties": {
      "taskId": {
        "description": "The id of the task associated with the question",
        "type": "string",
        "nullable": false
      },
      "question": {
        "description": "The question to answer to",
        "type": "string",
        "nullable": false
      },
      "transactionId": {
        "description": "The id of the transaction associated to the answer",
        "type": "string",
        "nullable": false
      },
      "answer": {
        "description": "The answer to the question",
        "type": "string",
        "nullable": false
      },
      "userId": {
        "description": "The id of the user who answered the question",
        "type": "string",
        "nullable": false
      },
      "anonymous": {
        "description": "Whether the user prefers to answer the question anonymously or not, if anonymous is chosen then the name of the user will not be shown",
        "type": "boolean",
        "default": "false",
        "nullable": false
      }
    },
    "required": {
      "0": "taskId",
      "1": "question",
      "2": "transactionId",
      "3": "answer",
      "4": "userId",
      "5": "anonymous"
    }
  },
  "AnsweredPickedMessage": {
    "title": "Answer picked",
    "type": "object",
    "properties": {
      "taskId": {
        "description": "The id of the task associated with the question",
        "type": "string",
        "nullable": false
      },
      "question": {
        "description": "The question for which was picked the answer",
        "type": "string",
        "nullable": false
      },
      "transactionId": {
        "description": "The id of the transaction associated to the answer",
        "type": "string",
        "nullable": false
      }
    },
    "required": {
      "0": "taskId",
      "1": "question",
      "2": "transactionId"
    }
  }
}
```

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
| `positionOfAnswerer` | _enum_ [`nearby`, `anywhere`] | How close the users should be to receive the question, if nearby is chosen the question has not the possibility to be postponed because the question requires a fast answer |

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

### Norms

The following norms are supported:

* when the task is created filter the possible users to ask about and ask them;
* notify user if it can help with a question;
* provide an answer to a question;
* notify the questioner about the answer;
* notify to the users about best answer;
* notify the user that its answer is picked;
* ask more users;
* nothing to do with some transactions only store them.

The app logic defined in the hub contains in the section `Norms`:

```json
[
  {
    "description": "When the task is created filter the possible users to ask about and ask them",
    "whenever": "is_received_created_task() and who_to_ask(Users)",
    "thenceforth": "add_created_transaction() and send_messages(Users,'notifyNewQuestionAndAnswer',json([]))",
    "ontology": ":- use_module(library(random)).  :- dynamic who_to_ask/1, users_by_closeness/2, users_by_social_closeness/2, users_by_beliefs_and_values/2, users_by_domain_interest/2, get_profile_attribues_by_beliefs_and_values/1, get_profile_attribues_by_domain_interest/1, domain_attributes/2, attributes_similars_to_question/1 .  who_to_ask(Users) :- ( get_task_state_attribute(Unasked,'unaskedUserIds') -> true ; ( get_app_users_except_me(UsersExceptMe), random_permutation(AppUsers,UsersExceptMe), put_task_state_attribute('appUsers',AppUsers), users_by_closeness(ClosenessUsers,AppUsers), users_by_social_closeness(SocialClosenessUsers,AppUsers), wenet_product_user_values(Tmp1,ClosenessUsers,SocialClosenessUsers), users_by_beliefs_and_values(BeliefsAndValuesUsers,AppUsers), wenet_product_user_values(Tmp2,Tmp1,BeliefsAndValuesUsers), users_by_domain_interest(DomainInterestUsers,AppUsers), wenet_product_user_values(Tmp3,Tmp2,DomainInterestUsers), wenet_sort_user_values_by_value(Sorted,Tmp3), reverse(Sorted,WhoToAsk), put_task_state_attribute('whoToAskUsers',WhoToAsk), wenet_user_values_to_user_ids(Unasked,WhoToAsk) ) ), !, get_task_attribute_value(MaxUsers,'maxUsers'), ( ( append(Users,NewUnasked,Unasked), length(Users,MaxUsers) ) -> true ; ( Users = Unasked, NewUnasked = [] )  ), !, put_task_state_attribute('unaskedUserIds',NewUnasked), !, retractall(who_to_ask(_)), asserta(who_to_ask(Users)).  users_by_closeness(ClosenessUsers,Users) :- ( ( get_task_attribute_value(PositionOfAnswerer,'positionOfAnswerer'), =(PositionOfAnswerer,'nearby') ) -> normalized_closeness(ClosenessUsers,Users,1000000)  ; wenet_initialize_user_values(ClosenessUsers,Users,1.0) ), put_task_state_attribute('closenessUsers',ClosenessUsers).  users_by_social_closeness(SocialClosenessUsers,Users) :- ( ( get_task_attribute_value(SocialClosenessAttr,'socialCloseness'), not(=(SocialClosenessAttr,'indifferent')) ) -> ( normalized_social_closeness(Socialness,Users), ( =(SocialClosenessAttr,'similar') -> SocialClosenessUsers = Socialness ; wenet_negate_user_value(SocialClosenessUsers,Socialness) ) )  ; wenet_initialize_user_values(SocialClosenessUsers,Users,1.0) ), put_task_state_attribute('socialClosenessUsers',SocialClosenessUsers).  users_by_beliefs_and_values(BeliefsAndValuesUsers,Users) :- ( ( get_task_attribute_value(BeliefsAndValuesAttr,'beliefsAndValues'), not(=(BeliefsAndValuesAttr,'indifferent')) ) -> ( get_profile_attribues_by_beliefs_and_values(Attributes), normalized_diversity(Diversity,Users,Attributes), ( =(BeliefsAndValuesAttr,'similar') -> wenet_negate_user_value(BeliefsAndValuesUsers,Diversity) ; BeliefsAndValuesUsers = Diversity ) )  ; wenet_initialize_user_values(BeliefsAndValuesUsers,Users,1.0) ), put_task_state_attribute('beliefsAndValuesUsers',BeliefsAndValuesUsers).  get_profile_attribues_by_beliefs_and_values(['meanings.excitement','meanings.promotion','meanings.existence','meanings.suprapersonal','meanings.interactive','meanings.normative','meanings.extraversion','meanings.agreeableness','meanings.consientiousness','meanings.neuroticism','meanings.openness']).  users_by_domain_interest(DomainInterestUsers,Users) :- ( ( get_task_attribute_value(DomainInterestAttr,'domainInterest'), not(=(DomainInterestAttr,'indifferent')) ) -> ( get_profile_attribues_by_domain_interest(Attributes), normalized_diversity(Diversity,Users,Attributes), ( =(DomainInterestAttr,'similar') -> wenet_negate_user_value(DomainInterestUsers,Diversity) ; DomainInterestUsers = Diversity ) )  ; wenet_initialize_user_values(DomainInterestUsers,Users,1.0) ), put_task_state_attribute('domainInterestUsers',DomainInterestUsers).   get_profile_attribues_by_domain_interest(Attributes) :- get_task_attribute_value(Domain,'domain'), domain_attributes(Domain,Attributes), !, retractall(get_profile_attribues_by_domain_interest(_)), asserta(get_profile_attribues_by_domain_interest(Attributes)) .  domain_attributes('studying_career',['competences.u_active','competences.u_read','competences.u_essay','competences.u_org','competences.u_balance','competences.u_assess','competences.u_theory','competences.u_pract']). domain_attributes('local_university',['competences.c_locfac','competences.c_accom']). domain_attributes('local_things',['competences.c_accom']). domain_attributes('physical_activity',['competences.c_team_sp','competences.c_ind_sp','competences.c_watch_sp']). domain_attributes('cultural_interests',['competences.c_lit','competences.c_creatlit','competences.c_perf_art','competences.c_musgall']). domain_attributes('food_and_cooking',['competences.c_food','competences.c_eating']). domain_attributes('cinema_theatre',['competences.c_plays','competences.c_perf_plays']). domain_attributes('music',['competences.c_app_mus','competences.c_perf_mus']). domain_attributes('arts_and_crafts',['competences.c_perf_art','competences.c_musgall']). domain_attributes('life_ponders',Attributes) :- attributes_similars_to_question(Attributes) . domain_attributes('varia_misc',Attributes) :- attributes_similars_to_question(Attributes) .  attributes_similars_to_question(Attributes) :- ( get_task_goal_name(Question), my_profile_attributes_similars_to(SimAttributes,Question,0.4) -> true ; SimAttributes = [] ), !, ( length(SimAttributes,0) -> Attributes = ['competences.u_active','competences.u_read','competences.u_essay','competences.u_org','competences.u_balance','competences.u_assess','competences.u_theory','competences.u_pract','competences.c_locfac','competences.c_accom','competences.c_team_sp','competences.c_ind_sp','competences.c_watch_sp','competences.c_lit','competences.c_creatlit','competences.c_perf_art','competences.c_musgall','competences.c_food','competences.c_eating','competences.c_plays','competences.c_perf_plays','competences.c_app_mus','competences.c_perf_mus'] ; Attributes = SimAttributes ), retractall(attributes_similars_to_question(_)), asserta(attributes_similars_to_question(Attributes)) ."
  },
  {
    "description": "Notify user if it can help with a question",
    "whenever": "is_received(_,'notifyNewQuestionAndAnswer',_) and get_task_id(TaskId) and get_task_goal_name(Question) and get_task_requester_id(RequesterId) and get_task_attribute_value(Sensitive,'sensitive') and get_task_attribute_value(Sensitive,'sensitive') and get_task_attribute_value(Anonymous,'anonymous') and get_task_attribute_value(PositionOfAnswerer,'positionOfAnswerer')",
    "thenceforth": "send_user_message('QuestionToAnswerMessage',json([taskId=TaskId,question=Question,userId=RequesterId,sensitive=Sensitive,anonymous=Anonymous,positionOfAnswerer=PositionOfAnswerer]))",
    "ontology": null
  },
  {
    "description": "Provide an answer to a question",
    "whenever": "is_received_do_transaction('answerTransaction',Attributes) and not(is_task_closed()) and get_attribute(Answer,answer,Attributes) and get_attribute(Anonymous,anonymous,Attributes) and get_task_requester_id(RequesterId)",
    "thenceforth": "add_message_transaction() and send_message(RequesterId,'answerTransaction',json([answer=Answer,anonymous=Anonymous]))",
    "ontology": null
  },
  {
    "description": "Notify the questioner about the answer",
    "whenever": "is_received(SenderId,'answerTransaction',Attributes) and get_attribute(Answer,answer,Attributes) and get_attribute(Anonymous,anonymous,Attributes) and get_task_goal_name(Question) and get_task_id(TaskId) and get_transaction_id(TransactionId)",
    "thenceforth": "send_user_message('AnsweredQuestionMessage',json([taskId=TaskId,question=Question,transactionId=TransactionId,answer=Answer,userId=SenderId,anonymous=Anonymous]))",
    "ontology": null
  },
  {
    "description": "Notify to the users about best answer",
    "whenever": "is_received_do_transaction('bestAnswerTransaction',Attributes) and not(is_task_closed()) and get_attribute(TransactionId,transactionId,Attributes) and get_transaction(Transaction,TransactionId) and wenet_actioneer_id_of_transaction(ActioneerId,Transaction)",
    "thenceforth": "add_message_transaction() and close_task() and send_message(ActioneerId,'bestAnswerTransaction',json([transactionId=TransactionId]))",
    "ontology": null
  },
  {
    "description": "Notify the user that its answer is picked",
    "whenever": "is_received(_,'bestAnswerTransaction',Attributes) and get_attribute(TransactionId,transactionId,Attributes) and get_task_goal_name(Question) and get_task_id(TaskId)",
    "thenceforth": "send_user_message('AnsweredPickedMessage',json([taskId=TaskId,question=Question,transactionId=TransactionId]))",
    "ontology": null
  },
  {
    "description": "Ask more users",
    "whenever": "is_received_do_transaction('moreAnswerTransaction',_) and not(is_task_closed()) and who_to_ask(Users)",
    "thenceforth": "add_message_transaction() and send_messages(Users,'notifyNewQuestionAndAnswer',json([]))",
    "ontology": null
  },
  {
    "description": "Nothing to do with this transaction only store it",
    "whenever": "is_received_do_transaction('notAnswerTransaction',_) and not(is_task_closed())",
    "thenceforth": "add_message_transaction()",
    "ontology": null
  },
  {
    "description": "Nothing to do with this transaction only store it",
    "whenever": "is_received_do_transaction('reportQuestionTransaction',_) and not(is_task_closed())",
    "thenceforth": "add_message_transaction()",
    "ontology": null
  },
  {
    "description": "Nothing to do with this transaction only store it",
    "whenever": "is_received_do_transaction('reportAnswerTransaction',_) and not(is_task_closed())",
    "thenceforth": "add_message_transaction()",
    "ontology": null
  }
]
```
