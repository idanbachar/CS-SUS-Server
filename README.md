# CS:SUS - Server

The backbone of the CS:SUS client, the CS:SUS server handles all the data processing, requests, and core logic essential for analyzing Counter-Strike 2 player profiles and determining the likelihood of cheating. Integrated with the Steam API, the server processes player statistics and manages user tracking lists.

## Features:

1. **Steam API Integration**: Fetches and processes data from the Steam API for CS2 statistics.
2. **Cheater Probability Score Logic**: Computes the percentage score based on metrics from the Steam API, including player's CS2 statistics and other steam account information.
3. **User Authentication**: Handles OAuth2.0 authentication for users logging in via Steam.
4. **Tracking List Management**: Maintains user lists of profiles to track and manages notifications for changes in VAC ban status.
5. **Email Notification System (SOON)**: Will handle sending email notifications to users.

## Technologies Used

- Node.js
- Express.js (for handling API requests)
- Steam API Integration
- Firebase (for storing tracking lists)
- OAuth2.0 (for Steam authentication)

## Acknowledgments

- Kudos to the developers of the Steam API, which has been instrumental for this project.
