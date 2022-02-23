---
title: Platform API
sidebar_label: Platform API
---

## Platform API

As already mentioned in the [Service API](/docs/platform/service-api) page the main entry point for the platform api are the Service API component

## Scopes {#scopes}

The scopes are divided in three categories:

- **Public** scopes: The scopes are always enabled by default in your application, they comprehend the read access to some public information about the user
- **Read** scopes: These scopes grant the read access to the user's information
- **Write** scopes: These scopes grants the write access to the user's information.

This is the list of the scopes divided by category:

- **Public** scopes:
    - **ID**: Allows the application to read the user's ID
    - **First Name**: Allows the application to read the user's first name
    - **Last Name**: Allows the application to read the user's last name
- **Read** scopes:
    - **Middle Name**: Allows the application to read the user's middle name
    - **Prefix Name**: Allows the application to read the user's prefix name
    - **Suffix Name**: Allows the application to read the user's suffix name
    - **Birthdate**: Allows the application to read the user's birthdate
    - **Gender**: Allows the application to read the user's gender
    - **Email**: Allows the application to read the user's email
    - **Phone Number**: Allows the application to read the user's phone number
    - **Locale**: Allows the application to read the user's locale
    - **Avatar**: Allows the application to read the user's avatar
    - **Nationality**: Allows the application to read the user's nationality
    - **Occupation**: Allows the application to read the user's occupation
    - **Norms**: Allows the application to read the user's norms
    - **Activities**: Allows the application to read the user's activities
    - **Locations**: Allows the application to read the user's locations
    - **Relationship**: Allows the application to read the user's relationship
    - **Behaviours**: Allows the application to read the user's behaviours
    - **Materials**: Allows the application to read the user's materials
    - **Competencies**: Allows the application to read the user's competencies
    - **Meanings**: Allows the application to read the user's meanings
- **Write** Scopes:
   - **First Name**: Allows the application to write the user's first name
    - **Last Name**: Allows the application to write the user's last name
    - **Middle Name**: Allows the application to write the user's middle name
    - **Prefix Name**: Allows the application to write the user's prefix name
    - **Suffix Name**: Allows the application to write the user's suffix name
    - **Birthdate**: Allows the application to write the user's birthdate
    - **Gender**: Allows the application to write the user's gender
    - **Email**: Allows the application to write the user's email
    - **Phone Number**: Allows the application to write the user's phone number
    - **Locale**: Allows the application to write the user's locale
    - **Avatar**: Allows the application to write the user's avata
    - **Nationality**: Allows the application to write the user's nationality
    - **Occupation**: Allows the application to write the user's occupation
    - **Norms**: Allows the application to write the user's norms
    - **Activities**: Allows the application to write the user's activities
    - **Locations**: Allows the application to write the user's locations
    - **Relationship**: Allows the application to write the user's relationship
    - **Behaviours**: Allows the application to write the user's behaviours
    - **Materials**: Allows the application to write the user's materials
    - **Competencies**: Allows to write the user's competencies
    - **Meanings**: Allows to write the user's meanings
    - **Conversation**: Allows the application to log the user conversations to platform logging system
    - **Data**: Allows the application to send relatime data abaout the user through the [Realtime API](/docs/platform/realtime)
