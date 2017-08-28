# Publish Your Module

## 1. Create an example code (snippet)
People who will use your module need to know how it works. For these purposes,
*create a code snippet* that shows how to use your module and save it
in a `.coffee` file.

Please don't include `require()` statement in your example.

## 2. Create `module.json`
Module.json holds all important metadata about your module.

| key            | type              | description                           |
| ---------------|:-----------------:|---------------------------------------|
| `name`         | *String*          | Human readable name of your module that is seen in the app. <br /><br />*Do know that a `unique_name` **will be automatically created** from the `name` and used as the main identificator for the directory name, dependency link, etc.<br /><br />[Check for name availability and `unique_name` before publishing](https://checkname.framermodules.com)*
| `description`  | *String*          | Brief description of what your module does *(recommended 100 characters).* <br /><br />*Keep in mind including keywords in description greatly increases chances of being found via the app search.*
| `author`       | *String*          | Your name, right?
| `require`      | *String*          | A `require()` statement that will load your module to the prototype.<br /><br />*Please avoid using path to the module file that includes `.framer`. Framer won't be able to recognize the module.*
| `install`      | *String or Array* | Path to the file(s) you'd like to be downloaded and installed to the prototype. Please note it's only possible to define exact files, not full directories.
| `example`      | *String*          | Path to the file with the snippet created in step 1.
| `thumb` *(optional)*        | *String*          | Path to the thumbnail. Thumbnails are shown at `80×80px` (@2x is recommended). <br />Please use a thumbnail with opaque background (`#1D1D1F` is recommended). Allowed filetypes are `mp4` `mov` `png` `jpg` `gif`.
| `dependencies` *(optional)* | *Array*           | Array of dependencies' *unique names*. Please note each dependency will be installed inside a subdirectory named after their `unique_name`.

### Example `module.json`
Taken from [this module](https://github.com/kysely/framer-bidirectional-cycle).
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
and will be installed to `<PATH_TO_PROTOTYPE>/modules/ios-status-bar/`.
All paths inside your repository will be preserved under the modules's directory.*

## 3. Push to GitHub
And keep it there. Your module will always be installed from its GitHub repository.

### Add the badge to your README
*If you want to* that show your module can be discovered and installed
via Framer Modules, you can include the following badge to your `README.md`.
Clicking the badge will also automatically open the app and redirect the
user to your module!

<a href='#add-the-badge-to-your-readme'><img alt='Install with Framer Modules'
src='https://www.framermodules.com/assets/badge@2x.png' width='160' height='40' /></a>

Just copy one of the snippets and replace `<MODULE NAME>` with yours as defined in `name` key.

HTML **(recommended, will use @2x)**
```html
<a href='https://open.framermodules.com/<MODULE NAME>'>
    <img alt='Install with Framer Modules'
    src='https://www.framermodules.com/assets/badge@2x.png' width='160' height='40' />
</a>
```

Markdown (will use @1x)
```md
[![Install with Framer Modules](https://www.framermodules.com/assets/badge.png)](https://open.framermodules.com/<MODULE NAME>)
```

## 4. Publish to Framer Modules
Open Framer Modules, click Publish button in the top right corner,
enter your GitHub repository link and follow the instructions on the screen.

## Okay, how do I update?
Just push the changes to GitHub. If you make some changes to `module.json`,
please re-publish in Framer Modules as described in step #4.

---
## Questions?
[Open an issue](https://github.com/kysely/framer-modules/issues) |
[Send me an e-mail](mailto:kyselyradek@gmail.com) |
[Reach me on Messenger](https://m.me/kysely)

---

### [← Return to the main page](https://github.com/kysely/framer-modules)
