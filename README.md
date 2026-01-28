This project includes code from PLM-ALM-with-GitLab, written by Yoann Maingon at Aras Corp., which is licensed under the MIT License.

# GitHub Integration for Aras Innovator

## Overview
This package integrates GitHub repository management into Aras Innovator CE.

## Contents
- ItemTypes: GH_Configuration, GH_Repository
- Forms: Configuration and Repository management interfaces
- Methods: GitHub API integration logic
- Initial configuration data

## Installation
1. Open Aras Innovator
2. Press Ctrl+Shift+I to open IOM window
3. Run files in this order:
   a. ItemTypes/*.xml
   b. Forms/*.xml
   c. Methods/*.xml
   d. Data/GH_Configuration_DataItem.xml
4. Edit the created GH_Configuration item:
   - Add your GitHub Personal Access Token
   - Enter your GitHub username
   - Save

## Usage
1. Open the GH_Configuration item
2. Click "Test Connection" to validate token
3. Click "Load Repositories" to sync from GitHub
4. Browse repositories in GH_Repository items

## Dependencies
- Aras Innovator CE 2025+
- GitHub account with repository access
- Personal Access Token with "repo" scope

## Credits
Based on PLM-ALM-with-GitLab by Yoann Maingon at Aras Corp.,
which is licensed under the MIT License.

## Support
For issues, check GitHub API rate limits and token permissions.
