---
title: Interaction Protocol Engine
sidebar_label: Interaction Protocol Engine
---

The interaction protocol engine component is the one responsible for guaranteeing
that interactions between WeNet users follow the norms.

## Message

The interaction between users is modeled as an exchange of messages.
When a user sends a message through the API, the message is sent to the norm interpreter of the user.
This interpreter needs to first verify that the message does not violate any of the norms,
this includes the community norms, the task norms, the sender’s individual norms, as well as the context-dependent
norms that are attached to this message. If the message violates any of those norms,
an error message is sent back to the user. However, if the message obeys the norms, then the norm interpreter needs
to decide what to do next, usually translated into sending messages to other peers. This decision follows from
the community, individual and context-dependent norms, and takes the user’s profile (both public and private)
into account as needed. If the message is sent to the interpreter of another user. As in the previous case,
the norm interpreter of this new user needs to first verify that the message does not violate any of the community norms.
This re-checking upon receipt ensures that the sender’s norm engine has not been manipulated to cheat.
If the message violates any of the community norms, then it may either be discarded, or if the community norms
require sanctioning, then the appropriate sanctions should be executed. However, if the action obeys the community norms,
then the norm interpreter needs to decide what to do next, which is usually translated into sending messages
to other peers and/or sending messages to its user. This decision takes into consideration the community norms,
the context-dependent norms that are attached to the message, the individual private norms of the human whose interpreter
has received this message, as well as their local profile (both private and public). This ensures that the interpreter
abides by human’s private norms without leaking any of their private norms and profile.


## Norm

There are norms on the individual (user level), the task level, and the community level.
An individual’s norm might be “Suppress incoming messages at night” (and this will
be applied for the user who sets this norm only). A task norm might be “Don’t ask my ex”
(so that would be applied for a specific task only). A community norm might be
“If you don’t volunteer, you cannot ask for help” and it would be enforced on everyone.
Given the above, this means that norms will be attached to users, tasks and communities.
