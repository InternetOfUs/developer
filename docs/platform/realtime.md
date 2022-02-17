---
title: Realtime
sidebar_label: Realtime
---

The Realtime component provides 2 entry-points.

- POST /locations/ -- ask who are the closest for each user of a list of user identifiants.
- GET /closest/ -- ask who are the N closest from a given latitude and longitude.

This component depends on the following platform components:

- The Profile Manager -- for retrieving the existing users
- Streambase -- for retrieving the locations of the users

This component is used by the following platform components:

- The Profile Manager -- Norms based on proximity

More information are available in [this openapi documentation](https://lab.idiap.ch/devel/hub/wenet/docs).
