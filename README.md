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

    signup           do the sign up, creating a new user and dealing with configuration
    s|search         searches snippets for the current signed up user and copies the selected one to the clipboard
    sa|search-all    searches snippets from any user and copies the selected one to the clipboard
    n|new            creates new snippet for the current signed up user
    u|update         updates a snippet for the current signed up user
    d|delete         deletes a snippet for the current signed up user
    e|export <file>  exports all the signed in user snippets to json file
    i|import <file>  imports the snippets from a json file for the signed in user
    help [command]   display help for command

### Keys

Query snippets while typing.

|  Key binding  |                                  Description                                                |
|---------------|---------------------------------------------------------------------------------------------|
| `Arrow down`  | move down selected snippet                                                                  |
| `Arrow up`    | move up selected snippet                                                                    |
| `Arrow right` | selects last snippet                                                                        |
| `Arrow left`  | selects first snippet                                                                       |
| `Enter`       | copy selected snippet to clipboard and exit (paste it later with `ctrl+v` or `ctrl+shift+v` |

---

Feedback from usage and contributions are very welcome.
Also if you like it, please leave a :star: I would appreciate it ;)
