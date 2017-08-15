# Publishing Your Module

## 1. Create an example code
People who will use your module need to know how it works. For these purposes,
*create a code snippet* that shows how to use your module and save it
in a `.coffee` file.

## 2. Create `module.json`
Module.json holds all important metadata about your module.

### Required keys
#### `name`
*(String)* Human readable name of your module that is seen in the app.

Do know that a `unique_name` **will be automatically created** from the `name`
and used as the main identificator for the directory name, dependency link, etc.

#### `description`
*(String)* Brief description of what your module does *(recommended 100 characters).*

#### `author`
*(String)* Your name, right?

#### `require`
*(String)* A `require()` statement that will load your module to the prototype.

#### `install`
*(String | Array)* Path to the file(s) you'd like to be downloaded and installed
to the prototype. Please note it's only possible to define exact files, not full directories.

#### `example`
*(String)* Path to the file with the snippet created in step 1.

### Optional
#### `thumb` (recommended)
*(String)* Path to the thumbnail. Thumbnails are shown at `80×80px` (@2x is recommended).
Please use a thumbnail with opaque background (`#1D1D1F` is recommended).
Allowed filetypes are `mp4` `mov` `png` `jpg` `gif`.

#### `dependencies`
*(Array)* Array of dependencies' *unique names*. Please note each dependency
will be installed inside a subdirectory named after their `unique_name`.

### Example `module.json`
Taken from [this module](https://github.com/kysely/framer-bidirectional-cycle/blob/master/module.json).
```javascript
{
    "name": "Bidirectional Cycle",
    "description": "Extension that will make Utils.cycle() iterate in both directions",
    "author": "Radek Kysely",

    "require": "Utilscycle = require 'Utilscycle'",
    "install": "Utilscycle.coffee",
    "example": "example.coffee",

    "thumb": "bidirectional-cycle-thumb.mov"
}
```

### Note
To maintain clean prototype directories hierarchy, modules will be installed to
a subdirectory in `modules` folder named after their `unique_name`. If you need
to reach parent directories from your code, please use one more set of `../`.

Please note the `require()` command *will be automatically updated* to reach
module's actual directory.

*Example: A module named `iOS Status Bar` will get a unique name `ios-status-bar`
and will be installed to `<PATH_TO_PROTOTYPE>/modules/ios-status-bar/`.*

## 3. Push to GitHub
And keep it there. Your module will always be installed from its GitHub repository.

## 4. ~~Publish to Framer Modules~~ [Send me the link](https://m.me/kysely)
~~Open Framer Modules, click Publish button in the top right corner,
enter your GitHub repository link and follow the instructions on the screen.~~

Until the project is public, please just send the link to me, I'll freshly
publish all the modules upon app release :)

---
## Questions?
[Open an issue](https://github.com/kysely/framer-modules/issues) |
[Send me an e-mail](mailto:kyselyradek@gmail.com) |
[Reach me on Messenger](https://m.me/kysely)

---
