# Super Tags

[![Build Status](https://travis-ci.com/ktfth/super-tags.svg?branch=master)](https://travis-ci.com/ktfth/super-tags)

## Description

Tags expansion from css patterns. Use other mature solutions, for productivity.


## Installation

```
[sudo] npm i super-tags [-g]
```

## Usage

You can use the common way of module call.

```
const superTags = require('super-tags');
```

After the module call, use the expand nest method.

```
superTags.highLevelExpansion('div>a.my-custom-button');
```

And the output could possible be the following:

```
<div>
  <a class="my-custom-button"></a>
</div>
```

The above way is related to programmaticaly usage, but you
can use as cli on development mode.

## Development Mode

With the code cloned on your machine, access the project and run command:

```
node .\index.js "div*3>a.my-custom-button{Item $}"
```

The result is the following:

```
<div>
  <a class="my-custom-button">
    Item 1  
  </a>
</div>
<div>
  <a class="my-custom-button">
    Item 2  
  </a>
</div>
<div>
  <a class="my-custom-button">
    Item 3  
  </a>
</div>
```

Enjoy!

## Contributions

Feel free to open PR, start an issue about improvements and contact me using my email `kaeyosthaeron@gmail.com`.