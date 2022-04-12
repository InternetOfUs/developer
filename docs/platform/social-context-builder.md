---
title: Social Context Builder
sidebar_label: Social Context Builder
---

## Introduction

The Social Context Builder is responsible for building and  
maintaining the social details of a user profile, by leveraging  
data within the WENET platform.

## Usage

### Social Relations Component
Description:
The Social Relations component aims at analysing the social  
interactions of the users and specifies two pieces of information.  
The first concerns the relationships between them and the second is the tie  
strength of their friendship.The component uses mainly information harnessed  
from the Interaction protocol engine regarding interactions between 2 users  
and their respective profile information.  

A relation object is constructed from:
- **appId** : the application in which the relation exists
- **userId** : the destination of the user relationship
- **type** : type of the relationship (i.g.friend)
- **weight** : weight calculated upon interaction


### Social Ranking Component
Description:

The social ranking component is responsible for ranking volunteers  
with respect to a specific task that a user poses. It analyzes the  
social and personal data of the volunteers, the characteristics of  
the task and the information of the user that set the task and  
performs a personalized ranking of the users and implements a  
knowledge-based methodology that utilizes rules to perform the  
user ranking.

#### Received list of users in ranking component for Task1
- userId1
- userId6
- userId12
- userId5

#### Returned list from social ranking component
1. userId12
2. userId5
3. userId1
4. userId6
