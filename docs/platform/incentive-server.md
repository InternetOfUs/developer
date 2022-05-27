---
title: Task manager
sidebar_label: Task manager
---

The Incentive Server is responsible for generating diversity-aware incentives used during
WeNet’s individual and group interactions to maximize the probability of successful
interactions, i.e., interactions that are beneficial to accomplishing the goals of the different
participants in the WeNet system. The component leverages the information provided by the
other components for identifying the appropriate incentives to users while adhering to WeNet
norms. The current APIs support message-based and badge-based incentives. 


The server exposes dedicated endpoints allowing to manage:
- badge incentives;
- message incentives;
- norms relating to the incentive server behaviour.

Badges incentives are based on the [Open Badges 2.0](https://www.imsglobal.org/sites/default/files/Badges/OBv2p0Final/index.html) (OBv2) API specification.
The APIs defined in this component are meant to be used by other components of the WeNet
platform (but the norms endpoint, which is for internal testing only). 
