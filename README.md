[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=satuhalinen_reporting_system&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=satuhalinen_reporting_system)

# Reporting system

## Introduction

This is a SERN (SQLite + Express + React + Node.js) app! In this app you can show four different data: monthly working hours, cumulative monthly working hours, billable and non-billable monthly working hours and monthly working hours itemized by the type of them (salary report).

## Technologies used

- SQLite: database for working hours data
- Firestore Database: database for users' firstnames and lastnames
- Firebase Authentication: authentication
- Node.js/Express: backend
- React: frontend
- Ant Design: frontend components
- Nivo (https://nivo.rocks/): chart library
- Vitest: unit testing
- SonarCloud: code analysis

## Features

The app is used for creating reports related to a company employees' working hours. Four different reports are available: monthly working hours, cumulative monthly working hours, billable monthly working hours and salary report. In salary report page you first choose the salary date and then you can see the data. In other report pages you enter the starting year and choose how many years (0-3) backwards you want to see the data.

In all report pages the data is shown both as a chart and as a table, salary report as an exception. Salary report page shows a table and you can download a csv file out of the data. Monthly working hours page shows working hours of different months during the chosen years. Cumulative monthly working hours page is based on the same SQLite query but it makes a cumulative chart and a table. In billable monthly working hours page you can make a chart which includes both billable and non-billable monthly working hours but billable and non-billable monthly working hours data are shown in separate tables.

In the app you have to sign in with email and password to see the reports for which you have permissions. If you are not logged in, the only available feature is the logging in. The authentication has two different users, users and admin users. Admin users can go to pages called “user list” and “adding users” and execute functionalities related to them.

In the user list page admin users can see the emails, lastnames and firstnames of all users and delete users. From user list page can also be moved to different pages to either change users' firstnames, lastnames, emails, passwords or permissions for the different reports.
