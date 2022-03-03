---
title: Commons APIs
sidebar_label: Commons APIs
---


# What is it?

Commons APIs manages streams of data that are pushed mainly from external applications towards the WeNet Platform. An example of an external application can be the iLog application from the University of Trento. The Commons APIs component interacts with the iLogBase component for saving and sharing the streams to the internal component of the WeNet Platform.

The Commons APIS provides services for the External Applications that want to collaborate with the WeNet Platform by pushing data inside the Platform.


# Availability

* The source code is in [github](https://github.com/InternetOfUs/streambase).
* The production deployment is in the [URL](https://internetofus.u-hopper.com/prod/api/common/).

# Requirements for Usage

1. Register your application in the WeNet Hub.
   1. You will obtain your WeNet oAuth2 credentials (appId, appSecret, Callback URL) for authentication and usage of the Commons APIs. 
2. The Web application should be deployed in a server accessible from the Internet.


# Related WeNet components

* **iLogBase component**: The iLogbase provides services for handling big data within the WeNet Platform. The services include the management of streams of data with batch services and with subscription/notification services.
* **Authentication and Authorization component**: To access the Commons APIs you need to use the Authentication and Authorization Component of the WeNet Platform. 


# Implemented Streams

## The main JSON structure:

```json
{
    "userId": "abcd123",
    "appId": "Wenet2",
    "data":	{
        locationeventpertime [...]
        accelerometerevent [...]
        gyroscopeevent [...]
        tasksanswers [...]
        tasksquestions [...]
        socialrelations [...]
        touchevent [...]
        socialprofile [...]
        socialevent [...]
        socialpost [...]
    }
}
```
        
## The implemented streams:

* Main Characteristics:
  * **ts** is integer as epoch in miliseconds
  * **meta** is optional.

1. Location (name in the json:**locationeventpertime**)
```json
"locationeventpertime": [
  {
    "ts": 12341234124,
    "payload": {
      "accuracy": 23.2,
      "lucene": "lucene",
      "provider": "gps",
      "speed": 2.3,
      "point": {
        "latitude": 22.1492,
        "longitude": -101.03609,
        "altitude": 1845.29208
      }
    },
    "meta": {
      "experimentId": "wenetTest"
    }
  }
]
```
   
2. Accelerometer (name in the json:**accelerometerevent**)
```json   
"accelerometerevent": [
    {
        "ts": 12341234124,
        "payload": {
            "x": 2.37,
            "y": 8.36,
            "z": 4.68
        },
        "meta": {
            "experimentId": "wenetTest"
        }
    }
]
```

3. Gyroscope (name in the json:**gyroscopeevent**)
```json
"gyroscopeevent": [
    {
      "ts": 12341234124,
      "payload": {
        "x": 2.37,
        "y": 8.36,
        "z": 4.68
      },
      "meta": {
        "experimentId": "wenetTest"
      }
   }
]
```
4. Touch (name in the json:**touchevent**)
```json
"touchevent": [
  {
    "ts": 12341234124,
    "payload": {},
    "meta": {
      "experimentId": "wenetTest"
    }
  }
]
```
5. Social Relations (name in the json:**socialrelations**)
```json
"socialrelations": [
      {
        "ts": 12341234124,
        "payload": {
          "source": "twitter",
          "content": {
            "eventtype": "follows",
            "value": 1,
            "userdestinationid": 8
          }
        },
        "meta": {
          "experimentId": "wenetTest"
        }
      }
    ]
```
6. Social Profiles (name in the json:**socialprofile**)
```json
    "socialprofile": [
      {
        "ts": 12341234124,
        "payload": {
          "source": "twitter",
          "sourceId": "123123",
          "gender": "female",
          "hometown": "Trento, Italy"
        },
        "meta": {
          "experimentId": "wenetTest"
        }
      }
    ]
```
7. Social Events (name in the json:**socialevent**)
```json
"socialevent": [
      {
        "ts": 12341234124,
        "payload": {
          "source": "twitter",
          "sourceId": "123123",
          "name": "Polenta all-you-can-eat",
          "description": "You can have all the polenta you can eat for just € 9,99",
          "start_time": "Random date format?",
          "end_time": "Random date format?",
          "place": "Casa Mia Restaurant, Shanghai, China"
        },
        "meta": {
          "experimentId": "wenetTest"
        }
      }
    ]
```
8. Social Posts (name in the json:**socialpost**)
```json
 "socialpost": [
      {
        "ts": 12341234124,
        "payload": {
          "source": "twitter",
          "sourceId": "123123",
          "message": "你好，你在干嘛？",
          "reactions": [
            {
              "userId": "id321321",
              "username": "supermario85",
              "type": "like"
            }
          ],
          "comments": [
            {
              "userId": "id321321",
              "username": "luca_tony",
              "message": "Numero 1!",
              "created_time": "Random date format"
            }
          ]
        },
        "meta": {
          "experimentId": "wenetTest"
        }
      }
    ]
```
9. Tasks Questions (name in the json:**tasksquestions**)
```json
"tasksquestions": [
      {
        "ts": 12341234124,
        "payload": {
          "instanceid": "f161dee2a122af926a9c4285275800942d128c34",
          "question": [
            {
              "q": {
                "id": 1,
                "c": [],
                "t": "t",
                "at": "s",
                "p": [
                  {
                    "l": "en_US",
                    "t": "What are you doing?"
                  },
                  {
                    "l": "it_IT",
                    "t": "Cosa stai facendo?"
                  }
                ]
              },
              "a": [
                [
                  {
                    "id": 1,
                    "c": [],
                    "c_id": -1,
                    "p": [
                      {
                        "l": "en_US",
                        "t": "I am working"
                      },
                      {
                        "l": "it_IT",
                        "t": "Sto lavorando"
                      }
                    ]
                  },
                  {
                    "id": 2,
                    "c": [],
                    "c_id": -1,
                    "p": [
                      {
                        "l": "en_US",
                        "t": "I am studying"
                      },
                      {
                        "l": "it_IT",
                        "t": "Sto studiando"
                      }
                    ]
                  }
                ]
              ]
            }
          ],
          "day": 20190910,
          "instancetimestamp": 20190911201814344,
          "status": "success",
          "title": "Question Title"
        },
        "meta": {
          "experimentId": "wenetTest"
        }
      }
    ]
```
10. Tasks Answers (name in the json:**tasksanswers**)
```json
"tasksanswers": [
      {
        "ts": 12341234124,
        "payload": {
          "instanceid": "f161dee2a122af926a9c4285275800942d128c34",
          "answer": [
            [
              {
                "cnt": "I am at home",
                "qid": 2,
                "aid": 3,
                "cid": -1
              }
            ]
          ],
          "answerduration": 20142,
          "answertimestamp": 20190909010129450,
          "instancetimestamp": 20190911201814344,
          "notificationtimestamp": 20190911201816910,
          "payload": [
            {
              "payload": {},
              "qid": 1
            }
          ]
        },
        "meta": {
          "experimentId": "wenetTest"
        }
      }
    ]
```


## Implementation Organization

From the logical architecture of the WeNet Platform we have two related modules: Commons APIs and ILogbase.

## Repository

1. Commons APIs (and streambase) [link](https://github.com/InternetOfUs/streambase)

## Documentation

1. WeNet Platform Documentation [link](https://github.com/InternetOfUs/components-documentation)
2. Commons APIs Swagger Documentation [link](https://github.com/InternetOfUs/components-documentation/blob/master/sources/wenet-common_api-openapi.yaml)