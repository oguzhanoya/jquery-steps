## ![jquery-steps](https://oguzhanoya.github.io/jquery-steps/img/logo.svg)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> A simple, lightweight jQuery step wizard plugin.

## Features
- Easy configuration
- Lightweight (2KB gzipped)
- Works in all major browsers including IE11+

## Compatibility
IE11+, Edge, Chrome, Firefox, Opera, Safari

## Installation
NPM
```sh
npm install jquery.steps
```
Github
```sh
git clone http://github.com/oguzhanoya/jquery-steps.git
```

## Setup

Include plugin stylesheets.
```html
<link rel="stylesheet" href="css/jquery-steps.css">
```
Make necessary markup for wizard. That's all, you don't need to do anything else.
```html
<div id="demo">
    <div class="step-app">
        <ul class="step-steps">
            <li><a href="#step1">Step 1</a></li>
            <li><a href="#step2">Step 2</a></li>
            <li><a href="#step3">Step 3</a></li>
        </ul>
        <div class="step-content">
            <div class="step-tab-panel" id="step1">
                ...
            </div>
            <div class="step-tab-panel" id="step2">
                ...
            </div>
            <div class="step-tab-panel" id="step3">
                ...
            </div>
        </div>
        <div class="step-footer">
            <button data-direction="prev">Previous</button>
            <button data-direction="next">Next</button>
            <button data-direction="finish">Finish</button>
        </div>
    </div>
</div>
```
Include plugin and dependeces. jQuery is the only dependency, make sure to include it.
```html
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="js/jquery-steps.js"></script>
```
Init plugin with choosen options.
```html
<script>
    $('#demo').steps({
        onFinish: function () { alert('complete'); }
    });
</script>
```
## Configuration

|Setting|Default Value|Description|
|---|---|---|
|startAt|`0`|Start wizard at specifed step number.|
|showBackButton|`true`|Indicates whether the back button will be visible.|
|showFooterButtons|`true`|Indicates whether the footer buttons will be visible.|
|stepSelector|`.step-steps > li`|The selector used for each step.|
|contentSelector|`.step-content > .step-tab-panel`|The selector used for the step content.|
|footerSelector|`.step-footer`|The selector used for the buttons.|
|buttonSelector|`button`|The selector used for the footer buttons.|
|activeClass|`active`|The class used when a step is active.|
|doneClass|`done`|The class used when a step is done.|
|errorClass|`error`|The class used when an error occurs in a step.|
|onInit|`function(){}`|Fired when plugin is initialized|
|onChange|`function(currentIndex, newIndex, stepDirection){return true;}`|Fired when plugin step changed|
|onFinish|`function(){}`|Fired when plugin wizard finished|
|onDestroy|`function(){}`|Fired when plugin destroy|

## Methods

|Name|Description|
|---|---|
|destory|Destroy the plugin instance|
|next|Go to the next step.|
|prev|Go to the previous step.|
|finish|Trigger the onFinish event.|
|getStepIndex|Gets the current step index.(start from 0)|

## License

MIT
