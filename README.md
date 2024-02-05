<div class="text" align="center">
    <pre>
             ┓┓  ┓•
      ┏┓┓┏┏┓┏┃┃ ┏┃┓
      ┣┛┗┻┛┗┫┗┗━┗┗┗
┛     ┛

the cli for the simple snippet manager service
    </pre>
</div>

# pwyll-cli

## Install

`$ npm install -g pwyll-cli`

## Usage

**pwyll-cli [options] command**

**Options**:

  -V, --version            output the version number

  -h, --help               display help for command


**Commands**:

  **signup <url> <username>**  do the sign up, creating a new user and dealing with configuration

  **s**                        searches snippets for the current signed up user and copies the selected one to the clipboard

  **sa**                       searches snippets from any user and copies the selected one to the clipboard

  **n**                        creates new snippet for the current signed up user

  **u**                        updates a snippet for the current signed up user

  **d**                        deletes a snippet for the current signed up user

  **help [command]**           display help for command


