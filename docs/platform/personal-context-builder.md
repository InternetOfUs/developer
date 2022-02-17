---
title: Personal Context Builder
sidebar_label: Personal Context Builder
---

The personal context builder build routines when

  - Survey are available and answered (the question "where are you now?").
  - The locations are available in Streambase.
  - The profile exist in the Profile Manager

This component depend of two other components
  - Streambase -- to gather locations and surveys
  - the Profile Manager -- to retreive existing users and update them

The routines are put into the `personalBehaviors` field of the Profile Manager.

If the `personalBehaviors` field is empty, this is because of one of the following cases:

  - There are no locations available for this user
  - There are no Surveys available for this user
  - The algorithm wasn't able to group locations into regions
  - The algorithm wasn't able to link the surveys with the regions
  - The user is too new (the component run once per 24h)
  - The personal context builder component isn't running correctly
  - The streambase component isn't reachable
  - The profile manager isn't reachable