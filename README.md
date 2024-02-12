<div align="center">
  <p>
    <img src="https://github.com/carvilsi/pwyll-cli/blob/main/img/pwyll-cli.png" alt="pwyll-cli" >
  </p>
  <p>the cli for the simple snippet manager service</p>
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

    signup <url> <username>  do the sign up, creating a new user and dealing with configuration
    s                        searches snippets for the current signed up user and copies the selected one to the clipboard
    sa                       searches snippets from any user and copies the selected one to the clipboard
    n                        creates new snippet for the current signed up user
    u                        updates a snippet for the current signed up user
    d                        deletes a snippet for the current signed up user
    help [command]           display help for command

### Keys

Query snippets while typing.

|  Key binding  |                                  Description                                                |
|---------------|---------------------------------------------------------------------------------------------|
| `Arrow down`  | move down selected snippet                                                                  |
| `Arrow up`    | move up selected snippet                                                                    |
| `Arrow right` | selects last snippet                                                                        |
| `Arrow left`  | selects first snippet                                                                       |
| `Enter`       | copy selected snippet to clipboard and exit (paste it later with `ctrl+v` or `ctrl+shift+v` |

