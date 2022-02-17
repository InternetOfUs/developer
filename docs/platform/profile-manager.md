---
title: Profile Manager
sidebar_label: Profile Manager
---

The profile manager component is the one responsible for storing and maintaining
the WeNet user profiles and its historic. A user profile is a set of attributes
that define the state of the user. Some of these attributes are filled in by
the user, such as name, email, telephone,... , or by  other components of
the platform, such as social relationships, routines,....

Also, the profile manager is responsible to manage the communities that
the users can be aggregated. By default, each application has associated with
one community that contains the norms that manage how the incentives have
to be notified to the users.

Another responsibility of the profile manager is to evaluate the trust of one user
over another when it is doing some action. The trust is dynamic and will be
updated every time they collaborate to achieve a task. When a user has received
help it can rate the performance of the user that has helped it. For this, it has
to post a performance rating event to the profile manager. These events are used
by the profile manager when it has to provide the trust that has a user that
another does a certain action. When you want to calculate the trust, you must
specify some parameters that are used to select with events has to be aggregated
to obtain the trust. Also, you must define the aggregation function, that can be:

 - RECENCY_BASED: the trust is the average of the last 'n' rating events.
 At the moment n=5.
 - AVERAGE: the trust is the average of all the rating events.
 - MEDIAN: the trust is the median of all the rating events.
 - MINIMUM: the trust is the minimum rating of all the events.
 - MAXIMUM: the trust is the maximum rating of all the events.
