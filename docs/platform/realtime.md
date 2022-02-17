---
title: Realtime
sidebar_label: Realtime
---

The Realtime component provides 2 entrypoints

  - POST /locations/ -- ask who are the closest for each user of a list of user identifiants.
  - GET /closest/ -- ask who are the N closest from a given latitude and longitude.

This component depend of

  - The Profile Manager -- to retreive the existing users
  - Streambase -- to retreive the locations of the users

This component is used by

  - The Profile Manager -- Norms based on proximity

More information are available in this openapi documentation [here](https://lab.idiap.ch/devel/hub/wenet/docs)