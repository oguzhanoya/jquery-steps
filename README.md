## ![jquery-steps](https://oguzhanoya.github.io/jquery-steps/img/logo.svg)

[![npm](https://img.shields.io/npm/v/jquery.steps)](https://www.npmjs.com/package/jquery.steps)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dm/jquery.steps)](https://www.npmjs.com/package/jquery.steps)
[![npm](https://img.shields.io/jsdelivr/npm/hm/jquery.steps)](https://www.jsdelivr.com/package/npm/jquery.steps)

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
CDN
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery.steps@1.1.2/dist/jquery-steps.min.css">
<script src="https://cdn.jsdelivr.net/npm/jquery.steps@1.1.2/dist/jquery-steps.min.js"></script>
```

## Setup

Include plugin stylesheets.
```html
<link rel="stylesheet" href="css/jquery-steps.css">
```
Make necessary markup for wizard. That's all, you don't need to do anything else.
```html
<div class="step-app" id="demo">
  <ul class="step-steps">
    <li data-step-target="step1">Step 1</li>
    <li data-step-target="step2">Step 2</li>
    <li data-step-target="step3">Step 3</li>
  </ul>
  <div class="step-content">
    <div class="step-tab-panel" data-step="step1">
      ...
    </div>
    <div class="step-tab-panel" data-step="step2">
      ...
    </div>
    <div class="step-tab-panel" data-step="step3">
      ...
    </div>
  </div>
  <div class="step-footer">
    <button data-step-action="prev" class="step-btn">Previous</button>
    <button data-step-action="next" class="step-btn">Next</button>
    <button data-step-action="finish" class="step-btn">Finish</button>
  </div>
</div>
```
Include plugin and dependeces. jQuery is the only dependency, make sure to include it.
```html
<script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script>
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
|startAt|`0`|Starts wizard at specifed step number.|
|showBackButton|`true`|Indicates whether the back button will be visible.|
|showFooterButtons|`true`|Indicates whether the footer buttons will be visible.|
|stepSelector|`.step-steps`|The selector used for each step.|
|contentSelector|`.step-content`|The selector used for the step content.|
|footerSelector|`.step-footer`|The selector used for the buttons.|
|activeClass|`active`|The class used when a step is active.|
|doneClass|`done`|The class used when a step is done.|
|errorClass|`error`|The class used when an error occurs in a step.|
|onInit|`function(){}`|Fired when plugin is initialized.|
|onChange|`function(currentIndex, newIndex, stepDirection){return true;}`|Fired when plugin step changed.|
|onFinish|`function(){}`|Fired when plugin wizard finished.|
|onDestroy|`function(){}`|Fired when plugin destroy.|

## Methods

|Name|Description|
|---|---|
|destory|Destroy the plugin instance.|
|next|Goes to the next step.|
|prev|Goes to the previous step.|
|finish|Trigger the onFinish event.|
|getStepIndex|Gets the current step index.(start from 0)|
|getMaxStepIndex|Gets the max step index.|
|setStepIndex|Sets the step index.|

## License

MIT
