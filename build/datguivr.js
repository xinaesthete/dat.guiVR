(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createButton;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  var group = new THREE.Group();
  group.guiType = "button";
  group.toString = function () {
    return '[' + group.guiType + ': ' + propertyName + ']';
  };

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var divisions = 4;
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.BoxGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor(divisions * aspectRatio), divisions, divisions);
  var modifier = new THREE.SubdivisionModifier(1);
  modifier.modify(rect);
  rect.translate(BUTTON_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshBasicMaterial({ color: Colors.BUTTON_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var buttonLabel = textCreator.create(propertyName, { scale: 0.866 });

  //  This is a real hack since we need to fit the text position to the font scaling
  //  Please fix me.
  buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.000011 * 0.5;
  buttonLabel.position.z = BUTTON_DEPTH * 1.2;
  buttonLabel.position.y = -0.025;
  filledVolume.add(buttonLabel);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.BUTTON_HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"../thirdparty/SubdivisionModifier":20,"./colors":3,"./grab":7,"./interaction":12,"./layout":14,"./sharedmaterials":17,"./textlabel":19}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var CHECKBOX_WIDTH = Layout.CHECKBOX_SIZE;
  var CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
  var CHECKBOX_DEPTH = depth;

  var INACTIVE_SCALE = 0.001;
  var ACTIVE_SCALE = 0.9;

  var state = {
    value: initialValue,
    listen: false
  };

  var group = new THREE.Group();
  group.guiType = "checkbox";
  group.toString = function () {
    return '[' + group.guiType + ': ' + propertyName + ']';
  };

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var rect = new THREE.BoxGeometry(CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH);
  rect.translate(CHECKBOX_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  // const outline = new THREE.BoxHelper( hitscanVolume );
  // outline.material.color.setHex( Colors.OUTLINE_COLOR );

  //  checkbox volume
  var material = new THREE.MeshBasicMaterial({ color: Colors.CHECKBOX_BG_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  // filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE,ACTIVE_SCALE );
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_CHECKBOX);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(CHECKBOX_WIDTH + Layout.BORDER_THICKNESS, CHECKBOX_HEIGHT + Layout.BORDER_THICKNESS, CHECKBOX_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  var checkmark = Graphic.checkmark();
  checkmark.position.z = depth * 0.51;
  hitscanVolume.add(checkmark);

  panel.add(descriptorLabel, hitscanVolume, controllerID, borderBox);

  // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    state.value = !state.value;

    object[propertyName] = state.value;

    if (onChangedCB) {
      onChangedCB(state.value);
    }

    p.locked = true;
  }

  function updateView() {

    if (state.value) {
      checkmark.visible = true;
    } else {
      checkmark.visible = false;
    }
    if (interaction.hovering()) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.updateControl = function (inputObjects) {
    if (state.listen) {
      state.value = object[propertyName];
    }
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":12,"./layout":14,"./sharedmaterials":17,"./textlabel":19}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorizeGeometry = colorizeGeometry;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var DEFAULT_COLOR = exports.DEFAULT_COLOR = 0x2FA1D6;
var HIGHLIGHT_COLOR = exports.HIGHLIGHT_COLOR = 0x43b5ea;
var INTERACTION_COLOR = exports.INTERACTION_COLOR = 0x07ABF7;
var EMISSIVE_COLOR = exports.EMISSIVE_COLOR = 0x222222;
var HIGHLIGHT_EMISSIVE_COLOR = exports.HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
var OUTLINE_COLOR = exports.OUTLINE_COLOR = 0x999999;
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x1a1a1a;
var DEFAULT_FOLDER_BACK = exports.DEFAULT_FOLDER_BACK = 0x101010;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x313131;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var CONTROLLER_ID_DROPDOWN = exports.CONTROLLER_ID_DROPDOWN = 0xfff000;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;
var CHECKBOX_BG_COLOR = exports.CHECKBOX_BG_COLOR = 0xffffff;
var BUTTON_COLOR = exports.BUTTON_COLOR = 0xe61d5f;
var BUTTON_HIGHLIGHT_COLOR = exports.BUTTON_HIGHLIGHT_COLOR = 0xfa3173;
var SLIDER_BG = exports.SLIDER_BG = 0x444444;

function colorizeGeometry(geometry, color) {
  geometry.faces.forEach(function (face) {
    face.color.setHex(color);
  });
  geometry.colorsNeedUpdate = true;
  return geometry;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var state = {
    open: false,
    listen: false
  };

  var DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  var DROPDOWN_DEPTH = depth;
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;

  var group = new THREE.Group();
  group.guiType = "dropdown";
  group.toString = function () {
    return '[' + group.guiType + ': ' + propertyName + ']';
  };

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  group.hitscan = [panel];

  var labelInteractions = [];
  var optionLabels = [];

  //  find actually which label is selected
  var initialLabel = findLabelFromProp();

  function findLabelFromProp() {
    if (Array.isArray(options)) {
      return options.find(function (optionName) {
        return optionName === object[propertyName];
      });
    } else {
      return Object.keys(options).find(function (optionName) {
        return object[propertyName] === options[optionName];
      });
    }
  }

  function createOption(labelText, isOption) {
    var label = (0, _textlabel2.default)(textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR, 0.866);

    group.hitscan.push(label.back);
    var labelInteraction = (0, _interaction2.default)(label.back);
    labelInteractions.push(labelInteraction);
    optionLabels.push(label);

    if (isOption) {
      labelInteraction.events.on('onPressed', function (p) {
        selectedLabel.setString(labelText);

        var propertyChanged = false;

        if (Array.isArray(options)) {
          propertyChanged = object[propertyName] !== labelText;
          if (propertyChanged) {
            object[propertyName] = labelText;
          }
        } else {
          propertyChanged = object[propertyName] !== options[labelText];
          if (propertyChanged) {
            object[propertyName] = options[labelText];
          }
        }

        collapseOptions();
        state.open = false;

        if (onChangedCB && propertyChanged) {
          onChangedCB(object[propertyName]);
        }

        p.locked = true;
      });
    } else {
      labelInteraction.events.on('onPressed', function (p) {
        if (state.open === false) {
          openOptions();
          state.open = true;
        } else {
          collapseOptions();
          state.open = false;
        }

        p.locked = true;
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  var selectedLabel = createOption(initialLabel, false);
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
  selectedLabel.position.z = depth;

  var downArrow = Graphic.downArrow();
  // Colors.colorizeGeometry( downArrow.geometry, Colors.DROPDOWN_FG_COLOR );
  downArrow.position.set(DROPDOWN_WIDTH - 0.04, 0, depth * 1.01);
  selectedLabel.add(downArrow);

  function configureLabelPosition(label, index) {
    label.position.y = -DROPDOWN_MARGIN - (index + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth;
  }

  function optionToLabel(optionName, index) {
    var optionLabel = createOption(optionName, true);
    configureLabelPosition(optionLabel, index);
    return optionLabel;
  }

  if (Array.isArray(options)) {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(options.map(optionToLabel)));
  } else {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(Object.keys(options).map(optionToLabel)));
  }

  collapseOptions();

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_DROPDOWN);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(DROPDOWN_WIDTH + Layout.BORDER_THICKNESS, DROPDOWN_HEIGHT + Layout.BORDER_THICKNESS * 0.5, DROPDOWN_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  panel.add(descriptorLabel, controllerID, selectedLabel, borderBox);

  updateView();

  function updateView() {

    labelInteractions.forEach(function (interaction, index) {
      var label = optionLabels[index];
      if (label.isOption) {
        if (interaction.hovering()) {
          Colors.colorizeGeometry(label.back.geometry, Colors.HIGHLIGHT_COLOR);
        } else {
          Colors.colorizeGeometry(label.back.geometry, Colors.DROPDOWN_BG_COLOR);
        }
      }
    });

    if (labelInteractions[0].hovering() || state.open) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.updateControl = function (inputObjects) {
    if (state.listen) {
      selectedLabel.setString(findLabelFromProp());
    }
    labelInteractions.forEach(function (labelInteraction) {
      labelInteraction.update(inputObjects);
    });
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":12,"./layout":14,"./sharedmaterials":17,"./textlabel":19}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFolder;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

function createFolder() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      name = _ref.name,
      guiAdd = _ref.guiAdd,
      guiRemove = _ref.guiRemove,
      addControllerFuncs = _ref.addControllerFuncs;

  var width = Layout.FOLDER_WIDTH;
  var depth = Layout.PANEL_DEPTH;

  var state = {
    collapsed: false,
    previousParent: undefined
  };

  var group = new THREE.Group();
  group.guiType = "folder";
  group.toString = function () {
    return '[' + group.guiType + ': ' + name + ']';
  };

  var collapseGroup = new THREE.Group();
  group.add(collapseGroup);

  var isAccordion = false;
  /** When true, will keep only one child folder of this folder open at a time.
   * Siblings automatically close.
   */
  Object.defineProperty(group, 'accordion', {
    get: function get() {
      return isAccordion;
    },
    set: function set(newValue) {
      if (newValue && !isAccordion) group.guiChildren.filter(function (c) {
        return c.isFolder;
      }).map(function (c) {
        return c.close();
      });
      isAccordion = newValue;
      performLayout();
    }
  });

  //expose as public interface so that children can call it when their spacing changes
  group.performLayout = performLayout;
  group.isCollapsed = function () {
    return state.collapsed;
  };

  //useful to have access to this as well. Using in remove implementation
  Object.defineProperty(group, 'guiChildren', {
    get: function get() {
      return collapseGroup.children;
    }
  });
  // returns true if all of the supplied args are members of this folder
  group.hasChild = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.includes(function (obj) {
      return group.guiChildren.indexOf(obj) === -1;
    });
  };

  group.folderName = name; //for debugging

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;
  //as long as no-one expects this to behave like a regular THREE.Group, the changed definition of remove shouldn't hurt
  //const removeOriginal = THREE.Group.prototype.remove; 

  function addImpl(o) {
    addOriginal.call(group, o);
  }

  addImpl(collapseGroup);

  var panel = Layout.createPanel(width, Layout.FOLDER_HEIGHT, depth, true);
  addImpl(panel);

  var descriptorLabel = textCreator.create(name);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 1.5;
  descriptorLabel.position.y = -0.03;
  descriptorLabel.position.z = depth;
  panel.add(descriptorLabel);

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, 0xffffff);
  downArrow.position.set(0.05, 0, depth * 1.01);
  panel.add(downArrow);

  var grabber = Layout.createPanel(width, Layout.FOLDER_GRAB_HEIGHT, depth, true);
  grabber.position.y = Layout.FOLDER_HEIGHT * 0.86; //XXX: magic number
  grabber.name = 'grabber';
  addImpl(grabber);

  var grabBar = Graphic.grabBar();
  grabBar.position.set(width * 0.5, 0, depth * 1.001);
  grabber.add(grabBar);
  group.isFolder = true;
  group.hideGrabber = function () {
    grabber.visible = false;
  };

  group.add = function () {
    var newController = guiAdd.apply(undefined, arguments);

    if (newController) {
      group.addController(newController);
      return newController;
    } else {
      return new THREE.Group();
    }
  };

  /* 
  Removes the given controllers from the GUI.
    If the arguments are invalid, it will attempt to detect this before making any changes, 
  aborting the process and returning false from this method.
    Note: as with add, this overwrites an existing property of THREE.Group.
  As long as no-one expects folders to behave like regular THREE.Groups, that shouldn't matter.
  */
  group.remove = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var ok = guiRemove.apply(undefined, args); // any invalid arguments should cause this to return false
    if (!ok) return false;
    args.forEach(function (obj) {
      console.assert(group.hasChild(obj), "internal problem with housekeeping logic of dat.GUIVR folder not caught by sanity check");
      if (obj.isFolder) {
        obj.remove.apply(obj, _toConsumableArray(obj.guiChildren));
      }
      collapseGroup.remove(obj);
    });
    //TODO: defer actual layout performance; set a flag and make sure it gets done before any rendering or hit-testing happens.
    performLayout();
    return true;
  };

  group.addController = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      if (obj.isFolder) {
        obj.hideGrabber();
        obj.close();
      }
    });

    performLayout();
  };

  group.addFolder = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      obj.hideGrabber();
      obj.close();
    });

    performLayout();
  };

  function performLayout() {
    var spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;
    var emptyFolderSpace = Layout.FOLDER_HEIGHT + Layout.PANEL_SPACING;
    var totalSpacing = emptyFolderSpace;

    collapseGroup.children.forEach(function (c) {
      c.visible = !state.collapsed;
    });

    if (state.collapsed) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;

      var y = 0,
          lastHeight = emptyFolderSpace;

      collapseGroup.children.forEach(function (child) {
        var h = child.spacing ? child.spacing : spacingPerController;
        // how far to get from the middle of previous to middle of this child?
        // half of the height of previous plus half height of this.
        var spacing = 0.5 * (lastHeight + h);

        if (child.isFolder) {
          // For folders, the origin isn't in the middle of the entire height of the folder,
          // but just the middle of the top panel.
          var offset = 0.5 * (lastHeight + emptyFolderSpace);
          child.position.y = y - offset;
        } else {
          child.position.y = y - spacing;
        }
        // in any case, for use by the next object along we remember 'y' as the middle of the whole panel
        y -= spacing;
        lastHeight = h;
        totalSpacing += h;
        child.position.x = 0.026;
      });
    }

    group.spacing = totalSpacing;

    //make sure parent folder also performs layout.
    if (group.folder !== group) group.folder.performLayout();

    // if we're a subfolder, use a smaller panel
    var panelWidth = Layout.FOLDER_WIDTH;
    if (group.folder !== group) {
      panelWidth = Layout.SUBFOLDER_WIDTH;
    }

    Layout.resizePanel(panel, panelWidth, Layout.FOLDER_HEIGHT, depth);
  }

  function updateView() {
    if (interaction.hovering()) {
      panel.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      panel.material.color.setHex(Colors.DEFAULT_FOLDER_BACK);
    }

    if (grabInteraction.hovering()) {
      grabber.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      grabber.material.color.setHex(Colors.DEFAULT_FOLDER_BACK);
    }
  }

  var interaction = (0, _interaction2.default)(panel);
  interaction.events.on('onPressed', function (p) {
    if (state.collapsed) group.open();else group.close();
    p.locked = true;
  });

  group.open = function () {
    if (!state.collapsed) return;
    if (group.folder !== group && group.folder.accordion) {
      group.folder.guiChildren.filter(function (c) {
        return c.isFolder && c !== group;
      }).forEach(function (c) {
        return c.close();
      });
    }
    state.collapsed = false;
    performLayout();
  };

  group.close = function () {
    if (state.collapsed) return;
    state.collapsed = true;
    performLayout();
  };

  group.folder = group;

  var grabInteraction = Grab.create({ group: group, panel: grabber });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.hitscan = [panel, grabber];

  group.beingMoved = false;

  var _loop = function _loop(k) {
    group[k] = function () {
      var controller = addControllerFuncs[k].apply(addControllerFuncs, arguments);
      if (controller) {
        group.addController(controller);
        return controller;
      } else {
        return new THREE.Group();
      }
    };
  };

  for (var k in addControllerFuncs) {
    _loop(k);
  }

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":12,"./layout":14,"./palette":15,"./sharedmaterials":17,"./textlabel":19}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.fnt = fnt;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function image() {
  var image = new Image();
  image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAMAAADyTj5VAAAAjVBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+umAc7AAAAL3RSTlMAWnJfbnqDWGR4a2ZcYnBRalRLgH6ETnR8UGh2RoZDXlaHSYo8QHU2LyYcFAwFmmUR1OIAAJFhSURBVHhetL2JWmu7jjUKIQkkQLqZvgMCZO2zT/33/R/vSkNDkj2TrOarVd5V6xDP3pJlWdKQ7qaPb6+vrw8vj+PZ/vvrxz///Pj63s/G7/cP2n0/XZ6Op6X8fJHfaG/3j9q5X/LKt/t3v/QfufQk/Xoubolz/Dq5LH7y1nLVl9xeH4b28jidncZy/ZM0P+Wff/7zn//8++9//sG5Uztav3H1inJIXkle8Qvn3+OROP2oj5OPmz7ev+m5PDDFyXan/UwewBd8124ZDn2o3eTBBmCKAzZQfjY75WX//Y+/Kj6Ln77//uF3r24vHyfP5ae9cRRsaH5I/48veQqP5Kh9X9z86wvn+wjhZfmYjTzmyBflSOBz5V1lXO8eH54mw8nzK8dTHsnPepbupwft1Vu+PslvaZPts73FaWxXbp/iUjx/I9SUc3HLqZ2DhntVP0ERfN79q918+/T2uFlO8ew8BW+qw4Rz5RZbOTp5fsJj+dTqFZ/llTAquLc+Em8jA/4dA/S89c95khEh8ZTYm8e3p+0QV9xP5f5fQjU8VLueJ3ite9CT9Lezn5ID+Kp8tB3EmOfdefsl580PY1WMDkaBNFXqH5VjeSSG5HjRdTzq+eAMjP+EL8vHyCSzFzW6LE96Prjv7uVpMup0uluMp7IpuWXb7XQ6wycZttkUb93toI269rHLKa8cbp0UnM2vTxM9t/v88IhzeN3k6SV/4tbyZse9fd4Qfd2JvO7m8eG5W57yDRbArMK5uDveGCT9Qb7IV+zaGM72xxPuPcLpSs8j59nzpBufM3x24nHavtoDhnIP6SXV8N64aDQkPTlRtnb2s99E39RfdRifrrwknbw7bo/JhXlLwelPmciT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";
  return image;
}

function fnt() {
  return "info face=\"Roboto\" size=192 bold=0 italic=0 charset=\"\" unicode=1 stretchH=100 smooth=1 aa=1 padding=24,24,24,24 spacing=12,12 outline=0\ncommon lineHeight=192 base=152 scaleW=3072 scaleH=1536 pages=1 packed=0 alphaChnl=0 redChnl=4 greenChnl=4 blueChnl=4\npage id=0 file=\"roboto_0.png\"\nchars count=194\nchar id=0    x=636   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=2    x=576   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=13   x=450   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=32   x=2987  y=1242  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=33   x=1714  y=769   width=66    height=163   xoffset=-12   yoffset=14    xadvance=41    page=0  chnl=15\nchar id=34   x=1999  y=1263  width=81    height=87    xoffset=-14   yoffset=8     xadvance=51    page=0  chnl=15\nchar id=35   x=1214  y=951   width=136   height=162   xoffset=-15   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=36   x=1610  y=0     width=122   height=196   xoffset=-16   yoffset=-4    xadvance=90    page=0  chnl=15\nchar id=37   x=1341  y=595   width=152   height=165   xoffset=-17   yoffset=13    xadvance=117   page=0  chnl=15\nchar id=38   x=1658  y=592   width=141   height=165   xoffset=-17   yoffset=13    xadvance=99    page=0  chnl=15\nchar id=39   x=2092  y=1263  width=62    height=85    xoffset=-17   yoffset=8     xadvance=28    page=0  chnl=15\nchar id=40   x=103   y=0     width=90    height=213   xoffset=-14   yoffset=0     xadvance=55    page=0  chnl=15\nchar id=41   x=0     y=0     width=91    height=213   xoffset=-22   yoffset=0     xadvance=56    page=0  chnl=15\nchar id=42   x=664   y=1294  width=114   height=114   xoffset=-23   yoffset=14    xadvance=69    page=0  chnl=15\nchar id=43   x=0     y=1317  width=128   height=129   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=44   x=1916  y=1264  width=71    height=88    xoffset=-22   yoffset=111   xadvance=31    page=0  chnl=15\nchar id=45   x=233   y=1457  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=46   x=2828  y=1245  width=68    height=65    xoffset=-14   yoffset=112   xadvance=42    page=0  chnl=15\nchar id=47   x=0     y=429   width=109   height=172   xoffset=-23   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=48   x=2392  y=583   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=49   x=112   y=1143  width=93    height=162   xoffset=-11   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=50   x=1443  y=772   width=126   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=51   x=2660  y=575   width=121   height=165   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=52   x=1794  y=943   width=132   height=162   xoffset=-21   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=53   x=539   y=779   width=121   height=164   xoffset=-13   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=54   x=406   y=779   width=121   height=164   xoffset=-14   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=55   x=2082  y=941   width=127   height=162   xoffset=-19   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=56   x=2526  y=581   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=57   x=1581  y=771   width=121   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=58   x=2383  y=1113  width=67    height=134   xoffset=-14   yoffset=43    xadvance=39    page=0  chnl=15\nchar id=59   x=372   y=1140  width=73    height=156   xoffset=-22   yoffset=43    xadvance=34    page=0  chnl=15\nchar id=60   x=539   y=1307  width=113   height=119   xoffset=-19   yoffset=42    xadvance=81    page=0  chnl=15\nchar id=61   x=1688  y=1269  width=115   height=93    xoffset=-13   yoffset=51    xadvance=88    page=0  chnl=15\nchar id=62   x=411   y=1308  width=116   height=119   xoffset=-14   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=63   x=800   y=779   width=113   height=164   xoffset=-19   yoffset=13    xadvance=76    page=0  chnl=15\nchar id=64   x=1421  y=0     width=177   height=196   xoffset=-16   yoffset=16    xadvance=144   page=0  chnl=15\nchar id=65   x=2708  y=752   width=150   height=162   xoffset=-23   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=66   x=2221  y=939   width=127   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=67   x=1811  y=592   width=137   height=165   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=68   x=1650  y=946   width=132   height=162   xoffset=-12   yoffset=14    xadvance=105   page=0  chnl=15\nchar id=69   x=2496  y=934   width=122   height=162   xoffset=-12   yoffset=14    xadvance=91    page=0  chnl=15\nchar id=70   x=2630  y=932   width=120   height=162   xoffset=-12   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=71   x=1960  y=590   width=137   height=165   xoffset=-15   yoffset=13    xadvance=109   page=0  chnl=15\nchar id=72   x=916   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=73   x=296   y=1142  width=64    height=162   xoffset=-10   yoffset=14    xadvance=44    page=0  chnl=15\nchar id=74   x=272   y=790   width=122   height=164   xoffset=-21   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=75   x=767   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=76   x=2762  y=926   width=119   height=162   xoffset=-12   yoffset=14    xadvance=86    page=0  chnl=15\nchar id=77   x=2197  y=765   width=163   height=162   xoffset=-12   yoffset=14    xadvance=140   page=0  chnl=15\nchar id=78   x=1065  y=952   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=79   x=1505  y=594   width=141   height=165   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=80   x=1938  y=943   width=132   height=162   xoffset=-12   yoffset=14    xadvance=101   page=0  chnl=15\nchar id=81   x=2222  y=207   width=141   height=183   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=82   x=1362  y=949   width=132   height=162   xoffset=-11   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=83   x=2109  y=588   width=132   height=165   xoffset=-18   yoffset=13    xadvance=95    page=0  chnl=15\nchar id=84   x=617   y=955   width=138   height=162   xoffset=-21   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=85   x=128   y=792   width=132   height=164   xoffset=-14   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=86   x=2870  y=749   width=147   height=162   xoffset=-22   yoffset=14    xadvance=102   page=0  chnl=15\nchar id=87   x=2002  y=767   width=183   height=162   xoffset=-20   yoffset=14    xadvance=142   page=0  chnl=15\nchar id=88   x=312   y=966   width=141   height=162   xoffset=-20   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=89   x=157   y=968   width=143   height=162   xoffset=-24   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=90   x=1506  y=947   width=132   height=162   xoffset=-18   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=91   x=658   y=0     width=79    height=202   xoffset=-13   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=92   x=2945  y=204   width=111   height=172   xoffset=-22   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=93   x=567   y=0     width=79    height=202   xoffset=-24   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=94   x=1570  y=1271  width=106   height=105   xoffset=-20   yoffset=14    xadvance=67    page=0  chnl=15\nchar id=95   x=0     y=1458  width=121   height=60    xoffset=-24   yoffset=128   xadvance=72    page=0  chnl=15\nchar id=96   x=2622  y=1258  width=82    height=71    xoffset=-20   yoffset=8     xadvance=49    page=0  chnl=15\nchar id=97   x=1585  y=1121  width=119   height=136   xoffset=-16   yoffset=42    xadvance=87    page=0  chnl=15\nchar id=98   x=677   y=418   width=121   height=170   xoffset=-14   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=99   x=1453  y=1123  width=120   height=136   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=100  x=1209  y=413   width=120   height=170   xoffset=-17   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=101  x=1320  y=1125  width=121   height=136   xoffset=-17   yoffset=42    xadvance=85    page=0  chnl=15\nchar id=102  x=1866  y=408   width=101   height=170   xoffset=-20   yoffset=6     xadvance=56    page=0  chnl=15\nchar id=103  x=134   y=612   width=121   height=167   xoffset=-17   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=104  x=2627  y=395   width=116   height=168   xoffset=-14   yoffset=8     xadvance=88    page=0  chnl=15\nchar id=105  x=1050  y=776   width=67    height=164   xoffset=-14   yoffset=12    xadvance=39    page=0  chnl=15\nchar id=106  x=1327  y=0     width=82    height=198   xoffset=-30   yoffset=12    xadvance=38    page=0  chnl=15\nchar id=107  x=2495  y=401   width=120   height=168   xoffset=-14   yoffset=8     xadvance=81    page=0  chnl=15\nchar id=108  x=2755  y=392   width=64    height=168   xoffset=-13   yoffset=8     xadvance=39    page=0  chnl=15\nchar id=109  x=1973  y=1117  width=168   height=134   xoffset=-14   yoffset=42    xadvance=140   page=0  chnl=15\nchar id=110  x=2153  y=1115  width=116   height=134   xoffset=-14   yoffset=42    xadvance=88    page=0  chnl=15\nchar id=111  x=1181  y=1126  width=127   height=136   xoffset=-18   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=112  x=267   y=611   width=121   height=167   xoffset=-14   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=113  x=400   y=600   width=120   height=167   xoffset=-17   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=114  x=2281  y=1113  width=90    height=134   xoffset=-14   yoffset=42    xadvance=54    page=0  chnl=15\nchar id=115  x=1716  y=1120  width=117   height=136   xoffset=-17   yoffset=42    xadvance=83    page=0  chnl=15\nchar id=116  x=457   y=1140  width=95    height=155   xoffset=-24   yoffset=23    xadvance=52    page=0  chnl=15\nchar id=117  x=1845  y=1117  width=116   height=135   xoffset=-14   yoffset=43    xadvance=88    page=0  chnl=15\nchar id=118  x=2772  y=1100  width=122   height=133   xoffset=-22   yoffset=43    xadvance=78    page=0  chnl=15\nchar id=119  x=2462  y=1113  width=163   height=133   xoffset=-22   yoffset=43    xadvance=120   page=0  chnl=15\nchar id=120  x=2637  y=1106  width=123   height=133   xoffset=-22   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=121  x=0     y=613   width=122   height=167   xoffset=-23   yoffset=43    xadvance=76    page=0  chnl=15\nchar id=122  x=2906  y=1097  width=117   height=133   xoffset=-18   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=123  x=458   y=0     width=97    height=202   xoffset=-20   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=124  x=2451  y=206   width=61    height=183   xoffset=-11   yoffset=14    xadvance=39    page=0  chnl=15\nchar id=125  x=349   y=0     width=97    height=202   xoffset=-23   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=126  x=2378  y=1259  width=138   height=79    xoffset=-14   yoffset=65    xadvance=109   page=0  chnl=15\nchar id=160  x=513   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=161  x=217   y=1142  width=67    height=162   xoffset=-14   yoffset=42    xadvance=39    page=0  chnl=15\nchar id=162  x=1341  y=413   width=120   height=170   xoffset=-16   yoffset=25    xadvance=88    page=0  chnl=15\nchar id=163  x=1300  y=774   width=131   height=163   xoffset=-18   yoffset=13    xadvance=93    page=0  chnl=15\nchar id=164  x=702   y=1129  width=149   height=149   xoffset=-17   yoffset=30    xadvance=114   page=0  chnl=15\nchar id=165  x=465   y=955   width=140   height=162   xoffset=-22   yoffset=14    xadvance=97    page=0  chnl=15\nchar id=166  x=2375  y=206   width=64    height=183   xoffset=-13   yoffset=14    xadvance=38    page=0  chnl=15\nchar id=167  x=205   y=0     width=132   height=202   xoffset=-18   yoffset=13    xadvance=98    page=0  chnl=15\nchar id=168  x=2716  y=1251  width=100   height=65    xoffset=-17   yoffset=12    xadvance=67    page=0  chnl=15\nchar id=169  x=995   y=599   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=170  x=1368  y=1273  width=99    height=109   xoffset=-13   yoffset=13    xadvance=71    page=0  chnl=15\nchar id=171  x=1131  y=1277  width=110   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=172  x=2251  y=1261  width=115   height=81    xoffset=-15   yoffset=65    xadvance=89    page=0  chnl=15\nchar id=173  x=133   y=1458  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=174  x=1168  y=597   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=175  x=333   y=1448  width=105   height=59    xoffset=-15   yoffset=14    xadvance=73    page=0  chnl=15\nchar id=176  x=1815  y=1268  width=89    height=88    xoffset=-15   yoffset=13    xadvance=60    page=0  chnl=15\nchar id=177  x=863   y=1129  width=121   height=147   xoffset=-17   yoffset=29    xadvance=85    page=0  chnl=15\nchar id=178  x=899   y=1288  width=97    height=111   xoffset=-19   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=179  x=790   y=1290  width=97    height=112   xoffset=-20   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=180  x=2528  y=1258  width=82    height=71    xoffset=-15   yoffset=8     xadvance=50    page=0  chnl=15\nchar id=181  x=866   y=599   width=117   height=166   xoffset=-13   yoffset=43    xadvance=91    page=0  chnl=15\nchar id=182  x=2893  y=923   width=110   height=162   xoffset=-20   yoffset=14    xadvance=78    page=0  chnl=15\nchar id=183  x=2908  y=1242  width=67    height=65    xoffset=-13   yoffset=62    xadvance=42    page=0  chnl=15\nchar id=184  x=2166  y=1261  width=73    height=82    xoffset=-15   yoffset=128   xadvance=40    page=0  chnl=15\nchar id=185  x=1479  y=1271  width=79    height=109   xoffset=-15   yoffset=14    xadvance=59    page=0  chnl=15\nchar id=186  x=1253  y=1274  width=103   height=109   xoffset=-15   yoffset=13    xadvance=73    page=0  chnl=15\nchar id=187  x=1008  y=1277  width=111   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=188  x=2542  y=758   width=154   height=162   xoffset=-18   yoffset=14    xadvance=117   page=0  chnl=15\nchar id=189  x=2372  y=760   width=158   height=162   xoffset=-18   yoffset=14    xadvance=124   page=0  chnl=15\nchar id=190  x=1129  y=776   width=159   height=163   xoffset=-16   yoffset=13    xadvance=124   page=0  chnl=15\nchar id=191  x=925   y=777   width=113   height=164   xoffset=-19   yoffset=42    xadvance=76    page=0  chnl=15\nchar id=192  x=162   y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=193  x=324   y=214   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=194  x=0     y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=195  x=1359  y=210   width=150   height=190   xoffset=-23   yoffset=-14   xadvance=104   page=0  chnl=15\nchar id=196  x=1814  y=208   width=150   height=188   xoffset=-23   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=197  x=1016  y=0     width=150   height=199   xoffset=-23   yoffset=-23   xadvance=104   page=0  chnl=15\nchar id=198  x=1792  y=769   width=198   height=162   xoffset=-26   yoffset=14    xadvance=150   page=0  chnl=15\nchar id=199  x=1178  y=0     width=137   height=198   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=200  x=2922  y=0     width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=201  x=641   y=214   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=202  x=775   y=213   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=203  x=1976  y=207   width=122   height=188   xoffset=-12   yoffset=-12   xadvance=91    page=0  chnl=15\nchar id=204  x=1018  y=211   width=82    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=205  x=1112  y=211   width=82    height=192   xoffset=-11   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=206  x=909   y=213   width=97    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=207  x=2110  y=207   width=100   height=188   xoffset=-28   yoffset=-12   xadvance=44    page=0  chnl=15\nchar id=208  x=0     y=969   width=145   height=162   xoffset=-22   yoffset=14    xadvance=107   page=0  chnl=15\nchar id=209  x=1521  y=208   width=137   height=190   xoffset=-12   yoffset=-14   xadvance=114   page=0  chnl=15\nchar id=210  x=2184  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=211  x=2031  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=212  x=1878  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=213  x=2769  y=0     width=141   height=193   xoffset=-16   yoffset=-15   xadvance=110   page=0  chnl=15\nchar id=214  x=1206  y=210   width=141   height=191   xoffset=-16   yoffset=-13   xadvance=110   page=0  chnl=15\nchar id=215  x=279   y=1316  width=120   height=120   xoffset=-18   yoffset=40    xadvance=85    page=0  chnl=15\nchar id=216  x=2655  y=206   width=143   height=174   xoffset=-16   yoffset=10    xadvance=110   page=0  chnl=15\nchar id=217  x=2625  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=218  x=2481  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=219  x=2337  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=220  x=1670  y=208   width=132   height=190   xoffset=-14   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=221  x=486   y=214   width=143   height=192   xoffset=-24   yoffset=-16   xadvance=96    page=0  chnl=15\nchar id=222  x=2360  y=939   width=124   height=162   xoffset=-12   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=223  x=121   y=429   width=127   height=171   xoffset=-14   yoffset=7     xadvance=95    page=0  chnl=15\nchar id=224  x=1604  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=225  x=1473  y=412   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=226  x=1735  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=227  x=532   y=600   width=119   height=167   xoffset=-16   yoffset=11    xadvance=87    page=0  chnl=15\nchar id=228  x=2926  y=569   width=119   height=165   xoffset=-16   yoffset=13    xadvance=87    page=0  chnl=15\nchar id=229  x=2524  y=206   width=119   height=177   xoffset=-16   yoffset=1     xadvance=87    page=0  chnl=15\nchar id=230  x=996   y=1129  width=173   height=136   xoffset=-19   yoffset=42    xadvance=135   page=0  chnl=15\nchar id=231  x=1979  y=407   width=120   height=169   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=232  x=1076  y=415   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=233  x=943   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=234  x=810   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=235  x=2793  y=572   width=121   height=165   xoffset=-17   yoffset=13    xadvance=85    page=0  chnl=15\nchar id=236  x=772   y=600   width=82    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=237  x=2970  y=388   width=82    height=167   xoffset=-13   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=238  x=663   y=600   width=97    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=239  x=0     y=1143  width=100   height=162   xoffset=-30   yoffset=14    xadvance=40    page=0  chnl=15\nchar id=240  x=2810  y=205   width=123   height=173   xoffset=-15   yoffset=5     xadvance=94    page=0  chnl=15\nchar id=241  x=0     y=792   width=116   height=165   xoffset=-14   yoffset=11    xadvance=88    page=0  chnl=15\nchar id=242  x=260   y=429   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=243  x=538   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=244  x=399   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=245  x=2831  y=390   width=127   height=167   xoffset=-18   yoffset=11    xadvance=91    page=0  chnl=15\nchar id=246  x=2253  y=583   width=127   height=165   xoffset=-18   yoffset=13    xadvance=91    page=0  chnl=15\nchar id=247  x=140   y=1317  width=127   height=128   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=248  x=564   y=1129  width=126   height=153   xoffset=-17   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=249  x=2111  y=407   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=250  x=2239  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=251  x=2367  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=252  x=672   y=779   width=116   height=164   xoffset=-14   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=253  x=749   y=0     width=122   height=201   xoffset=-23   yoffset=9     xadvance=76    page=0  chnl=15\nchar id=254  x=883   y=0     width=121   height=201   xoffset=-13   yoffset=8     xadvance=92    page=0  chnl=15\nchar id=255  x=1744  y=0     width=122   height=196   xoffset=-23   yoffset=14    xadvance=76    page=0  chnl=15\nkernings count=1686\nkerning first=32  second=84  amount=-3\nkerning first=40  second=86  amount=2\nkerning first=40  second=87  amount=1\nkerning first=40  second=89  amount=2\nkerning first=40  second=221 amount=2\nkerning first=70  second=44  amount=-18\nkerning first=70  second=46  amount=-18\nkerning first=70  second=65  amount=-13\nkerning first=70  second=74  amount=-21\nkerning first=70  second=84  amount=2\nkerning first=70  second=97  amount=-3\nkerning first=70  second=99  amount=-2\nkerning first=70  second=100 amount=-2\nkerning first=70  second=101 amount=-2\nkerning first=70  second=103 amount=-2\nkerning first=70  second=111 amount=-2\nkerning first=70  second=113 amount=-2\nkerning first=70  second=117 amount=-2\nkerning first=70  second=118 amount=-2\nkerning first=70  second=121 amount=-2\nkerning first=70  second=192 amount=-13\nkerning first=70  second=193 amount=-13\nkerning first=70  second=194 amount=-13\nkerning first=70  second=195 amount=-13\nkerning first=70  second=196 amount=-13\nkerning first=70  second=197 amount=-13\nkerning first=70  second=224 amount=-3\nkerning first=70  second=225 amount=-3\nkerning first=70  second=226 amount=-3\nkerning first=70  second=227 amount=-3\nkerning first=70  second=228 amount=-3\nkerning first=70  second=229 amount=-3\nkerning first=70  second=231 amount=-2\nkerning first=70  second=232 amount=-2\nkerning first=70  second=233 amount=-2\nkerning first=70  second=234 amount=-2\nkerning first=70  second=235 amount=-2\nkerning first=70  second=242 amount=-2\nkerning first=70  second=243 amount=-2\nkerning first=70  second=244 amount=-2\nkerning first=70  second=245 amount=-2\nkerning first=70  second=246 amount=-2\nkerning first=70  second=249 amount=-2\nkerning first=70  second=250 amount=-2\nkerning first=70  second=251 amount=-2\nkerning first=70  second=252 amount=-2\nkerning first=70  second=253 amount=-2\nkerning first=70  second=255 amount=-2\nkerning first=81  second=84  amount=-3\nkerning first=81  second=86  amount=-2\nkerning first=81  second=87  amount=-2\nkerning first=81  second=89  amount=-3\nkerning first=81  second=221 amount=-3\nkerning first=82  second=84  amount=-6\nkerning first=82  second=86  amount=-1\nkerning first=82  second=89  amount=-4\nkerning first=82  second=221 amount=-4\nkerning first=91  second=74  amount=-1\nkerning first=91  second=85  amount=-1\nkerning first=91  second=217 amount=-1\nkerning first=91  second=218 amount=-1\nkerning first=91  second=219 amount=-1\nkerning first=91  second=220 amount=-1\nkerning first=102 second=34  amount=1\nkerning first=102 second=39  amount=1\nkerning first=102 second=99  amount=-2\nkerning first=102 second=100 amount=-2\nkerning first=102 second=101 amount=-2\nkerning first=102 second=103 amount=-2\nkerning first=102 second=113 amount=-2\nkerning first=102 second=231 amount=-2\nkerning first=102 second=232 amount=-2\nkerning first=102 second=233 amount=-2\nkerning first=102 second=234 amount=-2\nkerning first=102 second=235 amount=-2\nkerning first=107 second=99  amount=-2\nkerning first=107 second=100 amount=-2\nkerning first=107 second=101 amount=-2\nkerning first=107 second=103 amount=-2\nkerning first=107 second=113 amount=-2\nkerning first=107 second=231 amount=-2\nkerning first=107 second=232 amount=-2\nkerning first=107 second=233 amount=-2\nkerning first=107 second=234 amount=-2\nkerning first=107 second=235 amount=-2\nkerning first=116 second=111 amount=-2\nkerning first=116 second=242 amount=-2\nkerning first=116 second=243 amount=-2\nkerning first=116 second=244 amount=-2\nkerning first=116 second=245 amount=-2\nkerning first=116 second=246 amount=-2\nkerning first=119 second=44  amount=-10\nkerning first=119 second=46  amount=-10\nkerning first=123 second=74  amount=-2\nkerning first=123 second=85  amount=-2\nkerning first=123 second=217 amount=-2\nkerning first=123 second=218 amount=-2\nkerning first=123 second=219 amount=-2\nkerning first=123 second=220 amount=-2\nkerning first=34  second=34  amount=-8\nkerning first=34  second=39  amount=-8\nkerning first=34  second=111 amount=-5\nkerning first=34  second=242 amount=-5\nkerning first=34  second=243 amount=-5\nkerning first=34  second=244 amount=-5\nkerning first=34  second=245 amount=-5\nkerning first=34  second=246 amount=-5\nkerning first=34  second=65  amount=-9\nkerning first=34  second=192 amount=-9\nkerning first=34  second=193 amount=-9\nkerning first=34  second=194 amount=-9\nkerning first=34  second=195 amount=-9\nkerning first=34  second=196 amount=-9\nkerning first=34  second=197 amount=-9\nkerning first=34  second=99  amount=-5\nkerning first=34  second=100 amount=-5\nkerning first=34  second=101 amount=-5\nkerning first=34  second=103 amount=-5\nkerning first=34  second=113 amount=-5\nkerning first=34  second=231 amount=-5\nkerning first=34  second=232 amount=-5\nkerning first=34  second=233 amount=-5\nkerning first=34  second=234 amount=-5\nkerning first=34  second=235 amount=-5\nkerning first=34  second=109 amount=-2\nkerning first=34  second=110 amount=-2\nkerning first=34  second=112 amount=-2\nkerning first=34  second=241 amount=-2\nkerning first=34  second=97  amount=-4\nkerning first=34  second=224 amount=-4\nkerning first=34  second=225 amount=-4\nkerning first=34  second=226 amount=-4\nkerning first=34  second=227 amount=-4\nkerning first=34  second=228 amount=-4\nkerning first=34  second=229 amount=-4\nkerning first=34  second=115 amount=-6\nkerning first=39  second=34  amount=-8\nkerning first=39  second=39  amount=-8\nkerning first=39  second=111 amount=-5\nkerning first=39  second=242 amount=-5\nkerning first=39  second=243 amount=-5\nkerning first=39  second=244 amount=-5\nkerning first=39  second=245 amount=-5\nkerning first=39  second=246 amount=-5\nkerning first=39  second=65  amount=-9\nkerning first=39  second=192 amount=-9\nkerning first=39  second=193 amount=-9\nkerning first=39  second=194 amount=-9\nkerning first=39  second=195 amount=-9\nkerning first=39  second=196 amount=-9\nkerning first=39  second=197 amount=-9\nkerning first=39  second=99  amount=-5\nkerning first=39  second=100 amount=-5\nkerning first=39  second=101 amount=-5\nkerning first=39  second=103 amount=-5\nkerning first=39  second=113 amount=-5\nkerning first=39  second=231 amount=-5\nkerning first=39  second=232 amount=-5\nkerning first=39  second=233 amount=-5\nkerning first=39  second=234 amount=-5\nkerning first=39  second=235 amount=-5\nkerning first=39  second=109 amount=-2\nkerning first=39  second=110 amount=-2\nkerning first=39  second=112 amount=-2\nkerning first=39  second=241 amount=-2\nkerning first=39  second=97  amount=-4\nkerning first=39  second=224 amount=-4\nkerning first=39  second=225 amount=-4\nkerning first=39  second=226 amount=-4\nkerning first=39  second=227 amount=-4\nkerning first=39  second=228 amount=-4\nkerning first=39  second=229 amount=-4\nkerning first=39  second=115 amount=-6\nkerning first=44  second=34  amount=-13\nkerning first=44  second=39  amount=-13\nkerning first=46  second=34  amount=-13\nkerning first=46  second=39  amount=-13\nkerning first=65  second=118 amount=-4\nkerning first=65  second=121 amount=-4\nkerning first=65  second=253 amount=-4\nkerning first=65  second=255 amount=-4\nkerning first=65  second=67  amount=-1\nkerning first=65  second=71  amount=-1\nkerning first=65  second=79  amount=-1\nkerning first=65  second=81  amount=-1\nkerning first=65  second=216 amount=-1\nkerning first=65  second=199 amount=-1\nkerning first=65  second=210 amount=-1\nkerning first=65  second=211 amount=-1\nkerning first=65  second=212 amount=-1\nkerning first=65  second=213 amount=-1\nkerning first=65  second=214 amount=-1\nkerning first=65  second=85  amount=-1\nkerning first=65  second=217 amount=-1\nkerning first=65  second=218 amount=-1\nkerning first=65  second=219 amount=-1\nkerning first=65  second=220 amount=-1\nkerning first=65  second=34  amount=-9\nkerning first=65  second=39  amount=-9\nkerning first=65  second=111 amount=-1\nkerning first=65  second=242 amount=-1\nkerning first=65  second=243 amount=-1\nkerning first=65  second=244 amount=-1\nkerning first=65  second=245 amount=-1\nkerning first=65  second=246 amount=-1\nkerning first=65  second=87  amount=-5\nkerning first=65  second=84  amount=-10\nkerning first=65  second=117 amount=-1\nkerning first=65  second=249 amount=-1\nkerning first=65  second=250 amount=-1\nkerning first=65  second=251 amount=-1\nkerning first=65  second=252 amount=-1\nkerning first=65  second=122 amount=1\nkerning first=65  second=86  amount=-7\nkerning first=65  second=89  amount=-7\nkerning first=65  second=221 amount=-7\nkerning first=66  second=84  amount=-2\nkerning first=66  second=86  amount=-2\nkerning first=66  second=89  amount=-4\nkerning first=66  second=221 amount=-4\nkerning first=67  second=84  amount=-2\nkerning first=68  second=84  amount=-2\nkerning first=68  second=86  amount=-2\nkerning first=68  second=89  amount=-3\nkerning first=68  second=221 amount=-3\nkerning first=68  second=65  amount=-2\nkerning first=68  second=192 amount=-2\nkerning first=68  second=193 amount=-2\nkerning first=68  second=194 amount=-2\nkerning first=68  second=195 amount=-2\nkerning first=68  second=196 amount=-2\nkerning first=68  second=197 amount=-2\nkerning first=68  second=88  amount=-2\nkerning first=68  second=44  amount=-8\nkerning first=68  second=46  amount=-8\nkerning first=68  second=90  amount=-2\nkerning first=69  second=118 amount=-2\nkerning first=69  second=121 amount=-2\nkerning first=69  second=253 amount=-2\nkerning first=69  second=255 amount=-2\nkerning first=69  second=111 amount=-1\nkerning first=69  second=242 amount=-1\nkerning first=69  second=243 amount=-1\nkerning first=69  second=244 amount=-1\nkerning first=69  second=245 amount=-1\nkerning first=69  second=246 amount=-1\nkerning first=69  second=84  amount=2\nkerning first=69  second=117 amount=-1\nkerning first=69  second=249 amount=-1\nkerning first=69  second=250 amount=-1\nkerning first=69  second=251 amount=-1\nkerning first=69  second=252 amount=-1\nkerning first=69  second=99  amount=-1\nkerning first=69  second=100 amount=-1\nkerning first=69  second=101 amount=-1\nkerning first=69  second=103 amount=-1\nkerning first=69  second=113 amount=-1\nkerning first=69  second=231 amount=-1\nkerning first=69  second=232 amount=-1\nkerning first=69  second=233 amount=-1\nkerning first=69  second=234 amount=-1\nkerning first=69  second=235 amount=-1\nkerning first=72  second=84  amount=-2\nkerning first=72  second=89  amount=-2\nkerning first=72  second=221 amount=-2\nkerning first=72  second=65  amount=1\nkerning first=72  second=192 amount=1\nkerning first=72  second=193 amount=1\nkerning first=72  second=194 amount=1\nkerning first=72  second=195 amount=1\nkerning first=72  second=196 amount=1\nkerning first=72  second=197 amount=1\nkerning first=72  second=88  amount=1\nkerning first=73  second=84  amount=-2\nkerning first=73  second=89  amount=-2\nkerning first=73  second=221 amount=-2\nkerning first=73  second=65  amount=1\nkerning first=73  second=192 amount=1\nkerning first=73  second=193 amount=1\nkerning first=73  second=194 amount=1\nkerning first=73  second=195 amount=1\nkerning first=73  second=196 amount=1\nkerning first=73  second=197 amount=1\nkerning first=73  second=88  amount=1\nkerning first=74  second=65  amount=-2\nkerning first=74  second=192 amount=-2\nkerning first=74  second=193 amount=-2\nkerning first=74  second=194 amount=-2\nkerning first=74  second=195 amount=-2\nkerning first=74  second=196 amount=-2\nkerning first=74  second=197 amount=-2\nkerning first=75  second=118 amount=-3\nkerning first=75  second=121 amount=-3\nkerning first=75  second=253 amount=-3\nkerning first=75  second=255 amount=-3\nkerning first=75  second=67  amount=-2\nkerning first=75  second=71  amount=-2\nkerning first=75  second=79  amount=-2\nkerning first=75  second=81  amount=-2\nkerning first=75  second=216 amount=-2\nkerning first=75  second=199 amount=-2\nkerning first=75  second=210 amount=-2\nkerning first=75  second=211 amount=-2\nkerning first=75  second=212 amount=-2\nkerning first=75  second=213 amount=-2\nkerning first=75  second=214 amount=-2\nkerning first=75  second=111 amount=-2\nkerning first=75  second=242 amount=-2\nkerning first=75  second=243 amount=-2\nkerning first=75  second=244 amount=-2\nkerning first=75  second=245 amount=-2\nkerning first=75  second=246 amount=-2\nkerning first=75  second=117 amount=-2\nkerning first=75  second=249 amount=-2\nkerning first=75  second=250 amount=-2\nkerning first=75  second=251 amount=-2\nkerning first=75  second=252 amount=-2\nkerning first=75  second=99  amount=-2\nkerning first=75  second=100 amount=-2\nkerning first=75  second=101 amount=-2\nkerning first=75  second=103 amount=-2\nkerning first=75  second=113 amount=-2\nkerning first=75  second=231 amount=-2\nkerning first=75  second=232 amount=-2\nkerning first=75  second=233 amount=-2\nkerning first=75  second=234 amount=-2\nkerning first=75  second=235 amount=-2\nkerning first=75  second=45  amount=-5\nkerning first=75  second=173 amount=-5\nkerning first=75  second=109 amount=-2\nkerning first=75  second=110 amount=-2\nkerning first=75  second=112 amount=-2\nkerning first=75  second=241 amount=-2\nkerning first=76  second=118 amount=-10\nkerning first=76  second=121 amount=-10\nkerning first=76  second=253 amount=-10\nkerning first=76  second=255 amount=-10\nkerning first=76  second=67  amount=-5\nkerning first=76  second=71  amount=-5\nkerning first=76  second=79  amount=-5\nkerning first=76  second=81  amount=-5\nkerning first=76  second=216 amount=-5\nkerning first=76  second=199 amount=-5\nkerning first=76  second=210 amount=-5\nkerning first=76  second=211 amount=-5\nkerning first=76  second=212 amount=-5\nkerning first=76  second=213 amount=-5\nkerning first=76  second=214 amount=-5\nkerning first=76  second=85  amount=-4\nkerning first=76  second=217 amount=-4\nkerning first=76  second=218 amount=-4\nkerning first=76  second=219 amount=-4\nkerning first=76  second=220 amount=-4\nkerning first=76  second=34  amount=-26\nkerning first=76  second=39  amount=-26\nkerning first=76  second=87  amount=-11\nkerning first=76  second=84  amount=-21\nkerning first=76  second=117 amount=-3\nkerning first=76  second=249 amount=-3\nkerning first=76  second=250 amount=-3\nkerning first=76  second=251 amount=-3\nkerning first=76  second=252 amount=-3\nkerning first=76  second=86  amount=-14\nkerning first=76  second=89  amount=-19\nkerning first=76  second=221 amount=-19\nkerning first=76  second=65  amount=1\nkerning first=76  second=192 amount=1\nkerning first=76  second=193 amount=1\nkerning first=76  second=194 amount=1\nkerning first=76  second=195 amount=1\nkerning first=76  second=196 amount=1\nkerning first=76  second=197 amount=1\nkerning first=77  second=84  amount=-2\nkerning first=77  second=89  amount=-2\nkerning first=77  second=221 amount=-2\nkerning first=77  second=65  amount=1\nkerning first=77  second=192 amount=1\nkerning first=77  second=193 amount=1\nkerning first=77  second=194 amount=1\nkerning first=77  second=195 amount=1\nkerning first=77  second=196 amount=1\nkerning first=77  second=197 amount=1\nkerning first=77  second=88  amount=1\nkerning first=78  second=84  amount=-2\nkerning first=78  second=89  amount=-2\nkerning first=78  second=221 amount=-2\nkerning first=78  second=65  amount=1\nkerning first=78  second=192 amount=1\nkerning first=78  second=193 amount=1\nkerning first=78  second=194 amount=1\nkerning first=78  second=195 amount=1\nkerning first=78  second=196 amount=1\nkerning first=78  second=197 amount=1\nkerning first=78  second=88  amount=1\nkerning first=79  second=84  amount=-2\nkerning first=79  second=86  amount=-2\nkerning first=79  second=89  amount=-3\nkerning first=79  second=221 amount=-3\nkerning first=79  second=65  amount=-2\nkerning first=79  second=192 amount=-2\nkerning first=79  second=193 amount=-2\nkerning first=79  second=194 amount=-2\nkerning first=79  second=195 amount=-2\nkerning first=79  second=196 amount=-2\nkerning first=79  second=197 amount=-2\nkerning first=79  second=88  amount=-2\nkerning first=79  second=44  amount=-8\nkerning first=79  second=46  amount=-8\nkerning first=79  second=90  amount=-2\nkerning first=80  second=118 amount=1\nkerning first=80  second=121 amount=1\nkerning first=80  second=253 amount=1\nkerning first=80  second=255 amount=1\nkerning first=80  second=111 amount=-1\nkerning first=80  second=242 amount=-1\nkerning first=80  second=243 amount=-1\nkerning first=80  second=244 amount=-1\nkerning first=80  second=245 amount=-1\nkerning first=80  second=246 amount=-1\nkerning first=80  second=65  amount=-11\nkerning first=80  second=192 amount=-11\nkerning first=80  second=193 amount=-11\nkerning first=80  second=194 amount=-11\nkerning first=80  second=195 amount=-11\nkerning first=80  second=196 amount=-11\nkerning first=80  second=197 amount=-11\nkerning first=80  second=88  amount=-2\nkerning first=80  second=44  amount=-25\nkerning first=80  second=46  amount=-25\nkerning first=80  second=90  amount=-2\nkerning first=80  second=99  amount=-1\nkerning first=80  second=100 amount=-1\nkerning first=80  second=101 amount=-1\nkerning first=80  second=103 amount=-1\nkerning first=80  second=113 amount=-1\nkerning first=80  second=231 amount=-1\nkerning first=80  second=232 amount=-1\nkerning first=80  second=233 amount=-1\nkerning first=80  second=234 amount=-1\nkerning first=80  second=235 amount=-1\nkerning first=80  second=97  amount=-1\nkerning first=80  second=224 amount=-1\nkerning first=80  second=225 amount=-1\nkerning first=80  second=226 amount=-1\nkerning first=80  second=227 amount=-1\nkerning first=80  second=228 amount=-1\nkerning first=80  second=229 amount=-1\nkerning first=80  second=74  amount=-16\nkerning first=84  second=118 amount=-6\nkerning first=84  second=121 amount=-6\nkerning first=84  second=253 amount=-6\nkerning first=84  second=255 amount=-6\nkerning first=84  second=67  amount=-2\nkerning first=84  second=71  amount=-2\nkerning first=84  second=79  amount=-2\nkerning first=84  second=81  amount=-2\nkerning first=84  second=216 amount=-2\nkerning first=84  second=199 amount=-2\nkerning first=84  second=210 amount=-2\nkerning first=84  second=211 amount=-2\nkerning first=84  second=212 amount=-2\nkerning first=84  second=213 amount=-2\nkerning first=84  second=214 amount=-2\nkerning first=84  second=111 amount=-8\nkerning first=84  second=242 amount=-8\nkerning first=84  second=243 amount=-8\nkerning first=84  second=244 amount=-8\nkerning first=84  second=245 amount=-8\nkerning first=84  second=246 amount=-8\nkerning first=84  second=87  amount=1\nkerning first=84  second=84  amount=1\nkerning first=84  second=117 amount=-7\nkerning first=84  second=249 amount=-7\nkerning first=84  second=250 amount=-7\nkerning first=84  second=251 amount=-7\nkerning first=84  second=252 amount=-7\nkerning first=84  second=122 amount=-5\nkerning first=84  second=86  amount=1\nkerning first=84  second=89  amount=1\nkerning first=84  second=221 amount=1\nkerning first=84  second=65  amount=-6\nkerning first=84  second=192 amount=-6\nkerning first=84  second=193 amount=-6\nkerning first=84  second=194 amount=-6\nkerning first=84  second=195 amount=-6\nkerning first=84  second=196 amount=-6\nkerning first=84  second=197 amount=-6\nkerning first=84  second=44  amount=-17\nkerning first=84  second=46  amount=-17\nkerning first=84  second=99  amount=-8\nkerning first=84  second=100 amount=-8\nkerning first=84  second=101 amount=-8\nkerning first=84  second=103 amount=-8\nkerning first=84  second=113 amount=-8\nkerning first=84  second=231 amount=-8\nkerning first=84  second=232 amount=-8\nkerning first=84  second=233 amount=-8\nkerning first=84  second=234 amount=-8\nkerning first=84  second=235 amount=-8\nkerning first=84  second=120 amount=-6\nkerning first=84  second=45  amount=-18\nkerning first=84  second=173 amount=-18\nkerning first=84  second=109 amount=-9\nkerning first=84  second=110 amount=-9\nkerning first=84  second=112 amount=-9\nkerning first=84  second=241 amount=-9\nkerning first=84  second=83  amount=-1\nkerning first=84  second=97  amount=-9\nkerning first=84  second=224 amount=-9\nkerning first=84  second=225 amount=-9\nkerning first=84  second=226 amount=-9\nkerning first=84  second=227 amount=-9\nkerning first=84  second=228 amount=-9\nkerning first=84  second=229 amount=-9\nkerning first=84  second=115 amount=-9\nkerning first=84  second=74  amount=-19\nkerning first=85  second=65  amount=-2\nkerning first=85  second=192 amount=-2\nkerning first=85  second=193 amount=-2\nkerning first=85  second=194 amount=-2\nkerning first=85  second=195 amount=-2\nkerning first=85  second=196 amount=-2\nkerning first=85  second=197 amount=-2\nkerning first=86  second=118 amount=-1\nkerning first=86  second=121 amount=-1\nkerning first=86  second=253 amount=-1\nkerning first=86  second=255 amount=-1\nkerning first=86  second=67  amount=-1\nkerning first=86  second=71  amount=-1\nkerning first=86  second=79  amount=-1\nkerning first=86  second=81  amount=-1\nkerning first=86  second=216 amount=-1\nkerning first=86  second=199 amount=-1\nkerning first=86  second=210 amount=-1\nkerning first=86  second=211 amount=-1\nkerning first=86  second=212 amount=-1\nkerning first=86  second=213 amount=-1\nkerning first=86  second=214 amount=-1\nkerning first=86  second=111 amount=-4\nkerning first=86  second=242 amount=-4\nkerning first=86  second=243 amount=-4\nkerning first=86  second=244 amount=-4\nkerning first=86  second=245 amount=-4\nkerning first=86  second=246 amount=-4\nkerning first=86  second=117 amount=-2\nkerning first=86  second=249 amount=-2\nkerning first=86  second=250 amount=-2\nkerning first=86  second=251 amount=-2\nkerning first=86  second=252 amount=-2\nkerning first=86  second=65  amount=-6\nkerning first=86  second=192 amount=-6\nkerning first=86  second=193 amount=-6\nkerning first=86  second=194 amount=-6\nkerning first=86  second=195 amount=-6\nkerning first=86  second=196 amount=-6\nkerning first=86  second=197 amount=-6\nkerning first=86  second=44  amount=-18\nkerning first=86  second=46  amount=-18\nkerning first=86  second=99  amount=-3\nkerning first=86  second=100 amount=-3\nkerning first=86  second=101 amount=-3\nkerning first=86  second=103 amount=-3\nkerning first=86  second=113 amount=-3\nkerning first=86  second=231 amount=-3\nkerning first=86  second=232 amount=-3\nkerning first=86  second=233 amount=-3\nkerning first=86  second=234 amount=-3\nkerning first=86  second=235 amount=-3\nkerning first=86  second=45  amount=-3\nkerning first=86  second=173 amount=-3\nkerning first=86  second=97  amount=-4\nkerning first=86  second=224 amount=-4\nkerning first=86  second=225 amount=-4\nkerning first=86  second=226 amount=-4\nkerning first=86  second=227 amount=-4\nkerning first=86  second=228 amount=-4\nkerning first=86  second=229 amount=-4\nkerning first=87  second=111 amount=-2\nkerning first=87  second=242 amount=-2\nkerning first=87  second=243 amount=-2\nkerning first=87  second=244 amount=-2\nkerning first=87  second=245 amount=-2\nkerning first=87  second=246 amount=-2\nkerning first=87  second=84  amount=1\nkerning first=87  second=117 amount=-1\nkerning first=87  second=249 amount=-1\nkerning first=87  second=250 amount=-1\nkerning first=87  second=251 amount=-1\nkerning first=87  second=252 amount=-1\nkerning first=87  second=65  amount=-3\nkerning first=87  second=192 amount=-3\nkerning first=87  second=193 amount=-3\nkerning first=87  second=194 amount=-3\nkerning first=87  second=195 amount=-3\nkerning first=87  second=196 amount=-3\nkerning first=87  second=197 amount=-3\nkerning first=87  second=44  amount=-10\nkerning first=87  second=46  amount=-10\nkerning first=87  second=99  amount=-2\nkerning first=87  second=100 amount=-2\nkerning first=87  second=101 amount=-2\nkerning first=87  second=103 amount=-2\nkerning first=87  second=113 amount=-2\nkerning first=87  second=231 amount=-2\nkerning first=87  second=232 amount=-2\nkerning first=87  second=233 amount=-2\nkerning first=87  second=234 amount=-2\nkerning first=87  second=235 amount=-2\nkerning first=87  second=45  amount=-5\nkerning first=87  second=173 amount=-5\nkerning first=87  second=97  amount=-3\nkerning first=87  second=224 amount=-3\nkerning first=87  second=225 amount=-3\nkerning first=87  second=226 amount=-3\nkerning first=87  second=227 amount=-3\nkerning first=87  second=228 amount=-3\nkerning first=87  second=229 amount=-3\nkerning first=88  second=118 amount=-2\nkerning first=88  second=121 amount=-2\nkerning first=88  second=253 amount=-2\nkerning first=88  second=255 amount=-2\nkerning first=88  second=67  amount=-2\nkerning first=88  second=71  amount=-2\nkerning first=88  second=79  amount=-2\nkerning first=88  second=81  amount=-2\nkerning first=88  second=216 amount=-2\nkerning first=88  second=199 amount=-2\nkerning first=88  second=210 amount=-2\nkerning first=88  second=211 amount=-2\nkerning first=88  second=212 amount=-2\nkerning first=88  second=213 amount=-2\nkerning first=88  second=214 amount=-2\nkerning first=88  second=111 amount=-2\nkerning first=88  second=242 amount=-2\nkerning first=88  second=243 amount=-2\nkerning first=88  second=244 amount=-2\nkerning first=88  second=245 amount=-2\nkerning first=88  second=246 amount=-2\nkerning first=88  second=117 amount=-2\nkerning first=88  second=249 amount=-2\nkerning first=88  second=250 amount=-2\nkerning first=88  second=251 amount=-2\nkerning first=88  second=252 amount=-2\nkerning first=88  second=86  amount=1\nkerning first=88  second=99  amount=-2\nkerning first=88  second=100 amount=-2\nkerning first=88  second=101 amount=-2\nkerning first=88  second=103 amount=-2\nkerning first=88  second=113 amount=-2\nkerning first=88  second=231 amount=-2\nkerning first=88  second=232 amount=-2\nkerning first=88  second=233 amount=-2\nkerning first=88  second=234 amount=-2\nkerning first=88  second=235 amount=-2\nkerning first=88  second=45  amount=-4\nkerning first=88  second=173 amount=-4\nkerning first=89  second=118 amount=-2\nkerning first=89  second=121 amount=-2\nkerning first=89  second=253 amount=-2\nkerning first=89  second=255 amount=-2\nkerning first=89  second=67  amount=-2\nkerning first=89  second=71  amount=-2\nkerning first=89  second=79  amount=-2\nkerning first=89  second=81  amount=-2\nkerning first=89  second=216 amount=-2\nkerning first=89  second=199 amount=-2\nkerning first=89  second=210 amount=-2\nkerning first=89  second=211 amount=-2\nkerning first=89  second=212 amount=-2\nkerning first=89  second=213 amount=-2\nkerning first=89  second=214 amount=-2\nkerning first=89  second=85  amount=-7\nkerning first=89  second=217 amount=-7\nkerning first=89  second=218 amount=-7\nkerning first=89  second=219 amount=-7\nkerning first=89  second=220 amount=-7\nkerning first=89  second=111 amount=-5\nkerning first=89  second=242 amount=-5\nkerning first=89  second=243 amount=-5\nkerning first=89  second=244 amount=-5\nkerning first=89  second=245 amount=-5\nkerning first=89  second=246 amount=-5\nkerning first=89  second=87  amount=1\nkerning first=89  second=84  amount=1\nkerning first=89  second=117 amount=-3\nkerning first=89  second=249 amount=-3\nkerning first=89  second=250 amount=-3\nkerning first=89  second=251 amount=-3\nkerning first=89  second=252 amount=-3\nkerning first=89  second=122 amount=-2\nkerning first=89  second=86  amount=1\nkerning first=89  second=89  amount=1\nkerning first=89  second=221 amount=1\nkerning first=89  second=65  amount=-7\nkerning first=89  second=192 amount=-7\nkerning first=89  second=193 amount=-7\nkerning first=89  second=194 amount=-7\nkerning first=89  second=195 amount=-7\nkerning first=89  second=196 amount=-7\nkerning first=89  second=197 amount=-7\nkerning first=89  second=88  amount=1\nkerning first=89  second=44  amount=-16\nkerning first=89  second=46  amount=-16\nkerning first=89  second=99  amount=-5\nkerning first=89  second=100 amount=-5\nkerning first=89  second=101 amount=-5\nkerning first=89  second=103 amount=-5\nkerning first=89  second=113 amount=-5\nkerning first=89  second=231 amount=-5\nkerning first=89  second=232 amount=-5\nkerning first=89  second=233 amount=-5\nkerning first=89  second=234 amount=-5\nkerning first=89  second=235 amount=-5\nkerning first=89  second=120 amount=-2\nkerning first=89  second=45  amount=-4\nkerning first=89  second=173 amount=-4\nkerning first=89  second=109 amount=-3\nkerning first=89  second=110 amount=-3\nkerning first=89  second=112 amount=-3\nkerning first=89  second=241 amount=-3\nkerning first=89  second=83  amount=-1\nkerning first=89  second=97  amount=-6\nkerning first=89  second=224 amount=-6\nkerning first=89  second=225 amount=-6\nkerning first=89  second=226 amount=-6\nkerning first=89  second=227 amount=-6\nkerning first=89  second=228 amount=-6\nkerning first=89  second=229 amount=-6\nkerning first=89  second=115 amount=-5\nkerning first=89  second=74  amount=-7\nkerning first=90  second=118 amount=-2\nkerning first=90  second=121 amount=-2\nkerning first=90  second=253 amount=-2\nkerning first=90  second=255 amount=-2\nkerning first=90  second=67  amount=-2\nkerning first=90  second=71  amount=-2\nkerning first=90  second=79  amount=-2\nkerning first=90  second=81  amount=-2\nkerning first=90  second=216 amount=-2\nkerning first=90  second=199 amount=-2\nkerning first=90  second=210 amount=-2\nkerning first=90  second=211 amount=-2\nkerning first=90  second=212 amount=-2\nkerning first=90  second=213 amount=-2\nkerning first=90  second=214 amount=-2\nkerning first=90  second=111 amount=-2\nkerning first=90  second=242 amount=-2\nkerning first=90  second=243 amount=-2\nkerning first=90  second=244 amount=-2\nkerning first=90  second=245 amount=-2\nkerning first=90  second=246 amount=-2\nkerning first=90  second=117 amount=-1\nkerning first=90  second=249 amount=-1\nkerning first=90  second=250 amount=-1\nkerning first=90  second=251 amount=-1\nkerning first=90  second=252 amount=-1\nkerning first=90  second=65  amount=1\nkerning first=90  second=192 amount=1\nkerning first=90  second=193 amount=1\nkerning first=90  second=194 amount=1\nkerning first=90  second=195 amount=1\nkerning first=90  second=196 amount=1\nkerning first=90  second=197 amount=1\nkerning first=90  second=99  amount=-2\nkerning first=90  second=100 amount=-2\nkerning first=90  second=101 amount=-2\nkerning first=90  second=103 amount=-2\nkerning first=90  second=113 amount=-2\nkerning first=90  second=231 amount=-2\nkerning first=90  second=232 amount=-2\nkerning first=90  second=233 amount=-2\nkerning first=90  second=234 amount=-2\nkerning first=90  second=235 amount=-2\nkerning first=97  second=118 amount=-1\nkerning first=97  second=121 amount=-1\nkerning first=97  second=253 amount=-1\nkerning first=97  second=255 amount=-1\nkerning first=97  second=34  amount=-5\nkerning first=97  second=39  amount=-5\nkerning first=98  second=118 amount=-1\nkerning first=98  second=121 amount=-1\nkerning first=98  second=253 amount=-1\nkerning first=98  second=255 amount=-1\nkerning first=98  second=34  amount=-2\nkerning first=98  second=39  amount=-2\nkerning first=98  second=122 amount=-1\nkerning first=98  second=120 amount=-1\nkerning first=99  second=34  amount=-1\nkerning first=99  second=39  amount=-1\nkerning first=101 second=118 amount=-1\nkerning first=101 second=121 amount=-1\nkerning first=101 second=253 amount=-1\nkerning first=101 second=255 amount=-1\nkerning first=101 second=34  amount=-1\nkerning first=101 second=39  amount=-1\nkerning first=104 second=34  amount=-8\nkerning first=104 second=39  amount=-8\nkerning first=109 second=34  amount=-8\nkerning first=109 second=39  amount=-8\nkerning first=110 second=34  amount=-8\nkerning first=110 second=39  amount=-8\nkerning first=111 second=118 amount=-1\nkerning first=111 second=121 amount=-1\nkerning first=111 second=253 amount=-1\nkerning first=111 second=255 amount=-1\nkerning first=111 second=34  amount=-11\nkerning first=111 second=39  amount=-11\nkerning first=111 second=122 amount=-1\nkerning first=111 second=120 amount=-2\nkerning first=112 second=118 amount=-1\nkerning first=112 second=121 amount=-1\nkerning first=112 second=253 amount=-1\nkerning first=112 second=255 amount=-1\nkerning first=112 second=34  amount=-2\nkerning first=112 second=39  amount=-2\nkerning first=112 second=122 amount=-1\nkerning first=112 second=120 amount=-1\nkerning first=114 second=118 amount=1\nkerning first=114 second=121 amount=1\nkerning first=114 second=253 amount=1\nkerning first=114 second=255 amount=1\nkerning first=114 second=34  amount=1\nkerning first=114 second=39  amount=1\nkerning first=114 second=111 amount=-2\nkerning first=114 second=242 amount=-2\nkerning first=114 second=243 amount=-2\nkerning first=114 second=244 amount=-2\nkerning first=114 second=245 amount=-2\nkerning first=114 second=246 amount=-2\nkerning first=114 second=44  amount=-10\nkerning first=114 second=46  amount=-10\nkerning first=114 second=99  amount=-1\nkerning first=114 second=100 amount=-1\nkerning first=114 second=101 amount=-1\nkerning first=114 second=103 amount=-1\nkerning first=114 second=113 amount=-1\nkerning first=114 second=231 amount=-1\nkerning first=114 second=232 amount=-1\nkerning first=114 second=233 amount=-1\nkerning first=114 second=234 amount=-1\nkerning first=114 second=235 amount=-1\nkerning first=114 second=97  amount=-3\nkerning first=114 second=224 amount=-3\nkerning first=114 second=225 amount=-3\nkerning first=114 second=226 amount=-3\nkerning first=114 second=227 amount=-3\nkerning first=114 second=228 amount=-3\nkerning first=114 second=229 amount=-3\nkerning first=118 second=34  amount=1\nkerning first=118 second=39  amount=1\nkerning first=118 second=111 amount=-1\nkerning first=118 second=242 amount=-1\nkerning first=118 second=243 amount=-1\nkerning first=118 second=244 amount=-1\nkerning first=118 second=245 amount=-1\nkerning first=118 second=246 amount=-1\nkerning first=118 second=44  amount=-8\nkerning first=118 second=46  amount=-8\nkerning first=118 second=99  amount=-1\nkerning first=118 second=100 amount=-1\nkerning first=118 second=101 amount=-1\nkerning first=118 second=103 amount=-1\nkerning first=118 second=113 amount=-1\nkerning first=118 second=231 amount=-1\nkerning first=118 second=232 amount=-1\nkerning first=118 second=233 amount=-1\nkerning first=118 second=234 amount=-1\nkerning first=118 second=235 amount=-1\nkerning first=118 second=97  amount=-1\nkerning first=118 second=224 amount=-1\nkerning first=118 second=225 amount=-1\nkerning first=118 second=226 amount=-1\nkerning first=118 second=227 amount=-1\nkerning first=118 second=228 amount=-1\nkerning first=118 second=229 amount=-1\nkerning first=120 second=111 amount=-2\nkerning first=120 second=242 amount=-2\nkerning first=120 second=243 amount=-2\nkerning first=120 second=244 amount=-2\nkerning first=120 second=245 amount=-2\nkerning first=120 second=246 amount=-2\nkerning first=120 second=99  amount=-2\nkerning first=120 second=100 amount=-2\nkerning first=120 second=101 amount=-2\nkerning first=120 second=103 amount=-2\nkerning first=120 second=113 amount=-2\nkerning first=120 second=231 amount=-2\nkerning first=120 second=232 amount=-2\nkerning first=120 second=233 amount=-2\nkerning first=120 second=234 amount=-2\nkerning first=120 second=235 amount=-2\nkerning first=121 second=34  amount=1\nkerning first=121 second=39  amount=1\nkerning first=121 second=111 amount=-1\nkerning first=121 second=242 amount=-1\nkerning first=121 second=243 amount=-1\nkerning first=121 second=244 amount=-1\nkerning first=121 second=245 amount=-1\nkerning first=121 second=246 amount=-1\nkerning first=121 second=44  amount=-8\nkerning first=121 second=46  amount=-8\nkerning first=121 second=99  amount=-1\nkerning first=121 second=100 amount=-1\nkerning first=121 second=101 amount=-1\nkerning first=121 second=103 amount=-1\nkerning first=121 second=113 amount=-1\nkerning first=121 second=231 amount=-1\nkerning first=121 second=232 amount=-1\nkerning first=121 second=233 amount=-1\nkerning first=121 second=234 amount=-1\nkerning first=121 second=235 amount=-1\nkerning first=121 second=97  amount=-1\nkerning first=121 second=224 amount=-1\nkerning first=121 second=225 amount=-1\nkerning first=121 second=226 amount=-1\nkerning first=121 second=227 amount=-1\nkerning first=121 second=228 amount=-1\nkerning first=121 second=229 amount=-1\nkerning first=122 second=111 amount=-1\nkerning first=122 second=242 amount=-1\nkerning first=122 second=243 amount=-1\nkerning first=122 second=244 amount=-1\nkerning first=122 second=245 amount=-1\nkerning first=122 second=246 amount=-1\nkerning first=122 second=99  amount=-1\nkerning first=122 second=100 amount=-1\nkerning first=122 second=101 amount=-1\nkerning first=122 second=103 amount=-1\nkerning first=122 second=113 amount=-1\nkerning first=122 second=231 amount=-1\nkerning first=122 second=232 amount=-1\nkerning first=122 second=233 amount=-1\nkerning first=122 second=234 amount=-1\nkerning first=122 second=235 amount=-1\nkerning first=254 second=118 amount=-1\nkerning first=254 second=121 amount=-1\nkerning first=254 second=253 amount=-1\nkerning first=254 second=255 amount=-1\nkerning first=254 second=34  amount=-2\nkerning first=254 second=39  amount=-2\nkerning first=254 second=122 amount=-1\nkerning first=254 second=120 amount=-1\nkerning first=208 second=84  amount=-2\nkerning first=208 second=86  amount=-2\nkerning first=208 second=89  amount=-3\nkerning first=208 second=221 amount=-3\nkerning first=208 second=65  amount=-2\nkerning first=208 second=192 amount=-2\nkerning first=208 second=193 amount=-2\nkerning first=208 second=194 amount=-2\nkerning first=208 second=195 amount=-2\nkerning first=208 second=196 amount=-2\nkerning first=208 second=197 amount=-2\nkerning first=208 second=88  amount=-2\nkerning first=208 second=44  amount=-8\nkerning first=208 second=46  amount=-8\nkerning first=208 second=90  amount=-2\nkerning first=192 second=118 amount=-4\nkerning first=192 second=121 amount=-4\nkerning first=192 second=253 amount=-4\nkerning first=192 second=255 amount=-4\nkerning first=192 second=67  amount=-1\nkerning first=192 second=71  amount=-1\nkerning first=192 second=79  amount=-1\nkerning first=192 second=81  amount=-1\nkerning first=192 second=216 amount=-1\nkerning first=192 second=199 amount=-1\nkerning first=192 second=210 amount=-1\nkerning first=192 second=211 amount=-1\nkerning first=192 second=212 amount=-1\nkerning first=192 second=213 amount=-1\nkerning first=192 second=214 amount=-1\nkerning first=192 second=85  amount=-1\nkerning first=192 second=217 amount=-1\nkerning first=192 second=218 amount=-1\nkerning first=192 second=219 amount=-1\nkerning first=192 second=220 amount=-1\nkerning first=192 second=34  amount=-9\nkerning first=192 second=39  amount=-9\nkerning first=192 second=111 amount=-1\nkerning first=192 second=242 amount=-1\nkerning first=192 second=243 amount=-1\nkerning first=192 second=244 amount=-1\nkerning first=192 second=245 amount=-1\nkerning first=192 second=246 amount=-1\nkerning first=192 second=87  amount=-5\nkerning first=192 second=84  amount=-10\nkerning first=192 second=117 amount=-1\nkerning first=192 second=249 amount=-1\nkerning first=192 second=250 amount=-1\nkerning first=192 second=251 amount=-1\nkerning first=192 second=252 amount=-1\nkerning first=192 second=122 amount=1\nkerning first=192 second=86  amount=-7\nkerning first=192 second=89  amount=-7\nkerning first=192 second=221 amount=-7\nkerning first=193 second=118 amount=-4\nkerning first=193 second=121 amount=-4\nkerning first=193 second=253 amount=-4\nkerning first=193 second=255 amount=-4\nkerning first=193 second=67  amount=-1\nkerning first=193 second=71  amount=-1\nkerning first=193 second=79  amount=-1\nkerning first=193 second=81  amount=-1\nkerning first=193 second=216 amount=-1\nkerning first=193 second=199 amount=-1\nkerning first=193 second=210 amount=-1\nkerning first=193 second=211 amount=-1\nkerning first=193 second=212 amount=-1\nkerning first=193 second=213 amount=-1\nkerning first=193 second=214 amount=-1\nkerning first=193 second=85  amount=-1\nkerning first=193 second=217 amount=-1\nkerning first=193 second=218 amount=-1\nkerning first=193 second=219 amount=-1\nkerning first=193 second=220 amount=-1\nkerning first=193 second=34  amount=-9\nkerning first=193 second=39  amount=-9\nkerning first=193 second=111 amount=-1\nkerning first=193 second=242 amount=-1\nkerning first=193 second=243 amount=-1\nkerning first=193 second=244 amount=-1\nkerning first=193 second=245 amount=-1\nkerning first=193 second=246 amount=-1\nkerning first=193 second=87  amount=-5\nkerning first=193 second=84  amount=-10\nkerning first=193 second=117 amount=-1\nkerning first=193 second=249 amount=-1\nkerning first=193 second=250 amount=-1\nkerning first=193 second=251 amount=-1\nkerning first=193 second=252 amount=-1\nkerning first=193 second=122 amount=1\nkerning first=193 second=86  amount=-7\nkerning first=193 second=89  amount=-7\nkerning first=193 second=221 amount=-7\nkerning first=194 second=118 amount=-4\nkerning first=194 second=121 amount=-4\nkerning first=194 second=253 amount=-4\nkerning first=194 second=255 amount=-4\nkerning first=194 second=67  amount=-1\nkerning first=194 second=71  amount=-1\nkerning first=194 second=79  amount=-1\nkerning first=194 second=81  amount=-1\nkerning first=194 second=216 amount=-1\nkerning first=194 second=199 amount=-1\nkerning first=194 second=210 amount=-1\nkerning first=194 second=211 amount=-1\nkerning first=194 second=212 amount=-1\nkerning first=194 second=213 amount=-1\nkerning first=194 second=214 amount=-1\nkerning first=194 second=85  amount=-1\nkerning first=194 second=217 amount=-1\nkerning first=194 second=218 amount=-1\nkerning first=194 second=219 amount=-1\nkerning first=194 second=220 amount=-1\nkerning first=194 second=34  amount=-9\nkerning first=194 second=39  amount=-9\nkerning first=194 second=111 amount=-1\nkerning first=194 second=242 amount=-1\nkerning first=194 second=243 amount=-1\nkerning first=194 second=244 amount=-1\nkerning first=194 second=245 amount=-1\nkerning first=194 second=246 amount=-1\nkerning first=194 second=87  amount=-5\nkerning first=194 second=84  amount=-10\nkerning first=194 second=117 amount=-1\nkerning first=194 second=249 amount=-1\nkerning first=194 second=250 amount=-1\nkerning first=194 second=251 amount=-1\nkerning first=194 second=252 amount=-1\nkerning first=194 second=122 amount=1\nkerning first=194 second=86  amount=-7\nkerning first=194 second=89  amount=-7\nkerning first=194 second=221 amount=-7\nkerning first=195 second=118 amount=-4\nkerning first=195 second=121 amount=-4\nkerning first=195 second=253 amount=-4\nkerning first=195 second=255 amount=-4\nkerning first=195 second=67  amount=-1\nkerning first=195 second=71  amount=-1\nkerning first=195 second=79  amount=-1\nkerning first=195 second=81  amount=-1\nkerning first=195 second=216 amount=-1\nkerning first=195 second=199 amount=-1\nkerning first=195 second=210 amount=-1\nkerning first=195 second=211 amount=-1\nkerning first=195 second=212 amount=-1\nkerning first=195 second=213 amount=-1\nkerning first=195 second=214 amount=-1\nkerning first=195 second=85  amount=-1\nkerning first=195 second=217 amount=-1\nkerning first=195 second=218 amount=-1\nkerning first=195 second=219 amount=-1\nkerning first=195 second=220 amount=-1\nkerning first=195 second=34  amount=-9\nkerning first=195 second=39  amount=-9\nkerning first=195 second=111 amount=-1\nkerning first=195 second=242 amount=-1\nkerning first=195 second=243 amount=-1\nkerning first=195 second=244 amount=-1\nkerning first=195 second=245 amount=-1\nkerning first=195 second=246 amount=-1\nkerning first=195 second=87  amount=-5\nkerning first=195 second=84  amount=-10\nkerning first=195 second=117 amount=-1\nkerning first=195 second=249 amount=-1\nkerning first=195 second=250 amount=-1\nkerning first=195 second=251 amount=-1\nkerning first=195 second=252 amount=-1\nkerning first=195 second=122 amount=1\nkerning first=195 second=86  amount=-7\nkerning first=195 second=89  amount=-7\nkerning first=195 second=221 amount=-7\nkerning first=196 second=118 amount=-4\nkerning first=196 second=121 amount=-4\nkerning first=196 second=253 amount=-4\nkerning first=196 second=255 amount=-4\nkerning first=196 second=67  amount=-1\nkerning first=196 second=71  amount=-1\nkerning first=196 second=79  amount=-1\nkerning first=196 second=81  amount=-1\nkerning first=196 second=216 amount=-1\nkerning first=196 second=199 amount=-1\nkerning first=196 second=210 amount=-1\nkerning first=196 second=211 amount=-1\nkerning first=196 second=212 amount=-1\nkerning first=196 second=213 amount=-1\nkerning first=196 second=214 amount=-1\nkerning first=196 second=85  amount=-1\nkerning first=196 second=217 amount=-1\nkerning first=196 second=218 amount=-1\nkerning first=196 second=219 amount=-1\nkerning first=196 second=220 amount=-1\nkerning first=196 second=34  amount=-9\nkerning first=196 second=39  amount=-9\nkerning first=196 second=111 amount=-1\nkerning first=196 second=242 amount=-1\nkerning first=196 second=243 amount=-1\nkerning first=196 second=244 amount=-1\nkerning first=196 second=245 amount=-1\nkerning first=196 second=246 amount=-1\nkerning first=196 second=87  amount=-5\nkerning first=196 second=84  amount=-10\nkerning first=196 second=117 amount=-1\nkerning first=196 second=249 amount=-1\nkerning first=196 second=250 amount=-1\nkerning first=196 second=251 amount=-1\nkerning first=196 second=252 amount=-1\nkerning first=196 second=122 amount=1\nkerning first=196 second=86  amount=-7\nkerning first=196 second=89  amount=-7\nkerning first=196 second=221 amount=-7\nkerning first=197 second=118 amount=-4\nkerning first=197 second=121 amount=-4\nkerning first=197 second=253 amount=-4\nkerning first=197 second=255 amount=-4\nkerning first=197 second=67  amount=-1\nkerning first=197 second=71  amount=-1\nkerning first=197 second=79  amount=-1\nkerning first=197 second=81  amount=-1\nkerning first=197 second=216 amount=-1\nkerning first=197 second=199 amount=-1\nkerning first=197 second=210 amount=-1\nkerning first=197 second=211 amount=-1\nkerning first=197 second=212 amount=-1\nkerning first=197 second=213 amount=-1\nkerning first=197 second=214 amount=-1\nkerning first=197 second=85  amount=-1\nkerning first=197 second=217 amount=-1\nkerning first=197 second=218 amount=-1\nkerning first=197 second=219 amount=-1\nkerning first=197 second=220 amount=-1\nkerning first=197 second=34  amount=-9\nkerning first=197 second=39  amount=-9\nkerning first=197 second=111 amount=-1\nkerning first=197 second=242 amount=-1\nkerning first=197 second=243 amount=-1\nkerning first=197 second=244 amount=-1\nkerning first=197 second=245 amount=-1\nkerning first=197 second=246 amount=-1\nkerning first=197 second=87  amount=-5\nkerning first=197 second=84  amount=-10\nkerning first=197 second=117 amount=-1\nkerning first=197 second=249 amount=-1\nkerning first=197 second=250 amount=-1\nkerning first=197 second=251 amount=-1\nkerning first=197 second=252 amount=-1\nkerning first=197 second=122 amount=1\nkerning first=197 second=86  amount=-7\nkerning first=197 second=89  amount=-7\nkerning first=197 second=221 amount=-7\nkerning first=199 second=84  amount=-2\nkerning first=200 second=118 amount=-2\nkerning first=200 second=121 amount=-2\nkerning first=200 second=253 amount=-2\nkerning first=200 second=255 amount=-2\nkerning first=200 second=111 amount=-1\nkerning first=200 second=242 amount=-1\nkerning first=200 second=243 amount=-1\nkerning first=200 second=244 amount=-1\nkerning first=200 second=245 amount=-1\nkerning first=200 second=246 amount=-1\nkerning first=200 second=84  amount=2\nkerning first=200 second=117 amount=-1\nkerning first=200 second=249 amount=-1\nkerning first=200 second=250 amount=-1\nkerning first=200 second=251 amount=-1\nkerning first=200 second=252 amount=-1\nkerning first=200 second=99  amount=-1\nkerning first=200 second=100 amount=-1\nkerning first=200 second=101 amount=-1\nkerning first=200 second=103 amount=-1\nkerning first=200 second=113 amount=-1\nkerning first=200 second=231 amount=-1\nkerning first=200 second=232 amount=-1\nkerning first=200 second=233 amount=-1\nkerning first=200 second=234 amount=-1\nkerning first=200 second=235 amount=-1\nkerning first=201 second=118 amount=-2\nkerning first=201 second=121 amount=-2\nkerning first=201 second=253 amount=-2\nkerning first=201 second=255 amount=-2\nkerning first=201 second=111 amount=-1\nkerning first=201 second=242 amount=-1\nkerning first=201 second=243 amount=-1\nkerning first=201 second=244 amount=-1\nkerning first=201 second=245 amount=-1\nkerning first=201 second=246 amount=-1\nkerning first=201 second=84  amount=2\nkerning first=201 second=117 amount=-1\nkerning first=201 second=249 amount=-1\nkerning first=201 second=250 amount=-1\nkerning first=201 second=251 amount=-1\nkerning first=201 second=252 amount=-1\nkerning first=201 second=99  amount=-1\nkerning first=201 second=100 amount=-1\nkerning first=201 second=101 amount=-1\nkerning first=201 second=103 amount=-1\nkerning first=201 second=113 amount=-1\nkerning first=201 second=231 amount=-1\nkerning first=201 second=232 amount=-1\nkerning first=201 second=233 amount=-1\nkerning first=201 second=234 amount=-1\nkerning first=201 second=235 amount=-1\nkerning first=202 second=118 amount=-2\nkerning first=202 second=121 amount=-2\nkerning first=202 second=253 amount=-2\nkerning first=202 second=255 amount=-2\nkerning first=202 second=111 amount=-1\nkerning first=202 second=242 amount=-1\nkerning first=202 second=243 amount=-1\nkerning first=202 second=244 amount=-1\nkerning first=202 second=245 amount=-1\nkerning first=202 second=246 amount=-1\nkerning first=202 second=84  amount=2\nkerning first=202 second=117 amount=-1\nkerning first=202 second=249 amount=-1\nkerning first=202 second=250 amount=-1\nkerning first=202 second=251 amount=-1\nkerning first=202 second=252 amount=-1\nkerning first=202 second=99  amount=-1\nkerning first=202 second=100 amount=-1\nkerning first=202 second=101 amount=-1\nkerning first=202 second=103 amount=-1\nkerning first=202 second=113 amount=-1\nkerning first=202 second=231 amount=-1\nkerning first=202 second=232 amount=-1\nkerning first=202 second=233 amount=-1\nkerning first=202 second=234 amount=-1\nkerning first=202 second=235 amount=-1\nkerning first=203 second=118 amount=-2\nkerning first=203 second=121 amount=-2\nkerning first=203 second=253 amount=-2\nkerning first=203 second=255 amount=-2\nkerning first=203 second=111 amount=-1\nkerning first=203 second=242 amount=-1\nkerning first=203 second=243 amount=-1\nkerning first=203 second=244 amount=-1\nkerning first=203 second=245 amount=-1\nkerning first=203 second=246 amount=-1\nkerning first=203 second=84  amount=2\nkerning first=203 second=117 amount=-1\nkerning first=203 second=249 amount=-1\nkerning first=203 second=250 amount=-1\nkerning first=203 second=251 amount=-1\nkerning first=203 second=252 amount=-1\nkerning first=203 second=99  amount=-1\nkerning first=203 second=100 amount=-1\nkerning first=203 second=101 amount=-1\nkerning first=203 second=103 amount=-1\nkerning first=203 second=113 amount=-1\nkerning first=203 second=231 amount=-1\nkerning first=203 second=232 amount=-1\nkerning first=203 second=233 amount=-1\nkerning first=203 second=234 amount=-1\nkerning first=203 second=235 amount=-1\nkerning first=204 second=84  amount=-2\nkerning first=204 second=89  amount=-2\nkerning first=204 second=221 amount=-2\nkerning first=204 second=65  amount=1\nkerning first=204 second=192 amount=1\nkerning first=204 second=193 amount=1\nkerning first=204 second=194 amount=1\nkerning first=204 second=195 amount=1\nkerning first=204 second=196 amount=1\nkerning first=204 second=197 amount=1\nkerning first=204 second=88  amount=1\nkerning first=205 second=84  amount=-2\nkerning first=205 second=89  amount=-2\nkerning first=205 second=221 amount=-2\nkerning first=205 second=65  amount=1\nkerning first=205 second=192 amount=1\nkerning first=205 second=193 amount=1\nkerning first=205 second=194 amount=1\nkerning first=205 second=195 amount=1\nkerning first=205 second=196 amount=1\nkerning first=205 second=197 amount=1\nkerning first=205 second=88  amount=1\nkerning first=206 second=84  amount=-2\nkerning first=206 second=89  amount=-2\nkerning first=206 second=221 amount=-2\nkerning first=206 second=65  amount=1\nkerning first=206 second=192 amount=1\nkerning first=206 second=193 amount=1\nkerning first=206 second=194 amount=1\nkerning first=206 second=195 amount=1\nkerning first=206 second=196 amount=1\nkerning first=206 second=197 amount=1\nkerning first=206 second=88  amount=1\nkerning first=207 second=84  amount=-2\nkerning first=207 second=89  amount=-2\nkerning first=207 second=221 amount=-2\nkerning first=207 second=65  amount=1\nkerning first=207 second=192 amount=1\nkerning first=207 second=193 amount=1\nkerning first=207 second=194 amount=1\nkerning first=207 second=195 amount=1\nkerning first=207 second=196 amount=1\nkerning first=207 second=197 amount=1\nkerning first=207 second=88  amount=1\nkerning first=209 second=84  amount=-2\nkerning first=209 second=89  amount=-2\nkerning first=209 second=221 amount=-2\nkerning first=209 second=65  amount=1\nkerning first=209 second=192 amount=1\nkerning first=209 second=193 amount=1\nkerning first=209 second=194 amount=1\nkerning first=209 second=195 amount=1\nkerning first=209 second=196 amount=1\nkerning first=209 second=197 amount=1\nkerning first=209 second=88  amount=1\nkerning first=210 second=84  amount=-2\nkerning first=210 second=86  amount=-2\nkerning first=210 second=89  amount=-3\nkerning first=210 second=221 amount=-3\nkerning first=210 second=65  amount=-2\nkerning first=210 second=192 amount=-2\nkerning first=210 second=193 amount=-2\nkerning first=210 second=194 amount=-2\nkerning first=210 second=195 amount=-2\nkerning first=210 second=196 amount=-2\nkerning first=210 second=197 amount=-2\nkerning first=210 second=88  amount=-2\nkerning first=210 second=44  amount=-8\nkerning first=210 second=46  amount=-8\nkerning first=210 second=90  amount=-2\nkerning first=211 second=84  amount=-2\nkerning first=211 second=86  amount=-2\nkerning first=211 second=89  amount=-3\nkerning first=211 second=221 amount=-3\nkerning first=211 second=65  amount=-2\nkerning first=211 second=192 amount=-2\nkerning first=211 second=193 amount=-2\nkerning first=211 second=194 amount=-2\nkerning first=211 second=195 amount=-2\nkerning first=211 second=196 amount=-2\nkerning first=211 second=197 amount=-2\nkerning first=211 second=88  amount=-2\nkerning first=211 second=44  amount=-8\nkerning first=211 second=46  amount=-8\nkerning first=211 second=90  amount=-2\nkerning first=212 second=84  amount=-2\nkerning first=212 second=86  amount=-2\nkerning first=212 second=89  amount=-3\nkerning first=212 second=221 amount=-3\nkerning first=212 second=65  amount=-2\nkerning first=212 second=192 amount=-2\nkerning first=212 second=193 amount=-2\nkerning first=212 second=194 amount=-2\nkerning first=212 second=195 amount=-2\nkerning first=212 second=196 amount=-2\nkerning first=212 second=197 amount=-2\nkerning first=212 second=88  amount=-2\nkerning first=212 second=44  amount=-8\nkerning first=212 second=46  amount=-8\nkerning first=212 second=90  amount=-2\nkerning first=213 second=84  amount=-2\nkerning first=213 second=86  amount=-2\nkerning first=213 second=89  amount=-3\nkerning first=213 second=221 amount=-3\nkerning first=213 second=65  amount=-2\nkerning first=213 second=192 amount=-2\nkerning first=213 second=193 amount=-2\nkerning first=213 second=194 amount=-2\nkerning first=213 second=195 amount=-2\nkerning first=213 second=196 amount=-2\nkerning first=213 second=197 amount=-2\nkerning first=213 second=88  amount=-2\nkerning first=213 second=44  amount=-8\nkerning first=213 second=46  amount=-8\nkerning first=213 second=90  amount=-2\nkerning first=214 second=84  amount=-2\nkerning first=214 second=86  amount=-2\nkerning first=214 second=89  amount=-3\nkerning first=214 second=221 amount=-3\nkerning first=214 second=65  amount=-2\nkerning first=214 second=192 amount=-2\nkerning first=214 second=193 amount=-2\nkerning first=214 second=194 amount=-2\nkerning first=214 second=195 amount=-2\nkerning first=214 second=196 amount=-2\nkerning first=214 second=197 amount=-2\nkerning first=214 second=88  amount=-2\nkerning first=214 second=44  amount=-8\nkerning first=214 second=46  amount=-8\nkerning first=214 second=90  amount=-2\nkerning first=217 second=65  amount=-2\nkerning first=217 second=192 amount=-2\nkerning first=217 second=193 amount=-2\nkerning first=217 second=194 amount=-2\nkerning first=217 second=195 amount=-2\nkerning first=217 second=196 amount=-2\nkerning first=217 second=197 amount=-2\nkerning first=218 second=65  amount=-2\nkerning first=218 second=192 amount=-2\nkerning first=218 second=193 amount=-2\nkerning first=218 second=194 amount=-2\nkerning first=218 second=195 amount=-2\nkerning first=218 second=196 amount=-2\nkerning first=218 second=197 amount=-2\nkerning first=219 second=65  amount=-2\nkerning first=219 second=192 amount=-2\nkerning first=219 second=193 amount=-2\nkerning first=219 second=194 amount=-2\nkerning first=219 second=195 amount=-2\nkerning first=219 second=196 amount=-2\nkerning first=219 second=197 amount=-2\nkerning first=220 second=65  amount=-2\nkerning first=220 second=192 amount=-2\nkerning first=220 second=193 amount=-2\nkerning first=220 second=194 amount=-2\nkerning first=220 second=195 amount=-2\nkerning first=220 second=196 amount=-2\nkerning first=220 second=197 amount=-2\nkerning first=221 second=118 amount=-2\nkerning first=221 second=121 amount=-2\nkerning first=221 second=253 amount=-2\nkerning first=221 second=255 amount=-2\nkerning first=221 second=67  amount=-2\nkerning first=221 second=71  amount=-2\nkerning first=221 second=79  amount=-2\nkerning first=221 second=81  amount=-2\nkerning first=221 second=216 amount=-2\nkerning first=221 second=199 amount=-2\nkerning first=221 second=210 amount=-2\nkerning first=221 second=211 amount=-2\nkerning first=221 second=212 amount=-2\nkerning first=221 second=213 amount=-2\nkerning first=221 second=214 amount=-2\nkerning first=221 second=85  amount=-7\nkerning first=221 second=217 amount=-7\nkerning first=221 second=218 amount=-7\nkerning first=221 second=219 amount=-7\nkerning first=221 second=220 amount=-7\nkerning first=221 second=111 amount=-5\nkerning first=221 second=242 amount=-5\nkerning first=221 second=243 amount=-5\nkerning first=221 second=244 amount=-5\nkerning first=221 second=245 amount=-5\nkerning first=221 second=246 amount=-5\nkerning first=221 second=87  amount=1\nkerning first=221 second=84  amount=1\nkerning first=221 second=117 amount=-3\nkerning first=221 second=249 amount=-3\nkerning first=221 second=250 amount=-3\nkerning first=221 second=251 amount=-3\nkerning first=221 second=252 amount=-3\nkerning first=221 second=122 amount=-2\nkerning first=221 second=86  amount=1\nkerning first=221 second=89  amount=1\nkerning first=221 second=221 amount=1\nkerning first=221 second=65  amount=-7\nkerning first=221 second=192 amount=-7\nkerning first=221 second=193 amount=-7\nkerning first=221 second=194 amount=-7\nkerning first=221 second=195 amount=-7\nkerning first=221 second=196 amount=-7\nkerning first=221 second=197 amount=-7\nkerning first=221 second=88  amount=1\nkerning first=221 second=44  amount=-16\nkerning first=221 second=46  amount=-16\nkerning first=221 second=99  amount=-5\nkerning first=221 second=100 amount=-5\nkerning first=221 second=101 amount=-5\nkerning first=221 second=103 amount=-5\nkerning first=221 second=113 amount=-5\nkerning first=221 second=231 amount=-5\nkerning first=221 second=232 amount=-5\nkerning first=221 second=233 amount=-5\nkerning first=221 second=234 amount=-5\nkerning first=221 second=235 amount=-5\nkerning first=221 second=120 amount=-2\nkerning first=221 second=45  amount=-4\nkerning first=221 second=173 amount=-4\nkerning first=221 second=109 amount=-3\nkerning first=221 second=110 amount=-3\nkerning first=221 second=112 amount=-3\nkerning first=221 second=241 amount=-3\nkerning first=221 second=83  amount=-1\nkerning first=221 second=97  amount=-6\nkerning first=221 second=224 amount=-6\nkerning first=221 second=225 amount=-6\nkerning first=221 second=226 amount=-6\nkerning first=221 second=227 amount=-6\nkerning first=221 second=228 amount=-6\nkerning first=221 second=229 amount=-6\nkerning first=221 second=115 amount=-5\nkerning first=221 second=74  amount=-7\nkerning first=224 second=118 amount=-1\nkerning first=224 second=121 amount=-1\nkerning first=224 second=253 amount=-1\nkerning first=224 second=255 amount=-1\nkerning first=224 second=34  amount=-5\nkerning first=224 second=39  amount=-5\nkerning first=225 second=118 amount=-1\nkerning first=225 second=121 amount=-1\nkerning first=225 second=253 amount=-1\nkerning first=225 second=255 amount=-1\nkerning first=225 second=34  amount=-5\nkerning first=225 second=39  amount=-5\nkerning first=226 second=118 amount=-1\nkerning first=226 second=121 amount=-1\nkerning first=226 second=253 amount=-1\nkerning first=226 second=255 amount=-1\nkerning first=226 second=34  amount=-5\nkerning first=226 second=39  amount=-5\nkerning first=227 second=118 amount=-1\nkerning first=227 second=121 amount=-1\nkerning first=227 second=253 amount=-1\nkerning first=227 second=255 amount=-1\nkerning first=227 second=34  amount=-5\nkerning first=227 second=39  amount=-5\nkerning first=228 second=118 amount=-1\nkerning first=228 second=121 amount=-1\nkerning first=228 second=253 amount=-1\nkerning first=228 second=255 amount=-1\nkerning first=228 second=34  amount=-5\nkerning first=228 second=39  amount=-5\nkerning first=229 second=118 amount=-1\nkerning first=229 second=121 amount=-1\nkerning first=229 second=253 amount=-1\nkerning first=229 second=255 amount=-1\nkerning first=229 second=34  amount=-5\nkerning first=229 second=39  amount=-5\nkerning first=231 second=34  amount=-1\nkerning first=231 second=39  amount=-1\nkerning first=232 second=118 amount=-1\nkerning first=232 second=121 amount=-1\nkerning first=232 second=253 amount=-1\nkerning first=232 second=255 amount=-1\nkerning first=232 second=34  amount=-1\nkerning first=232 second=39  amount=-1\nkerning first=233 second=118 amount=-1\nkerning first=233 second=121 amount=-1\nkerning first=233 second=253 amount=-1\nkerning first=233 second=255 amount=-1\nkerning first=233 second=34  amount=-1\nkerning first=233 second=39  amount=-1\nkerning first=234 second=118 amount=-1\nkerning first=234 second=121 amount=-1\nkerning first=234 second=253 amount=-1\nkerning first=234 second=255 amount=-1\nkerning first=234 second=34  amount=-1\nkerning first=234 second=39  amount=-1\nkerning first=235 second=118 amount=-1\nkerning first=235 second=121 amount=-1\nkerning first=235 second=253 amount=-1\nkerning first=235 second=255 amount=-1\nkerning first=235 second=34  amount=-1\nkerning first=235 second=39  amount=-1\nkerning first=241 second=34  amount=-8\nkerning first=241 second=39  amount=-8\nkerning first=242 second=118 amount=-1\nkerning first=242 second=121 amount=-1\nkerning first=242 second=253 amount=-1\nkerning first=242 second=255 amount=-1\nkerning first=242 second=34  amount=-11\nkerning first=242 second=39  amount=-11\nkerning first=242 second=122 amount=-1\nkerning first=242 second=120 amount=-2\nkerning first=243 second=118 amount=-1\nkerning first=243 second=121 amount=-1\nkerning first=243 second=253 amount=-1\nkerning first=243 second=255 amount=-1\nkerning first=243 second=34  amount=-11\nkerning first=243 second=39  amount=-11\nkerning first=243 second=122 amount=-1\nkerning first=243 second=120 amount=-2\nkerning first=244 second=118 amount=-1\nkerning first=244 second=121 amount=-1\nkerning first=244 second=253 amount=-1\nkerning first=244 second=255 amount=-1\nkerning first=244 second=34  amount=-11\nkerning first=244 second=39  amount=-11\nkerning first=244 second=122 amount=-1\nkerning first=244 second=120 amount=-2\nkerning first=245 second=118 amount=-1\nkerning first=245 second=121 amount=-1\nkerning first=245 second=253 amount=-1\nkerning first=245 second=255 amount=-1\nkerning first=245 second=34  amount=-11\nkerning first=245 second=39  amount=-11\nkerning first=245 second=122 amount=-1\nkerning first=245 second=120 amount=-2\nkerning first=246 second=118 amount=-1\nkerning first=246 second=121 amount=-1\nkerning first=246 second=253 amount=-1\nkerning first=246 second=255 amount=-1\nkerning first=246 second=34  amount=-11\nkerning first=246 second=39  amount=-11\nkerning first=246 second=122 amount=-1\nkerning first=246 second=120 amount=-2\nkerning first=253 second=34  amount=1\nkerning first=253 second=39  amount=1\nkerning first=253 second=111 amount=-1\nkerning first=253 second=242 amount=-1\nkerning first=253 second=243 amount=-1\nkerning first=253 second=244 amount=-1\nkerning first=253 second=245 amount=-1\nkerning first=253 second=246 amount=-1\nkerning first=253 second=44  amount=-8\nkerning first=253 second=46  amount=-8\nkerning first=253 second=99  amount=-1\nkerning first=253 second=100 amount=-1\nkerning first=253 second=101 amount=-1\nkerning first=253 second=103 amount=-1\nkerning first=253 second=113 amount=-1\nkerning first=253 second=231 amount=-1\nkerning first=253 second=232 amount=-1\nkerning first=253 second=233 amount=-1\nkerning first=253 second=234 amount=-1\nkerning first=253 second=235 amount=-1\nkerning first=253 second=97  amount=-1\nkerning first=253 second=224 amount=-1\nkerning first=253 second=225 amount=-1\nkerning first=253 second=226 amount=-1\nkerning first=253 second=227 amount=-1\nkerning first=253 second=228 amount=-1\nkerning first=253 second=229 amount=-1\nkerning first=255 second=34  amount=1\nkerning first=255 second=39  amount=1\nkerning first=255 second=111 amount=-1\nkerning first=255 second=242 amount=-1\nkerning first=255 second=243 amount=-1\nkerning first=255 second=244 amount=-1\nkerning first=255 second=245 amount=-1\nkerning first=255 second=246 amount=-1\nkerning first=255 second=44  amount=-8\nkerning first=255 second=46  amount=-8\nkerning first=255 second=99  amount=-1\nkerning first=255 second=100 amount=-1\nkerning first=255 second=101 amount=-1\nkerning first=255 second=103 amount=-1\nkerning first=255 second=113 amount=-1\nkerning first=255 second=231 amount=-1\nkerning first=255 second=232 amount=-1\nkerning first=255 second=233 amount=-1\nkerning first=255 second=234 amount=-1\nkerning first=255 second=235 amount=-1\nkerning first=255 second=97  amount=-1\nkerning first=255 second=224 amount=-1\nkerning first=255 second=225 amount=-1\nkerning first=255 second=226 amount=-1\nkerning first=255 second=227 amount=-1\nkerning first=255 second=228 amount=-1\nkerning first=255 second=229 amount=-1\n";
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      group = _ref.group,
      panel = _ref.panel;

  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('tick', handleTick);
  interaction.events.on('onReleased', handleOnRelease);

  var tempMatrix = new THREE.Matrix4();
  var tPosition = new THREE.Vector3();

  var oldParent = void 0;

  function getTopLevelFolder(group) {
    var folder = group.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
    }return folder;
  }

  function handleTick() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref2.input;

    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (input.mouse) {
      if (input.pressed && input.selected && input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
        if (input.interaction.press === interaction) {
          folder.position.copy(input.mouseIntersection.sub(input.mouseOffset));
          return;
        }
      } else if (input.intersections.length > 0) {
        var hitObject = input.intersections[0].object;
        if (hitObject === panel) {
          hitObject.updateMatrixWorld();
          tPosition.setFromMatrixPosition(hitObject.matrixWorld);

          input.mousePlane.setFromNormalAndCoplanarPoint(input.mouseCamera.getWorldDirection(input.mousePlane.normal), tPosition);
          // console.log( input.mousePlane );
        }
      }
    }
  }

  function handleOnPress(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    if (input.mouse) {
      if (input.intersections.length > 0) {
        if (input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
          var hitObject = input.intersections[0].object;
          if (hitObject !== panel) {
            return;
          }

          input.selected = folder;

          input.selected.updateMatrixWorld();
          tPosition.setFromMatrixPosition(input.selected.matrixWorld);

          input.mouseOffset.copy(input.mouseIntersection).sub(tPosition);
          // console.log( input.mouseOffset );
        }
      }
    } else {
      tempMatrix.getInverse(inputObject.matrixWorld);

      folder.matrix.premultiply(tempMatrix);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

      oldParent = folder.parent;
      inputObject.add(folder);
    }

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('grabbed', input);
  }

  function handleOnRelease(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    if (input.mouse) {
      input.selected = undefined;
    } else {

      if (oldParent === undefined) {
        return;
      }

      folder.matrix.premultiply(inputObject.matrixWorld);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
      oldParent.add(folder);
      oldParent = undefined;
    }

    folder.beingMoved = false;

    input.events.emit('grabReleased', input);
  }

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":12}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var grabBar = exports.grabBar = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,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/GMzLdsAADskaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzMiA3OS4xNTkyODQsIDIwMTYvMDQvMTktMTM6MTM6NDAgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTA5LTI4VDE2OjI1OjMyLTA3OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMDktMjhUMTY6Mzc6MjMtMDc6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTA5LTI4VDE2OjM3OjIzLTA3OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlNzdmYmZjLTg1ZDQtMTFlNi1hYzhmLWFjNzU0ZWQ1ODM3ZjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmM1ZmM0ZGYyLTkxY2MtZTI0MS04Y2VjLTMzODIyY2Q1ZWFlOTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjNWZjNGRmMi05MWNjLWUyNDEtOGNlYy0zMzgyMmNkNWVhZTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDktMjhUMTY6MjU6MzItMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wOS0yOFQxNjozNzoyMy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+OhF7RwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAlElEQVR42uzZsQ3AIAxEUTuTZJRskt5LRFmCdTLapUKCBijo/F0hn2SkJxIKXJJlrsOSFwAAAABA6vKI6O7BUorXdZu1/VEWEZeZfbN5m/ZamjfK+AQAAAAAAAAAAAAAAAAAAAAAACBfuaSna7i/dd1mbX+USTrN7J7N27TX0rxRxgngZYifIAAAAJC4fgAAAP//AwAuMVPw20hxCwAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  // texture.minFilter = THREE.LinearMipMapLinearFilter;
  // texture.magFilter = THREE.LinearFilter;
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.5;

  return function () {
    var geometry = new THREE.PlaneGeometry(image.width / 1000, image.height / 1000, 1, 1);

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };
}();

var downArrow = exports.downArrow = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjE4OjI1LTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMToxODoyNS0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDozMDQyYjI0ZS1iMzc2LWI0NGItOGI4Yy1lZTFjY2IzYWU1MDU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjMwNDJiMjRlLWIzNzYtYjQ0Yi04YjhjLWVlMWNjYjNhZTUwNTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5Uilz0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJdSURBVHja7N3LccJAEIThRuW7ncUeTQhkQAiIDMgIhUIIcFQWJgJ88FKlovwArN2d6Z45cZGA/T9viYftxeVyQYzudLEEASAmAMQEgBjJeWl1xymlNwAHAMdxHHvFxU8pDQCWAFbjOH7I7ACT+O8ANnkhFONv8hoc8prwA7iJfx0pBJP412mGoDMQXwrBN/GbIuiMxJdA8Ev8Zgg6Q/GpEdwRvwmCzlh8SgQPxK+OoMYOMDwYnwrBE/GnCAbXAPKTX//jFJuUUu84fv9k/OusS/8QdAbl387eI4L8mPcznKroTlhyB1jOeC5XCGaMX2ItqwFYATipISgQ/5TX0heA/N62FIJS8Ut+TlD0IlAJgcf4VV4GKiDwGr/W+wDUCDzHrwaAFYH3+FUBsCFgiF8dAAsClvhNAHhHwBS/GQCvCNjiNwXgDQFj/OYAvCBgjW8CgHUEzPHNALCKgD2+KQDWECjENwfACgKV+CYBTBD0AM61ERSIfwbQW4xvFkBGcMw7QTUEheKv8nNBADCMQDG+eQC1EKjGB4CFl78RlFJa4usXTF7njJRvz35eD/FdASiIAKrx3QEohACq8V1cA1S6JpCM7xKAQQRu47sFYAiB6/iuARhA4D6+ewANEVDEpwDQAAFNfBoAFRFQxacCUAEBXXw6AAURUManBFAAAW18WgAzIqCOTw1gBgT08ekBTBDsnjh0xx5fAkBGMADYPnDINh+DAKCHQCa+FIA7EUjFlwPwBwK5+JIAfkAgGR9w+JWwOef6zWDV+PIAYuLfxgWAWIIAEBMAYgJAjOR8DgD+6Ozgv4uy9gAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.3;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(-0.005, -0.004, 0);
    return new THREE.Mesh(geo, material);
  };
}();

var checkmark = exports.checkmark = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjMzOjUzLTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMTozMzo1My0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo2ODcxYTk5Yy0zNjE5LTlkNGEtODdkNi0wYWE5YTRiNWU4Mjc8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY4NzFhOTljLTM2MTktOWQ0YS04N2Q2LTBhYTlhNGI1ZTgyNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5z9RT3AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAATtSURBVHja7Jzbb5RFGMZ/2xbCvVhASExUiI144w0hQtHEGrHgISqgN6KgtNYWAb0w0Wo1XqrbPbSlokYSxfMhemX/Aa7wGAVq8XTp30DXi5mJm0a2u9v3/b6Z2XludrOHdw/PMzPP+74zX6FWqyGFgYEBElpGD/AecCtwB/Dbcm+Ym5sT+/Cu9P/nim6gCDwCXAt8DVyX5RdIAsgPBaAEjNQ9diPwFbA5CSB+TAFP/c/jW4HPgL4kgHgxCww1eP5m4GN7mwQQEbos+U808dqtwEf2NgkgErc/0yT5Dn12OdiSBBA++aUWyXfYAnwDXJ8EEG6qNwkMryDGZpsi3pAEEB6qV3D7raIP+NKmikkAgeAt4IhgvJvsTJAE4DkKwCngsELss0kA/q/5s8AhhdjTwEFpd5ogS35VaeTPAk8Di0kA/pJfEl7zHU7SuHKYlgAP1vyykNtfihkt8pMAZEkaVohbVYqbBCCIU8CTCnFLwJj2l08CWNma/7aS268Cx6QNXxKArHmeBh5XWk7GsiA/TwGMYfa/hUp+mfYaO824/eGsyM9LAC9gmiPvAzsDI7/Lrs1DSiN/KI8flCXGgVft/V7gDLArIAFMh+r2fRDAS8DEksc2Ah8C/R3s9svAaJ5TWlbkv3yF59Zjdr1s93ja13L7Fev2azELYLwB+Q5rMb3ubR4avpNKbn8aeAa4nLe6tQ3fRJOv7QW+8Ggm6LEjVKOxM4M5D3A57x+pKYAX6wxfs9gAfALs8IB8rcaOKxvXfFC5lgDGgVfafK8zhrty/E+0XHklL7efpQAmWpj2lxPBbTn8J7Po1fZH8QzSAnjNjn4JrMecjsmqWFQA3lVy+yXr9oldAHcKx7sa+DwDY9hj8/yDiqneYicI4FHgR+GYa5WzA83GzhRw1FfyNQTwC3CPvZXEOuBTzEUUJLEqg1TPW/K1TOCfwCBwUTjuNciWjbsxZViNVC+32r4vaeAfwF3AgnDcTVYEtwuNUA3yy5jdu3SyAAB+B3YrLAcbBOoE7yhN+5N2zScJwGAeeAD4TjhuL6aB1Kon6LbkP6Y08o/jSYXPFwEAnAceVhDBVS1mB66xo0H+FKaxs0hgyKodfAF4EPhJqU6w3EywyhqzQ0rkj4RIfpYCALgE7LEzgiRcxbC/wcivoFPedeQHi6y3hP1ljeG8Uoq4NDsoYIo8Wjt5giY/DwHUp4i/KmQHZ+pEUMDs5NFw+0UyOLQRqwDccnAv8L1w3HXAaZsivq5k+IrACSJBnqeD54EDwAfALYJxNwHfKpmysiV/MRYB5H0y6AKwH/hBOO5qYI2C4TsaE/k+CADM1bH3Il8xlETVGr4akcGXs4F/A3fbGcE3VAioth+qAMB0EXd7JoJJPNzGFasAwDSQBpHfVNKu2z9G5PDxePgC8BBwLueRfyLGNT8EAYDZTHIA+QZSs2v+8djcfmgCcHWC+5FvIC3n9kc7hXzfBeCM4R7ky8Yd5/ZDFQD810C6qPgZ0bv9kAVQnyJqFIvexGzmIAnAb1wC7hM2hkXgWToYoV0lzDWQJFLE6Bo7nSAAlyLuY2UNpAoZXootCUAeC5gG0s9tkj9KQtACANNAGqS1PYalRH48AnApYrPby4oEdmgjCaD5FHEvjbeXvYEp7yZEKADnCfZbEfwDPI85L+DIf44OaOy0g38HAM/e7guIRx94AAAAAElFTkSuQmCC';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.4;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(0.025, 0, 0);
    return new THREE.Mesh(geo, material);
  };
}();

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createImageButton;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createImageButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$pressing = _ref.pressing,
      pressing = _ref$pressing === undefined ? undefined : _ref$pressing,
      _ref$image = _ref.image,
      image = _ref$image === undefined ? "textures/spotlight.jpg" : _ref$image,
      _ref$wide = _ref.wide,
      wide = _ref$wide === undefined ? false : _ref$wide,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  function applyImageToMaterial(image, targetMaterial) {
    if (typeof image === "string") {
      //TODO cache.  Does TextureLoader already cache?
      new THREE.TextureLoader().load(image, function (texture) {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        targetMaterial.map = texture;
        targetMaterial.needsUpdate = true;
      });
    } else if (image.isTexture) {
      targetMaterial.map = image;
    } else if (image.isWebGLRenderTarget) {
      targetMaterial.map = image.texture;
    } else throw "not sure how to interpret image " + image;
    targetMaterial.needsUpdate = true;
  }

  //XXX magic numbers...
  var height = Layout.PANEL_WIDTH * (wide ? 0.94 : 0.25);

  var BUTTON_WIDTH = width * (wide ? 0.94 : 0.25) - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH * 2;

  var group = new THREE.Group();
  group.guiType = "imagebutton";
  group.toString = function () {
    return '[' + group.guiType + ': ' + propertyName + ']';
  };
  group.spacing = height;

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.PlaneGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, 1, 1);
  var modifier = new THREE.SubdivisionModifier(1);
  //modifier.modify( rect );
  rect.translate(BUTTON_WIDTH * 0.5, 0, BUTTON_DEPTH);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH;
  if (!wide) hitscanVolume.position.x = width * 0.5;else {
    hitscanVolume.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 0.75;
    hitscanVolume.position.y = 0.01; //XXX magic number
  }

  var material;
  if (image.isMaterial) {
    material = image;
  } else {
    material = new THREE.MeshBasicMaterial();
    material.transparent = true;
    applyImageToMaterial(image, material);
  }
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  //button label removed; might want options like a hover label in future.

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = 0.03;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;
  if (wide) descriptorLabel.visible = false;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  //TODO: drag and hover
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('pressing', handlePressing);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    //compute x & y as normalised coordinates from p.point
    var point = hitscanVolume.worldToLocal(p.point);
    object[propertyName](point.x, point.y + 0.5);

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handlePressing(p) {
    var point = hitscanVolume.worldToLocal(p.point);
    //nb, likely to need a different strategy for dual wielding
    if (pressing) pressing(point.x, point.y + 0.5);
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {
    if (!material.color) return;
    if (interaction.hovering()) {
      material.color.setHex(0xFFFFFF);
    } else {
      material.color.setHex(0xCCCCCC);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  return group;
} /** 
   * Big button with an image on (which might come from a file or existing texture,
   * the texture might be from a RenderTarget...).
   * 
   * I'd put this more separate from the datgui modules but need to think a little
   * bit about how to structure that etc.  Very un-DRY, but I'm starting by just
   * copying existing button.js in its entirety.
   * 
   * TODO: not just simple 'bang' function but callbacks for hover / etc.
   * 
   * 
   * Copyright  Data Arts Team, Google inc. 2016 / Peter Todd, 2017
   * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
   */

},{"../thirdparty/SubdivisionModifier":20,"./colors":3,"./grab":7,"./interaction":12,"./layout":14,"./sharedmaterials":17,"./textlabel":19}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createImageButtonGrid;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** 
 * Grid of buttons with images on (which might come from a file or existing texture,
 * the texture might be from a RenderTarget...).
 * 
 * I'd put this more separate from the datgui modules but need to think a little
 * bit about how to structure that etc.  Very un-DRY, but I'm starting by just
 * copying existing imagebutton.js in its entirety.
 * 
 * TODO: not just simple 'bang' function but callbacks for hover / etc.
 * 
 * 
 * Copyright  Data Arts Team, Google inc. 2016 / Peter Todd, 2017
 * 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

function createImageButtonGrid() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        textCreator = _ref.textCreator,
        objects = _ref.objects,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
        rowHeight = _ref.rowHeight,
        _ref$depth = _ref.depth,
        depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth,
        _ref$columns = _ref.columns,
        columns = _ref$columns === undefined ? 4 : _ref$columns;

    var buttons = [];

    function applyImageToMaterial(image, targetMaterial) {
        if (typeof image === "string") {
            //TODO cache.  Does TextureLoader already cache?
            //TODO Image only on front face of button.
            new THREE.TextureLoader().load(image, function (texture) {
                texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
                targetMaterial.map = texture;
                targetMaterial.needsUpdate = true;
            });
        } else if (image.isTexture) {
            targetMaterial.map = image;
        } else if (image.isWebGLRenderTarget) {
            targetMaterial.map = image.texture;
        } else throw "not sure how to interpret image " + image;
        targetMaterial.needsUpdate = true;
    }

    var BUTTON_WIDTH = width * (1 / columns) - Layout.PANEL_MARGIN;
    var BUTTON_HEIGHT = rowHeight > 0 ? rowHeight : BUTTON_WIDTH; //height - Layout.PANEL_MARGIN;
    var BUTTON_DEPTH = Layout.BUTTON_DEPTH;

    var group = new THREE.Group();
    group.guiType = "imagebuttongrid";
    group.toString = function () {
        return '[' + group.guiType + ': ' + objects + ']';
    };
    group.guiChildren = buttons;

    var rows = Math.ceil(objects.length / columns);
    var height = Layout.PANEL_MARGIN + BUTTON_HEIGHT * rows;
    group.spacing = height;

    var panel = Layout.createPanel(width, height, depth);
    group.add(panel);

    var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
    controllerID.position.z = depth;
    panel.add(controllerID);

    var rect = new THREE.PlaneGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, 1, 1);
    rect.translate(BUTTON_WIDTH / 2, -BUTTON_HEIGHT / 2, BUTTON_DEPTH);

    var i = 0;
    objects.forEach(function (obj) {
        var subgroup = new THREE.Group();
        subgroup.guiType = "imageButtonGridElement";
        group.add(subgroup);
        buttons.push(subgroup);

        var col = i % columns;
        var row = Math.floor(i / columns);

        subgroup.position.x = 0.025 + Layout.PANEL_MARGIN + BUTTON_WIDTH * col;
        subgroup.position.y = height / 2 - BUTTON_HEIGHT * row;
        subgroup.position.z = BUTTON_DEPTH;

        //  hitscan volume.
        // This material could probably be reused.
        var hitscanMaterial = new THREE.MeshBasicMaterial();
        hitscanMaterial.visible = false;

        var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);

        var material = new THREE.MeshBasicMaterial();
        material.transparent = true;
        if (obj.image) applyImageToMaterial(obj.image, material);
        if (obj.text) {
            var text = textCreator.create(obj.text);
            subgroup.add(text);
            subgroup.text = text;
            text.position.x = 0.3 * BUTTON_WIDTH;
            text.position.y = -BUTTON_HEIGHT;
            text.position.z = BUTTON_DEPTH * 1.2;
        }
        var filledVolume = new THREE.Mesh(rect.clone(), material);
        hitscanVolume.add(filledVolume);

        //button label & descriptor label removed.
        //Tooltip text option added.  Might want to be able to pass in richer things...
        //maybe an arbitrary THREE object would work well...
        if (obj.tip) {
            var tipText = textCreator.create(obj.tip);
            var tipGroup = new THREE.Group();
            tipGroup.position.x = 0.5 * BUTTON_WIDTH;
            tipGroup.position.y = -1.2 * BUTTON_HEIGHT;
            tipGroup.position.z = BUTTON_DEPTH * 2.5;
            tipGroup.visible = false;

            subgroup.add(tipGroup);
            tipGroup.add(tipText);
            subgroup.tipText = tipGroup;
            //TODO: compute text geometry and adjust.
            //Estimate for now. Width is dodgy especially as font is not monospace.
            var w = 0.01 + obj.tip.length * BUTTON_WIDTH / 10,
                h = Layout.PANEL_HEIGHT * 0.8;
            var paddedW = w + 0.03;
            var tipRect = new THREE.PlaneGeometry(paddedW, Layout.PANEL_HEIGHT, 1, 1);
            var tipBackground = new THREE.Mesh(tipRect, SharedMaterials.TOOLTIP);
            tipBackground.position.x = 0; //paddedW / 2;
            tipBackground.position.y = h / 2;
            tipBackground.position.z = -BUTTON_DEPTH * 0.5;
            tipGroup.add(tipBackground);

            // tipText.position.x = 0.5 * (BUTTON_WIDTH - w);
            tipText.position.x = -0.5 * w;
            // tipText.position.y = -1.2 * BUTTON_HEIGHT;
            // tipText.position.z = BUTTON_DEPTH * 2.5;
            // tipText.visible = false;
        }

        //panel.add( descriptorLabel, hitscanVolume, controllerID );
        subgroup.add(hitscanVolume);
        panel.add(subgroup);

        var interaction = (0, _interaction2.default)(hitscanVolume);
        interaction.events.on('onPressed', handleOnPress);
        interaction.events.on('onReleased', handleOnRelease);

        function handleOnPress(p) {
            if (subgroup.visible === false) {
                return;
            }

            obj.func();
            subgroup.position.z = BUTTON_DEPTH * 0.4;
            p.locked = true;
        }

        function handleOnRelease() {
            subgroup.position.z = BUTTON_DEPTH;
            if (obj.release) obj.release();
        }
        //quick color hack...
        var hoverCol = obj.text ? 0x888 : 0xFFFFFF;
        var noHoverCol = obj.text ? 0x111 : 0xCCCCCC;
        subgroup.updateView = function () {

            if (interaction.hovering()) {
                material.color.setHex(hoverCol);
                if (subgroup.tipText) subgroup.tipText.visible = true;
            } else {
                material.color.setHex(noHoverCol);
                if (subgroup.tipText) subgroup.tipText.visible = false;
            }
        };

        subgroup.updateView();

        subgroup.interaction = interaction;
        subgroup.hitscan = hitscanVolume; //XXX: making this single element rather than array,
        //that means these 'subgroup' buttons aren't acting exactly as normal dat.GUIVR controllers
        i++;
    });

    group.hitscan = buttons.map(function (b) {
        return b.hitscan;
    }); //.push(panel);
    group.hitscan.push(panel);

    var grabInteraction = Grab.create({ group: group, panel: panel });

    function updateView() {
        buttons.forEach(function (b) {
            return b.updateView();
        });
    }

    group.updateControl = function (inputObjects) {
        buttons.forEach(function (b) {
            b.interaction.update(inputObjects);
        });
        //interaction.update( inputObjects );
        grabInteraction.update(inputObjects);
        updateView();
    };

    group.name = function (str) {
        descriptorLabel.updateLabel(str);
        return group;
    };

    return group;
}

},{"./colors":3,"./grab":7,"./interaction":12,"./layout":14,"./sharedmaterials":17,"./textlabel":19}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _folder = require('./folder');

var _folder2 = _interopRequireDefault(_folder);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _imagebutton = require('./imagebutton');

var _imagebutton2 = _interopRequireDefault(_imagebutton);

var _imagebuttongrid = require('./imagebuttongrid');

var _imagebuttongrid2 = _interopRequireDefault(_imagebuttongrid);

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _sdftext = require('./sdftext');

var SDFText = _interopRequireWildcard(_sdftext);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

//PJT: I'd rather inject custom extensions like this, but will work that out later.


var GUIVR = function DATGUIVR() {

  /*
    SDF font
  */
  var textCreator = SDFText.creator();

  /*
    Lists.
    InputObjects are things like VIVE controllers, cardboard headsets, etc.
    Controllers are the DAT GUI sliders, checkboxes, etc.
  */
  var inputObjects = [];
  var controllers = [];

  /*
    Functions for determining whether a given controller is visible (by which we
    mean not hidden, not 'visible' in terms of the camera orientation etc), and
    for retrieving the list of visible hitscanObjects dynamically.
    This might benefit from some caching especially in cases with large complex GUIs.
    I haven't measured the impact of garbage collection etc.
  */
  function isControllerVisible(control) {
    if (!control.visible) return false;
    var folder = control.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
      if (folder.isCollapsed() || !folder.visible) return false;
    }
    return true;
  }
  function getVisibleControllers() {
    // not terribly efficient
    return controllers.filter(isControllerVisible);
  }
  function getVisibleHitscanObjects() {
    var tmp = getVisibleControllers().map(function (o) {
      return o.hitscan;
    });
    return tmp.reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  var mouseEnabled = false;
  var mouseRenderer = undefined;

  function enableMouse(camera, renderer) {
    mouseEnabled = true;
    mouseRenderer = renderer;
    mouseInput.mouseCamera = camera;
    return mouseInput.laser;
  }

  function disableMouse() {
    mouseEnabled = false;
  }

  /*
    The default laser pointer coming out of each InputObject.
  */
  var laserMaterial = new THREE.LineBasicMaterial({ color: 0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser() {
    var g = new THREE.Geometry();
    g.vertices.push(new THREE.Vector3());
    g.vertices.push(new THREE.Vector3(0, 0, 0));
    return new THREE.Line(g, laserMaterial);
  }

  /*
    A "cursor", eg the ball that appears at the end of your laser.
  */
  var cursorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, blending: THREE.AdditiveBlending });
  function createCursor() {
    return new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), cursorMaterial);
  }

  /*
    Creates a generic Input type.
    Takes any THREE.Object3D type object and uses its position
    and orientation as an input device.
      A laser pointer is included and will be updated.
    Contains state about which Interaction is currently being used or hover.
  */
  function createInput() {
    var inputObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Group();

    var input = {
      raycast: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3()),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      events: new _events2.default(),
      interaction: {
        grip: undefined,
        press: undefined,
        hover: undefined
      }
    };

    input.laser.add(input.cursor);

    return input;
  }

  /*
    MouseInput.
    Allows you to click on the screen when not in VR for debugging.
  */
  var mouseInput = createMouseInput();

  function createMouseInput() {
    var mouse = new THREE.Vector2(-1, -1);

    var input = createInput();
    input.mouse = mouse;
    input.mouseIntersection = new THREE.Vector3();
    input.mouseOffset = new THREE.Vector3();
    input.mousePlane = new THREE.Plane();
    input.intersections = [];

    //  set my enableMouse
    input.mouseCamera = undefined;

    window.addEventListener('mousemove', function (event) {
      // if a specific renderer has been defined
      if (mouseRenderer) {
        var clientRect = mouseRenderer.domElement.getBoundingClientRect();
        mouse.x = (event.clientX - clientRect.left) / clientRect.width * 2 - 1;
        mouse.y = -((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;
      }
      // default to fullscreen
      else {
          mouse.x = event.clientX / window.innerWidth * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    }, false);

    window.addEventListener('mousedown', function (event) {
      if (input.intersections.length > 0) {
        // prevent mouse down from triggering other listeners (polyfill, etc)
        event.stopImmediatePropagation();
        input.pressed = true;
      }
    }, true);

    window.addEventListener('mouseup', function (event) {
      input.pressed = false;
    }, false);

    return input;
  }

  /*
    Public function users run to give DAT GUI an input device.
    Automatically detects for ViveController and binds buttons + haptic feedback.
      Returns a laser pointer so it can be directly added to scene.
      The laser will then have two methods:
    laser.pressed(), laser.gripped()
      These can then be bound to any button the user wants. Useful for binding to
    cardboard or alternate input devices.
      For example...
      document.addEventListener( 'mousedown', function(){ laser.pressed( true ); } );
  */
  function addInputObject(object) {
    var input = createInput(object);

    input.laser.pressed = function (flag) {
      // only pay attention to presses over the GUI
      if (flag && input.intersections.length > 0) {
        input.pressed = true;
      } else {
        input.pressed = false;
      }
    };

    input.laser.gripped = function (flag) {
      input.gripped = flag;
    };

    input.laser.cursor = input.cursor;

    if (THREE.ViveController && object instanceof THREE.ViveController) {
      bindViveController(input, object, input.laser.pressed, input.laser.gripped);
    }

    inputObjects.push(input);

    return input.laser;
  }

  /*
    Here are the main dat gui controller types.
  */

  function addSlider(object, propertyName) {
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100.0;

    var slider = (0, _slider2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, min: min, max: max,
      initialValue: object[propertyName]
    });

    controllers.push(slider);

    return slider;
  }

  function addCheckbox(object, propertyName) {
    var checkbox = (0, _checkbox2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object,
      initialValue: object[propertyName]
    });

    controllers.push(checkbox);

    return checkbox;
  }

  function addButton(object, propertyName) {
    var button = (0, _button2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object
    });

    controllers.push(button);
    return button;
  }

  /**
   * 
   * @param {function} func to call back when button pressed
   * @param {*} image can be filename, WebGLRenderTarget or Material
   * @param {Boolean} wide whether to make button fill entire width of panel (api subject to change)
   */
  function addImageButton(func, image, wide) {
    var object = { f: func };
    var propertyName = 'f';

    //see also folder.js where this is added to group object...
    //as such this function also needs to be passed as an argument to createFolder.
    //perhaps all of these 'addX' functions could be initially put onto an object so that
    //new additions could be added slightly more easily.
    var button = (0, _imagebutton2.default)({
      textCreator: textCreator, object: object, propertyName: propertyName, image: image, wide: wide
    });
    controllers.push(button);
    return button;
  }

  /*
  This interface may be subject to change.
  */
  function addImageButtonGrid() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var objects = args;
    var grid = (0, _imagebuttongrid2.default)({ textCreator: textCreator, objects: objects, columns: 5 });
    controllers.push(grid);
    return grid;
  }

  function addKeyboard(keyListener) {
    if (!keyListener) keyListener = function keyListener(k) {
      return console.log('keyDown ' + k);
    };
    var kb = (0, _keyboard2.default)({ keyListener: keyListener, textCreator: textCreator });
    controllers.push(kb);
    return kb;
  }

  function addDropdown(object, propertyName, options) {
    var dropdown = (0, _dropdown2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, options: options
    });

    controllers.push(dropdown);
    return dropdown;
  }

  /*
    An implicit Add function which detects for property type
    and gives you the correct controller.
      Dropdown:
      add( object, propertyName, objectType )
      Slider:
      add( object, propertyOfNumberType, min, max )
      Checkbox:
      add( object, propertyOfBooleanType )
      Button:
      add( object, propertyOfFunctionType )
      Not used directly. Used by folders.
  */

  function add(object, propertyName, arg3, arg4) {

    if (object === undefined) {
      return undefined;
    } else if (object[propertyName] === undefined) {
      console.warn('no property named', propertyName, 'on object', object);
      return new THREE.Group();
    }

    if (isObject(arg3) || isArray(arg3)) {
      return addDropdown(object, propertyName, arg3);
    }

    if (isNumber(object[propertyName])) {
      return addSlider(object, propertyName, arg3, arg4);
    }

    if (isBoolean(object[propertyName])) {
      return addCheckbox(object, propertyName);
    }

    if (isFunction(object[propertyName])) {
      return addButton(object, propertyName);
    }

    //  add couldn't figure it out, pass it back to folder
    return undefined;
  }

  function addSimpleSlider() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var proxy = {
      number: min
    };

    return addSlider(proxy, 'number', min, max);
  }

  function addSimpleDropdown() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var proxy = {
      option: ''
    };

    if (options !== undefined) {
      proxy.option = isArray(options) ? options[0] : options[Object.keys(options)[0]];
    }

    return addDropdown(proxy, 'option', options);
  }

  function addSimpleCheckbox() {
    var defaultOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var proxy = {
      checked: defaultOption
    };

    return addCheckbox(proxy, 'checked');
  }

  function addSimpleButton(fn) {
    var proxy = {
      button: fn !== undefined ? fn : function () {}
    };

    return addButton(proxy, 'button');
  }

  /*
  Not used directly; used by folders.
  Remove controllers from the global list of all controllers known to dat.GUIVR.
  Calls removeTest first to check input arguments.  returns false if this test fails.
  returns true if successful.
    Note that this function does not recursively remove elements from folders; that is dealt with in the folder code which calls this.
  
   */
  function remove() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var argSet = [].concat(_toConsumableArray(new Set(args))); //just in case there were repeated elements in args, turn into Set then back to array.
    if (!removeTest.apply(undefined, _toConsumableArray(argSet))) return false;
    argSet.forEach(function (obj) {
      var i = controllers.indexOf(obj);
      if (i > -1) controllers.splice(i, 1);else {
        // I can't see how this'd happen now we guard against repeated elements.
        console.log("Internal error in remove, not anticipated by removeTest. Internal dat.GUIVR state may be inconsistent.");
        return false;
      }
    });
    return true;
  }

  /*
  Verify that all of the items in provided arguments are existing controllers that should be ok to remove.
    Returns false if there are any mismatches, true if believed ok to continue with actual remove()
    If any of the provided args are folders (have isFolder property) this is called recursively.
  This will result in redundant work as each folder will also call it again as it's removed, but this is cheap
  and it means that any error should be caught as early as possible and the whole process aborted.
  */
  function removeTest() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    for (var i = 0; i < args.length; i++) {
      var obj = args[i];
      if (controllers.indexOf(obj) === -1 || !obj.folder.hasChild(obj)) {
        //TODO: toString implementations for controllers
        console.log("Can't remove controller " + obj); //not sure the preferred way of reporting problem to user.
        return false;
      }
      if (obj.isFolder) {
        if (!removeTest.apply(undefined, _toConsumableArray(obj.guiChildren))) return false;
      }
    }
    return true;
  }

  /*
    Creates a folder with the name.
      Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
      Folders are given the add() functionality so that they can do
    folder.add( ... ) to create controllers.
  */

  function create(name) {
    var folder = (0, _folder2.default)({
      textCreator: textCreator,
      name: name,
      guiAdd: add,
      guiRemove: remove,
      addControllerFuncs: {
        addSlider: addSimpleSlider,
        addDropdown: addSimpleDropdown,
        addCheckbox: addSimpleCheckbox,
        addButton: addSimpleButton,
        addImageButton: addImageButton,
        addImageButtonPanel: addImageButtonGrid,
        addKeyboard: addKeyboard
      }
    });

    controllers.push(folder);

    return folder;
  }

  /*
    Perform the necessary updates, raycasts on its own RAF.
  */

  var tPosition = new THREE.Vector3();
  var tDirection = new THREE.Vector3(0, 0, -1);
  var tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame(update);

    var hitscanObjects = getVisibleHitscanObjects();

    if (mouseEnabled) {
      mouseInput.intersections = performMouseInput(hitscanObjects, mouseInput);
    }

    inputObjects.forEach(function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          box = _ref.box,
          object = _ref.object,
          raycast = _ref.raycast,
          laser = _ref.laser,
          cursor = _ref.cursor;

      var index = arguments[1];

      object.updateMatrixWorld();

      tPosition.set(0, 0, 0).setFromMatrixPosition(object.matrixWorld);
      tMatrix.identity().extractRotation(object.matrixWorld);
      tDirection.set(0, 0, -1).applyMatrix4(tMatrix).normalize();

      raycast.set(tPosition, tDirection);

      laser.geometry.vertices[0].copy(tPosition);

      //  debug...
      // laser.geometry.vertices[ 1 ].copy( tPosition ).add( tDirection.multiplyScalar( 1 ) );

      var intersections = raycast.intersectObjects(hitscanObjects, false);
      parseIntersections(intersections, laser, cursor);

      inputObjects[index].intersections = intersections;
    });

    var inputs = inputObjects.slice();

    if (mouseEnabled) {
      inputs.push(mouseInput);
    }

    controllers.forEach(function (controller) {
      //nb, we could do a more thorough check for visibilty, not sure how important
      //this bit is at this stage...
      if (controller.visible) controller.updateControl(inputs);
    });
  }

  function updateLaser(laser, point) {
    laser.geometry.vertices[1].copy(point);
    laser.visible = true;
    laser.geometry.computeBoundingSphere();
    laser.geometry.computeBoundingBox();
    laser.geometry.verticesNeedUpdate = true;
  }

  function parseIntersections(intersections, laser, cursor) {
    if (intersections.length > 0) {
      var firstHit = intersections[0];
      updateLaser(laser, firstHit.point);
      cursor.position.copy(firstHit.point);
      cursor.visible = true;
      cursor.updateMatrixWorld();
    } else {
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function parseMouseIntersection(intersection, laser, cursor) {
    cursor.position.copy(intersection);
    updateLaser(laser, cursor.position);
  }

  function performMouseIntersection(raycast, mouse, camera) {
    raycast.setFromCamera(mouse, camera);
    var hitscanObjects = getVisibleHitscanObjects();
    return raycast.intersectObjects(hitscanObjects, false);
  }

  function mouseIntersectsPlane(raycast, v, plane) {
    return raycast.ray.intersectPlane(plane, v);
  }

  function performMouseInput(hitscanObjects) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        box = _ref2.box,
        object = _ref2.object,
        raycast = _ref2.raycast,
        laser = _ref2.laser,
        cursor = _ref2.cursor,
        mouse = _ref2.mouse,
        mouseCamera = _ref2.mouseCamera;

    var intersections = [];

    if (mouseCamera) {
      intersections = performMouseIntersection(raycast, mouse, mouseCamera);
      parseIntersections(intersections, laser, cursor);
      cursor.visible = true;
      laser.visible = true;
    }

    return intersections;
  }

  update();

  /*
    Public methods.
  */

  return {
    create: create,
    addInputObject: addInputObject,
    enableMouse: enableMouse,
    disableMouse: disableMouse
  };
}();

if (window) {
  if (window.dat === undefined) {
    window.dat = {};
  }

  window.dat.GUIVR = GUIVR;
}

if (module) {
  module.exports = {
    dat: GUIVR
  };
}

if (typeof define === 'function' && define.amd) {
  define([], GUIVR);
}

/*
  Bunch of state-less utility functions.
*/

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(n) {
  return typeof n === 'boolean';
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//  only {} objects not arrays
//                    which are technically objects but you're just being pedantic
function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
}

function isArray(o) {
  return Array.isArray(o);
}

/*
  Controller-specific support.
*/

function bindViveController(input, controller, pressed, gripped) {
  controller.addEventListener('triggerdown', function () {
    return pressed(true);
  });
  controller.addEventListener('triggerup', function () {
    return pressed(false);
  });
  controller.addEventListener('gripsdown', function () {
    return gripped(true);
  });
  controller.addEventListener('gripsup', function () {
    return gripped(false);
  });

  var gamepad = controller.getGamepad();
  function vibrate(t, a) {
    if (gamepad && gamepad.hapticActuators.length > 0) {
      gamepad.hapticActuators[0].pulse(t, a);
    }
  }

  function hapticsTap() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(1 - a, 0.5);
    }, 10, 20);
  }

  function hapticsEcho() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(4, 1.0 * (1 - a));
    }, 100, 4);
  }

  input.events.on('onControllerHeld', function (input) {
    vibrate(0.3, 0.3);
  });

  input.events.on('grabbed', function () {
    hapticsTap();
  });

  input.events.on('grabReleased', function () {
    hapticsEcho();
  });

  input.events.on('pinned', function () {
    hapticsTap();
  });

  input.events.on('pinReleased', function () {
    hapticsEcho();
  });
}

function setIntervalTimes(cb, delay, times) {
  var x = 0;
  var id = setInterval(function () {
    cb(x, times, x / times);
    x++;
    if (x >= times) {
      clearInterval(id);
    }
  }, delay);
  return id;
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./imagebutton":9,"./imagebuttongrid":10,"./keyboard":13,"./sdftext":16,"./slider":18,"events":24}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInteraction;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInteraction(hitVolume) {
  var events = new _events2.default();

  var anyHover = false;
  var anyPressing = false;
  var anyActive = false;

  var tVector = new THREE.Vector3();
  var availableInputs = [];

  function update(inputObjects) {

    anyHover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {

      if (availableInputs.indexOf(input) < 0) {
        availableInputs.push(input);
      }

      var _extractHit = extractHit(input),
          hitObject = _extractHit.hitObject,
          hitPoint = _extractHit.hitPoint;

      var hover = hitVolume === hitObject;
      anyHover = anyHover || hover;

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'pressed',
        interactionName: 'press',
        downName: 'onPressed',
        holdName: 'pressing',
        upName: 'onReleased'
      });

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'gripped',
        interactionName: 'grip',
        downName: 'onGripped',
        holdName: 'gripping',
        upName: 'onReleaseGrip'
      });

      events.emit('tick', {
        input: input,
        hitObject: hitObject,
        inputObject: input.object
      });
    });
  }

  function extractHit(input) {
    if (input.intersections.length <= 0) {
      return {
        hitPoint: tVector.setFromMatrixPosition(input.cursor.matrixWorld).clone(),
        hitObject: undefined
      };
    } else {
      return {
        hitPoint: input.intersections[0].point,
        hitObject: input.intersections[0].object
      };
    }
  }

  function performStateEvents() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref.input,
        hover = _ref.hover,
        hitObject = _ref.hitObject,
        hitPoint = _ref.hitPoint,
        buttonName = _ref.buttonName,
        interactionName = _ref.interactionName,
        downName = _ref.downName,
        holdName = _ref.holdName,
        upName = _ref.upName;

    if (input[buttonName] === true && hitObject === undefined) {
      return;
    }

    //  hovering and button down but no interactions active yet
    if (hover && input[buttonName] === true && input.interaction[interactionName] === undefined) {

      var payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };
      events.emit(downName, payload);

      if (payload.locked) {
        input.interaction[interactionName] = interaction;
        input.interaction.hover = interaction;
      }

      anyPressing = true;
      anyActive = true;
    }

    //  button still down and this is the active interaction
    if (input[buttonName] && input.interaction[interactionName] === interaction) {
      var _payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };

      events.emit(holdName, _payload);

      anyPressing = true;

      input.events.emit('onControllerHeld');
    }

    //  button not down and this is the active interaction
    if (input[buttonName] === false && input.interaction[interactionName] === interaction) {
      input.interaction[interactionName] = undefined;
      input.interaction.hover = undefined;
      events.emit(upName, {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
    }
  }

  function isMainHover() {

    var noMainHover = true;
    for (var i = 0; i < availableInputs.length; i++) {
      if (availableInputs[i].interaction.hover !== undefined) {
        noMainHover = false;
        break;
      }
    }

    if (noMainHover) {
      return anyHover;
    }

    if (availableInputs.filter(function (input) {
      return input.interaction.hover === interaction;
    }).length > 0) {
      return true;
    }

    return false;
  }

  var interaction = {
    hovering: isMainHover,
    pressing: function pressing() {
      return anyPressing;
    },
    update: update,
    events: events
  };

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"events":24}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createKeyboard;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _imagebuttongrid = require('./imagebuttongrid');

var _imagebuttongrid2 = _interopRequireDefault(_imagebuttongrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 
 * TODO: Shift, return, backspace... cursors...
 * Maybe something like mobile input where you switch between letters & numbers / symbols
 * 
 * Something like a split keyboard ala https://medium.com/aaronn/vr-text-input-split-keyboard-e5bf3fd87a4c
 * might be better.
 * 
 * Peter Todd 2017
 */

function createKeyboard() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        keyListener = _ref.keyListener,
        textCreator = _ref.textCreator;

    var group = new THREE.Group();

    var events = new _events2.default();
    events.on('keyDown', keyListener);

    var lowerChars = "1234567890-=qwertyuiop[]asdfghjkl;'#\\zxcvbnm,./ ".split('');
    var objects = lowerChars.map(function (k) {
        return { func: function func() {
                return events.emit('keyDown', k);
            }, text: k };
    });
    var lowerKeys = (0, _imagebuttongrid2.default)({ textCreator: textCreator, objects: objects, columns: 12 });
    group.add(lowerKeys);

    var upperChars = "!\"£$%^&*()_+QWERTYUIOP{}ASDFGHJKL:@~|ZXCVBNM<>? ".split('');
    objects = upperChars.map(function (k) {
        return { func: function func() {
                return events.emit('keyDown', k);
            }, text: k };
    });
    var upperKeys = (0, _imagebuttongrid2.default)({ textCreator: textCreator, objects: objects, columns: 12 });
    upperKeys.visible = false;
    group.add(upperKeys);

    var shift = false;
    function shiftToggle() {
        shift = !shift;
        lowerKeys.visible = !shift;
        upperKeys.visible = shift;
    }

    objects = [{ text: "shift", func: shiftToggle }, { text: "backspace", func: function func() {
            return events.emit('keyDown', '\b');
        } }, { text: "enter", func: function func() {
            return events.emit('keyDown', '\n');
        } }];
    var specialKeys = (0, _imagebuttongrid2.default)({ textCreator: textCreator, objects: objects, columns: 3, rowHeight: 0.1 });
    group.add(specialKeys);
    specialKeys.position.y = -0.5 * (lowerKeys.spacing + specialKeys.spacing);
    group.spacing = lowerKeys.spacing + specialKeys.spacing;

    Object.defineProperty(group, 'hitscan', {
        get: function get() {
            return [specialKeys.hitscan, shift ? upperKeys.hitscan : lowerKeys.hitscan].reduce(function (a, b) {
                return a.concat(b);
            }, []);
        }
    });

    upperKeys.folder = lowerKeys.folder = specialKeys.folder = group;
    group.updateControl = function (inputs) {
        specialKeys.updateControl(inputs);
        lowerKeys.updateControl(inputs);
        upperKeys.updateControl(inputs);
    };

    return group;
}

},{"./imagebuttongrid":10,"events":24}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHECKBOX_SIZE = exports.BORDER_THICKNESS = exports.FOLDER_GRAB_HEIGHT = exports.FOLDER_HEIGHT = exports.SUBFOLDER_WIDTH = exports.FOLDER_WIDTH = exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.resizePanel = resizePanel;
exports.createControllerIDBox = createControllerIDBox;
exports.createDownArrow = createDownArrow;

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function alignLeft(obj) {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.computeBoundingBox();
    var width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate(width, 0, 0);
    return obj;
  } else if (obj instanceof THREE.Geometry) {
    obj.computeBoundingBox();
    var _width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate(_width, 0, 0);
    return obj;
  }
}

function createPanel(width, height, depth, uniqueMaterial) {
  var material = uniqueMaterial ? new THREE.MeshBasicMaterial({ color: 0xffffff }) : SharedMaterials.PANEL;
  var panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  panel.geometry.translate(width * 0.5, 0, 0);

  if (uniqueMaterial) {
    material.color.setHex(Colors.DEFAULT_BACK);
  } else {
    Colors.colorizeGeometry(panel.geometry, Colors.DEFAULT_BACK);
  }

  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;

  return panel;
}
function resizePanel(panel, width, height, depth) {
  panel.geometry.scale(width / panel.userData.currentWidth, height / panel.userData.currentHeight, depth / panel.userData.currentDepth);
  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;
}

function createControllerIDBox(height, color) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH), SharedMaterials.PANEL);
  panel.geometry.translate(CONTROLLER_ID_WIDTH * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, color);
  return panel;
}

function createDownArrow() {
  var w = 0.0096;
  var h = 0.016;
  var sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.lineTo(-w, h);
  sh.lineTo(w, h);
  sh.lineTo(0, 0);

  var geo = new THREE.ShapeGeometry(sh);
  geo.translate(0, -h * 0.5, 0);

  return new THREE.Mesh(geo, SharedMaterials.PANEL);
}

var PANEL_WIDTH = exports.PANEL_WIDTH = 1.0;
var PANEL_HEIGHT = exports.PANEL_HEIGHT = 0.08;
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.01;
var PANEL_SPACING = exports.PANEL_SPACING = 0.001;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.015;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.001;
var BUTTON_DEPTH = exports.BUTTON_DEPTH = 0.01;
var FOLDER_WIDTH = exports.FOLDER_WIDTH = 1.026;
var SUBFOLDER_WIDTH = exports.SUBFOLDER_WIDTH = 1.0;
var FOLDER_HEIGHT = exports.FOLDER_HEIGHT = 0.09;
var FOLDER_GRAB_HEIGHT = exports.FOLDER_GRAB_HEIGHT = 0.0512;
var BORDER_THICKNESS = exports.BORDER_THICKNESS = 0.01;
var CHECKBOX_SIZE = exports.CHECKBOX_SIZE = 0.05;

},{"./colors":3,"./sharedmaterials":17}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        group = _ref.group,
        panel = _ref.panel;

    var interaction = (0, _interaction2.default)(panel);

    interaction.events.on('onGripped', handleOnGrip);
    interaction.events.on('onReleaseGrip', handleOnGripRelease);

    var oldParent = void 0;
    var oldPosition = new THREE.Vector3();
    var oldRotation = new THREE.Euler();

    var rotationGroup = new THREE.Group();
    rotationGroup.scale.set(0.3, 0.3, 0.3);
    rotationGroup.position.set(-0.015, 0.015, 0.0);

    function handleOnGrip(p) {
        var inputObject = p.inputObject,
            input = p.input;


        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (folder.beingMoved === true) {
            return;
        }

        oldPosition.copy(folder.position);
        oldRotation.copy(folder.rotation);

        folder.position.set(0, 0, 0);
        folder.rotation.set(0, 0, 0);
        folder.rotation.x = -Math.PI * 0.5;

        oldParent = folder.parent;

        rotationGroup.add(folder);

        inputObject.add(rotationGroup);

        p.locked = true;

        folder.beingMoved = true;

        input.events.emit('pinned', input);
    }

    function handleOnGripRelease() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            inputObject = _ref2.inputObject,
            input = _ref2.input;

        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (oldParent === undefined) {
            return;
        }

        if (folder.beingMoved === false) {
            return;
        }

        oldParent.add(folder);
        oldParent = undefined;

        folder.position.copy(oldPosition);
        folder.rotation.copy(oldRotation);

        folder.beingMoved = false;

        input.events.emit('pinReleased', input);
    }

    return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":12}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMaterial = createMaterial;
exports.creator = creator;

var _sdf = require('three-bmfont-text/shaders/sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

var _parseBmfontAscii = require('parse-bmfont-ascii');

var _parseBmfontAscii2 = _interopRequireDefault(_parseBmfontAscii);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createMaterial(color) {

  var texture = new THREE.Texture();
  var image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return new THREE.RawShaderMaterial((0, _sdf2.default)({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
}

var textScale = 0.00024;

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xffffff;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;


    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      align: 'left',
      width: 10000,
      flipY: true,
      font: font
    });

    var layout = geometry.layout;

    var material = colorMaterials[color];
    if (material === undefined) {
      material = colorMaterials[color] = createMaterial(color);
    }
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiply(new THREE.Vector3(1, -1, 1));

    var finalScale = scale * textScale;

    mesh.scale.multiplyScalar(finalScale);

    mesh.position.y = layout.height * 0.5 * finalScale;

    return mesh;
  }

  function create(str) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 0xffffff : _ref$color,
        _ref$scale = _ref.scale,
        scale = _ref$scale === undefined ? 1.0 : _ref$scale;

    var group = new THREE.Group();

    var mesh = createText(str, font, color, scale);
    group.add(mesh);
    group.layout = mesh.geometry.layout;

    group.updateLabel = function (str) {
      mesh.geometry.update(str);
    };

    return group;
  }

  return {
    create: create,
    getMaterial: function getMaterial() {
      return material;
    }
  };
}

},{"./font":6,"parse-bmfont-ascii":31,"three-bmfont-text":33,"three-bmfont-text/shaders/sdf":36}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOLTIP = exports.FOLDER = exports.LOCATOR = exports.PANEL = undefined;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PANEL = exports.PANEL = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors }); /**
                                                                                                                * dat-guiVR Javascript Controller Library for VR
                                                                                                                * https://github.com/dataarts/dat.guiVR
                                                                                                                *
                                                                                                                * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                *
                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                * You may obtain a copy of the License at
                                                                                                                *
                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                *
                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                * limitations under the License.
                                                                                                                */

var LOCATOR = exports.LOCATOR = new THREE.MeshBasicMaterial();
var FOLDER = exports.FOLDER = new THREE.MeshBasicMaterial({ color: 0x000000 });
var TOOLTIP = exports.TOOLTIP = new THREE.MeshBasicMaterial({ color: 0x205080, transparent: true, opacity: 0.8 });

},{"./colors":3}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSlider() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue,
      _ref$min = _ref.min,
      min = _ref$min === undefined ? 0.0 : _ref$min,
      _ref$max = _ref.max,
      max = _ref$max === undefined ? 1.0 : _ref$max,
      _ref$step = _ref.step,
      step = _ref$step === undefined ? 0.1 : _ref$step,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  var SLIDER_DEPTH = depth;

  var state = {
    alpha: 1.0,
    value: initialValue,
    step: step,
    useStep: true,
    precision: 1,
    listen: false,
    min: min,
    max: max,
    onChangedCB: undefined,
    onFinishedChange: undefined,
    pressing: false
  };

  state.step = getImpliedStep(state.value);
  state.precision = numDecimals(state.step);
  state.alpha = getAlphaFromValue(state.value, state.min, state.max);

  var group = new THREE.Group();
  group.guiType = "slider";
  group.toString = function () {
    return '[' + group.guiType + ': ' + propertyName + ']';
  };

  //  filled volume
  var rect = new THREE.BoxGeometry(SLIDER_WIDTH, SLIDER_HEIGHT, SLIDER_DEPTH);
  rect.translate(SLIDER_WIDTH * 0.5, 0, 0);
  // Layout.alignLeft( rect );

  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;
  hitscanVolume.name = 'hitscanVolume';

  //  sliderBG volume
  var sliderBG = new THREE.Mesh(rect.clone(), SharedMaterials.PANEL);
  Colors.colorizeGeometry(sliderBG.geometry, Colors.SLIDER_BG);
  sliderBG.position.z = depth * 0.5;
  sliderBG.position.x = SLIDER_WIDTH + Layout.PANEL_MARGIN;

  var material = new THREE.MeshBasicMaterial({ color: Colors.DEFAULT_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  filledVolume.position.z = depth * 0.5;
  hitscanVolume.add(filledVolume);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05, 1, 1, 1), SharedMaterials.LOCATOR);
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add(endLocator);
  endLocator.visible = false;

  var valueLabel = textCreator.create(state.value.toString());
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth * 2.5;
  valueLabel.position.y = -0.0325;

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_SLIDER);
  controllerID.position.z = depth;

  var panel = Layout.createPanel(width, height, depth);
  panel.name = 'panel';
  panel.add(descriptorLabel, hitscanVolume, sliderBG, valueLabel, controllerID);

  group.add(panel);

  updateValueLabel(state.value);
  updateSlider();

  function updateValueLabel(value) {
    if (state.useStep) {
      valueLabel.updateLabel(roundToDecimal(state.value, state.precision).toString());
    } else {
      valueLabel.updateLabel(state.value.toString());
    }
  }

  function updateView() {
    if (state.pressing) {
      material.color.setHex(Colors.INTERACTION_COLOR);
    } else if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.DEFAULT_COLOR);
    }
  }

  function updateSlider() {
    filledVolume.scale.x = Math.min(Math.max(getAlphaFromValue(state.value, state.min, state.max) * width, 0.000001), width);
  }

  function updateObject(value) {
    object[propertyName] = value;
  }

  function updateStateFromAlpha(alpha) {
    state.alpha = getClampedAlpha(alpha);
    state.value = getValueFromAlpha(state.alpha, state.min, state.max);
    if (state.useStep) {
      state.value = getSteppedValue(state.value, state.step);
    }
    state.value = getClampedValue(state.value, state.min, state.max);
  }

  function listenUpdate() {
    state.value = getValueFromObject();
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    state.alpha = getClampedAlpha(state.alpha);
  }

  function getValueFromObject() {
    return parseFloat(object[propertyName]);
  }

  group.onChange = function (callback) {
    state.onChangedCB = callback;
    return group;
  };

  group.step = function (step) {
    state.step = step;
    state.precision = numDecimals(state.step);
    state.useStep = true;

    state.alpha = getAlphaFromValue(state.value, state.min, state.max);

    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.listen = function () {
    state.listen = true;
    return group;
  };

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handlePress);
  interaction.events.on('pressing', handleHold);
  interaction.events.on('onReleased', handleRelease);

  function handlePress(p) {
    if (group.visible === false) {
      return;
    }
    state.pressing = true;
    p.locked = true;
  }

  function handleHold() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        point = _ref2.point;

    if (group.visible === false) {
      return;
    }

    state.pressing = true;

    filledVolume.updateMatrixWorld();
    endLocator.updateMatrixWorld();

    var a = new THREE.Vector3().setFromMatrixPosition(filledVolume.matrixWorld);
    var b = new THREE.Vector3().setFromMatrixPosition(endLocator.matrixWorld);

    var previousValue = state.value;

    updateStateFromAlpha(getPointAlpha(point, { a: a, b: b }));
    updateValueLabel(state.value);
    updateSlider();
    updateObject(state.value);

    if (previousValue !== state.value && state.onChangedCB) {
      state.onChangedCB(state.value);
    }
  }

  function handleRelease() {
    state.pressing = false;
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider();
    }
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.min = function (m) {
    state.min = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.max = function (m) {
    state.max = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

var ta = new THREE.Vector3();
var tb = new THREE.Vector3();
var tToA = new THREE.Vector3();
var aToB = new THREE.Vector3();

function getPointAlpha(point, segment) {
  ta.copy(segment.b).sub(segment.a);
  tb.copy(point).sub(segment.a);

  var projected = tb.projectOnVector(ta);

  tToA.copy(point).sub(segment.a);

  aToB.copy(segment.b).sub(segment.a).normalize();

  var side = tToA.normalize().dot(aToB) >= 0 ? 1 : -1;

  var length = segment.a.distanceTo(segment.b) * side;

  var alpha = projected.length() / length;
  if (alpha > 1.0) {
    alpha = 1.0;
  }
  if (alpha < 0.0) {
    alpha = 0.0;
  }
  return alpha;
}

function lerp(min, max, value) {
  return (1 - value) * min + value * max;
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getClampedAlpha(alpha) {
  if (alpha > 1) {
    return 1;
  }
  if (alpha < 0) {
    return 0;
  }
  return alpha;
}

function getClampedValue(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getImpliedStep(value) {
  if (value === 0) {
    return 1; // What are we, psychics?
  } else {
    // Hey Doug, check this out.
    return Math.pow(10, Math.floor(Math.log(Math.abs(value)) / Math.LN10)) / 10;
  }
}

function getValueFromAlpha(alpha, min, max) {
  return map_range(alpha, 0.0, 1.0, min, max);
}

function getAlphaFromValue(value, min, max) {
  return map_range(value, min, max, 0.0, 1.0);
}

function getSteppedValue(value, step) {
  if (value % step != 0) {
    return Math.round(value / step) * step;
  }
  return value;
}

function numDecimals(x) {
  x = x.toString();
  if (x.indexOf('.') > -1) {
    return x.length - x.indexOf('.') - 1;
  } else {
    return 0;
  }
}

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

},{"./colors":3,"./grab":7,"./interaction":12,"./layout":14,"./palette":15,"./sharedmaterials":17,"./textlabel":19}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTextLabel;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createTextLabel(textCreator, str) {
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;
  var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.029;
  var fgColor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xffffff;
  var bgColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Colors.DEFAULT_BACK;
  var scale = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1.0;


  var group = new THREE.Group();
  group.guiType = "textlabel";
  group.toString = function () {
    return '[' + group.guiType + ': ' + str + ']';
  };

  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor, scale: scale });
  internalPositioning.add(text);

  group.setString = function (str) {
    text.updateLabel(str.toString());
  };

  group.setNumber = function (str) {
    text.updateLabel(str.toFixed(2));
  };

  text.position.z = depth;

  var backBounds = 0.01;
  var margin = 0.01;
  var totalWidth = width;
  var totalHeight = 0.04 + margin * 2;
  var labelBackGeometry = new THREE.BoxGeometry(totalWidth, totalHeight, depth, 1, 1, 1);
  labelBackGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(totalWidth * 0.5 - margin, 0, 0));

  var labelBackMesh = new THREE.Mesh(labelBackGeometry, SharedMaterials.PANEL);
  Colors.colorizeGeometry(labelBackMesh.geometry, bgColor);

  labelBackMesh.position.y = 0.03;
  internalPositioning.add(labelBackMesh);
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}

},{"./colors":3,"./sharedmaterials":17}],20:[function(require,module,exports){
'use strict';

/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *	@author centerionware / http://www.centerionware.com
 *
 *	Subdivision Geometry Modifier
 *		using Loop Subdivision Scheme
 *
 *	References:
 *		http://graphics.stanford.edu/~mdfisher/subdivision.html
 *		http://www.holmes3d.net/graphics/subdivision/
 *		http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
 *
 *	Known Issues:
 *		- currently doesn't handle "Sharp Edges"
 */

THREE.SubdivisionModifier = function (subdivisions) {

		this.subdivisions = subdivisions === undefined ? 1 : subdivisions;
};

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function (geometry) {

		var repeats = this.subdivisions;

		while (repeats-- > 0) {

				this.smooth(geometry);
		}

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
};

(function () {

		// Some constants
		var WARNINGS = !true; // Set to true for development
		var ABC = ['a', 'b', 'c'];

		function getEdge(a, b, map) {

				var vertexIndexA = Math.min(a, b);
				var vertexIndexB = Math.max(a, b);

				var key = vertexIndexA + "_" + vertexIndexB;

				return map[key];
		}

		function processEdge(a, b, vertices, map, face, metaVertices) {

				var vertexIndexA = Math.min(a, b);
				var vertexIndexB = Math.max(a, b);

				var key = vertexIndexA + "_" + vertexIndexB;

				var edge;

				if (key in map) {

						edge = map[key];
				} else {

						var vertexA = vertices[vertexIndexA];
						var vertexB = vertices[vertexIndexB];

						edge = {

								a: vertexA, // pointer reference
								b: vertexB,
								newEdge: null,
								// aIndex: a, // numbered reference
								// bIndex: b,
								faces: [] // pointers to face

						};

						map[key] = edge;
				}

				edge.faces.push(face);

				metaVertices[a].edges.push(edge);
				metaVertices[b].edges.push(edge);
		}

		function generateLookups(vertices, faces, metaVertices, edges) {

				var i, il, face, edge;

				for (i = 0, il = vertices.length; i < il; i++) {

						metaVertices[i] = { edges: [] };
				}

				for (i = 0, il = faces.length; i < il; i++) {

						face = faces[i];

						processEdge(face.a, face.b, vertices, edges, face, metaVertices);
						processEdge(face.b, face.c, vertices, edges, face, metaVertices);
						processEdge(face.c, face.a, vertices, edges, face, metaVertices);
				}
		}

		function newFace(newFaces, a, b, c) {

				newFaces.push(new THREE.Face3(a, b, c));
		}

		function midpoint(a, b) {

				return Math.abs(b - a) / 2 + Math.min(a, b);
		}

		function newUv(newUvs, a, b, c) {

				newUvs.push([a.clone(), b.clone(), c.clone()]);
		}

		/////////////////////////////

		// Performs one iteration of Subdivision
		THREE.SubdivisionModifier.prototype.smooth = function (geometry) {

				var tmp = new THREE.Vector3();

				var oldVertices, oldFaces, oldUvs;
				var newVertices,
				    newFaces,
				    newUVs = [];

				var n, l, i, il, j, k;
				var metaVertices, sourceEdges;

				// new stuff.
				var sourceEdges, newEdgeVertices, newSourceVertices;

				oldVertices = geometry.vertices; // { x, y, z}
				oldFaces = geometry.faces; // { a: oldVertex1, b: oldVertex2, c: oldVertex3 }
				oldUvs = geometry.faceVertexUvs[0];

				var hasUvs = oldUvs !== undefined && oldUvs.length > 0;

				/******************************************************
     *
     * Step 0: Preprocess Geometry to Generate edges Lookup
     *
     *******************************************************/

				metaVertices = new Array(oldVertices.length);
				sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

				generateLookups(oldVertices, oldFaces, metaVertices, sourceEdges);

				/******************************************************
     *
     *	Step 1.
     *	For each edge, create a new Edge Vertex,
     *	then position it.
     *
     *******************************************************/

				newEdgeVertices = [];
				var other, currentEdge, newEdge, face;
				var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

				for (i in sourceEdges) {

						currentEdge = sourceEdges[i];
						newEdge = new THREE.Vector3();

						edgeVertexWeight = 3 / 8;
						adjacentVertexWeight = 1 / 8;

						connectedFaces = currentEdge.faces.length;

						// check how many linked faces. 2 should be correct.
						if (connectedFaces != 2) {

								// if length is not 2, handle condition
								edgeVertexWeight = 0.5;
								adjacentVertexWeight = 0;

								if (connectedFaces != 1) {

										if (WARNINGS) console.warn('Subdivision Modifier: Number of connected faces != 2, is: ', connectedFaces, currentEdge);
								}
						}

						newEdge.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);

						tmp.set(0, 0, 0);

						for (j = 0; j < connectedFaces; j++) {

								face = currentEdge.faces[j];

								for (k = 0; k < 3; k++) {

										other = oldVertices[face[ABC[k]]];
										if (other !== currentEdge.a && other !== currentEdge.b) break;
								}

								tmp.add(other);
						}

						tmp.multiplyScalar(adjacentVertexWeight);
						newEdge.add(tmp);

						currentEdge.newEdge = newEdgeVertices.length;
						newEdgeVertices.push(newEdge);

						// console.log(currentEdge, newEdge);
				}

				/******************************************************
     *
     *	Step 2.
     *	Reposition each source vertices.
     *
     *******************************************************/

				var beta, sourceVertexWeight, connectingVertexWeight;
				var connectingEdge, connectingEdges, oldVertex, newSourceVertex;
				newSourceVertices = [];

				for (i = 0, il = oldVertices.length; i < il; i++) {

						oldVertex = oldVertices[i];

						// find all connecting edges (using lookupTable)
						connectingEdges = metaVertices[i].edges;
						n = connectingEdges.length;

						if (n == 3) {

								beta = 3 / 16;
						} else if (n > 3) {

								beta = 3 / (8 * n); // Warren's modified formula
						}

						// Loop's original beta formula
						// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

						sourceVertexWeight = 1 - n * beta;
						connectingVertexWeight = beta;

						if (n <= 2) {

								// crease and boundary rules
								// console.warn('crease and boundary rules');

								if (n == 2) {

										if (WARNINGS) console.warn('2 connecting edges', connectingEdges);
										sourceVertexWeight = 3 / 4;
										connectingVertexWeight = 1 / 8;

										// sourceVertexWeight = 1;
										// connectingVertexWeight = 0;
								} else if (n == 1) {

										if (WARNINGS) console.warn('only 1 connecting edge');
								} else if (n == 0) {

										if (WARNINGS) console.warn('0 connecting edges');
								}
						}

						newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight);

						tmp.set(0, 0, 0);

						for (j = 0; j < n; j++) {

								connectingEdge = connectingEdges[j];
								other = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
								tmp.add(other);
						}

						tmp.multiplyScalar(connectingVertexWeight);
						newSourceVertex.add(tmp);

						newSourceVertices.push(newSourceVertex);
				}

				/******************************************************
     *
     *	Step 3.
     *	Generate Faces between source vertices
     *	and edge vertices.
     *
     *******************************************************/

				newVertices = newSourceVertices.concat(newEdgeVertices);
				var sl = newSourceVertices.length,
				    edge1,
				    edge2,
				    edge3;
				newFaces = [];

				var uv, x0, x1, x2;
				var x3 = new THREE.Vector2();
				var x4 = new THREE.Vector2();
				var x5 = new THREE.Vector2();

				for (i = 0, il = oldFaces.length; i < il; i++) {

						face = oldFaces[i];

						// find the 3 new edges vertex of each old face

						edge1 = getEdge(face.a, face.b, sourceEdges).newEdge + sl;
						edge2 = getEdge(face.b, face.c, sourceEdges).newEdge + sl;
						edge3 = getEdge(face.c, face.a, sourceEdges).newEdge + sl;

						// create 4 faces.

						newFace(newFaces, edge1, edge2, edge3);
						newFace(newFaces, face.a, edge1, edge3);
						newFace(newFaces, face.b, edge2, edge1);
						newFace(newFaces, face.c, edge3, edge2);

						// create 4 new uv's

						if (hasUvs) {

								uv = oldUvs[i];

								x0 = uv[0];
								x1 = uv[1];
								x2 = uv[2];

								x3.set(midpoint(x0.x, x1.x), midpoint(x0.y, x1.y));
								x4.set(midpoint(x1.x, x2.x), midpoint(x1.y, x2.y));
								x5.set(midpoint(x0.x, x2.x), midpoint(x0.y, x2.y));

								newUv(newUVs, x3, x4, x5);
								newUv(newUVs, x0, x3, x5);

								newUv(newUVs, x1, x4, x3);
								newUv(newUVs, x2, x5, x4);
						}
				}

				// Overwrite old arrays
				geometry.vertices = newVertices;
				geometry.faces = newFaces;
				if (hasUvs) geometry.faceVertexUvs[0] = newUVs;

				// console.log('done');
		};
})();

},{}],21:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],22:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],23:[function(require,module,exports){
module.exports = function(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array
    case 'array':
      return Array
    case 'uint8_clamped':
      return Uint8ClampedArray
  }
}

},{}],24:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],25:[function(require,module,exports){
/*eslint new-cap:0*/
var dtype = require('dtype')
module.exports = flattenVertexData
function flattenVertexData (data, output, offset) {
  if (!data) throw new TypeError('must specify data as first parameter')
  offset = +(offset || 0) | 0

  if (Array.isArray(data) && Array.isArray(data[0])) {
    var dim = data[0].length
    var length = data.length * dim

    // no output specified, create a new typed array
    if (!output || typeof output === 'string') {
      output = new (dtype(output || 'float32'))(length + offset)
    }

    var dstLength = output.length - offset
    if (length !== dstLength) {
      throw new Error('source length ' + length + ' (' + dim + 'x' + data.length + ')' +
        ' does not match destination length ' + dstLength)
    }

    for (var i = 0, k = offset; i < data.length; i++) {
      for (var j = 0; j < dim; j++) {
        output[k++] = data[i][j]
      }
    }
  } else {
    if (!output || typeof output === 'string') {
      // no output, create a new one
      var Ctor = dtype(output || 'float32')
      if (offset === 0) {
        output = new Ctor(data)
      } else {
        output = new Ctor(data.length + offset)
        output.set(data, offset)
      }
    } else {
      // store output in existing array
      output.set(data, offset)
    }
  }

  return output
}

},{"dtype":23}],26:[function(require,module,exports){
module.exports = function compile(property) {
	if (!property || typeof property !== 'string')
		throw new Error('must specify property for indexof search')

	return new Function('array', 'value', 'start', [
		'start = start || 0',
		'for (var i=start; i<array.length; i++)',
		'  if (array[i]["' + property +'"] === value)',
		'      return i',
		'return -1'
	].join('\n'))
}
},{}],27:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],28:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],29:[function(require,module,exports){
var wordWrap = require('word-wrapper')
var xtend = require('xtend')
var findChar = require('indexof-property')('id')
var number = require('as-number')

var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
var M_WIDTHS = ['m', 'w']
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


var TAB_ID = '\t'.charCodeAt(0)
var SPACE_ID = ' '.charCodeAt(0)
var ALIGN_LEFT = 0, 
    ALIGN_CENTER = 1, 
    ALIGN_RIGHT = 2

module.exports = function createLayout(opt) {
  return new TextLayout(opt)
}

function TextLayout(opt) {
  this.glyphs = []
  this._measure = this.computeMetrics.bind(this)
  this.update(opt)
}

TextLayout.prototype.update = function(opt) {
  opt = xtend({
    measure: this._measure
  }, opt)
  this._opt = opt
  this._opt.tabSize = number(this._opt.tabSize, 4)

  if (!opt.font)
    throw new Error('must provide a valid bitmap font')

  var glyphs = this.glyphs
  var text = opt.text||'' 
  var font = opt.font
  this._setupSpaceGlyphs(font)
  
  var lines = wordWrap.lines(text, opt)
  var minWidth = opt.width || 0

  //clear glyphs
  glyphs.length = 0

  //get max line width
  var maxLineWidth = lines.reduce(function(prev, line) {
    return Math.max(prev, line.width, minWidth)
  }, 0)

  //the pen position
  var x = 0
  var y = 0
  var lineHeight = number(opt.lineHeight, font.common.lineHeight)
  var baseline = font.common.base
  var descender = lineHeight-baseline
  var letterSpacing = opt.letterSpacing || 0
  var height = lineHeight * lines.length - descender
  var align = getAlignType(this._opt.align)

  //draw text along baseline
  y -= height
  
  //the metrics for this text layout
  this._width = maxLineWidth
  this._height = height
  this._descender = lineHeight - baseline
  this._baseline = baseline
  this._xHeight = getXHeight(font)
  this._capHeight = getCapHeight(font)
  this._lineHeight = lineHeight
  this._ascender = lineHeight - descender - this._xHeight
    
  //layout each glyph
  var self = this
  lines.forEach(function(line, lineIndex) {
    var start = line.start
    var end = line.end
    var lineWidth = line.width
    var lastGlyph
    
    //for each glyph in that line...
    for (var i=start; i<end; i++) {
      var id = text.charCodeAt(i)
      var glyph = self.getGlyph(font, id)
      if (glyph) {
        if (lastGlyph) 
          x += getKerning(font, lastGlyph.id, glyph.id)

        var tx = x
        if (align === ALIGN_CENTER) 
          tx += (maxLineWidth-lineWidth)/2
        else if (align === ALIGN_RIGHT)
          tx += (maxLineWidth-lineWidth)

        glyphs.push({
          position: [tx, y],
          data: glyph,
          index: i,
          line: lineIndex
        })  

        //move pen forward
        x += glyph.xadvance + letterSpacing
        lastGlyph = glyph
      }
    }

    //next line down
    y += lineHeight
    x = 0
  })
  this._linesTotal = lines.length;
}

TextLayout.prototype._setupSpaceGlyphs = function(font) {
  //These are fallbacks, when the font doesn't include
  //' ' or '\t' glyphs
  this._fallbackSpaceGlyph = null
  this._fallbackTabGlyph = null

  if (!font.chars || font.chars.length === 0)
    return

  //try to get space glyph
  //then fall back to the 'm' or 'w' glyphs
  //then fall back to the first glyph available
  var space = getGlyphById(font, SPACE_ID) 
          || getMGlyph(font) 
          || font.chars[0]

  //and create a fallback for tab
  var tabWidth = this._opt.tabSize * space.xadvance
  this._fallbackSpaceGlyph = space
  this._fallbackTabGlyph = xtend(space, {
    x: 0, y: 0, xadvance: tabWidth, id: TAB_ID, 
    xoffset: 0, yoffset: 0, width: 0, height: 0
  })
}

TextLayout.prototype.getGlyph = function(font, id) {
  var glyph = getGlyphById(font, id)
  if (glyph)
    return glyph
  else if (id === TAB_ID) 
    return this._fallbackTabGlyph
  else if (id === SPACE_ID) 
    return this._fallbackSpaceGlyph
  return null
}

TextLayout.prototype.computeMetrics = function(text, start, end, width) {
  var letterSpacing = this._opt.letterSpacing || 0
  var font = this._opt.font
  var curPen = 0
  var curWidth = 0
  var count = 0
  var glyph
  var lastGlyph

  if (!font.chars || font.chars.length === 0) {
    return {
      start: start,
      end: start,
      width: 0
    }
  }

  end = Math.min(text.length, end)
  for (var i=start; i < end; i++) {
    var id = text.charCodeAt(i)
    var glyph = this.getGlyph(font, id)

    if (glyph) {
      //move pen forward
      var xoff = glyph.xoffset
      var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0
      curPen += kern

      var nextPen = curPen + glyph.xadvance + letterSpacing
      var nextWidth = curPen + glyph.width

      //we've hit our limit; we can't move onto the next glyph
      if (nextWidth >= width || nextPen >= width)
        break

      //otherwise continue along our line
      curPen = nextPen
      curWidth = nextWidth
      lastGlyph = glyph
    }
    count++
  }
  
  //make sure rightmost edge lines up with rendered glyphs
  if (lastGlyph)
    curWidth += lastGlyph.xoffset

  return {
    start: start,
    end: start + count,
    width: curWidth
  }
}

//getters for the private vars
;['width', 'height', 
  'descender', 'ascender',
  'xHeight', 'baseline',
  'capHeight',
  'lineHeight' ].forEach(addGetter)

function addGetter(name) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true
  })
}

//create lookups for private vars
function wrapper(name) {
  return (new Function([
    'return function '+name+'() {',
    '  return this._'+name,
    '}'
  ].join('\n')))()
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0)
    return null

  var glyphIdx = findChar(font.chars, id)
  if (glyphIdx >= 0)
    return font.chars[glyphIdx]
  return null
}

function getXHeight(font) {
  for (var i=0; i<X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getMGlyph(font) {
  for (var i=0; i<M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx]
  }
  return 0
}

function getCapHeight(font) {
  for (var i=0; i<CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0)
    return 0

  var table = font.kernings
  for (var i=0; i<table.length; i++) {
    var kern = table[i]
    if (kern.first === left && kern.second === right)
      return kern.amount
  }
  return 0
}

function getAlignType(align) {
  if (align === 'center')
    return ALIGN_CENTER
  else if (align === 'right')
    return ALIGN_RIGHT
  return ALIGN_LEFT
}
},{"as-number":22,"indexof-property":26,"word-wrapper":38,"xtend":39}],30:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],31:[function(require,module,exports){
module.exports = function parseBMFontAscii(data) {
  if (!data)
    throw new Error('no data provided')
  data = data.toString().trim()

  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  var lines = data.split(/\r\n?|\n/g)

  if (lines.length === 0)
    throw new Error('no data in BMFont file')

  for (var i = 0; i < lines.length; i++) {
    var lineData = splitLine(lines[i], i)
    if (!lineData) //skip empty lines
      continue

    if (lineData.key === 'page') {
      if (typeof lineData.data.id !== 'number')
        throw new Error('malformed file at line ' + i + ' -- needs page id=N')
      if (typeof lineData.data.file !== 'string')
        throw new Error('malformed file at line ' + i + ' -- needs page file="path"')
      output.pages[lineData.data.id] = lineData.data.file
    } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
      //... do nothing for these two ...
    } else if (lineData.key === 'char') {
      output.chars.push(lineData.data)
    } else if (lineData.key === 'kerning') {
      output.kernings.push(lineData.data)
    } else {
      output[lineData.key] = lineData.data
    }
  }

  return output
}

function splitLine(line, idx) {
  line = line.replace(/\t+/g, ' ').trim()
  if (!line)
    return null

  var space = line.indexOf(' ')
  if (space === -1) 
    throw new Error("no named row at line " + idx)

  var key = line.substring(0, space)

  line = line.substring(space + 1)
  //clear "letter" field as it is non-standard and
  //requires additional complexity to parse " / = symbols
  line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '')  
  line = line.split("=")
  line = line.map(function(str) {
    return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g))
  })

  var data = []
  for (var i = 0; i < line.length; i++) {
    var dt = line[i]
    if (i === 0) {
      data.push({
        key: dt[0],
        data: ""
      })
    } else if (i === line.length - 1) {
      data[data.length - 1].data = parseData(dt[0])
    } else {
      data[data.length - 1].data = parseData(dt[0])
      data.push({
        key: dt[1],
        data: ""
      })
    }
  }

  var out = {
    key: key,
    data: {}
  }

  data.forEach(function(v) {
    out.data[v.key] = v.data;
  })

  return out
}

function parseData(data) {
  if (!data || data.length === 0)
    return ""

  if (data.indexOf('"') === 0 || data.indexOf("'") === 0)
    return data.substring(1, data.length - 1)
  if (data.indexOf(',') !== -1)
    return parseIntList(data)
  return parseInt(data, 10)
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],32:[function(require,module,exports){
var dtype = require('dtype')
var anArray = require('an-array')
var isBuffer = require('is-buffer')

var CW = [0, 2, 3]
var CCW = [2, 1, 3]

module.exports = function createQuadElements(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}
},{"an-array":21,"dtype":23,"is-buffer":28}],33:[function(require,module,exports){
var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var buffer = require('three-buffer-vertex-data')
var assign = require('object-assign')

var vertices = require('./lib/vertices')
var utils = require('./lib/utils')

var Base = THREE.BufferGeometry

module.exports = function createTextGeometry (opt) {
  return new TextGeometry(opt)
}

function TextGeometry (opt) {
  Base.call(this)

  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use these as default values for any subsequent
  // calls to update()
  this._opt = assign({}, opt)

  // also do an initial setup...
  if (opt) this.update(opt)
}

inherits(TextGeometry, Base)

TextGeometry.prototype.update = function (opt) {
  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use constructor defaults
  opt = assign({}, this._opt, opt)

  if (!opt.font) {
    throw new TypeError('must specify a { font } in options')
  }

  this.layout = createLayout(opt)

  // get vec2 texcoords
  var flipY = opt.flipY !== false

  // the desired BMFont data
  var font = opt.font

  // determine texture size from font file
  var texWidth = font.common.scaleW
  var texHeight = font.common.scaleH

  // get visible glyphs
  var glyphs = this.layout.glyphs.filter(function (glyph) {
    var bitmap = glyph.data
    return bitmap.width * bitmap.height > 0
  })

  // provide visible glyphs for convenience
  this.visibleGlyphs = glyphs

  // get common vertex data
  var positions = vertices.positions(glyphs)
  var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
  var indices = createIndices({
    clockwise: true,
    type: 'uint16',
    count: glyphs.length
  })

  // update vertex data
  buffer.index(this, indices, 1, 'uint16')
  buffer.attr(this, 'position', positions, 2)
  buffer.attr(this, 'uv', uvs, 2)

  // update multipage data
  if (!opt.multipage && 'page' in this.attributes) {
    // disable multipage rendering
    this.removeAttribute('page')
  } else if (opt.multipage) {
    var pages = vertices.pages(glyphs)
    // enable multipage rendering
    buffer.attr(this, 'page', pages, 1)
  }
}

TextGeometry.prototype.computeBoundingSphere = function () {
  if (this.boundingSphere === null) {
    this.boundingSphere = new THREE.Sphere()
  }

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius)) {
    console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
      'Computed radius is NaN. The ' +
      '"position" attribute is likely to have NaN values.')
  }
}

TextGeometry.prototype.computeBoundingBox = function () {
  if (this.boundingBox === null) {
    this.boundingBox = new THREE.Box3()
  }

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}

},{"./lib/utils":34,"./lib/vertices":35,"inherits":27,"layout-bmfont-text":29,"object-assign":30,"quad-indices":32,"three-buffer-vertex-data":37}],34:[function(require,module,exports){
var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function (positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0)
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function (positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var width = maxX - minX
  var height = maxY - minY
  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, 0)
  output.radius = length / 2
}

},{}],35:[function(require,module,exports){
module.exports.pages = function pages (glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1)
  var i = 0
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

module.exports.uvs = function uvs (glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data
    var bw = (bitmap.x + bitmap.width)
    var bh = (bitmap.y + bitmap.height)

    // top left position
    var u0 = bitmap.x / texWidth
    var v1 = bitmap.y / texHeight
    var u1 = bw / texWidth
    var v0 = bh / texHeight

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight
      v0 = (texHeight - bh) / texHeight
    }

    // BL
    uvs[i++] = u0
    uvs[i++] = v1
    // TL
    uvs[i++] = u0
    uvs[i++] = v0
    // TR
    uvs[i++] = u1
    uvs[i++] = v0
    // BR
    uvs[i++] = u1
    uvs[i++] = v1
  })
  return uvs
}

module.exports.positions = function positions (glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset
    var y = glyph.position[1] + bitmap.yoffset

    // quad size
    var w = bitmap.width
    var h = bitmap.height

    // BL
    positions[i++] = x
    positions[i++] = y
    // TL
    positions[i++] = x
    positions[i++] = y + h
    // TR
    positions[i++] = x + w
    positions[i++] = y + h
    // BR
    positions[i++] = x + w
    positions[i++] = y
  })
  return positions
}

},{}],36:[function(require,module,exports){
var assign = require('object-assign')

module.exports = function createSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}'
    ].join('\n'),
    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'varying vec2 vUv;',

      'float aastep(float value) {',
      '  #ifdef GL_OES_standard_derivatives',
      '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;',
      '  #else',
      '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));',
      '  #endif',
      '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);',
      '}',

      'void main() {',
      '  vec4 texColor = texture2D(map, vUv);',
      '  float alpha = aastep(texColor.a);',
      '  gl_FragColor = vec4(color, opacity * alpha);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt)
}

},{"object-assign":30}],37:[function(require,module,exports){
var flatten = require('flatten-vertex-data')
var warned = false;

module.exports.attr = setAttribute
module.exports.index = setIndex

function setIndex (geometry, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 1
  if (typeof dtype !== 'string') dtype = 'uint16'

  var isR69 = !geometry.index && typeof geometry.setIndex !== 'function'
  var attrib = isR69 ? geometry.getAttribute('index') : geometry.index
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    if (isR69) geometry.addAttribute('index', newAttrib)
    else geometry.index = newAttrib
  }
}

function setAttribute (geometry, key, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 3
  if (typeof dtype !== 'string') dtype = 'float32'
  if (Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].length !== itemSize) {
    throw new Error('Nested vertex array has unexpected size; expected ' +
      itemSize + ' but found ' + data[0].length)
  }

  var attrib = geometry.getAttribute(key)
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    geometry.addAttribute(key, newAttrib)
  }
}

function updateAttribute (attrib, data, itemSize, dtype) {
  data = data || []
  if (!attrib || rebuildAttribute(attrib, data, itemSize)) {
    // create a new array with desired type
    data = flatten(data, dtype)

    var needsNewBuffer = attrib && typeof attrib.setArray !== 'function'
    if (!attrib || needsNewBuffer) {
      // We are on an old version of ThreeJS which can't
      // support growing / shrinking buffers, so we need
      // to build a new buffer
      if (needsNewBuffer && !warned) {
        warned = true
        console.warn([
          'A WebGL buffer is being updated with a new size or itemSize, ',
          'however this version of ThreeJS only supports fixed-size buffers.',
          '\nThe old buffer may still be kept in memory.\n',
          'To avoid memory leaks, it is recommended that you dispose ',
          'your geometries and create new ones, or update to ThreeJS r82 or newer.\n',
          'See here for discussion:\n',
          'https://github.com/mrdoob/three.js/pull/9631'
        ].join(''))
      }

      // Build a new attribute
      attrib = new THREE.BufferAttribute(data, itemSize);
    }

    attrib.itemSize = itemSize
    attrib.needsUpdate = true

    // New versions of ThreeJS suggest using setArray
    // to change the data. It will use bufferData internally,
    // so you can change the array size without any issues
    if (typeof attrib.setArray === 'function') {
      attrib.setArray(data)
    }

    return attrib
  } else {
    // copy data into the existing array
    flatten(data, attrib.array)
    attrib.needsUpdate = true
    return null
  }
}

// Test whether the attribute needs to be re-created,
// returns false if we can re-use it as-is.
function rebuildAttribute (attrib, data, itemSize) {
  if (attrib.itemSize !== itemSize) return true
  if (!attrib.array) return true
  var attribLength = attrib.array.length
  if (Array.isArray(data) && Array.isArray(data[0])) {
    // [ [ x, y, z ] ]
    return attribLength !== data.length * itemSize
  } else {
    // [ x, y, z ]
    return attribLength !== data.length
  }
  return false
}

},{"flatten-vertex-data":25}],38:[function(require,module,exports){
var newline = /\n/
var newlineChar = '\n'
var whitespace = /\s/

module.exports = function(text, opt) {
    var lines = module.exports.lines(text, opt)
    return lines.map(function(line) {
        return text.substring(line.start, line.end)
    }).join('\n')
}

module.exports.lines = function wordwrap(text, opt) {
    opt = opt||{}

    //zero width results in nothing visible
    if (opt.width === 0 && opt.mode !== 'nowrap') 
        return []

    text = text||''
    var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
    var start = Math.max(0, opt.start||0)
    var end = typeof opt.end === 'number' ? opt.end : text.length
    var mode = opt.mode

    var measure = opt.measure || monospace
    if (mode === 'pre')
        return pre(measure, text, start, end, width)
    else
        return greedy(measure, text, start, end, width, mode)
}

function idxOf(text, chr, start, end) {
    var idx = text.indexOf(chr, start)
    if (idx === -1 || idx > end)
        return end
    return idx
}

function isWhitespace(chr) {
    return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
    var lines = []
    var lineStart = start
    for (var i=start; i<end && i<text.length; i++) {
        var chr = text.charAt(i)
        var isNewline = newline.test(chr)

        //If we've reached a newline, then step down a line
        //Or if we've reached the EOF
        if (isNewline || i===end-1) {
            var lineEnd = isNewline ? i : i+1
            var measured = measure(text, lineStart, lineEnd, width)
            lines.push(measured)
            
            lineStart = i+1
        }
    }
    return lines
}

function greedy(measure, text, start, end, width, mode) {
    //A greedy word wrapper based on LibGDX algorithm
    //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
    var lines = []

    var testWidth = width
    //if 'nowrap' is specified, we only wrap on newline chars
    if (mode === 'nowrap')
        testWidth = Number.MAX_VALUE

    while (start < end && start < text.length) {
        //get next newline position
        var newLine = idxOf(text, newlineChar, start, end)

        //eat whitespace at start of line
        while (start < newLine) {
            if (!isWhitespace( text.charAt(start) ))
                break
            start++
        }

        //determine visible # of glyphs for the available width
        var measured = measure(text, start, newLine, testWidth)

        var lineEnd = start + (measured.end-measured.start)
        var nextStart = lineEnd + newlineChar.length

        //if we had to cut the line before the next newline...
        if (lineEnd < newLine) {
            //find char to break on
            while (lineEnd > start) {
                if (isWhitespace(text.charAt(lineEnd)))
                    break
                lineEnd--
            }
            if (lineEnd === start) {
                if (nextStart > start + newlineChar.length) nextStart--
                lineEnd = nextStart // If no characters to break, show all.
            } else {
                nextStart = lineEnd
                //eat whitespace at end of line
                while (lineEnd > start) {
                    if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
                        break
                    lineEnd--
                }
            }
        }
        if (lineEnd >= start) {
            var result = measure(text, start, lineEnd, testWidth)
            lines.push(result)
        }
        start = nextStart
    }
    return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
    var glyphs = Math.min(width, end-start)
    return {
        start: start,
        end: start+glyphs
    }
}
},{}],39:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGdyYXBoaWMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW1hZ2VidXR0b24uanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW1hZ2VidXR0b25ncmlkLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGluZGV4LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGludGVyYWN0aW9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGtleWJvYXJkLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGxheW91dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxwYWxldHRlLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNkZnRleHQuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2hhcmVkbWF0ZXJpYWxzLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNsaWRlci5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFx0ZXh0bGFiZWwuanMiLCJtb2R1bGVzXFx0aGlyZHBhcnR5XFxTdWJkaXZpc2lvbk1vZGlmaWVyLmpzIiwibm9kZV9tb2R1bGVzL2FuLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzLW51bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdHlwZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2ZsYXR0ZW4tdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW5kZXhvZi1wcm9wZXJ0eS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQtYXNjaWkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcXVhZC1pbmRpY2VzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdmVydGljZXMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dvcmQtd3JhcHBlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkM0QndCLFk7O0FBVHhCOztJQUFZLG1COztBQUVaOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxNOztBQUNaOztJQUFZLE07O0FBQ1o7O0lBQVksZTs7QUFDWjs7SUFBWSxJOzs7Ozs7QUFFRyxTQUFTLFlBQVQsR0FPUDtBQUFBLGlGQUFKLEVBQUk7QUFBQSxNQU5OLFdBTU0sUUFOTixXQU1NO0FBQUEsTUFMTixNQUtNLFFBTE4sTUFLTTtBQUFBLCtCQUpOLFlBSU07QUFBQSxNQUpOLFlBSU0scUNBSlMsV0FJVDtBQUFBLHdCQUhOLEtBR007QUFBQSxNQUhOLEtBR00sOEJBSEUsT0FBTyxX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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVCdXR0b24oIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IExheW91dC5CVVRUT05fREVQVEg7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuZ3VpVHlwZSA9IFwiYnV0dG9uXCI7XHJcbiAgZ3JvdXAudG9TdHJpbmcgPSAoKSA9PiBgWyR7Z3JvdXAuZ3VpVHlwZX06ICR7cHJvcGVydHlOYW1lfV1gO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgZGl2aXNpb25zID0gNDtcclxuICBjb25zdCBhc3BlY3RSYXRpbyA9IEJVVFRPTl9XSURUSCAvIEJVVFRPTl9IRUlHSFQ7XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQlVUVE9OX1dJRFRILCBCVVRUT05fSEVJR0hULCBCVVRUT05fREVQVEgsIE1hdGguZmxvb3IoIGRpdmlzaW9ucyAqIGFzcGVjdFJhdGlvICksIGRpdmlzaW9ucywgZGl2aXNpb25zICk7XHJcbiAgY29uc3QgbW9kaWZpZXIgPSBuZXcgVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllciggMSApO1xyXG4gIG1vZGlmaWVyLm1vZGlmeSggcmVjdCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKCBCVVRUT05fV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuXHJcbiAgLy8gIGhpdHNjYW4gdm9sdW1lXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkJVVFRPTl9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcblxyXG4gIGNvbnN0IGJ1dHRvbkxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUsIHsgc2NhbGU6IDAuODY2IH0gKTtcclxuXHJcbiAgLy8gIFRoaXMgaXMgYSByZWFsIGhhY2sgc2luY2Ugd2UgbmVlZCB0byBmaXQgdGhlIHRleHQgcG9zaXRpb24gdG8gdGhlIGZvbnQgc2NhbGluZ1xyXG4gIC8vICBQbGVhc2UgZml4IG1lLlxyXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnggPSBCVVRUT05fV0lEVEggKiAwLjUgLSBidXR0b25MYWJlbC5sYXlvdXQud2lkdGggKiAwLjAwMDAxMSAqIDAuNTtcclxuICBidXR0b25MYWJlbC5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMS4yO1xyXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMjU7XHJcbiAgZmlsbGVkVm9sdW1lLmFkZCggYnV0dG9uTGFiZWwgKTtcclxuXHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0JVVFRPTiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBjb250cm9sbGVySUQgKTtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdKCk7XHJcblxyXG4gICAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC4xO1xyXG5cclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUmVsZWFzZSgpe1xyXG4gICAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC41O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkJVVFRPTl9ISUdITElHSFRfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkJVVFRPTl9DT0xPUiApO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gZmFsc2UsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQ0hFQ0tCT1hfV0lEVEggPSBMYXlvdXQuQ0hFQ0tCT1hfU0laRTtcclxuICBjb25zdCBDSEVDS0JPWF9IRUlHSFQgPSBDSEVDS0JPWF9XSURUSDtcclxuICBjb25zdCBDSEVDS0JPWF9ERVBUSCA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBJTkFDVElWRV9TQ0FMRSA9IDAuMDAxO1xyXG4gIGNvbnN0IEFDVElWRV9TQ0FMRSA9IDAuOTtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICB2YWx1ZTogaW5pdGlhbFZhbHVlLFxyXG4gICAgbGlzdGVuOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuZ3VpVHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICBncm91cC50b1N0cmluZyA9ICgpID0+IGBbJHtncm91cC5ndWlUeXBlfTogJHtwcm9wZXJ0eU5hbWV9XWA7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDSEVDS0JPWF9XSURUSCwgQ0hFQ0tCT1hfSEVJR0hULCBDSEVDS0JPWF9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKCBDSEVDS0JPWF9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG5cclxuXHJcbiAgLy8gIGhpdHNjYW4gdm9sdW1lXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICAvLyAgb3V0bGluZSB2b2x1bWVcclxuICAvLyBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xyXG4gIC8vIG91dGxpbmUubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuT1VUTElORV9DT0xPUiApO1xyXG5cclxuICAvLyAgY2hlY2tib3ggdm9sdW1lXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkNIRUNLQk9YX0JHX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgLy8gZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsQUNUSVZFX1NDQUxFICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQ0hFQ0tCT1ggKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBib3JkZXJCb3ggPSBMYXlvdXQuY3JlYXRlUGFuZWwoIENIRUNLQk9YX1dJRFRIICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MsIENIRUNLQk9YX0hFSUdIVCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBDSEVDS0JPWF9ERVBUSCwgdHJ1ZSApO1xyXG4gIGJvcmRlckJveC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4MWY3YWU3ICk7XHJcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnggPSAtTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUgKyB3aWR0aCAqIDAuNTtcclxuICBib3JkZXJCb3gucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG5cclxuICBjb25zdCBjaGVja21hcmsgPSBHcmFwaGljLmNoZWNrbWFyaygpO1xyXG4gIGNoZWNrbWFyay5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjUxO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBjaGVja21hcmsgKTtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCwgYm9yZGVyQm94ICk7XHJcblxyXG4gIC8vIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBoaXRzY2FuVm9sdW1lLCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnZhbHVlID0gIXN0YXRlLnZhbHVlO1xyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICBpZiggb25DaGFuZ2VkQ0IgKXtcclxuICAgICAgb25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xyXG4gICAgICBjaGVja21hcmsudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBjaGVja21hcmsudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgYm9yZGVyQm94LnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgYm9yZGVyQm94LnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGVMYWJlbCggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdO1xyXG4gICAgfVxyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09MT1IgPSAweDJGQTFENjtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9DT0xPUiA9IDB4NDNiNWVhO1xyXG5leHBvcnQgY29uc3QgSU5URVJBQ1RJT05fQ09MT1IgPSAweDA3QUJGNztcclxuZXhwb3J0IGNvbnN0IEVNSVNTSVZFX0NPTE9SID0gMHgyMjIyMjI7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgPSAweDk5OTk5OTtcclxuZXhwb3J0IGNvbnN0IE9VVExJTkVfQ09MT1IgPSAweDk5OTk5OTtcclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQkFDSyA9IDB4MWExYTFhO1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9GT0xERVJfQkFDSyA9IDB4MTAxMDEwO1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0JBQ0sgPSAweDMxMzEzMTtcclxuZXhwb3J0IGNvbnN0IElOQUNUSVZFX0NPTE9SID0gMHgxNjE4Mjk7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1NMSURFUiA9IDB4MmZhMWQ2O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9DSEVDS0JPWCA9IDB4ODA2Nzg3O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9CVVRUT04gPSAweGU2MWQ1ZjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfVEVYVCA9IDB4MWVkMzZmO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9EUk9QRE9XTiA9IDB4ZmZmMDAwO1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fQkdfQ09MT1IgPSAweGZmZmZmZjtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0ZHX0NPTE9SID0gMHgwMDAwMDA7XHJcbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9CR19DT0xPUiA9IDB4ZmZmZmZmO1xyXG5leHBvcnQgY29uc3QgQlVUVE9OX0NPTE9SID0gMHhlNjFkNWY7XHJcbmV4cG9ydCBjb25zdCBCVVRUT05fSElHSExJR0hUX0NPTE9SID0gMHhmYTMxNzM7XHJcbmV4cG9ydCBjb25zdCBTTElERVJfQkcgPSAweDQ0NDQ0NDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb2xvcml6ZUdlb21ldHJ5KCBnZW9tZXRyeSwgY29sb3IgKXtcclxuICBnZW9tZXRyeS5mYWNlcy5mb3JFYWNoKCBmdW5jdGlvbihmYWNlKXtcclxuICAgIGZhY2UuY29sb3Iuc2V0SGV4KGNvbG9yKTtcclxuICB9KTtcclxuICBnZW9tZXRyeS5jb2xvcnNOZWVkVXBkYXRlID0gdHJ1ZTtcclxuICByZXR1cm4gZ2VvbWV0cnk7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICBvcHRpb25zID0gW10sXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgb3BlbjogZmFsc2UsXHJcbiAgICBsaXN0ZW46IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgRFJPUERPV05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgRFJPUERPV05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9ERVBUSCA9IGRlcHRoO1xyXG4gIGNvbnN0IERST1BET1dOX09QVElPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOICogMS4yO1xyXG4gIGNvbnN0IERST1BET1dOX01BUkdJTiA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAtMC40O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGdyb3VwLmd1aVR5cGUgPSBcImRyb3Bkb3duXCI7XHJcbiAgZ3JvdXAudG9TdHJpbmcgPSAoKSA9PiBgWyR7Z3JvdXAuZ3VpVHlwZX06ICR7cHJvcGVydHlOYW1lfV1gO1xyXG5cclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBsYWJlbEludGVyYWN0aW9ucyA9IFtdO1xyXG4gIGNvbnN0IG9wdGlvbkxhYmVscyA9IFtdO1xyXG5cclxuICAvLyAgZmluZCBhY3R1YWxseSB3aGljaCBsYWJlbCBpcyBzZWxlY3RlZFxyXG4gIGNvbnN0IGluaXRpYWxMYWJlbCA9IGZpbmRMYWJlbEZyb21Qcm9wKCk7XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZmluZExhYmVsRnJvbVByb3AoKXtcclxuICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgICAgcmV0dXJuIG9wdGlvbnMuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb3B0aW9uTmFtZSA9PT0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xyXG4gICAgICAgIHJldHVybiBvYmplY3RbcHJvcGVydHlOYW1lXSA9PT0gb3B0aW9uc1sgb3B0aW9uTmFtZSBdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbiggbGFiZWxUZXh0LCBpc09wdGlvbiApe1xyXG4gICAgY29uc3QgbGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoXHJcbiAgICAgIHRleHRDcmVhdG9yLCBsYWJlbFRleHQsXHJcbiAgICAgIERST1BET1dOX1dJRFRILCBkZXB0aCxcclxuICAgICAgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SLCBDb2xvcnMuRFJPUERPV05fQkdfQ09MT1IsXHJcbiAgICAgIDAuODY2XHJcbiAgICApO1xyXG5cclxuICAgIGdyb3VwLmhpdHNjYW4ucHVzaCggbGFiZWwuYmFjayApO1xyXG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5wdXNoKCBsYWJlbEludGVyYWN0aW9uICk7XHJcbiAgICBvcHRpb25MYWJlbHMucHVzaCggbGFiZWwgKTtcclxuXHJcblxyXG4gICAgaWYoIGlzT3B0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggbGFiZWxUZXh0ICk7XHJcblxyXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBvbkNoYW5nZWRDQiAmJiBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgIG9uQ2hhbmdlZENCKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGxhYmVsLmlzT3B0aW9uID0gaXNPcHRpb247XHJcbiAgICByZXR1cm4gbGFiZWw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcclxuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gIGJhc2Ugb3B0aW9uXHJcbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsLCBmYWxzZSApO1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAwLjUgKyB3aWR0aCAqIDAuNTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gR3JhcGhpYy5kb3duQXJyb3coKTtcclxuICAvLyBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZG93bkFycm93Lmdlb21ldHJ5LCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcclxuICBkb3duQXJyb3cucG9zaXRpb24uc2V0KCBEUk9QRE9XTl9XSURUSCAtIDAuMDQsIDAsIGRlcHRoICogMS4wMSApO1xyXG4gIHNlbGVjdGVkTGFiZWwuYWRkKCBkb3duQXJyb3cgKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZUxhYmVsUG9zaXRpb24oIGxhYmVsLCBpbmRleCApe1xyXG4gICAgbGFiZWwucG9zaXRpb24ueSA9IC1EUk9QRE9XTl9NQVJHSU4gLSAoaW5kZXgrMSkgKiAoIERST1BET1dOX09QVElPTl9IRUlHSFQgKTtcclxuICAgIGxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wdGlvblRvTGFiZWwoIG9wdGlvbk5hbWUsIGluZGV4ICl7XHJcbiAgICBjb25zdCBvcHRpb25MYWJlbCA9IGNyZWF0ZU9wdGlvbiggb3B0aW9uTmFtZSwgdHJ1ZSApO1xyXG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XHJcbiAgICByZXR1cm4gb3B0aW9uTGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4ub3B0aW9ucy5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLk9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29sbGFwc2VPcHRpb25zKCk7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0RST1BET1dOICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcblxyXG4gIGNvbnN0IGJvcmRlckJveCA9IExheW91dC5jcmVhdGVQYW5lbCggRFJPUERPV05fV0lEVEggKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUywgRFJPUERPV05fSEVJR0hUICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUsIERST1BET1dOX0RFUFRILCB0cnVlICk7XHJcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcclxuICBib3JkZXJCb3gucG9zaXRpb24ueCA9IC1MYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSArIHdpZHRoICogMC41O1xyXG4gIGJvcmRlckJveC5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBjb250cm9sbGVySUQsIHNlbGVjdGVkTGFiZWwsIGJvcmRlckJveCApO1xyXG5cclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGludGVyYWN0aW9uLCBpbmRleCApe1xyXG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiggbGFiZWxJbnRlcmFjdGlvbnNbMF0uaG92ZXJpbmcoKSB8fCBzdGF0ZS5vcGVuICl7XHJcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBmaW5kTGFiZWxGcm9tUHJvcCgpICk7XHJcbiAgICB9XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWxJbnRlcmFjdGlvbiApe1xyXG4gICAgICBsYWJlbEludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB9KTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVGb2xkZXIoe1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG5hbWUsXHJcbiAgZ3VpQWRkLFxyXG4gIGd1aVJlbW92ZSxcclxuICBhZGRDb250cm9sbGVyRnVuY3NcclxufSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IHdpZHRoID0gTGF5b3V0LkZPTERFUl9XSURUSDtcclxuICBjb25zdCBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSDtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgcHJldmlvdXNQYXJlbnQ6IHVuZGVmaW5lZFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuZ3VpVHlwZSA9IFwiZm9sZGVyXCI7XHJcbiAgZ3JvdXAudG9TdHJpbmcgPSAoKSA9PiBgWyR7Z3JvdXAuZ3VpVHlwZX06ICR7bmFtZX1dYDtcclxuXHJcbiAgY29uc3QgY29sbGFwc2VHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGdyb3VwLmFkZCggY29sbGFwc2VHcm91cCApO1xyXG5cclxuICB2YXIgaXNBY2NvcmRpb24gPSBmYWxzZTtcclxuICAvKiogV2hlbiB0cnVlLCB3aWxsIGtlZXAgb25seSBvbmUgY2hpbGQgZm9sZGVyIG9mIHRoaXMgZm9sZGVyIG9wZW4gYXQgYSB0aW1lLlxyXG4gICAqIFNpYmxpbmdzIGF1dG9tYXRpY2FsbHkgY2xvc2UuXHJcbiAgICovXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBncm91cCwgJ2FjY29yZGlvbicsIHtcclxuICAgIGdldDogKCkgPT4ge1xyXG4gICAgICByZXR1cm4gaXNBY2NvcmRpb247XHJcbiAgICB9LFxyXG4gICAgc2V0OiAoIG5ld1ZhbHVlICkgPT4ge1xyXG4gICAgICBpZiAoIG5ld1ZhbHVlICYmICFpc0FjY29yZGlvbiApIGdyb3VwLmd1aUNoaWxkcmVuLmZpbHRlciggYz0+Yy5pc0ZvbGRlciApLm1hcCggYz0+Yy5jbG9zZSgpICk7XHJcbiAgICAgIGlzQWNjb3JkaW9uID0gbmV3VmFsdWU7XHJcbiAgICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy9leHBvc2UgYXMgcHVibGljIGludGVyZmFjZSBzbyB0aGF0IGNoaWxkcmVuIGNhbiBjYWxsIGl0IHdoZW4gdGhlaXIgc3BhY2luZyBjaGFuZ2VzXHJcbiAgZ3JvdXAucGVyZm9ybUxheW91dCA9IHBlcmZvcm1MYXlvdXQ7XHJcbiAgZ3JvdXAuaXNDb2xsYXBzZWQgPSAoKSA9PiB7IHJldHVybiBzdGF0ZS5jb2xsYXBzZWQgfVxyXG4gIFxyXG4gIC8vdXNlZnVsIHRvIGhhdmUgYWNjZXNzIHRvIHRoaXMgYXMgd2VsbC4gVXNpbmcgaW4gcmVtb3ZlIGltcGxlbWVudGF0aW9uXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdyb3VwLCAnZ3VpQ2hpbGRyZW4nLCB7XHJcbiAgICBnZXQ6ICgpID0+IHsgcmV0dXJuIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4gfVxyXG4gIH0pO1xyXG4gIC8vIHJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIHN1cHBsaWVkIGFyZ3MgYXJlIG1lbWJlcnMgb2YgdGhpcyBmb2xkZXJcclxuICBncm91cC5oYXNDaGlsZCA9IGZ1bmN0aW9uICggLi4uYXJncyApe1xyXG4gICAgcmV0dXJuICFhcmdzLmluY2x1ZGVzKChvYmopID0+IHsgcmV0dXJuIGdyb3VwLmd1aUNoaWxkcmVuLmluZGV4T2Yob2JqKSA9PT0gLTF9KTtcclxuICB9XHJcblxyXG4gIGdyb3VwLmZvbGRlck5hbWUgPSBuYW1lOyAvL2ZvciBkZWJ1Z2dpbmdcclxuICBcclxuICAvLyAgWWVhaC4gR3Jvc3MuXHJcbiAgY29uc3QgYWRkT3JpZ2luYWwgPSBUSFJFRS5Hcm91cC5wcm90b3R5cGUuYWRkO1xyXG4gIC8vYXMgbG9uZyBhcyBuby1vbmUgZXhwZWN0cyB0aGlzIHRvIGJlaGF2ZSBsaWtlIGEgcmVndWxhciBUSFJFRS5Hcm91cCwgdGhlIGNoYW5nZWQgZGVmaW5pdGlvbiBvZiByZW1vdmUgc2hvdWxkbid0IGh1cnRcclxuICAvL2NvbnN0IHJlbW92ZU9yaWdpbmFsID0gVEhSRUUuR3JvdXAucHJvdG90eXBlLnJlbW92ZTsgXHJcblxyXG4gIGZ1bmN0aW9uIGFkZEltcGwoIG8gKXtcclxuICAgIGFkZE9yaWdpbmFsLmNhbGwoIGdyb3VwLCBvICk7XHJcbiAgfVxyXG5cclxuICBhZGRJbXBsKCBjb2xsYXBzZUdyb3VwICk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgTGF5b3V0LkZPTERFUl9IRUlHSFQsIGRlcHRoLCB0cnVlICk7XHJcbiAgYWRkSW1wbCggcGFuZWwgKTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBuYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gKiAxLjU7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsICk7XHJcblxyXG4gIGNvbnN0IGRvd25BcnJvdyA9IExheW91dC5jcmVhdGVEb3duQXJyb3coKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZG93bkFycm93Lmdlb21ldHJ5LCAweGZmZmZmZiApO1xyXG4gIGRvd25BcnJvdy5wb3NpdGlvbi5zZXQoIDAuMDUsIDAsIGRlcHRoICAqIDEuMDEgKTtcclxuICBwYW5lbC5hZGQoIGRvd25BcnJvdyApO1xyXG5cclxuICBjb25zdCBncmFiYmVyID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgTGF5b3V0LkZPTERFUl9HUkFCX0hFSUdIVCwgZGVwdGgsIHRydWUgKTtcclxuICBncmFiYmVyLnBvc2l0aW9uLnkgPSBMYXlvdXQuRk9MREVSX0hFSUdIVCAqIDAuODY7IC8vWFhYOiBtYWdpYyBudW1iZXJcclxuICBncmFiYmVyLm5hbWUgPSAnZ3JhYmJlcic7XHJcbiAgYWRkSW1wbCggZ3JhYmJlciApO1xyXG5cclxuICBjb25zdCBncmFiQmFyID0gR3JhcGhpYy5ncmFiQmFyKCk7XHJcbiAgZ3JhYkJhci5wb3NpdGlvbi5zZXQoIHdpZHRoICogMC41LCAwLCBkZXB0aCAqIDEuMDAxICk7XHJcbiAgZ3JhYmJlci5hZGQoIGdyYWJCYXIgKTtcclxuICBncm91cC5pc0ZvbGRlciA9IHRydWU7XHJcbiAgZ3JvdXAuaGlkZUdyYWJiZXIgPSBmdW5jdGlvbigpIHsgZ3JhYmJlci52aXNpYmxlID0gZmFsc2UgfTtcclxuXHJcbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGNvbnN0IG5ld0NvbnRyb2xsZXIgPSBndWlBZGQoIC4uLmFyZ3MgKTtcclxuXHJcbiAgICBpZiggbmV3Q29udHJvbGxlciApe1xyXG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBuZXdDb250cm9sbGVyICk7XHJcbiAgICAgIHJldHVybiBuZXdDb250cm9sbGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qIFxyXG4gIFJlbW92ZXMgdGhlIGdpdmVuIGNvbnRyb2xsZXJzIGZyb20gdGhlIEdVSS5cclxuXHJcbiAgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgaXQgd2lsbCBhdHRlbXB0IHRvIGRldGVjdCB0aGlzIGJlZm9yZSBtYWtpbmcgYW55IGNoYW5nZXMsIFxyXG4gIGFib3J0aW5nIHRoZSBwcm9jZXNzIGFuZCByZXR1cm5pbmcgZmFsc2UgZnJvbSB0aGlzIG1ldGhvZC5cclxuXHJcbiAgTm90ZTogYXMgd2l0aCBhZGQsIHRoaXMgb3ZlcndyaXRlcyBhbiBleGlzdGluZyBwcm9wZXJ0eSBvZiBUSFJFRS5Hcm91cC5cclxuICBBcyBsb25nIGFzIG5vLW9uZSBleHBlY3RzIGZvbGRlcnMgdG8gYmVoYXZlIGxpa2UgcmVndWxhciBUSFJFRS5Hcm91cHMsIHRoYXQgc2hvdWxkbid0IG1hdHRlci5cclxuICAqL1xyXG4gIGdyb3VwLnJlbW92ZSA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBjb25zdCBvayA9IGd1aVJlbW92ZSggLi4uYXJncyApOyAvLyBhbnkgaW52YWxpZCBhcmd1bWVudHMgc2hvdWxkIGNhdXNlIHRoaXMgdG8gcmV0dXJuIGZhbHNlXHJcbiAgICBpZiAoIW9rKSByZXR1cm4gZmFsc2U7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcclxuICAgICAgY29uc29sZS5hc3NlcnQoZ3JvdXAuaGFzQ2hpbGQob2JqKSwgXCJpbnRlcm5hbCBwcm9ibGVtIHdpdGggaG91c2VrZWVwaW5nIGxvZ2ljIG9mIGRhdC5HVUlWUiBmb2xkZXIgbm90IGNhdWdodCBieSBzYW5pdHkgY2hlY2tcIik7XHJcbiAgICAgIGlmIChvYmouaXNGb2xkZXIpIHtcclxuICAgICAgICBvYmoucmVtb3ZlKCAuLi5vYmouZ3VpQ2hpbGRyZW4gKTtcclxuICAgICAgfVxyXG4gICAgICBjb2xsYXBzZUdyb3VwLnJlbW92ZShvYmopO1xyXG4gICAgfSk7XHJcbiAgICAvL1RPRE86IGRlZmVyIGFjdHVhbCBsYXlvdXQgcGVyZm9ybWFuY2U7IHNldCBhIGZsYWcgYW5kIG1ha2Ugc3VyZSBpdCBnZXRzIGRvbmUgYmVmb3JlIGFueSByZW5kZXJpbmcgb3IgaGl0LXRlc3RpbmcgaGFwcGVucy5cclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcclxuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xyXG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XHJcbiAgICAgIGlmIChvYmouaXNGb2xkZXIpIHtcclxuICAgICAgICBvYmouaGlkZUdyYWJiZXIoKTtcclxuICAgICAgICBvYmouY2xvc2UoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmFkZEZvbGRlciA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xyXG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XHJcbiAgICAgIG9iai5oaWRlR3JhYmJlcigpO1xyXG4gICAgICBvYmouY2xvc2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1MYXlvdXQoKXtcclxuICAgIGNvbnN0IHNwYWNpbmdQZXJDb250cm9sbGVyID0gTGF5b3V0LlBBTkVMX0hFSUdIVCArIExheW91dC5QQU5FTF9TUEFDSU5HO1xyXG4gICAgY29uc3QgZW1wdHlGb2xkZXJTcGFjZSA9IExheW91dC5GT0xERVJfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XHJcbiAgICB2YXIgdG90YWxTcGFjaW5nID0gZW1wdHlGb2xkZXJTcGFjZTtcclxuXHJcbiAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIChjKSA9PiB7IGMudmlzaWJsZSA9ICFzdGF0ZS5jb2xsYXBzZWQgfSApO1xyXG5cclxuICAgIGlmICggc3RhdGUuY29sbGFwc2VkICkge1xyXG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IE1hdGguUEkgKiAwLjU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IDA7XHJcblxyXG4gICAgICB2YXIgeSA9IDAsIGxhc3RIZWlnaHQgPSBlbXB0eUZvbGRlclNwYWNlO1xyXG5cclxuICAgICAgY29sbGFwc2VHcm91cC5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKXtcclxuICAgICAgICB2YXIgaCA9IGNoaWxkLnNwYWNpbmcgPyBjaGlsZC5zcGFjaW5nIDogc3BhY2luZ1BlckNvbnRyb2xsZXI7XHJcbiAgICAgICAgLy8gaG93IGZhciB0byBnZXQgZnJvbSB0aGUgbWlkZGxlIG9mIHByZXZpb3VzIHRvIG1pZGRsZSBvZiB0aGlzIGNoaWxkP1xyXG4gICAgICAgIC8vIGhhbGYgb2YgdGhlIGhlaWdodCBvZiBwcmV2aW91cyBwbHVzIGhhbGYgaGVpZ2h0IG9mIHRoaXMuXHJcbiAgICAgICAgdmFyIHNwYWNpbmcgPSAwLjUgKiAobGFzdEhlaWdodCArIGgpO1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQuaXNGb2xkZXIpIHtcclxuICAgICAgICAgIC8vIEZvciBmb2xkZXJzLCB0aGUgb3JpZ2luIGlzbid0IGluIHRoZSBtaWRkbGUgb2YgdGhlIGVudGlyZSBoZWlnaHQgb2YgdGhlIGZvbGRlcixcclxuICAgICAgICAgIC8vIGJ1dCBqdXN0IHRoZSBtaWRkbGUgb2YgdGhlIHRvcCBwYW5lbC5cclxuICAgICAgICAgIHZhciBvZmZzZXQgPSAwLjUgKiAobGFzdEhlaWdodCArIGVtcHR5Rm9sZGVyU3BhY2UpO1xyXG4gICAgICAgICAgY2hpbGQucG9zaXRpb24ueSA9IHkgLSBvZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSB5IC0gc3BhY2luZztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaW4gYW55IGNhc2UsIGZvciB1c2UgYnkgdGhlIG5leHQgb2JqZWN0IGFsb25nIHdlIHJlbWVtYmVyICd5JyBhcyB0aGUgbWlkZGxlIG9mIHRoZSB3aG9sZSBwYW5lbFxyXG4gICAgICAgIHkgLT0gc3BhY2luZztcclxuICAgICAgICBsYXN0SGVpZ2h0ID0gaDtcclxuICAgICAgICB0b3RhbFNwYWNpbmcgKz0gaDtcclxuICAgICAgICBjaGlsZC5wb3NpdGlvbi54ID0gMC4wMjY7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdyb3VwLnNwYWNpbmcgPSB0b3RhbFNwYWNpbmc7XHJcblxyXG4gICAgLy9tYWtlIHN1cmUgcGFyZW50IGZvbGRlciBhbHNvIHBlcmZvcm1zIGxheW91dC5cclxuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwKSBncm91cC5mb2xkZXIucGVyZm9ybUxheW91dCgpO1xyXG5cclxuICAgIC8vIGlmIHdlJ3JlIGEgc3ViZm9sZGVyLCB1c2UgYSBzbWFsbGVyIHBhbmVsXHJcbiAgICBsZXQgcGFuZWxXaWR0aCA9IExheW91dC5GT0xERVJfV0lEVEg7XHJcbiAgICBpZiAoZ3JvdXAuZm9sZGVyICE9PSBncm91cCkge1xyXG4gICAgICBwYW5lbFdpZHRoID0gTGF5b3V0LlNVQkZPTERFUl9XSURUSDtcclxuICAgIH1cclxuXHJcbiAgICBMYXlvdXQucmVzaXplUGFuZWwocGFuZWwsIHBhbmVsV2lkdGgsIExheW91dC5GT0xERVJfSEVJR0hULCBkZXB0aClcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBwYW5lbC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcGFuZWwubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9GT0xERVJfQkFDSyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBncmFiSW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfRk9MREVSX0JBQ0sgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgIGlmIChzdGF0ZS5jb2xsYXBzZWQpIGdyb3VwLm9wZW4oKTtcclxuICAgIGVsc2UgZ3JvdXAuY2xvc2UoKTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9KTtcclxuXHJcbiAgZ3JvdXAub3BlbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCFzdGF0ZS5jb2xsYXBzZWQpIHJldHVybjtcclxuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwICYmIGdyb3VwLmZvbGRlci5hY2NvcmRpb24pIHtcclxuICAgICAgZ3JvdXAuZm9sZGVyLmd1aUNoaWxkcmVuLmZpbHRlcihjPT5jLmlzRm9sZGVyICYmIGMgIT09IGdyb3VwKS5mb3JFYWNoKGM9PmMuY2xvc2UoKSk7XHJcbiAgICB9XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGdyb3VwLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoc3RhdGUuY29sbGFwc2VkKSByZXR1cm47XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuZm9sZGVyID0gZ3JvdXA7XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbDogZ3JhYmJlciB9ICk7XHJcbiAgY29uc3QgcGFsZXR0ZUludGVyYWN0aW9uID0gUGFsZXR0ZS5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCwgZ3JhYmJlciBdO1xyXG5cclxuICBncm91cC5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gIGZvciAobGV0IGsgaW4gYWRkQ29udHJvbGxlckZ1bmNzKSB7XHJcbiAgICBncm91cFtrXSA9ICguLi5hcmdzKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRDb250cm9sbGVyRnVuY3Nba10oLi4uYXJncyk7XHJcbiAgICAgIGlmICggY29udHJvbGxlciApe1xyXG4gICAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcclxuICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW1hZ2UoKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWdBQUFBRUFDQU1BQUFEeVRqNVZBQUFBalZCTVZFVkhjRXovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8rdW1BYzdBQUFBTDNSU1RsTUFXbkpmYm5xRFdHUjRhMlpjWW5CUmFsUkxnSDZFVG5SOFVHaDJSb1pEWGxhSFNZbzhRSFUyTHlZY0ZBd0ZtbVVSMU9JQUFKRmhTVVJCVkhoZXRMMkpXbXU3ampVS0lRa2tRTHFadmdNQ1pPMnpULzMzL1IvdlNrTkRrajJUck9hclZkNVY2eERQM3BKbFdkS1E3cWFQYjYrdnJ3OHZqK1BaL3Z2cnh6Ly8vUGo2M3MvRzcvY1AybjAvWFo2T3A2WDhmSkhmYUcvM2o5cTVYL0xLdC90M3YvUWZ1ZlFrL1hvdWJvbHovRHE1TEg3eTFuTFZsOXhlSDRiMjhqaWRuY1p5L1pNMFArV2ZmLzd6bi8vOCsrOS8vc0c1VXp0YXYzSDFpbkpJWGtsZThRdm4zK09ST1Ayb2o1T1BtejdldittNVBEREZ5WGFuL1V3ZXdCZDgxMjRaRG4ybzNlVEJCbUNLQXpaUWZqWTc1V1gvL1krL0tqNkxuNzcvL3VGM3IyNHZIeWZQNWFlOWNSUnNhSDVJLzQ4dmVRcVA1S2g5WDl6ODZ3dm4rd2poWmZtWWpUem15QmZsU09CejVWMWxYTzhlSDU0bXc4bnpLOGRUSHNuUGVwYnVwd2Z0MVZ1K1BzbHZhWlB0czczRmFXeFhicC9pVWp4L0k5U1VjM0hMcVoyRGhudFZQMEVSZk43OXE5MTgrL1QydUZsTzhldzhCVytxdzRSejVSWmJPVHA1ZnNKaitkVHFGWi9sbFRBcXVMYytFbThqQS80ZEEvUzg5Yzk1a2hFaDhaVFltOGUzcCswUVY5eFA1ZjVmUWpVOFZMdWVKM2l0ZTlDVDlMZXpuNUlEK0twOHRCM0VtT2ZkZWZzbDU4MFBZMVdNRGthQk5GWHFINVZqZVNTRzVIalJkVHpxK2VBTWpQK0VMOHZIeUNTekZ6VzZMRTk2UHJqdjd1VnBNdXAwdWx1TXA3SXB1V1hiN1hRNnd5Y1p0dGtVYjkzdG9JMjY5ckhMS2E4Y2JwMFVuTTJ2VHhNOXQvdjg4SWh6ZU4zazZTVi80dGJ5WnNlOWZkNFFmZDJKdk83bThlRzVXNTd5RFJiQXJNSzV1RHZlR0NUOVFiN0lWK3phR003Mnh4UHVQY0xwU3M4ajU5bnpwQnVmTTN4MjRuSGF2dG9EaG5JUDZTWFY4TjY0YURRa1BUbFJ0bmIyczk5RTM5UmZkUmlmcnJ3a25idzdiby9KaFhsTHdlbFBtY2lUeDdQVC9sdjdUN1BaNWhIamxrUHl0WmZSajV1RFJyT1RuQTltdlg5NHhrQjBoM3l2eDgxSkJ3SXZxdjE0VXpuLytLMHZleWVqZmU0TlZ1Q0FEY1htT3o1cjE5dDE5Zkt4dnBuOEhQUzA3VllqKzlqSE43bFNmbmZpMGgrY3pjUE9lZEFiZElTYTcyOVBjZzdhdWZ2MGxqL3Qxc3Y5YWJaVTNwekl3NlN0OVB2R01rYWRRWndpQTNIa1BQbmU0OXlSbmp0WWthUkNOdkJRdnVKZ3h6RThZY0J4NzRFTkhjWVpwNjc0T1lOemh4d2Q0dUZwdU5Lbmo3WVBrQXpIazc0UkhyclM5OXAxSnZaZ09RRDZyN1FUQk1XOHhTSjZQUEZWNDlPWHhnQzh1MXlnaEpOUnMxVnd0akg2NzNENlJLZlVjcmJYL3ZGMEtoK3g3ZTZLVVpPNzZ5eXhtMk1jcGxPY2I4dzZ4RUNjT3p0N1dRNkVkT3NuRDhEWk9CL3k1MDVIdTVselBGMXN2c29jSE16N0lPSVlYSHNlekp2K1l0SHZONzBkYmlFVGRUdmFOZjI4VkhuSDJIN1hhL3FnNXJzd3lXNitrRGFYZDMvTG40MTl5bkk4ZlgvWHp6djMrb3VtWUFENWlWUHdwaWVUbERJWHgvaHVPZGh2UUZJYjFwTk5rWE52M3RkWGxLK1JNUVM5T2VEOXhaeERSL29MelpxK2ZjNTZjRmFPQnZIMkpoNkdxL1dpUHhodGpTOU9Td3dlYnJLVEo5aGJ6bkEySnNxZ1dmVFh1MUdzV0pqUUdFUjhWditTQWVRQ0VnN2ZCcjY3Ri9wekdEQWI3NFVGMEM5TlBucWxkMXJqSzlDUGdWajNGeGlIQnoxSit2ZkhtVEhyV2orczE1T1hCUVZQZXpKQW80UlFtZkh5OG1pYUd4aWcxeHprUHJqMzdPaEVITXpsTGVYbTkzaVd2dlNIak5maThJR1BsWGRYQnRBN05zSUJ5aENuYnhWQWVQNjhmK2l2a3dIa3NvK0NBVDRPL2I1UlYrZmIyeHVlMW56b21PaDl5UUFmT09WTlZVNTVVeFd0eWwrUURzS0U4eURwdDhwRDhKQy80b2VPSWI3bXRNU0FydzhmZk41c3pIbldnUGlOOHJSek5JYkpoSjFjSWN6Zm5VRFNnV2VFQVJhZi9ZRzg1Z0VmUnJINmdJbXlhR1NrTWE3djFBMHdvZjJ6ZHZVU0FESi9jTUNubTVuekhRNDBpL2xCQnhTYVZTak5JSWNNcWJ4bzlHdW5UcWE1eWhKcFVLQ1Y0OEdzQjNDM1BHVUVDZUN5cWlmdm8yT0Q4NDFkN3g0dy9RNXp6cWdUbHBlSjNydHYwczRHdlRrY2xLZGs1SEVMK1NMd3hXQzlPQWhQZ2MyTzhpVXE1RmY2ZlhxdE1NK0wvaFJXckJoZ0Fja2xuNjlEKy9UOGpLZlpRSWxPV3pLQU5LanB5NzFKU2g2Yjc0UUpuQUZNN09IakZvM2NlZDBzRGcxRlBzZWo2YS94UENvdU94MmdlVzhnVGM5MmpsN2lSaEFQd2dEeWlyWk9ZM2xSV3NwanordSt5aW5UckhCejBMK0gxNWNuWUJwQU54Qk5UR2RDeWdhc3JuZ0NYc0FJOTNDdmVnRDFhZjBFb1VNRERvQWFFNXFlVEhhUWVqaXMrbTNjenQxUW9JUGpHL2t3NWUyenZSUVZhMmM5UFo4cTFBOVZBbkg3TldUU2VBYStoaXhhNzZEdlFIamd3bFZIbHM2NVVwd0szclpyUEk3Um5tRUZlbEFTSDVSSFZLNVM1N2xnQUNwR0dHOXBjb0lPbFB5bHN5Z1pRSnJxOUZEb3ZyK1NBWVRPL1pBQUx2Ym1oOE1jcnlpdnRGQ0N2K21NaDJ3WURIYkdFUDV0TWtBNzFlbEduYk5LT2dvTW41K05TSkhEb2xsam5aNUNxSzFXSzJHWGppeXVnL09xZ3lmN1lEY3l6THQ1STVOdGEycWRiNkw0V1IwWmEyZ1R3cXBVVmpzcW85ZXJMamRmTXlySHUwYnVJbHpRekhkVWlGMzUwenRwWjZmVnIrdTBQRGo2Wi9aT3ZmWDZEQjNuUERKTkl4VHJYZHhJcUEydXZGTWlLQmtiSXlNbUNUcTR1a3lOQVNERWg1TXVTQU1GQ1YvWlBhOFBDd2hGYkRiR1dCZjZJaXpCM2xPVnVOdkpKUVBZb0lCdzU5MXVwK082VzhrZnE2N2NPQmdBUGE0VXE0NEpYVlpYbUw1T1JGdFp2NmtSVTZ4aUlpMzhGWFhwZzBacFFzdk81QndiZFlTcW5hN09JcmtRSXVDZGt1VFExNVdrVHpIRklSV2VHc3JGOGdkSXZlSFNzS1BtT2RBSkJMWHV0REVsK2t5dFdiOEFPZ1kxa0ZCV3p4MjdaQm5Lc1k3QWVSY0tjZlRyQUEwNnE4dCtaY3RkOUUrNXhLMTJ2ZlY4UG9jUWc3U2lZcjN1c2ExN1NtMm9zbmNRNWFrbmJjQXNaeE1KV0FPVEFXVEtUR1RaZDJZZm04SzhPRGdEeEF6bGtqdGRZbnQrbFFHRXFHUXRlZFBkU05wQS9vRE80dmNZNkNGUjk2blF3ZnhoT3E2UWd3b0RWbEM3N2VHZ1F1eEpDZDQvVUgrZFVYejE3ZkdtUTY0eDVYR1h0WkJIRDRNLzlQQVdONUtuNmxwbmZFRTk4cUMvWktBZ0FKVUJxRTY0NXJrZWRFeXRvMG9pckdKYTgxelhOdWdZcDF1WHVITGMweEh1ZGtVSHRVbFY5TXNBRFcvMGo5aFBEbGNaTmhmK3BSQlRRVHgyeFRwYk1vQytyczk0MThGRy9HbkxxRjM4MlY4UGREN3FqTFdWaGFPYkRMQnZNWUJxME95NVpBQmpMVDJHTlVUSlJKM0Y3OUgwRC9vUkxwK1B0c3VsQ0pCZURHcXNPNzRVNmQ1RUtGc3hnT3VnSmc4YVdkeTZLb1VYaDRWc1lrUUVjRkhEdTVyOEdoVnJtL2J5bDdMSFltMnlSL3VoVGh4TTg1eFRqdzdka0ZyendkWEE1YzFMaW5GNWZ0Sk55TUhHdEpTWTIrMnYrNmRjNGhwNWFOUGdDVHVvZG1PblliUmtnTk00MW0zY2cvTFV4K1Iwc25tQnp4R2hvanpRdFRsWk1RQ3NhWnRweFFDUUNiY1pZT1l6VG9VTnA3QmU1aSs3MEkvNENJVnUvNVhTL2hQVDhEVVlZS3NzYTNzZUZSRXJhWHFuTmdOQXhLc0E2SXgwQWpYelJ2K1crMUZienJlWGFSU2p5dkhSUnhvalFMMGRVM0xLSUVQejFPTTJaVEFJT21DaE5aT0hiMTVTanN2TDAxVkNQejM4dXAvRVV4MElLdTVhbnJTR3VJb3Y2M21UQ1VJRzJGTnZjTjFPQmdrclFJL1Rla2EyYlQ1VXFLanlmT2FXdDJDQUx0VDNwVnFCLzRBQnNQWnh4UjdsakNNRHlFZklXZ21GanZvMWFJMzE2ZU9UNTlhS2h5MGd6ME5xdWNtamZMeVJVbjlnelJ2c2VtUUE0NTFrZ0JFa1VwK2ptaXFHWE1ZVkFOWVJHMnVaRTUyemJyRDRvazVtVVE2aE5jZGFjdk9TV3d6d3AvMVREby91NlVZamxUVTVwdnl5RGh1bGxUREFjUlpIOFdVY0pKY1JNTDdoZS9xUXliclY0cTRwR0FEcW9jb0FIZnp1N3pQQXJKQ3VIUGlTRFBvUjUxNXVaby9IdUtCWkpGc2tBMEExVVNiVVJ2MjZaZ0NzYmlMRFJRQ29aSUhCcHlQWHVzV0RyNk9LbStsZGJwa2lmNnE0b3ZhSllVbk5NMTcwUGs4L1EydkduOUF4Ymw3eXR4Z2d4MU8wNlMxMlJyWWZlaTlrR3h0Y0FudlpCbklBNVRMTW9NZjhnVkczU1ljN3lYd1VtZm1CMjdzT1FGS2RZUTE4MTZteTJxMXA5L3NsQThUcUl5Unh0Yk95QTJ6NU9UUytnaG1IbUlVWU91dXRKY0FqbkVYNHdQc0xDVUJWQ095bVQ0UEJSMlpLd3pmQzY2ak1YZzhHSzUxRFhibkx1RkNMT1REMFdQRFY1U1NvRnB3MDFEdE5pWHA5bG9lNGNMMTF5ZDlqQVBuaDI3UlhYUnRpTHVhWUp2MGhBSVFCVW9taURpNmppZkhkNmdRcjJVTU42TEp5K1pRTTdVQk1SUGdPMDdHVk9KVFB2MkFBcmo0NEdrcGNaUW5NMDRQVXBxN28vL01aeVFCNGYyeVIzUXZTWWdEOUFYbHZpb0RlU3EwTnpnQmNRcW51RE1UcEFSOWlzYzFNM1FnUGRZM2doWlFOS2dUUk1VVjhORzllOHRjWWdJL0dUSEtORm8rdWxvQjBFcWtwV0RRcjQwd3lRSzNHVlF3Z0ZpbXNYRzVobGpVY0F5YTZSaktBTWtpUFJxWGp6eG5nV0t3QnpyZVA0NXNNUUJ0bGl4S24xaTRBYXJCN1FhNHh3TUpFZVgrZ0RLQlBHUTJDQWVnRVVVTlFPRDJXWm4zQUFLMFhsT2JMM0RIb1N6c1Z6T1AxbkJxa1hKbnF5YzFML2hJRHNKOWNWYW5HdFJLWVRpSmhnQy9zbzI4eHdCN0RpNmV0ZFFNd3pCUEhWTW5VcnRva0Eram1kMDRkODFjTWNFcnBHaXZBOGlZRHFCMDFaREczcmVDTFVyUStnS05jcTd2TkFCOG0rL1dBRUlXYXZXelRuK0VHbFMyOE9UM0F4MnA5c00xNVBuVmNLVTR2K1pTYW1oQlpUb1ZibC94bEJtQi9MZGZyYmFCVDhQaExDYkJQODc1S3hkMHFGK1V4QmdHLzFRTkxYVVpXQ1NNRlBDTy9ZSUEwNHMzbmxJelROZ09rUGtxVGI2Mk5tVW1XbTRtQlNMYXRXeFIrTGdIMERKa2dLa2ZrZkpBVjBRdXdySFRPTUFUNUtwUEtUc3FkMnVMQnAxeCtaRTJGK3BLL3p3Qy9ldlRuZ3EzTkFPMVRCMjd1M2NDUmlHMXRYNldpOE1DNkhsMGo3Z2hlQTFqQXV1ajVyVjJBcVBXaE11T01iV3RvSjhPUzM1YUZqb05iY29MR1FxS0dkN0h3Y3M5K1RRY0FIV01KT0dNaEdZVWhDQUpHYmF2aUpGZ05hSmNRaFQ5MWp3V05KY3VhQVc1UDU1c004SDh2QWVDdXY3VUVEQW9HT0czOFZQVEdrbzhGK1ZTNCtMRXl3bis2cWtZWDR3VExQM3dndjc4TlBPYkdYaG9OYkx5Q3pxZmRXaWMyWHFYY00zVElHQ1NHM2FRUDdWM21iajhPdFJrQXpDM1hxenlmaTVFQjZpZFlRb2Z2M1pZd0hZZEpOMTk2R1Z2aHoxZ0I4SmFwM2hWNjMxdDdJVTc5OU5vbGY1c0JicXNmVkFKWCtLL1REU1dRTkFyRnYrSlplSmdSc1FjSFE5T0hDV1lITS95bEpWQzlvSzkveEFCcDJqUC9VVEcwbitLeE0yTVdYYm1GeHFodG5hYUFjR0IvTE13Q3FxOUk0VkF4QUZmaytRN21HRmtLeFJ3OG4vZTUyRThMWlhJeUxCamdGT1p5MEl1Ym8zSjhPZkMzVlhIdzhNMUwvaFlEM042QUpGMkdhRzRHa0cwZzNkb2h0NTJCZlpkbC9oZTBzL0pBTEkyenRpOUFsb3R4VzRQNCtUWVFFVnF2VysxTHBUN3Mxb2MrRGVhbUcxQVpDVTNtRU5OeHBpSkFoSlJHQW54QWYyZDB4bWxUTXdCbUNIYUE2dlBWOCtCWVhGUGRUNXV2T2s3blBqMlhjaGZ1Mm5Mdm1Wc1ArZmlIVjVlMlA5Mk0zN2drQ2FvSFhwKzZKT2lmOTk4MlFSUjBlVUpqQUlrd3dNbDFYR3B1Ym12aDlPSUNnU0E1YzUvNzFtVzVzVSs5N1EwY3o0UUNOeG5nWFE5ckxMYzluZHVyd3FFMGQyOE43b1U1Qi9vczJEQ1N1Q1lpRWRleW5LL1hZYXlHYmJwZ2dQUnppQjhWL3RnZC9vY2huVTQ2OVhuSVFoTG1ac1RaaG9jTSsxdmJPcDBaRHZPOHhZckJvemZOY1Rjdk1mTTdOSmNKcnZpd0JlUlArNmVYUmtpT2F5RUIyTGFNNHJwRHpNUW9sZTEwRHByQmwyYVdoUXF1TFp6dEhFMGhIbWhYTWNCanJpWnFhc0xZWFdjQU9NTGxZVS9QcGw5eE5oZE1SSDh0WGFZa1R5b3k4bURYRzhVaVlWYm9IY0pnM0FIUDFTc1lnUDVlNWZWZEo2SjhPeVBHZnRIcklhdk9BUUttejFDbk1lSnNsVjZ4Nk1UYVJidXhPQTlUOHpSQjRnYjVjeHJrYjE2U24zYVc5NUlyUGttTVArMkhNcFJ1aUxXN0lhNzVBaGphZWpkK3RMdTVmODNmM3dRVmZtL0pWU1BSanMraHVHQjBzVm93R0tGMnpDSG15TWJ1Q2dOMGgwcFZJUWlITmxhQWtnSGcxUnRwMElSSklzNGZmZ1IxSzdBZTBRaGQ0Um5lU3AyVFhMM2MwYVVHZkpyNjFFbXZOOThOTks2QWNlRWVVYXVxenVjaVZnWVZkSWo3S0ZhQUwxb2w1WDFjODhSWTQyakxKYWZ1TEJ2YW01ZEVTSk13dDRSdDZLVXdpdjF4dnp5NmRFVDJQYWdsdllGci9nZWFnUUUwV3BBRWgyQmZwcHdjSVR5WkF5OFhEeVFVQU80NXhnU3ExQTB4QmdaWXVsSS90NG5Mc2J0Z0FBa0Mwb2Y1MEpMZGFEbW94ZFVrM0RycGx0ZldEZEVxM0NFY0FPNFhpalpPN0ZPc1htNlltQzdEVlM4c3NKWTJiL0R5aGd4aFREMk1BQi96WEJuc3JlY2lYSHpqcVpnQU1GTnFub2REMkQvSDk5ZWQ4c3VibDFoUTR3QkJyZFI3d0h0LzJyKzhGWXJnZXRVaW1rdnRyenVoUHdPQ1J0U283c2tSK25aUUNzRFFJaEtiK1p3TytnbGRaN3QwYVk1UGlNL2x5WDBMTXVYWXpWc01JRDBoK2xZNjRZUm9aS0tLQVJDOUN1aFpGZmVGS0ZncVY0eEgzVlA0ekJ0d2N1VWtXQnpvbkVESUhJTjFGdEFsWU1QVU93ajlpYW9ScVNZMFF2eVRPWlRJQU9vSDVUQ2ZORDZ4clhuT1piaE04MnlGNWZROUxHZDI4eEtMSVJMVGd4THRZS0ZDZVBZZjlzK3VCaU5sUkZEUmtnR01aUTROZVV2WDB3eWNnK1N5OE4rNStvTHgydEpOcWNLUWVNcmhiNDRLZUxQeWNrZ3JHVUJhVXpEQUFVUEx4YldsU0w2ODNDTjAyczJWSHFubUQyOVpGSFlOSkhmdEp1ejNiYVpsZURRbXVjeCtqVGlUSTR6WkpaenZTWi9UekpYOUFLd2pBelROMmhBUTBKMHJESXp3ODFvUE1uaHhaa2dhQnVaSkhCVUQ4MDQzTHdHd0FUYm8zbHFhQndzdS83aS9IWTY0QXYxVjhtRzJscTNqUzRDTzVEeUJDc0FXS0JFQkZqQzFrQTlUZ2RuTWlTS2EwaXd6NzVHL2lmUER5U3RSeDR2OVRTTU5ESkEvQ3dhUXdWZ251TVFaSUlURWVLUGdDVEtBdnptMUhXbHBVV0NYakFheFcrUUo2UG5jRmpKZ2Q2aklJRFJ4YjNnNHZ3TTBiVm1DMUg0MHFySG5EQXlVUVRxSmdveGJpVElHWWdhOFJFWmgxR0ZVcTlBZkVNMmJseEJqS0FkVTdjRVZXUGYrdFA4WUFja2pVL1M2REVqZVFQUlVEV3VQTTBEaUdpVEVLa1JZdy9tRmgra1cwSWFNT0VJZmwwNFhLeVVqOSszTjlBdlBxcFg0MkhGQWk1OHI1UWVMdVBaN0FzWnE0UWt5ZmFnbUNGY0xLb1NMUzc0NUE2TWp1aGtub010MStqMkJaRjNpR2NHakhyS3ZNZkxkaURvSDkwcVROZXhrUWxRYWdUdEhteEI2dXFJSURVMkJ0ZzhjTEc4RW5LNE1vRU5WL1FBbGlTQVlibDVpaEhzeXdDcXVBSjMvdUQrL1Q0NEF1SXNIRUg5YnRXZENLKzh3ajN1SmJJS0NhekFscXBiMnNHTElRaXZiNm04aXFJNFZzTGpiQlhmam5CSCt3NEMyZmhxa1QxcGdmYWxkb1JNYkJRQUNBaFlhaUliNjE0bXJqNHdJNEw1R09ldkNkejliWExiMENXZ0g2T0NuWjdRbjRrNzJjbXl2RGNCSUhJUk1SUS9XQldtQmcvN211YndWYndUWVBHOGlaQkRzamgzUkp3ajlyMThDK2hPUXJ3ZTA0WjBVTUNMdFd2L1B6dmZ2UTNzQWxKK2lCMzNaSG9qb3ZjT2tYSEhucktQOUhRZ3B6TUhISlY3aUxZY01jQmFPbFA0MlNVbDRNamdBZUIvY2tLUEpBYTEvSW4wQUJvTWNyR1Q0eGhJYUpNREFIYjlLUUR5b29GSTJmK25UOSt3eWlzNEFseVZVbm4wbmE3T2w1Z2Q0ZVh1UVpzaXpwZlF0Wi9LUHRCaytWZzVCOTBRSExJSGE4MktaRUw2UGZ1cVN0NUptdWdyNmwvcnZSZy9neUwxY2hlNk5QdVRVdW1RRDlLdE8zZVgwWFE1b3d6dkptWnZOV0k3WC9XTzk0TXI1ZUU4NXVwbmhDWExrWHRyN1ZIN0xVQWpqYVYvWnlFby83ckFva2Y2bkk0aklSV3pvY3hCY2xVTm1nTFlqUndvb1JtbjZXcmlZK1JjdzVrdU9wZzlvK1ZNSnQrUmczSXMwc0xFVHdMaDM2aFhvU3dEbGkvd0hLaEEyaVYveTJlRHlwWDJqcWcxamc4dHEyZ2p0c2hGYXlwazhKUCs4VzV0dTlNQlVPOUVsNTIybVBJSWU5TE1CVVl1eHh4SDlkOHBiUVZmQjBEL3kzdjRRL2ZmUm43YWN5ZFYrd1BxSTZ6MGFaMnJEQU0vNFl6cldmbXZ2NkFCYWx1ZjdBWDEvSEFXakN5dE1kWHdlMzIwc3h0Ykh3WkNSbHhib1lDeEtYSXd3QmI4aTMwTE9RZHd5aDh5ZzZ4d3BQY0J2TXc3UWNTaEhJSzZiK1NYeDVTY09ocExFUDA2ZUhrUEhDM1hZZzVpUWFnNmNMbm80Z3ZqOTZMMmdPcVlOMkNNUFlVWnVsbVFTblVka09wSFdNOHhXdVVCN3JOKzRYREgxa0w3V3AvK3FlRGR4Y0RwUlVyem9WTkVEMm8vRlFINmkwMFFJTVBIeVVPM0JpZThnNlJITE45cTlyYnY0R3hKdU5yTWJvVU5mMGRZaDdSK0hISGpoUEpPanVCcExBT2NFK3lnMHdTVjc1Z2ZZVFBVN01DUXhrWmx4NVkxaWNFTzVoZ2FSUlVwTEh5N25kTVgrQ0MrR2swUFVQVTU1SFM3aHdOb3plU3I2OU9OQVNuYkNVVURSc1U5eGJyeXF0eHBIRCtEOXVkSTlJSW1NS2RnaTg3bVVZb0hJVyt5dGdkZGY5WHdzYUEvMzVjcXZQVmlPNERxeDJZR0JSQjh2NERwMVdtSXU4UXBxSFhFeTlBRkdZcG9tZ010VFI3QTE5WGtyRGZOT2xHbjhNQ1F5YjRRT1puMzVhbXNDT1A4SnFxdmNTcFVmaGRhK01VOU01Z2paRWxIRERDRTJYNmNiemswaTFpbm0xTVU3elFtOE54bkJkRFJ5VmlwSWVHblRCRTFINGxMT29kRDFIVnR0NE9NNEdsQy8vVngwY1NIU1RteVpjdFJPQmpPVXRyWDdBWUpuS3A3Q0VLV0h1cTZuY3RsUzhUOUt3LzRmbHo4am9Rc1BmWnUrdzNHWlFORTNteWFzZ3FiTDZncUpRY09vTTlrSyt2d0M2RTdtTng5cUYzWVJlQVpPdHA4VFUydlRjTDExcmRwSUNqZm9jM2VFV0dUcXkvcjMxbTBhdUpIMHhCTy9uYjI0RjVqWVVYbXNHZk4wRzRpaE1JTlc1QWdocHU2TE9ZSk1vNWx4dXIzb3ErRG0xajF6d2ZOR0JVaW96NHd0cGl6RUZva21FdWtGVFMxcEE3NXdRcjhUR0dNV21yOXZ3TzA3MEplcWlNNG5qcWNCS0RPNUNvRjJEc0d6cEMxdjhDUDZibmZZamR3cCtseW1jckJVTVR4RXFCRVI0YnFkSGlsT3RVT0ROUDBJWjkzOFk2OUxJS0xaS2JiV0p6dllzNGZYQm01UkR1Z205bXpQd01uNGlidkRndWFmWnZ2cWM0ZE1STFE1MFFnSWM1Ty9hZFdrZlVXd0NtRjI0Ymc5aHpWZ0pFZUpjdlZicVlsZzFMRXJJa2ZJcWt0enB0TC8zenVRcFpodTVBQ2J4cGc1ejYwWi9vOXlEbFAyOEtOOTA1NnNZK1NCd2NPc3RYc3VEY2ljY2lZU0dBS1J0b016VGlVSFdJWU5qaWRleWxNTkFKYWl3VDYwZTJ1UDNvblllTXVMc2hxZzk5VmgrWGJ1RG1ZaU9XUVJKdGhPRXhHdWJrYzFTVEdTREhFS0NqS2NpMTFSVUtzWU5Nd0FHaVNrYjdBNjkrUXcvY05IangxdTVucEYwNE9YQWlmYnovTzZZYXlzZlJvdGEzTjVjT0dOWHEzN1ZXb045MnRzM0J5cnR3L2ZLKzJCQTdoTkJ5dUdOZ1ZvQWJIdDhoeTdnc0VDN3RDd2RFYi8vdmRPUlRrdFZKUm9SbWpZT3RJczRobGtzRzZRL3A0SFp5N04wZnFod2hsQVNvN3duV1pVRHBFNXhmckJHTHBuTnV0aFk0RWNXT0pOdEhSMFBBZG1TVFZuZXI5UFdNcFVGd0RFS3ZibmhEQXMvWlQxdWJRUzYyZVFEbW9VSHF3WEhxN0NMU3ZTbjZpRHNHRW9qYm14WHdsY1pWUUZWcUk2RUNDeElET1RXSGtGRE5sQzFjeFFBdCs4SXpqaGRCUlhnVFRZMG1HN25GNEorbkVHb09HOVAyODhRR3F2WDVVZUFYRXZ5VmZRZ2MyekVSc2poKzBLRDI1UGwrWVBMQUZHU0o5dUdPd3c2K0JyTVkwcHZXUUs0Q29rN1FON0JBek9vRURmdVltenZDWUx1SGxlZFBES2hEQk1OT01JY3REL3NFQzAyWk11UTVEbVNJQUJYeHJNeGpacTdyV3d0REQ0ellRTjRiWFJCQ0tmQ1lDV2QvSjQ4ajY4WitSV0xGTWVqaURPdVFYeVdrQUZNenRUeFFBME9Ya1FmWnNCb0FIQWhZSXI5QmtUdnJYOXhCRU1mZmhzNlYzcjB4TjJtd0VZZlZlblJqbUYzK1dqYi9rTTNGdTFNUVpZeTczbEdRdlBwV0Y1VkFwUUhVVEFIUlAxY2JwUkhDSGIxWThJR0c3MHdNUnpnVEVWSWpOU1JYb2ZrMHVwKzAwaXJ3a1ZPV3AvS2pLc0g0aFM2SDlkT0ovY0EybUR3VHdheGdIdWZ0Wkx3VHFJb2tGMm8vQWpNRHhjQk1sS0JFTTRxYi9pTXhaejlkRHBFZUplcVduQkZONHpQNUtwWUxRN0YwdkFpa2JuRzBzQXZjUFN0UmI4eEU0ZFBhczBmdU9uSHNISkhyV2hlUHVkUmoxU3FQME9Bd3g2d1FDZXlZTlJBWE5FVDlwUTZDUGdFV29XbnpJNXFkbTRRejFHaGd4d1BMV21HMkdqS1FHVWVmM2VleklBTXZZbzJETFMrMkJ2a1liY0xoRzRIVnRBaW9Rd1o4dVFRelVRNTQrUWFRZi93TGZ3R05KY0phVWx4L0pGZ1FzZGw3bW01eG51VEpVY25RZHNPcWpZSGpvRGFGYUp5REFIb3JtbUJiVkJWQ2hjNjlIY09KVktZT0YyZ29iTnZrRW9nZjZJc3AwSlNGYStrSi9DUkJEMVZSQTc4aFNRSkQ5akFManpkSHlhUHZFemlaUkcrTFJHdXB1cm5JbGl0b2prbHNDNUJVTmVaMVVlQU9qZjJBYjZDZ2xDNm1ESENtRkNuc21sbERJVUhFemJtWDQ3NWtGeXJEWjFQK2dHZ3c1MFhYQzRKNFJCLzg3VlFId0dodE9TclZBVFp4S1VIWTZBQVpoNHpiSHRqNGtCZ3grQk82NlZ6QVdOOTZTWEVvR1BQajBsR2x3bmM2ZGJTM05relJucUhvb3FHQmtBZWdTMmdTcDNuQUc0RFJ5Wnk5dTNnUzVrRHRrWWg1cHhVeDNMSjBvOEpLZ2w4akFEM0c4ekFOUWtLSUZOcy9ZUExtTVBrWG1zYjZFNnhpK21VQjRhQ0JnTFkxaTJVajlBbW9NQnl1bldKeGlDaVQ4eHE1aEd6T0Zrc1Fjd1hoWnllcGF0WXpBRkJocXF3MWtHM2RRMEpvVEoxa3NjUXRIdy9YVHQ2WUdCSjhqa0dCUFhWUDFRRDJrRVNlam9VN2V5M1RzWDZLR0c0U0x5emZVNWp2SW5aSENrMnFqeEhFK3ZiVENMQjlGOUFwcGlTck16Z0R6WFcwWk81ZzJZWURPaW1SNHdpUjJCY3BNQnFPNmZCNUE2Wk9DTWtCa0JRTE1RclNMd01GaWNlem9Ob0szQXFaY29ITVpaNzVNQmNycGxYc3NmcWdSRVlyMzFPc0VrLzBBRkNMQjI2cFhmc1N6SUJFRFdMd3VPVzVkZ3FHajlaSUIrOWpMRUZGcVlIRkNFQ2cwM05ZSXBmM0F6UVlYa2NOQm9yNllQTlpPN2R4anBpRC9JbDAwR3NOaThZdmpMbTdmUlRBRlFPZVNIbC9DcUFSdTM4SnRXWGh5ZXlHdEJSQ2ZjVFFZZ2I4dFhxV3pqRWxhQUFMQVFOd0VDR0h0dTE1NjJpRzZlVmVtZnpEWURCcGlWMHkwejIxb09XNC9GYXlyVlFRNGxXUHR6RVRMRkZjTmUzMmFWTDFLUTZtU0FKbG95Z0p3KzkyWU1vSzY5U1B0ZzZhbC95Z0FlM0x6UURIQ3JNM1VyR2ljc05nU1NQSlhnZ2dFK3NYLzZQUWJZWjVhS2pCSStsdmk2RVpvYjhaWXRNTVNtaG13UnZmRnpCZ2gxZjZGck9wWFlBb0hVaFFrZ01DZHUzSmdqRlZWR1JKYllPajBOdEtRUytJUUVXR0JMVERmTGU4MjhYSEdJcWdNWUlNSGEvUVRxYWk4SmdUVURBb0REbEJnTk5vc1ppZXdPMFV0clNSeGcwdDc5VHhrZ1AwN0lEdDBxbzhZcm9qSGV2VndDRm1UWDMySUFINUVLSzF3eHdHVExCdDIwelFEanEyaXhaSURGNHBJQk1sWG4ya0tBNjd3eXVpbVJ6aHdONW5ZOUlEUzA3d0ltTVk0cHVZUUJWSmJEN0tWem1mcUJIZUkwcnc4bGF5UllPeUtLVDk5dVEyVk9VZ29BTERuSkFCWVRRaU54MHJuTE5pUU9KQTZRaWo5bEFCeU1YSEdpZVhPTVFiU0FPQi9teGRjbkF6QkErL2NZZ0NQQ0xCV0VzNVF2bDhnTE5aejhJUVAwcEYweUFIaGJkN3lyY3dqNnZLK09zb2pUQlBRRnd5QVhsVWRnd2gvRVlVaGEzbUV1T3lURzlBTjNGZHc4QkJVd3dkcjl6Tm5GVEc1T2VHcXBlRnFKMG1JVFdWTk9kTytGd0c4endQZlBHU0FrSzhoTHZRdERXYWNXS2I2K29BMzBsTkh2TU1DK2tLT1pNYW9TVDJ4MEgxeGRBZ1kzQU1NMHExOWxBTjFZZG14RVd3elE2Y0UrbUF3QVRpSzhOamxHMXNuYUZHRFFzSzhDb3F2L2w2NkNIN2NQUVd6RXBxSkpiWWplc2lFcGI0S1lEb3BrZ0NFYWRsRGpTZ0trNytoUEdZQ1lKSzZDTHdUTXVTc2xOV1orZllzMlBkTVlmb01CVG5YR29JQ201TXZWeUl0TEJ2QVQ4ZHZmSzVlQXBybGNBcUFEcmxhbTFOVU1vQys4bTZ1OUpjVktzYytZRE1zeGpKZFBrZjBsT2tCaUxoSjBqN1RuTnc5UkJTU0s5SnhBWFFibmhZV0NBL3RVcCt4YldUUHJjcVVEaE8vb2p4bmdFcTZkZUtDU2FHVm1pYVFObE1kQjU5Y01VQUZVeWcvM2x6dTBrUmR0QnVCYXhUMDdZSmw4MGR2YndQYzNBdlNSNjVORGtyc0FTM1dhWDE5dVlxc3hMR2R0NUFyMjdSeDZ3MVdBT09uYmh5RHBYWnJ3eVc1NHhWTTRScllKbmRRSnU5WnM5bGJ0WFFESDZZOFo0SGI2amFXdFZwR096dmZGQlFOd3Mvb2JERkNNQ0liY1Zjb0xPOEJOQm9ENWtSRFJKL2pTZkswaUExeVZBSVpaeE4wNUpDblY0QVFLMUdiRkFJUnF1aDVWQVVFSkREbVdxVUtUcGVGR3ZYVUlndjR0OUlueWhoUUI5QkdwVUtJNXhobmc4OERXcnhqZ2cyM3hmOEFBbVlpbVNraTVMR2hqRU03ZllJQVVmQ3FUODE3NWN0NDYxNWNBNUp2eGZmSVFPemlxVjdjWklGREw1UklRbHNBNU5vYWR6R0w3bm9zTUxnd2wwRGQxcGNpKzIrdmlURDdodjV6TFh6Y1BjWGZnaWVGZDJub3BIVStXYWdaUm9tbENBdlM5MVJLZ1lmdGZNVUNkZmlNTXFabnFVRnArZlVFYnl5c3orQ1VEK0loOE1rdEZmSGkrWElXOHVHUUFLcVEwV01pNjN1aDcvZHdaWkRMREVvenV5QUFKMnV3cmJsY1R3YnN2SUhRQTBiYm91YWF2RmxTb1BVTElEeENwQkVoUmh1cmNQbFNxVlRLbVpBNW95UlFjbVZKbGFJQ1RYQUlHYkx0YUIyQ2plKzF2S29IVG1DdG93Y2tGYmJyWXVLNS96UUFjRVlkWmZzUzk4cElDZWJFNXRSbUFma1BicGNtTW5zdi9jcEJ1NmdDWnM2UGJ6VjNBMkhHWUFnV0dOekJRbXRPdzBPNlkxaTlCelJjZUljOFBnTk9VYUdrK09kNCtWSUMxclgza0hvRWlBSXNiNWhvbVFqQUE1REFhWXJZS09zTTZZT21tTnFlL3VBMTB5MDBzTTUvOCtwSTJ5REhVWERMQXNQWUZjRVJ5cWY5d2xiTFV2TmdRWU5wbUFJZmVLWVQzc0ZDVTZCd1l3WjlMQUU3RGxTS3BDM3ZmRmpRZ1JqaFFtaHg5N2FIaEtFSE5GeDZodTJJdWF5djRaWC96VUtxQTJlSXBySXlTWDQzSXZKSUJ1bHRyK3RFbG5iVTlJMFR5SnhMZ3p3MUJFUXJUc0lYY0xtaGpTOWJjR1NBMWRRRlpGV2xnMjFrcVVxVXNlTWFiQVhiYkRLQkdTNXIyeVVKelloZC9wUU1zMU1teFdIQ3o1dzZmaFVjRUJVclR6UEhrTUxtcUFqVkhGaEdLN0x1WXl4eWR6TTU5dW4wb1djTmJ2VWU0K0dvOCtSZUdJS1crUlRZTHk5eGtnRDgzQlNjYnMvVTlJMVh4bHFhMUh1aUxncVpPVjdzdnIzaE83aWM3YURrck1nR1FOK1A5aTZHSVdENnI2cUpwc0JwemVQOXFGM0Q0QUJpY2tnMGpoM0luamhGVytyY3FWdlNKSFkrSVhTZHFLRnQzRjNNNWRqYXoyNGRLdFFxdE1nWDhrZ0hZV3FaZ2ExMDZVZjZRQWJEVnUrb01DamJtZ3lPcDZGdVZwaDI1WXo0L3lRQlVsUllJdHNsVVpXV1dpb20wOE92bTNtc2REVVM5WklERVQ0NUdxT0tqZFFQd2tiK3lBOHdialhOWXU3OE1BNlNCSm80Ujl2S2xwMlVCRWsvcytEZERQTUxnQ0ZMZWVRN3pPVnV4czdsOWlBTUU1WUJWbjFLdi9DVURvTG5OcDFBQ2QvS2ZOSHZFSHpMQWFYUExIWnhFUTNBYU42aFlzTXEzdEJCR1o0Q3N2R0hMSzhQU01DSjBwNkdjR3o4ODMrZmo0SzI1d1FCZkFlRlZuTUp3Skk5aHlvV2JVY0VJaHBJZ2RPaklaL3JMOEk1SyttNWdoSW5TUFFhSHNUU3FsNGlqZDRlUi9LWnMzWG5Wamw3TTVVaUlmZnNRZDVNSHJ1ZlFpekxTNkJjTUVBMEhxMjFnWmhMNFV3YllMMjhGaEtSbGZEVFJpc3BGREU2WkVzOU1GNTV2alFoNUxxOWVlNGVDajFFenpGSlJocWcxL1d3MUF4UkZXbGhYOEFYMXExR21ib0FZajl1NEFNdTFCVmpJeUdnSFpaKzFNYWgwRWdGcmNKZmtNRUNKdkM2MDJmQ0pBTEFheUhlTWJ1a1BMdWJ5OVBZaHFsWFFnQjhlVXNSaURmZ0ZBM2pqUVFhRVpLc1o0T09DQVJZbEEyVFcyK3NoWWJIWGF4cVgxUHlWbVRYWFNIWnY2NncwTUVDRVZPVHl5cjBlZzlJb0pqSkV6ZlBNWnJQWXZRZzhEQUZKL0tSaEZSODA5WUlsd3ZvSk1nZzEwQWtWQzlwdEZCWUVERnlCS2RhMmR4QThrZEhBTFNQTkFxSzhpQUVpdjl3VjFKTkd1dEtnZFBNUXJDNGVKR0lSVWxGTXJHQ0FwcmxnZ0NyNEt4aGdYalptWitRQmovb3Zrb1NreUMyeTNtWnVDcXdqa2JnaTF6d1FyZjcxNGdXR3RsbHNDT3RHSnZuZzhncThCSk5RZU1FVmlBbitpa3pUMlZoWmlhUWthb3RlTmtYVkxjY0tpUVVlRUVMNko5aEFCYW9RVngxd3k1bmlOMGw1YlVEQWJnd0p1MDhPVTc3QTRTWHdQc1EybzBrWE1vU01CcFRmYittYlFMam16dzV0UjFFK0RFc0ZmNEZVbDVyR2tlNWpkR1Z6UXE3cVh1Z0FHeit3cWxQejVZRHpCdytuYm9YUmpzUVZSb0NRbTVudWd5S2ROZGhmSHZOdkt6cGJwdUFnQnBSSktMemdpb2lKL0tVL1FMRnNWaXN1U2ZsNnowQUw0aWRQUU1YY094NzROam9ZVU5rcDRkOEVvMCt6YllEaTA1dlpLYUFzT095ZGdHaEhDSDk5RWR0TUlMUXlBR000TFdNbGRMc0k0cng5eUNPOHdlUVpDWjdKb25MVW4wQWUyMzg4U2V4dC9tY0hBWHFMUnRLb2R5VU9iTzJ1bVNTRUF4NC9jTmgxSzBwS0Z0K2xTa3o4S2dUQ2ZmN0MyaW9OQUlYNEd3RXhUUEpScE9EWUtMMlloRUk2eUNRUC9ncy82dllTK1g4OFF3SnhGV0FCVEVhZG5KNFJBSEliVGVkcjVnY0FrYVhIRWtBczBhYkVoQ01YQnJLUEhJRnp6dWNlNC9XNEVrU2FJZzRIUzZaTDdlQ2NaK05xMWozZVBqUjlKQ1lZVVM5Zy92amxFTnBTMDlEbVFPSnNXMDh4WG5jemJhTWZnSGdNeEhZTWYvVkR4NVc2bGExdlRGd2gvVXhrNGNCWHJvRDhwUU5KS1ZvT3Fnenp5Y2lSS1RnNC9DbFhnWFY3ajErUXVYV2JjaWJ5QU9MYUNLMnplRXU5SEUydVJ3b2haQmJ4SHNzUWttL0ZCZDZSMThHc0t0bVp0dzdNYjdCb0FyZFZQaGxpR3ZMSGRPVmh6ck1qYWdmN1BLdG4zZnZ0UTg1c1dJekFlbS84WlN0TmpycXRWbWlYYzRRcHhpbVMyQ2liOW5GQUtPbEpDcVl4WUxLQWVvNlFxU0hXTWpjRlp4SEdIMnlSdVRpVWF2NExkUzN0aDBNWHBUbnRwQU1UbE11cno4ZWxaNXc0RmN1c1pRZkNDdnp1OUhySFdxeFRUajQ3U0FnQllCTEFscXlTaDVuaHdIdVExOEJKalZrQmREWUNOWVUwdVZ5cGR1ZTVsZHpFdmlSd1c5ZklZUllKSXFRMlY5cjlYU2Jrc1lVbmY0MXZIeUpYazhuamw2ZnpLRWRkcG80blVibVlJOUJNWmpqT2x0ckpOdzZRT3Bta2dBcU5qL3c3dFJ0RXNERTNSVGxwd0FGQkEwRGNBVjdtb3BtNUtwQzVJMW4weFRwT015eXZQRUFwam93VEptSTliUkdUdlNGRkNQMEFMMkJNUnFRSENVLzJwa1RrSW1ORHJtS0dpZVo4eFJzVXBIWmY2NWNqMUVOaFJlSUtUNVRvVHJZTjg5NE9rQkk3aWdRUlVwdTY5djZPV0U0bVFhbG1YWEZvVmszSUltR0k3aTZnY1BCa2JqbS9jNXpIZGFLUUhQUXA4aDNsbVhXZUVCNjRURklnTFpaaUxuZUdXYVp1ZFRGcGtnWVlWYVF2NEtLWjJTM2c0a3BGN2drZDMwYzdlZVlIbmd3OWZ6eCtNeW5WTTlPeFBiZ1NwM29qdTBCQ1lsSklRazk2SmpkMmcyM3FzYUEvTXh5d0VIV1MydjB6OG16ZlVQbVcxVkxYMEhZZWJuWm12b1l0T0NwajRwbm05L0xNQTNlUmtJZFplbnpXYmV4M0pPa3BaNm9tSDRwOElaRld5bk9walBHVkhPYVVIRWFQbVNjSThRa2haL3FwMHpwUGlCK1lWVWtLNUVBcTQ4eDJZZ3VyYWRjWGsrYVlOTmg2RldwdGU4dmNXdWlaeTlqSzZmano3VXk1NUlGQXozL2hhdTRDbVhCQzFTdTVYK1J1QkFtSlNnTUpMYkhGa2RPRCtRMXlKN3QzVEx6MmRBRTVJcWtkYU1oTU82MUtIVnphU3N0WitvUVhpZzJBRmN3emdjUHpEVWlseFFOa2xwNndEa1NDSDgrTlJrazZZOW9lNXZpeUZVa0huUUFpRGlVNVFJZVo1cG5jaFRFalIrb2dPaCswOFI1MW5oQnQ1UzBZVzVMYmNUa1ZoS0pxcldrdExpWk5RUU5HQTMvVElBSUR4amwzbW9ZaU4xQVBwNnV2MVU5YkhBajBQUGxzcEprb21IQ0NNM3JYcTdMY0oyaVVpUzJFVnN5aFFKVDRZazRHaUZUQ2hxbkZrNXpVRU5pdXlGUU00Q1JxTXdETHg0anZvSWtxUDB3Wk96OFF6cTFpNTA2a0VWWDBUT2h6NG9SbWRrUlN3NlJXeXN5WjVRdkpLYklDM3BNeTRJZTBiemZRQnQ3RGZEYm4wRUdZY2VpSDM2UE1Fd0pDRWJ5T1cvZzFZWkREWnhXYmE2Z0FyVW1qMzBJYVlLQ1pBSVd2SnYxcGExcTZwWmM0ZTZZWDJkREUyUFFUUGMvb2QxUlNZc0lKem1oWWo3UE94VEpLNnhrTm9QZlk5R0orQTU0cGlnNVlBbEk3VU5wVnhaTklyVlV3UUpMb2dnR2VrUGxFSEdOZ1VaaTNITG1KUEF5QUxYeHBocERTUXpBeEhHa21NUnB1U1kzeUxPSnI2Vi93S2RLYkcyNk5lUVRzQ0JKQ0JPS0w3KzQ2eU1hU0FEb01GVUJrNUFuaDJ4VzNTQy9CL2hxaHNQNmZWT0Y4ckNiTkVrbXBBTnhGZUFCRk9CZUFMZ05uS0FGMDBKRFZndFBWa3o4eGdVV0Juajl0M01sOGNLdC81bjJBazUvUjhOQzZScEhZd2tRczFXdm1OK2gwc1IvR0N0SUZISDdkWjE2Tjk1SUJNclZXTW9DVFNEcmJTd0FFMUdwWGVRUU51VWt6dFZIMVRtYU93N3djclRWR01vWlJ4NEJha01obXpBdjducEk1MGtqSXdKRjJ3SVB4RUtpNkxPVWNnaVFybGxhVlEwVWk1bVBrQ2FGOGl1Z2lqR0RlWXVsQlZkckZ5dnpJUUFZdFhwZW9LaUowaXFXYXNCbGJ4SmNucFQ5dmN1aXZtU2M1U2MzcGFtbDV5UlpDS3FEblRaQTU2UGR3MEVCTnlCb1AwWU1IbVFXakFROS9nbHhIWWd2YnBNY0dHM2tzVmx3ZXNVRlhvTFFXTW9NUlhRYXlISzVNclpVTWNBYUowTm1XQUpDbmcza1ZFMkFTd0ZrV2ErZmRmd3FZVjlNUVcwYi9zOXJyZXo3R1NndENGNHlaSHhNaXdIRnJHcVZTSUFST1NKS2xBdEM2MjZVOFlZNnhQUit6SUZtZUVLK2p3Q3pLbEtIa0xVL0hBcG80b2FBeXlxeGtSdHVDQVF6ZExQRUI2cXJ2TVFXT3Bkdkd3Z0N2SVZrY1ZqTGpaTmFSUUlMQ1NFV3hjMSt0NVhseVF6bVZ3UEE2bndISFlZZzJaV2JISENNVXNaRkRRZWVpdTNmQloyWUw1LzhvQStWd0ZhbTFnZ0Y2U2d6eFZXRmdhZ2F3WkFvQWxCNGlLcWlPblRac1lBbnpZa25JYVVTZ2ZIeGdQb1k2elV3U0VGQmNCR0QzOVFJRElEWHpDSmd0MG85UUJwVU1VQmxzR2VUTVBDSHVRNkpta05VTDlKa3FjamhWKzZyZDRoWk0xTWljMXNrQXRodnFlWWtHMWdmRGJaV0N1aFoxcU51ZjZIVWQwZDhuaWs3RVJXbVg3cWNaN1czcDF4bUUybUhWekVUZVRqcDh0WVI3UWJ5NmlPVktqT2hJL1NQRDBNeEpQc1NMdFFMY1I3dElyUlVNMEtoekZjTWx2Rkl4UU5TdFVVQXBWaVRZREs0eUFLZDJGa1hpTDdsNDNoRGJXU0RqSVRZeFJ6bnpZcS9TVzVWNUJDempzRUp1b1JwZ25hc1lBQjZ5cldYTUp3TmdtQWVSajRVN1FOeGNJeWROZnJ0YVBsb2hRVWpYVVpqWTdZMmdMV1pwS3k3MFZxUWw0aU16S0V2YWlybzlkMkdtMkljYW4wVWVzSmhhcjJuVHdONTdtcnBwZ1VZQ3c2QTc0VjZRK0UzVExpSU1Rcllqa1lXUWx3aUhjOCtEWEVJQzlCZU5Cam5UUTFjeFFGYXVFajBnY2poY1k0QUM1clhnV1I3dk5SK2dFTENqM0VLbkg3Q1dSSlRhUWU5cUJ6UFVpbHNvYnVzNHlqdGRmaDhxaEtCMW16WjZJbTkxTEV1TVpXUlNJRjRWMjBSQ1piMk05UnFNQVdHRXRZSUwxN3hYRlF0RkFTZDVXbzZEbDdVb2s4bU1hVHVEWXQ4UE5kNzNadWhGWkVpS1VoU1hndVdsanVtVlJjZnpWMmJ2OWZyTXY4MEFaMFd3OHZHT3NVR2FxWjdId3RjTTRBc1NDbjVIdE1ZMUJraVlGem1wS0kzZlhWVmxBWkZPY2lLZGlLSGc5dURFWmRZRE1jNU1HTFdrR3BLai9GVHVhM3B6ZERPOW1GY2EwWHRrNGZaV2RDTnZVVmJNRVpwNHJSTnE0WDJUOWM0QW1aQUhnYUxNbFJBWkZ5UjJLTkswUmRXNEJRc3hvVGVVZS9SU2hKQUJGc0FIWERLQTJaM0FybitOQVpUK3ZnMU42MENueTFqNE5nUGtnclFOZE5EMktnTVVNQzhDUDhBQWhpaXJHTURUeVdGck1SajQ5bURKWmRhR2M0RmRYQlEyT3JOYmRlMDZTMEFmM1EyMXVIR1JCQ01LdDA5OXlXRXZDUlg2SXNyN0hiZ0NNbURYRmk3TndkZ3E1QXRwMnpTdGpBdno5VHlpUnlQanpScXh1aXcrcFdNRDVSNjluNFVvSGNRU0VBeGdoWlExdnREQnIzK0xBUXI2bDNhQUx1NTZnd0VvQmw4bjdMN0JBQW56WXJ4WE1JQXMwNWxPWW1hWVA2SlVyU0lWakVtYldHYWJOU3JMc3JiMGU2Z2hIT1V5VDhnbjZyWTFoOGdlNFdnWjZjM2l6NFNZTFpBYVEzc1J5NHRlVkYxVVFJekhxSVFXRHJIWWtBRXdxb1F1YnNNQUZldjFZS2NJOXFwb0xxcEtpckFJNjV1dmptZkRqMlhRYUNpQktaYUpvWmJSSlBqMXJ6R0FEZzBOa1pVbDhEY1lnTjAzR2FDdEFtNEtCcUQwTEhNaG9wRDh3bXJTUWZZU2Vxc3F3L2s4RUlJd2Rwd1FPT2tXOVhmdDRMRll2bm95OXN3ZmsrRm4wRmx5eFlvZ1hIaTBHTXZMdVlZYmpyak9PYlJTUGhsaThSeVdoaHhWWGJ4WXF3Ym5Jcnk2MDhueDhGeFpQWjIrMGtzRzhOQXo5TG84bklwdTZoUExmTzFGMXJiUlNDN1hxT0MveUFBS3FXUFc1Tk1mTW9BODdHY01rRWtnUE9ZN0dZREJ2c1NKZU9GVlJhbXU1d3RLemdLbTdOQzFsSktRa2RxOWkxUkY4V1pDQ3g5bWl6R3pTNlVOM0htUk9EYnR6YlV1OGJtcnFIT2R3aDZqZXAwQnRKbDVaUUluQUZSN0h3OTZHQmdJR2d5QTBMTVZlNTBCMUl4UTVyQjZYL29vb3VoNXIyRlJ5Ny9FQUo4ZkI1a3FGTG0veVFDT2xaMzhRZ2VJSkJBQjdrb0dzRnN3TVdGVUdkZkp1eHBFL2puSHUrc0hNK3NkS1AyU0czNWRJaWhTUzlhOHdwazl0RXlnUXJaQTQycWtIeG9RaktSSktld0xCbmk3dWdURWhzSEMvbW5NRDkxU3l6RzZFaEVadDdTVHlLRUwyTUxVd1ZJNkxGWVZsSGJMdjhRQWg4WVcwZTN2TGdFWjBObnR3bzdLMGI5a2dFZ0NFZkRPTmdORW5iak1iRERzaHV4dG95dDZGL2t1UkNtNkR0MHYwNldSdDlqWTYwS0VyUW9ranp3REh4ZmpWekFBVlRoa1M2bVZRR0t0RnRKU0FpRGhvaUUvL1FaUWtBRVJRZTkxQmhqRE9KRUZOc01aOUpjWVFLaGdTWmZNK2ZVYkRCRHlTTlVjR2NQYmRvQUVETlBnYzZxWGdNV2NIQUFaNTVqYkJGUzgxQXlRUTE5dWk2NHpRSUhzY05YUVd6bFEyVnN4UUQvYXp4Z2cxcWVWNm5EY0Jyb1dZUVdFaS9MK3hPMkxFQThkZ09pWXd4eTlOeG5BdlJrcVZ3NG9Bb0NZZ3BzTXdIVk83Q1M5U3hFbWZIZ3hYTkI2YWREOU5RT1FtN25SU1F2WUZRWWd6Q3Z4d3FkS0NkUnJtWSs3V2srSnYvOWZNY0EyR2NCN2U5NEc1VXlKM21BQXdGdWpkVzR1QWU5Wlp4dlZ0SnRhWDlCMFJZTmtBTDZRQWtLVEFaeFk2TDNOQU83UGxFbGpDY21GL2c1TXRYenpvNXBVOWlRUkdUbU9oQnJxSnVSaXVMQ2hvdC9xTnhoZ1hKZzYwZ1orbFFHWThpQVNRWllNTUFKMFVUNituWHFtaERGQ3lwclNZMkxIRlB2U05Eck1CRGFYT2dDdDQxeHZWdndQVCtRV2xyMHNGQnFrWG8ya2RYWXJRR2xLWVYvNEF0eVZCenNPbDlIOEVxaXR5UUFjUUd3am5BRml5RWF3Sk4xa0FPSVN0Rnk1ZUhOeEZqTmpVUUpCRWp1cDBwTTRYeENQNk5zWXN1cFZVekRWZ0o4eGdLZmVjUXg2QlpQS3NyekpBRXg1a05qT1pBQjRvQUJleGJFYkVxRFlCUXdkU2srQUxidkIvSmU3Z0NGeGxnbEN3UWNxVFdnS0RKaStiaGxRKzRUYk5XNFpPMHIvZVE4ZzA0U0htN0FuL2RKcStDbmFHU3ZrdnZPK2NrUFZackc5TFBDOXV6UWs1SnNobVRuczdsZWhpOFFsc0lTOXM4bHBIS1pvVUpVTTROdmJneW9Wb1ZmZ1ZMTHE0bEpnam5aUUE5SkhpTFdQdU1OZ0FMYy9iR3AzQjB0TjFXVjVqUUU0Y0ludXJoaEFvWXNrYWJIOWd2U20xRTgvcUFyVXpIN3ZDVFZsOWFuY0VXa0hnUGpEYzhNT0lPUkRGZ3lZQW8zVVdLdUorSjVIWG4wT3FsREtmWWRLNlJUMllRbmN2Tk52Z0R6T1ZrMTdiT29zTTJnc0RwUkNDS0xTWHBnU29ScW1WMFgwQmUwOWVFTHVTd2I0K2k1TDJJT2trVlhRVENjTG42dTBuWnA3d1FnWjl1azVPdGZ1c3llcDVhbFc4eVpOK2p1c2ZZWTdoSXRJcnc4TDVMTEdTVEVTcGwyV1YzTUYxMzZnNWI1a0FJMHBoM2pIRU9jdVFDVm55RFBEU0RLSlZacjgxTFZDSGNJY2ttdU1wMHVBaFJvVDRHc015RjVpdXhIcDRkWTlHMzFRaXF6bEQxejRoaXNUWm5BR3lkUktrQ25TKzFQaUsvME4zVTRMODBKT0pZUFh6Z1FONGtwMmsrOWliOE1KbGdJM0dZQ2RKbWt3d3ZSUTBKbmgza0R6bnREQkdIaGdFOW83ZEhyVVRwQmFqYjZkQVhzUlpVQVlLWEdIc0VVV1BvZ2xDeUk5RTVYR2dwSjFXVjRraTZiZ2ljeUJKUU9vWTI2VklGOE1HNmE2Q0paNVp1RHdvQ2NZQ0t0TU5XSkRzMjRpN0ZOL2tjdGxraDA4MnFEVVdSQy9nTExGNkxYUjExN1RSUUQ0RGg5L1J0K0ZzT2UwSWdOZ0ppU1FHQ1dwZUYrUVpkNExER3ZwVG93WXdyRUZuMWh2U3RoTklYQlpnTWREOCtHNFpLa0Ntcy9wenN5UXF5S2ltSVNrajlvTHZ6dTRORWk5QmFuWnE3R1poSkU2R09oK0NyUXdvOTgzQUpVZ3pGNmJZU1FRTVpsbGVXZFdMOERtYWVZT0xSbGczc3doVHZ1RGNxcHpQa0tqOWtyZUdEaTZDS1EzNG45SDdJNEVObzRSWG5QMEdXKzByQnkwYXdiL1JLQXRISTNxK2QxU0FiTUpOSi83aG92NUxISUdaY2s5MENDQnhGWk5QYjNNdTFWZ1dNdUFnb3dpTm84MGUwUENMbXVCZTJKZVRTOWh6MXFXckt6b3FSb3k2Rkk1d0RBRkV4SVNyT3A0MU1temcwdEJhdndBZEppOUc2L0JmTys0UTdVUEVTMk1LQ3VyT3owbW9oVDFmazhPZElwS3YyQ0E5QVBacWxBd2dCWWVvM011NE5BbzNFVzMzNW5nOVVoZzBldVp2cEVJZ0VrM1hQd21tUUlqek5GbjJmcFRyYk00TUdMam93L2hSNHZVeWVQOEFGVmNqV3pEZFpvVk02akkxMzlzb1lxQmtMUTRFNXpiVFF3cnZkMW9pU1BnV2hxZGpCNXBDVnpHd05ZbDdLM21kYVJxUVBPdzY2enhyaTJ3TjZ5SkhzaTVJUFVMb01QczFldlJwbzdKQWpxY0ZCNFRKanoxSTRpOWhVQ1E5bmhmNGRUdW9HUmt5WWRnZ0tacHNIUng5c1pVei9sNHRraU1DS1V5cUx4bnFtR1IyTzBRM2E2R0VDTXNqWk9DRWVBdGJEZWhVYTNlNGZNVEFWT2NRQ0NLM0JpOSszSUdaYjcrWXd0VkhMVks5UTVLbGdJcXU4a3krWlNsRHZqeDNwU3dJWEF6Q0xwVndoNkkxV05CNjZTZjlBYTBNZXFGSDRsSDFSYkl1WnJVN0JWc0dvdkY0ellKWUxWeXI0SHhpREw0ZXpDOXdkWlFhaGdsT0V3SFlEMVJWd0Y5SlVNQTRqbG5MejMvaUJibWZQVFFjbkQ1bTBvcWpLZVZjajU2RFhJTzg3UGhrd3M0MW9Sblc3WGdXbWRoVmhQdGZRL0U5elBSVmc3aUkrRG8xYXZhWHBsQlk0aTBOcEFZTzdhQWRyOEZXUmhXak44dVN4V1p0cm5vVmNoZ0NseURRUUE2a3lYc3ZmWWlrWk1WVlExTnQzSDQvcU5mRUhoVW5xK0Mya205U2R5cFFtcVJYWURqUUFnN0lLcUI4Y0F3Nmo4UXBaQ0RKcks4ZWpKTHdPa1NrSWxOZFhDSWtFTGo3T1hwSitJRllqNHE4YUsyL3h2SDg1NDRFdWtHMUxEc2R0UzZ0TEo3aGhZNkMzbzNLSnB1ZUduMnZpaG9GNTA2VGc0NTFEc1l1UHAwTVlQUUQ3SVVRR0xna0lJc0xPMnZnaE5WOW9uWHo5VlNENHpMWHZ6R0lmN0VQVm5RSHc4bVdvdGlvVVFSZzlBNFBTVEQyNXVMREZUWFBXVnlGMExjbGRRRjdqUTQzcGNYVDJMQnVVVEVtOHBSenpHRHVDMHFMYnFEQTJxS1JZUHVpRkFsMGtOYjR2MkZqWHoyWXBvU01SVHpNVW10WUdEbjJySEtxS09Oc25aclB6bGZtWVdqaEc0UW1vamZRbWVKWWNlQjZHVWZ6dzVNNDRaSVV1a0pZcHA4UENuOTg5WGtlZ0RzajBvdW9MbTE4U2lQQjZaMTR4eUdmdllhOCtrUkhMTEpxSitWcUlUazFTVUhZWlByUGFicDVtUjRFd0ljbjU0VXcwOGtqRlp4cHM2QTZ1L2tpOFNkZ2xTRURsUEJMTExFNmRuTXpxSWJSdjBYMjZsd1Z1cldSdkZDMktaYXhSREhxQU9RanBaNC8zcFMrMVIvcWI4UjJNQWxocEdOcDhlU2hpTmdabU1BL2hiU2pqR2NlWkZtd1FnbzkzdmthNUJlRUxSTzJSQW83NzJ1SUlGbWZJQlFzSDVmRng3NEdlT2x5TklacGlCbW00c3VOSmVoaW5yTmhkOFpuWWhpZVgxVkZGckxEK2ljaVp4eWRudzdSU2RLdkZ3SnZ3bVMxTkJScmU5TkpBeXJPR1BYSUowV002MmtMbkduSXdTc28vNkhiVEVaSE91eG1MUTlOVDNkUUNNYzNGUGpuNnNpdHBheDZnNUx5LzI5Zmtqa1B1QWtmZWZNSWFsRWZtTzJjZ0pUeWpIVkJZYng2YldBeStlU2JBTmNKQzZKazhCc1hMWWhaVW9vOTh0clp0emxnbGNuYllFK2NLUllnZjdtY01ZM1I3UlNNNlIyOHBJS2w2NERvYnkwaVBQdGlmWU1MT2RMM2JmU0dhOWZ3T2FJaEFUbFlubk05YkdnS0ZkVDRvc3RaU3VBKzZKV094Sm1uMEhvRExzRVRkRkwzR251ZXhuRnZHN1UxRUxqVTlhbFV5OTVHT3VpTm9KYU1nZjBxNU1CTnE1eEtHRXozNG0wV0xteWw3UFZwMlk1eUJ4R2JZVExveGVpYk9zMWxJemdXSFFJQWFhRzdtcEpDZVhHYWN5NGUrUU15N1JOMEFoRDJVaXlrQzQyQWQxRjE4WGd5ekwzWnNobXk1dWIyNWR5b3dMb2IyNytJVnVKUHlTRVdReUxQRFFhWW1QSzR1RlFrRk5EUm5COFVsUmJZQkJPTTdxa1pZb0NkZFF4MDNFR29VdWJPNllUVzZjTDNHa1p4ZHhuTEtiYUdNSzJHeENuVEtXTHdzcFd5UDZWRE1DY0pESnA3alAvRVJWaVR1b0g5dVpzTFJNVEVoczY1REFTTHUrR0daaEZ1bEZEaVdBQm5JUTVFa2h2TXgrVlVHNGFXckFEcFNTZFpPSzJJUmRJbTVZa3l4a1dCdERsZ1FJbXJFT0NxbEttSW5Pb2RoQUdqQlp4aUhUb3dOSkU0QUdleEVxcWdDVFFDRVdZTE9qc1cyU2d0ZkI5bTFrSkt5Z1RPaStMd3ZMOVR5OHdROHN4MHp4N3pQUW1UT0lMSnBmT1FGcEVNU000bGhHVEhFTFVRd2FlaWNEWGdHa0RvV1FzQkNWUUJaUzJwNGN5QTlvcDgxOWs5dnZZVHpQL2dnMHlzYUVkbXVEOG1mNUVIVm1GOEpoZHprdlI5aHdDSEpHWVJHZ21sRnNCVnBGeEY1S1V4R0xxUmtjRWZTT3poSk9sYVl3dUlXRG9ZVkdraDBZTHFscHNFenFqbk9Wb0VvZlZwRERqRURJRUttQzBQT2pqakxrb2gzQlBTQ2lhU0hBRmcrTnQ4aEpOeDJrYUZ2SGxkUW13TFB3cTZmeGd1V0hVRzFmY0tSMW9HZFdRd2JGcFBnVmJBM21EeDdsSm1veUw2V1pLb1BZYmpLWE1nYmpFbUxwWmpkdEVuNjIxMnFuQXdpdHVMREtpREM3Z2Z2VE5FVWZlQkFUWUdLQnZFRVNhbXdubFZtOXlaTnpsRE12a3JaaVltZG5GSzJXQ2xvRk84UUlaNGdrMmZIWkhtZDlyUFlabDg1REVnY3JNaUdicGFvaU5lMDFzSEFQRUdrRE5ES0QrWHFUb2I5YkNoUkV4NjZHaVZ1NGxmV0xqVWdjWTlPUjlvUU9NR1J4cnZsSlB2MXVVQUZIY3FZZXdaZlhrNGFRc2FVQzJMdXZNSXBVZkJCRVlGLzRhR2pEdlZMZ1l1R0diZVUrWkt0VmdjcWdvWEpYMGh0NUpLVWVSdzFnNitUKytYaFJyMWI0Rm83OERXaFlRWURwMjVDb01aUmwxVXNhdWVJWDdQdkFFSW1kNWZXUjJRV3BuakxMd3dRRVRrTG5OTE5wbGg2QkhXVExubEVYN1UwQkpjTms4RVpTempHZ0dOczZCRVZYSi9nRmlmK2xFUS9Ka3p0R3pHSzZqV0ZZRWl5dWhFZHJPSVBiVURVclVXeEZFTVl4eVl1V2dESXNpVUVYOTlKSUJuSzJ0V0FDSGxSSGRmV1hwMEJjUUVYSm5JRGZlVy9tSmQzbkZtTnA4cWpKWUwvcktSNGVBQUkzRFk3NHVRMW5vVVpCT1VDMldMVUlMNTFqZ0VITm52a1NPL2cwR0FKUGgyUU9NY0s4SjBUenphYW54QVdnOWFFQkZTUWdkUi95NzZtVjVkRWhuZWplRE9Qak1Bc0JZUm9IdHE1TDlvdXVmUGRneWt5ZXZOVVZ0SFJ3ZkZKME1pd3BobDVCRGVsc2lyRFkvL3dZRGhFRFd3dmU1QkJSc0xjZ2JobTdqUGJpSVdBZ01uWml5Qkd3OTZYMFVJOC9xc3loVWRtZ1dWZlNmem5QcE5UWnlTQTZtU3huTTV2N1NnUW1ZVGtFUFZVWGhhOERsWEQzSmVtMEd5SWh0Z1BsRCtnem1Ya1RacCtWaXJ2ZUVLemNQOHBYQkFCWlpPZWRWM0M5amxobHhNaGw2d1FCeUFrbUdQRXdaYkQxNVpsRWNIUFJLWUFyZWVjYnl3UU5aeTBvTzROc3pIVGwxQTY0K3J0ZXRHSGNXcEs0eFMrY285MExQRXpKK0NQc3ZXZ2dwVlFLVEVTT3dSRENTVlJ5THVZUEJFbEhKUHUvQzhKclBpZ0ZNN1NTc2l6QWJCbmtOazJZMFBWNnBlYi96QmdrQVZieHI4UzAzSlFBVlhxVS9kcjJOL3VGQlRDUmtNeGowTGNKam5nZERBb3p3N3hwKzd6TDJsWFVFa1BvL3FtK25KSmFsbEpBbU1Tek0yRzg5V2hkTDdwY1JzQTdFZVMxS0FKZXpvOXZOTk5XY3B3bEV4T3RXQ05OMmlHOHFnY1J3UWsrbkFPOGZYTDNNV015T2NNdTZaRVRnc2JYSkxaSUJzcHhDVVZJdjBWZnR1RlhLT2Fvb2tkbmVXS2VNLzc5YTh4NmRYU1lCcDVsNkdaa1Jiak9BblVJcjFueXVTcUxNQkdOQVRrdnBHZlFYdlo3SmZ6OVk2d0RDRjRTZExrOVphQTRuTWlMWTlTaUdsODJkTnJibm5aYmwvcm5aNm5tY09jY0FWdHh1RkEvTzlYRWdkZ09tUzZ2bmFWR1M1am9EVUFEMitpcVBzeElHck5YNEJ1dzdDQjJQR2dob2dkSkFZTWxLTjdhTnRKSUJvdmpMMmVIRVdBR3krdXpWQVBDSmk0dW50N0xxUWsyenk1cjNTQ0VjWlFDWWREUnBmcHNCU09OVlQya0pZc3E5SyttRzBvYnlFaXY4eTRQMzFTNkFLd1A4bFV6QkYwOTRhOWNaUXpxOXhRSVJUcDZSY0ZyV0k0UnhqblNHbmRXR2FUS3FDZ2R5TDJReGNEMmtTVkIxcnhhYjhlUWJET0RCVG9hL25qdENDQ1ljYkpZQnFMWFEvNnFDYWVKYkVyV2lyVndDT05ubFBDK0ZHelhRR0dSL2pRRXE4QTE3YXdhNFd2TitvOTdkL0RMNGZIL0ZBTHdaYUN5TUppdzZrczJQdm00VmZ5NmZyNlRmV1ZyTTNad2pXdG9CTFBCcGlFVHlwYVlIR0hjWjU4dzlwNkRCRDQwU3phZHowQWNpV0kzRlpBMk9nVjdlUFZlbFE4ZjNqRDVid0c3Z3RnWnlEQ0tsSWFQNExkY1o0SjNoam90R1NlMzJJVXNyQ3cvQmVSZmxBYk9HTVZzTmlPODNJbXNyQ1ZBSW94RHFUaE9BaFpJQjJxVG0yQkVYMEZ0VkRIQzE1djI0WFF0cXR2OHRCdUFrMzVrK2g1eU5DdFhOOVZlWlFSbEF4QnRTckVrSGFlbEdLbWdOS0Z6TkdPbVNBWExreVRVT2cvN1EzZWJPQmYyMFBpc3owaFlNRUhWajdDU0l2QzRzTUgyTmdhU2cvaFdhcG1ZQW9wT0F2eGEySlA0YXJnQnR3Z1NqODBYSncyamtMSUlPTG5TQTJLK3ZmUVZnZGtPZWRvc0I2cXJuTENWUjlGNnRlVC8rZzJwd3d3czQwZHdZZ0g3dVRvc0JWaU1xZ1VxellJRDBCZXlnSi9iV2JnZXJHYUNTQUJtTWpCM2Z3RlU5cHcva1pKbVJsaE9hREFDOFlkd0tIZ3BZNXRhUnBlaVBHSURTdE1aZkV5RkZFMDZCeVhTalVaYXZnNG1WRWdkZ21wb0Jzckl5TkViNkU1SW12MTRDN2d0NCtDcG9WdFc4LzJNR0FFRHEvQWNTUUFmV2xjQm1vT1RqN3AyT3FpNU1BQnBKdkdDbWtTczZ3TUV1aXJRRVBWaDBFaWRZNlFCVlJsb1NUbDhPWHh4RHh0eHZxR1ZZb0RSTHhha3NkVitrR1FITkU5VE5sK0JsaVpGY3FKaWVZQlVoN2pHRDk1SHdiR1ZLQ2k3a3NHTDRKeXdmbjdYVjUwYndWTXh0aDNTVkFiYkVnSEY1SVlwVUVUVUgxOXZxbXZkL3lBQXkrTmp4L0VRSDJNMjVicm9TT0RJbDBIUUExeEJuY0ZVREJpQ2tiRVFsd1M0aENoOHhGVUVBWHhObUNDWkUwcEplR2pMQitFYVdseklqN1lzZkdFRXFjOGlxM0cvYkNkTWtVTnZMc212ZEdqZEZVc2NmSmFxL3RQbjV1RUZMQVZ0VUpROWhrNFQ3cjhLZGlReHNIS0VFQmdqejFnS1BBMVdXUkY4eEM5RUZBNGducGxOWnFqRmhrTFBzNEF4UTE3ei9Zd2I0NkJNZzVma2pidXdDS0xCeEVBelE2ZW0vc1VlYzdTTkZlcitudkhHV29XcUJ2blJGd0toZExFTXdoaTBpVFU2WWlMR1hNS2xmNkZpWTNxamlSd1pJWG9MbFNOK0MvVC9McW9IUndiaVQ4Zkx1cTJML3phM0hJcjJCZzhvU2FCcWpFNGxLb0ExclBHNG1EQkFaWWo3VnFtV1FzVElYaEE3M1I4VUFtSjM1UkF4TDVKVnNuR1pWemZzLzF3RWF4WmpNM2JORUhyMXVCd2dqUVRJQWZtWmlFL05WckhlOWhVeDNJVTdjbEM0V05ldGxQY25TOGdyWG5KdTh2SklpUERwRHF5bk1hUmR3VDVpQ3E1MXo0aGhIblRRZE9tb1p0ZFNaYklQZll0MFk5eXB2SDVPUHVKOGhraE5IUE1ENU1uai8wS2ZCM25kRFdBTG5rZkYwTHd3dzgrTEtyS2hMbTZkOGFlRGthZ1pRWjF5VFQ5d1VtV1huNjFoVXE1cjNmODRBOFByQ3QveExTNkFkYk1UVTBqUXdad25yOStzNjExWmpWNFIwczBzR0NDNVhpUVpyT25mQlNVM1RIVC9sREZneU53bFd0RU5od01uNnpnTUVVN3Z0ck1BeERteld1UE1BZDBJS0xXVGpaQTF5M2dmZG9UR08wY3Y1SzUvUGt4M2ZSUCtvWTJ6Q3lVMWNzQVVtTUM3Q1Fvb2lESHdHSGVBOTY0QVNITUFVKzRHVGF5MEJ1cUZCYVU1SDlXakZOZWFXRGdhb2E5Ny9PUU9zcEVWMHlVOTlBV01YOFd0a25qenZrTk4zWjNIT0pzME0rNlFMaU9xSFpJQnc0ZEsxQi9kN1JscWtsMUJrSHIycWtLVHUrS3BLOXVNRmpYTDBCMU0wNkx1Ri8xZ3ZOUGRoSnRHVGxpQWIzZ2ZkaDc3WC9YWkRFRWpOUUtIRVRSVXhnUmZCK3g0WkVhZ1pCQldPaWpEd08xUXVnajlnUVJNekFVMkprN3ZRQVhyck1xb2dvc1dscFZwOXRlYjlIMjBEaDhPSUwwdHY0UHpTRzdpTVBQc3l6VERQbFA2c1czOGtBelR3N1BVVnB0M25STThxNnlBTzhpQ1FtcTYvbU5OTGhDNWgyVnhPS0hZUFdiSWY1U05rdkFodVRGOHB3R0lJVmNCY0NwRE54aW9zREJEQ3d1QUdsQ3l3ODlIZDI3SHVkNGJjWUFMTHlRaGJZSW1TT2p5akhielAyQ2dMMEdOWXNVZjRMSFViYUpXTFpDWms0QU5DVmlIVmQyaFVNSk1CcklCeGx4aXdZOWFYcUswRDdacjNmMWdVL09rcGdrZG5QNHNIeVB5RlFwVkd0eDNoWHAxWndSaXJ6enRFTW40OVROSEJwT05HSElUM0VHWElyL2N3cmw3anNHeS9CRjVjQWlFaE5DMGthSFIyMzRkRlN4anFWUW5OR0RMcHRnc1lHeGVZUTRKc29oRE5HZDFlOTN0R2lMTlIybUthbUVuNUVoZEFjclRLSjhySkVWTHJrWCtBaDk2cGpLcWNqQlpLYVhwZGIzZm01clZPQitXVkpCd0R4SmpzTXYvSTFacjNmMVlWL2lWTHN2MHNJc2psRlVkZmptVXAvZStNdis1dUtkTFduT2dNL2F3RC9DemUrakZpQlFHUXprckFXWmdkaHdJSWlYY0E1VXp5Y2tMYSttaXlWeGZJcVBITzZGaGlEalB5MlBGMDdHWmxGZys3SGFKTlBLcFJ1aStRUWRJcWhBS3dKU2d1T1l0cWFsbjVVT3NGSU5XN2hnNWtob0JqZU1yNnRwV2dxN213QTFTMVpMNElpcW1xRVR4ZXJYbS85RGlSQ3daZ21vdktOVGlXQnBUSjhXY3hnY2RUakg3VXg1aUFMbGJkeVVaNjh1elFYMXhLMFFFWm1paFRZZzl4dnd6bFRsaDJwRjNvOEpBRElma09jalBHaFdmRUpBT1dDV1I4TGk0QVdPL1pzUWMxbmc1TmlCcW90L2NNaWJlNDVxT0JqdDZyNHBZQXhDaWNMSVAzdmJ3c3dHaUUxV2dqUEJnTUlPdC94a1BKamJFTGlQUy80V291TFlGdlVVM3FCMkZ4clhvazEydmV6MXJWN2NBQUxOV0V2VTJhenNBZjBnRGp1SXdLbmtSVThGZU8vb2dWOHpITWpsckJTS3ZNMCt1bDZlR2NXQURjdElQOGdTWjhkcnhBd3JLSkdLSFlWYWdCeVJrRTlaT2RwQWFFU1NSSm9FejBnRS9VRExFbjh1VGxqZDFLT0paOERsQU1rUTFhZmV4NHJiZ2xTbUxPck5Kc0FCZ0pLUTZzRFdBelFBY3pWSVR1Wk5iNVhUS0ZSWlZpYUZ5VkJIZjRtOXlFNWJxZ09EQ3p3YTJhOTZlcXZpVVZUdS9SNTRmeEhJZFJvUStJak51NEFEbk0wU2VpcWtLdGZSR2RxVEtQME44RW1RbzVBYm1yWUQ3YUNFS3g5a1poU3JIclNLL0VUTEV0Q1c1TWtxYnNmU1NXTEJGTkozbEtZQTZCR0dUWlN3VzRFZU5tM1VRWWd0VHZEaHFXRytzaHZZYkZMYk5HTVhnUzROR0VNQXYzNnVxU1dCdWhzOUpmR01DaVFnY1JFeTJ6aHRqK1ZrV0Zka253MCttb0wvZVBOSlVDdGd6bVpMbGE4MzdmcW5CNy9NNXlqVkU2S1lvanpUQW50QW5HNmlveTZDaUh5OUUzWkRBbkZGQ2dPa0FFMkdMQ09jaVV1RExJMEVTWnNrVHRpWUJPWUtiS1NzQ0I5WlFqTDRTM1RjZUduREowWXBSL0R0bkxPUXFLQnA0ZkwyLzNjcUllSWFQeE5zcHNpbUpEWFU2dE4rOFlZNityT2RZcEQxVGl0NVY5TzJhVmNodG9PVUROeWN1akJ3YUhXQnZRLzk4N3F3L1ZBZEtDdFUwTnVwb3JHaUV6clpMZytuUnR4Z0VVeEc4NVdhN1Z2RC9WTmE0eFFkaEQxaFdDRUpOSnVDd3BwY0swWGM3NWhDRWtVSDVXb0xBcG5EaHZ4c1R3NnZWVEcveEVsdUk2LzlzaGNUaWJRRlRYbURZT2hBT3kyNTlWNHlGTEljdS9nTGdLS1F6VVpSWmVQRldEZ2F1QmVzZGtjYjdJTEFQSy9UYTk4RllzMUl6RzRtWWdWd3J5U0dNQ0t3YnNIcXZFMmlnRC9QdXZ4Z01BRUlJUythQnFwaldJclFRT3RVdUNvK0Y4b2IvRGMzT3lIRSt0bXZmc2pTcjNuQ0NjYmV6SnlZS3plUXdaVFZ3TUpzQVBoL09STE95c09HKzgxN0VFclJKcmoxYlAraGw1ckYwc0U2V2JzejQ4ZENhUmRWSGp1VzV2VlBtOXFqZi9rdjZpUkgzZ3JxSGVVM1h4RWFYSW5BeXhYSUl6b3Z5eFRVaGRITEhBNHEyOEhMMDJGRGRqeHJCVTVTS1JVVVQxcjJCZ1paSkFaWUQvM3NtM1JGS0xEVmNXNUM5b3B4ZzYxU1hCVHpFMUFiVWxRRHd5SnNUbU1KdHZTS21ZNEZqVzNaYkhKZVlRTnpadHpBYUNpSGhjSEhrdktpRURKZGhFc1pIZklhTkdLVndCN1F0dzdjdDFuenBHRnNzazV1bTV0SnFvc0dQTlNmUm53NHBXQWgzanI1ZVV3akRmUncxVVdtMURwa0pwVXJzT0ZHYWxOemZhV0NhcEFlOVV4UVptQzJJWkVodExCUDBVZllhMmN3ZnNlVzVCYy85Uk04QXBrMXFNSVNveHM3aGppTG1LQTJWSmNJTHhNYWhGaW9nczBmeHRPZ0VicDRYdnZUSlZDYmEvSkd3TGMvajluVlBFOHJCZ29UTXhpQTRxNjlxZzk4bUhVR3BTL1UvUUtxNXd1TzZGNXE5ZlRIUXZ1NGw1cXRObm1NTHJtTEpzYnJFT0lTdVRrSC9KbFE1MlpNQWViRHlaN293bDR1Q3pmNElGdDRjdHM5QTdjazBSUzN3RzlrM0loNmVQdUpTREFkS2xsK1ljbHdvOXV1MFl1aDdiL1M5akFKbTc0eHJHeitVYlRiaUNmOWFsMThzYTRLZGo0cXl6UkxQaHFOREJCc3VZSVFtaHgwKzhiMGF1b0lJZmU3aTlJZUNaMTlDTDFtd3o3MFZ1TkZTRGdXQ003RHlFREJLMFNxdzlFTTczMWQ3ZkNsTGp6cTFpbVZOemlwYWVFeXgyWGc2ekY2MzBXVUhJaWszZC90SXJEZXhZcERtV05oaWw1MVorK3NFdURDY3d2TXZmYXMrQ2Q5WWRHZzFUMitQcHUxekt2N0xvdzZlNzlPU0FPY0xDMld3ZUgwZCt6STVrQU52WlloVnpHUCtzVEtyamlHRGFwTkRhTmNBTG5IV1VhQ1pQcnJJRjdHcHJTVXBHNklOd3BhdkNqZHEwNGhHa1NUQ3JaV1lpaGdBZE5oRmhha0E1TnhYTHoyV2hXMEpHdFFWS0VqeFZXUC9BU25YTnNUV2hoWXdDVHQrcE1zQTNoaFV1OTZJcFdkcWw0eGptd2JCazJGS1pmNDF1M25lRzRsUnA4QThMNWhZWGVsdmx1YzNKUzNZNjhBNityNVRrRUVvZTFoTmhYVnc1bmtQc3Y5S1ZEVjVGZXBqL0tBT1liUXVybU1QNE4yVmFMZjdKSERMZmFPMGE0SW16enJxQk5QQ3NvM0VVMzVtcVpLZEVJRkp5T1MzcndKMGR1c28xek9Ic1NDYUhja0Y5ZEdDODVTTExXU1lYQ1FWWnlVckZ4ekpLUFFEZnh2S2F0UE92dy81djFnL2pWZ1kxaENlbkRnSmxMamg4UEh5OG41bkluZ3dRMFhHQ3ROUXpHTm9UY1VlMGc3dWNwdFQrTEJoQTJBOFNBRVcrV2RVNkdHRGRhN3pJZ0R2RGxkZUx5bytIZVlUMno0N3NEaWpMOE1vSzhGL3hCbDdDK012RWVnNUFZeUpSRzROV0RmREVXU1BUUHhtQVFGODJIOFdJUWRXNk9qdzVRTnpBSExxYk9mT1dlMFlUUERlVDFETDJSVk11dzNNdXI2QStHTUM0S0JSWjZrR3g5Z05NdXJGNytyS1NKTjZBOTBJQVJJQW5MeGtBWTAwMzhxSk1aRzhMYndZWlRURGFrTWZwYW5jR1lPakZDNmRuR2VLbGxRb3N1anhRVExMZk1VeVNoQVNEQWZCMGVyUTJLTjZhUlI5Njg5S21EOEhnd1ZzT2hDTWxqUUgrNTQ2K1pqZzlITTlVcHRZa0lwZ2tZRkh3dWdZNDEwVGlyTWtBbUw0SVFHVmptSGFad0lRT29Nd1VYSWEyYkJ5OWxTbHRzc0JzVkVyVUg2d21NMUZoWVVIUVVFRUNtWUNRSkpDZ1Jsa05zZ3hja1FZWDJONEdmSEhKQU5RQUxYd0k2WlNaeWQ2b0VmbTBRVUVyZkRGa2o1NUFobVpGb1FjR2ZySVFodGxJTzhZQUhVY3htYkdSK3dWakFDRUltQU8rQWlwTEpIUXo2QzA4R0lvbG1aUHVpTnlNbExCQ2Z6QUFJdm9HRFp6cERLVWxrV3d5RTVlWURQQVBHU0REZ2kxY2d6aHI3RU9ydWhObFdZY3BvZndxMVRVVHJjV3JlT0JVNDhGdHZBWEw5cTROeitYMVJTUHZSY1JGNzliS0FCYjQ2d3d3UyttM1lpQnNwOER3QUNXNW16UEV1MFRVbFNGNmJRWUlEUkI1enVIVFRBMjNxcW9EWXZYaFloMUZkWjFnQUlKd1NSdU9ybVcvTkFid09lNlpGRzA3UkFaUTVnQ2thR0tWc00xMHo3cE04ckJNKzFxdEFmeGZIdU1LOFAvdTRQYVJTUVpKeWpDVzBpZWJEcUMyQk1paURFVTFxUTR0VVltOVE0bGt6NGlNdFlNYklkTzRLMHo0cWlnT1JqMXlvcXBocFFRaTUzSTRIRHRhL3czZzhoRld6WTR0QWZicEpJYktaWXFtS3Q0NVB5SEN0Q2twb2IxZE1rQ2hBWDQwZEdxalZaV1IrMFlsK1hTbDF5aFZnSmdUckd4aTYwVmtZOWRkS3huQVFwak00WWpkaTFxQ3lBQmtEbTA2MUpSMld4WWt3VHJBMkU2b2dUd2lmZWRZaW5JRitIOTM5T0ZxZ0pOSHpGOW5nTnNTSUpiMVhTY1R1akxMQXVhQXRLRmxSQzdXamkxSzl4V1ZDT1pLUFZESFZ4SFRJejNOY3lKNkd4MVBZcU5BSVlCQll0V2tUeitwRjRrVVhoOExkN1BQK1dTQXk0cEROUU53YThHeUdCYm9oa2IvRjVWVVFLbzB4R3FOcGNreEd3L0pBT3doSG9NTWdPQTJNb0RPY2FacDVhMlh3UUJnampPK3FOUVJ5V2R5MU5PNEk5MVZ4dnNWNEYrekFoa0Q0SHNTeGovVXFmYUhFaURXSDIwZVZwRzF6YmkxQmllWEZ3NVgvdW5wQTU1a0lURllTbk10U2dZZ3REUWtnQ3dSalhBQVYwMG1PZHJBQmtEcURlSHR3TGNWN21ZQWdDbnpnZ0VTOVpZNGpXQ0ExQUIxUUhlc1c1VGhJaWFoaXBtSU9EdGlBT1VPR1ExanNEc1RPc0VBczJBQW9KaVE1R1hPV04rQ0FRYVc2cUpoMFdJdWxheVhNNnJJL0VYMUVjOHNWNEJqckFCMzlPRWovTVVEbHY2VUFiZ0RXVGRsVmhwdWloZTlJdXB0ZXAwQjBnZXMrbzNyQUpCNnczSk5xQ0lLVXdkWW5mVXhMaGd6aDFxM1kyZ2RFSDh5d1lxWmp4TFZOMGNreTA2aTRsQy8vTEprZ05BQW9Ud1dHRnd2d3JRRXFBaVVzQm1oc3pGaDUvbjZjNFQ4Rzk3cmdnSDZhL3QvMVo4amp6c1pvR2tRRzZ2YWJVUlZGZlllQ3pMUHZYN3VEeFk5Y0VnYUFiZ0NNRVhNdk9jRnVuK2hBOEQ5WGpNQXNWa0xvcGNqdEpMeTA3Zlc2TDNCQVBReUlVNDJUQlhNdkxYMmhDYVhESUFmR25HdFk0SlZjK0JKam96OWVvcmo0aTd0RlM2dGNEYy9VOW5MMEhMYVREdXE0VjFuQUdxQXFKT0xtbm9mQjJ0a2dBUlV6SGVReElpMEhBUkw1K3NibTF2bXpvSUJIcG14U1pVWmtTRDZZWDRNbVI3VmZObFRRU2ZjbnRWS1dQa3hLdWxSamFZcGdBY1ZGL1ZSR3dGMEQwQUdrR0xlckF5QThmZ0pBOUFRZUFtc1JPU1FDdU5EUGFrTVd2REIyakEzR0FBK1lPUWFheUlObmxWZjJHWFI2UEh5a2dFc0RWVmZ3M1liZ0VjanlSRzU4dU16N1RRYUNEUERvK1JaQ082VlM3SzhDZVAzc1JHcEdNQ3pSSm5MbFVtQ09sQ3QxbXhrQU5OOFFYSE0wN054NW1XaG9RR1dDWkNrR04yTitSaWd6S2lpb3N0OU1BQ2VqWjFMTXppcmlBQUQwS2VFb1k1V0xQWEhGQStzYlAxYXFZQmtBQzNtM1V1d3oyMEdPQzNSS2dZSVN2ZDJ4S216N2pvTTNRWXVDdERGZFFaUXQyM1VENmVkMThMOWU1NFJBNDZKbWdHWXpROUxwUXc0eHVWelVUSUFRcmREUkd0OGhYcUlhUTFHdERldGprVWRJdXlIRGhVRDhDVlRBMXlzSVdzSlgwZ1hlNkVFSU1vYTFiaTRwNmhxelptcUJwSVVvd3VIQkUwQXFxakl4NlVOQkJaYk13RWdJeFlZQUN0MkxQUGt4bFQyUzFPQUlOeWlPQ3pOd01rQUtPYWRxTFBiRE9BSnVkc000Qm15OUVtbHllVzhFN3NBeXZCUmp0OWdBQjg1Z0toU2gwQ1dEcXhMVDRpeXF4bUFHWFJScUFRbUFCa1hwNWI3Y1d3Sm9DYTFuRmtNZTlJZmVSNVZ4ODQ2UkJxODd5U3JHU0Ewd00reWxpMmE1eGhkUnZsQzhCQktNbU95dDBLaWJhdUFmV2ZKQUhnTG1nQmt0bU01cCtYdVpFWnNDRHJwbncrVUFieGMxck5qTU5ESzdYNWhEdTVidm9mS0NKQkx3STRXcTU4emdQaU5HSzc0NnhRaDhQcXBxMjRTRlNJbnJ6Y1pZUHlZOE1xdCtub2piNEcrV3RUN3FJUEtIUmpSTWNPNWduLzdCUGpTa3d2RUxyMjFGZ205bkZLMVFJbEJmUmI4aDR6ck45d1I3RXF4WUhsTnFiUUJIdGlJNzA4bjluNldObm5sSVZobmFabXBVVEZnRWhDcXRRUjRCU2RBZ2JBeGg0ekNDRzJOT1lUWUZGUzR6dGpTekwzU1NFZk9kVFVIOC9qbnBSRWdHWUFFK1JVRGlCUmlBTXZsRXJDZ2FhTkE5SG9PblNMdS95WURKQVFhSllBTXNVaVpsQlYvYWdid3dpOW1BdERCd1pvSkNhS3hIRzZVVVUrWHgvWElmS0ZxQVdpSnh5blFud2wvWkJqVG9zQVJmcVFHdUdiRDYwK3NXU0JrS0FGbW5GYkZzaDhxUU1rQWVETm81VG02YnJtSGd3SUpsaXlGWVZHREVpYUExWnJ5aHd4UU9ueWtxVWt3VjN0NDdzeFR6RmlSTUFMOE9RTkVVT0NrbmRiQzY4ZVh5QkQ2MGkzWnhlOHhRTk9RU1d1T3lKcGZOUU13cUplcnBnNk9Nb0NsbnlNRExNQUFtZStZdGN4WWhyV0lVNEJIRXFXTVRPeGtRZm5kemp6WmhRYTRRa1BHalE0YStCeExtZnM2c09SaFY4LzE1TDNTWVFFTjFqRzVaSUM1MTJBOU5PbG5vcEZKSEc3SUxTdE54UlJFZWl5ZXlGMm14c1NxSWdEV0FMRE9wUkhnVHhrQU94RXJmbmV0UXJjdUk2dk1haERscUNiaEVQVmVTL1RTV2dLSyt2N1VwM21aV3RNWDF3b2themhoWUgvbHE0Ry9iREpEU1llcE10ZzhNcEpsZUhjWnB4RGlkNmNCT2ExeWx2UEdUS3Z2b1FHQ2M4eksxR1B6QkxSTE9ocys1U3lXeDNhSDA2eGtBQmdUMUR4WE1nRERIVlF5SVpONGVwcGhaQUw4U1JVdDVxRG9tN3JzK2JYdEtmR0xETUJvTVdBeGFpUEE3MGdBNUVISVYzUmJCTzJvemdCbHpydEJKTHRBTHdSdHB4TU1tbFdpTGRWQk1BQTl3Z1BpWWQwVjNJQlF1K0NmRmdQUUltR2FNVktSeUtnbE50R3lLbnBMLzQ1MnQrSVVaaXo3T2dkS2xBVWN1TGlSbzhscUxtcEJvcjQzK2tWRDVUS3FVL1FPTGcyWkhER29DYVVTaUxDa0VSTHpOTmJJQURCQ0FrcUdPajZJTnhxTUZNdm9HZmFaaXJINmhZalN3R0owSjI0Ry9wMGxBTGtNUkhyU0ZsZjJhN0sxYnJyU3VJVUNadG9IS0ZJa3NuQzdwN2ZreXE0b1hWRzVQLzNUZmJlS1pIZjArMFNlYmFEVDlGRzNHRURvdG1Qa2o2WUp5dFJWZlhsQzBHaGRaT0w3UEVTck1XdUlFdW14SXA2cjlCRytvVnhHZndObVFEWm5BSXB4eWx2UHo1cStyQzJ6Wk9waVF1ZUgvQzYzZWsrcVQxd21WQ1UyQ29DeFYwWWNodEV6dzA1aEZKakVMeFRHU0N3RzlCUWdnc3dPOVA5dU1BQzltaXlhbjRrc0k5OEZjcitCZzl0NWJ3OWVEYlpNa1dpNCtGRlpmZFNzTjdFRXVHa3BTTXVwWk1rUm8vTHN0UFFGTUZXOFllUTdwaWhDQ1V4UDdxSnNCUVAwaTFZeGdKVWJXTkVGRjRXV3NNMEh6ZWxVZXVFdU14dmQwQkJsSVcvZHpzNWpYR1pBVTVIbS9GLzNpUUo0WmpIYWI2ajd4ZjlzVjh4dzVqZUZGTnlyd2hxYno2eXlZMjdEOHRjK3dYR0J4VGdwdm9HTHdBMEdpRVJEVFUrVENzWDhtMGIraW5WcDgzT2JMWE9MZTZZS2dxL1JHOGd6TUl1ZktvU29HVUNoMnlZQmFIYnZWT2kweC9RR0VscktHRk1aSmdTa2RubzJtenc4cjI2WnNxTnF0a0NucDlueDE4c290WmJhQTUyd3ZzZFo1WCtNUktybExiRnl1Snd1YXRPaXQwRGR4UDhTOE84UVFDRXg3ZFdKSWRnYmxBeXdsVEh3QjFuRE1xRW5qSy8zWDRZclN5ekdWQnJCSmx3RWJqQUFCZ1BSVkdXZGk2bm5ySVY2a3NXY3E5ejNuRDRKdmtadkFMYkJMSDdxd0RKRVV3bWtaNGVLQ3F0ejFPaTBvRkk0T3dpY0ZsK3pOS2pzWjFmWkp6V0ZxS2dyVzQ2OFpaekNLYXNsRW4vTkdzT1FwOXcvR0VBYlRpWHdYZGtZaTFqTDI4REtLYUdFZ25oWm8rbEQ5YjlXWUFoRVJvVzBkOEs3SFVXMExOb01DQ1NIWUtBNURLMUMyR3dBWlNJRDhJS3lhdXpQR0lBbEdBS016L2xIODd6MFY5VW9yR0lTcGtkV2cwM3dOWm9EdGkxK2xLZHFNOHdvNGFoUTFkUDFubVZqV1cwcnFVUjE1anVnSW1JcXhqSE9KcEtyYWtvU1pOWFlWczBDdzdOYUl2SFhKTmhEUUIyODNCa0NzZlRsNmdhWklhMlV0NG1WQXdsUmhwYkF0MGYrTHlGS0xKcUhzM0NUOTF0Tlp6QW9XamVoZDRteEErck9RU1BFUnljOEkwMEJZQUFHOTJXQXhwUVIxUUhHSnpyVThsZFltZWhlZVA1UjdjNHgwMWtOTmhKWVZNSCt4SG9VQlg2eHdMR09vcDZJVzdJWUdiU2VSS2VWVkNKMmxQQXZTRGZreGVCc1NuSmwwM21ObTdZYVp4aVJVTUNMYlpab21Ea09kdktDaDNwNFBBYThqUDg1VUJSdEUvSjJuTUExYjRLV2E1RTJRWW8wc3dOMEQzZzMvZ05lcld3dnhCaGVma1NKc29YNEovMDU1TFdvQ24vd2c5V1NnaG4zN09xSWxlR3F3UGlzL1BzWWRkYXltSE5kSGRQTFRINERmTTFlQWpha3RRdG5LOEtOM1c4RkRBK2szZFRGWk11YWxnYnpBVGgwQ1NBdHNYMCtRa3VRNjZWRm83R0JoTFBWNUhGbzZEaXBOQ1cwRklXTW81YXBseUpscTVDaXdLaVJFU3BrSEJuSlA2SEFrUlBkWGVEdUNJcVdJU1JYczVHL1NlcVdHS1AyRWZEUUg4U3gwTWpaS2MwZXVRYThSSUIvcVk0RXFrcWJBMGN6R3hCc241NVE0UWc2QklMSXkwenFlSTNyM2luK1EyY0NyNmNiSWpyWk94Mmo1cXRkbm1WajdhUW96NXVpME1nRTRSS0VlM1R5c1JYMDBWcjY5c1R4SllIQU96SHBFdEVQSkR5cUUwc2pCNU5YWjdOQWlwS3BDUzBOREZ3MkRGZ0NSTXZrSUxiZ0Zlb0FFaU5RcGN4R0FtRWx2RkJreWt3Ym5PU0UrcHVHVnBvOTlzRUFJVGZ2QzNWRUNkb0M0MjlPUG45OVZoT3lDUUMrWWZCakxxQytCdWpNaVFLaVowdW1rSXZpaXJ4QW1JMlhVN0xtU1FyaWZDbEZJZjltOGUyaWREcElzVUVCeTVKQW9ISmtUNmdiWkdjMTZaaDdCeUR0cis4b3JWd2sycXFSb3B3WGREQmVhQ0hjTkhkemp6YzBMQlBkL2FIQ0FPQ01VdjZRME40Z29wUFUyVEpUZkQvVHdKb0F5SlJYaGRrakdTQnFKSE1zWFFLMXdmZ3pGdkNkZVQxbzY4WGNwNVNrR0tmQWozRlhsWVEvMm1vVEQvQUsvb25sdmtKbWx5Y0ZYbFNKVmZ5TjZBZXdPM3J3RHhRWFUrV2pTU2NBalVRRDFtMUNBMFpPdXNpK0JZVWFrR01jVDhqb3BrYUtSbVkyN2lHckZsbFBuWnlaVGFvd3M3OUcrWEVheE9kRksweXkvV3hscHZpS0FZNnpTSHIzcWUyU0FkcHlNNnRldXpLaktwSFNscklZWWpnQm85WGZxc2k1YTh5aDFVQzRrZ2lYaUdvYzRCVitBZWhXSXJQeE4wL1NDZ3lSY3VZeC9zNGdXRzRGb2h1RVNQb1k1RlpuN2hVQzBkaVVrMjYxeWtSUVFHRjY2bUUzTFdjY0Y1dm5aaHliU1hCZHRnTE93amFQR3FPRm1mMDFTbk9IUnlSYVphdi9PSGk3eVFBWkR2RDUvMG03d2dDNWJVbWRCR1hYMGU4SzV1YWRHeHFmenI2a1ZYOUhJVE1rTWFBN1dGV1NkeExoRWxHdEIraE04d3V3NWF5UTJmRTMwVG93bm1rc2x6eXZTRUIxUEZtQXZQWWdIMWdCK2duNkRGZ3ZZaG5aRTdLWlpidWNkT3ZlZ0tuZ2lNS00xTU5oUWlTTnZEV29XaWxjeS81RHR0S2ZSWG9tRHJHZ1hwWWZUNWRZdEhVd1FPblF1TVVBTWlVWUx3YjZYMk1BRjVxcGsyQUpwa0VqRkV6Tkk2SXRwak9YdE1mOFc4NkMvWWpXSExHalk5d1JvNTVFcUJIVlBBQm5HaUJxSHI5ZkliT3pQaE96VlNwcDFGOER1eTVUMEVFMFpRakhJQXEwb1N2cDR4bE9hZnhQK2tUbTc1eDBDQS9pK1pDTEhqcmtsZFNTQVFnVVBVVGVWL1puKyt4WEhtMHdHSkJ3TFRET1NKcXJCdWtVajlaT3FKdTYvU1VEUkphUTV1TW1BMUJvVWlYcHVzWlAvVE1VVEVYL2F2UHFudUZmemI4ZGRXR09rQ2Y0empSYUw3M0FWYVBYTnYwbGlOTjFyM1dGek9iZm9FK21MRmU2bE1BTmJMc0lveDZZVnlBWllFRUNmUndjL1VJR3lQWVpESkNUamw2TU5EdE43K25NYURNQWdhSmFISWlWZ0prMWp3MmU4Y3FmcGRRY1JNYU9vSjdoRExpT0pBTUVpWlFiazlTbElmSXFBL0F6UWYrckRFQkhmT29rUSt6NUdkbmdDaVlzK0w3RHdPTG1FNTJUay9ERzlKZy9lL3o4S3VoTUVwQVV5UUQwSzV2cmgvYmxDcFZsZjFjQmFFb3Q0YktTQVV5cmg3eHJkbkpUeXpZYWtlZ042V092eEZVM0NjUVFzYUxXbzlJSGZrekhaaHdMWUZCenVHQUF4QjBJSGlCSUNrOEEyODVSdSsvcDBJemN5anBGcW1wZkxELys4bGd3UU1yb2FyMG8wcS84bEFGdVNnQjdSS0dUZEhLSkJLUU9lR0lEVC9jYjNOczh0NHlwUmhidlJlTVJRMTVhRlVWT3dkNGpPRktjVHl4TUU2M0ZBSWpUWkp6V3kvU1hETUFjN2dVRFVLdFhTRHBxaW1tMXptMUdvb05BcTZpYlNtMmY5TEc2djVaQ29KeDBrUkwreWIwNUZoVFFMK1JPbnE5UFgwWHNBckxtV1ZNcHg2RW80MW9SUUVVSGFLWFhRVFZvdlV5eGsxd21xYS8zcGc3QUhBcy9XUUlxUGZPUWVaWXhRYUk2YnM1c3ZDdG50LzdVdit6QXE0MnBuNGdEWHJzNG5XZWdkZ2V0eGdtQS9sNVVmUHdyQnZnd0xpc1p3TFg2UWQ5aWJUVklObm5NeHJDYjJRWEdvZVJzaCtUVlRudlN5UkhQODJIT2ZuNzZZWDZWQVo2ZkhJWUZEbk5Qd0t1RDBEQVVsUVJZcFFSSXZRN3A1aWt2NHVheGs2eWdXOWQ3eVFDV3pvQVJnYjlnQUNvbFRWYTRqMHJaNEZ3UGhtTjEwb3lOd1FnZDVuWUFlMThudkRNQzVFazR6MGh0WDdhU0FRZ0IyYkVrZWNrQUR3K1hETEN3RjV0VURFQ3R2dCtIdDlyM1hYd0VDTFF0c0llK3pkR1BzWS9ETUpZRVZheEtsQmJVWlpIZ2hYNHZHYUNXMGlVRG1KTUMxK0E0YTIybkRvQWFTd1JNbERUZERTNGlxS3FkWkpENmVpOFpRRzJKMkFaNlBwT2ZNUUJmYU9BVjdpTnRCMFVBYnVIVkVSSWZJU1JBV28xSTNlK2xVQ0NFQWJ5d3pEenVQSXNGSDh0V1dieHY1eEFRR3NhU0FiYlNMaG5Bd3pxVEFVS3JOem1xS255dlpnRFFKMGNJaG81N3NtemZkUGVhb0o3LzNBbkt1aFV5UkZjWlFGb0JnZGdnOFN1RW44d1cxenpHOVM1QWl3RzI0SGd1cDRBb0ozVnlKMW1TK2lONnJ6R0F0RDJoNC9EdHd4TDBjWU1CS0pJNlJhR2FrcGdqRndCUWg2RUt1NHFIZVc3TWpiaTFCODhWUUl6UU13N000RDhwNFNTVzZqSVpRQmNTQnNIVGprcmFqdEF1R2NCZXFNMEFqVFFvOEpvQ3Bta3hnSHhnQVQ3Vi9JVE95NzRBaVBaYk1VQUFPZlNDUXI1bFVhQkNZcUFsdUZGVGFkcUhKQzQzMFVFZmFKOVIvNk9nWGltbm5EcHNOYWtYVjN2NXkreTJTSFlJM3o0UVZCK1hFc0NTRWpEWGdSSGNaQklIQjJTR1BJL0MyL2dxWHdROGh2YU5RVytpK1haUmlSMnhkUEQzYzZ4YnRUcVJmVFc2ZW8zUjM2SUc5c2tBQTdZTEJxQUVTZ2FnalJVNm9NeFFSYXZEcmhvTUFMVSt3YWVubzM4SWVZa0FqSm9Ca2hiVWNMQ2ErMU5mQzUwQlU3cnBNeDJSQnpVa2N0c0dMeVFBdDVrT215Mm85MnlKSXdiSkFJVGVoNk1uVG03M0pnTkU0bkNXcGtCa3p2cUtMMEFYWnpMQVVDdGhwUVNEeENNV0hpVDFlWTdQY3JVd2Rub0tublFraGI2L3ZvbGI0elFUNDZrRktkWGd0T3dTZVNheWtBaXJZekpBUDFxYkFTaUJrZ0hvcVJZZGNHMDZJRDByemdCb0ttZWNQdktVaXdWZzMyYUFIRkl2UDFld0hkNlhrL1REMnFGUHdCblRkRkV0SmxPVTJBQzBLM2pNa0ZNc0drcVNzR0dxNWNuWGVtRk56c1RoeThpWHVMckdBRkNkd1FDd2hYZFM0dEdQWktIVkRPdjFGSlRUUUc1aUdtSmxpQ0J0U0dCWm54cHA4YndMVVBseVgzVHBDc1Vic1FnSU5mOEM4dHBpQU5zMXBqRG1yazZHeStEem1peWhLQkhyQk9vNytIUjJuQVVmODlIS2xEZVhnSHVPaGo3VDJJNWh1YlcxZHQ0VCtqT25YZ29BR29GcWhMdTB6RWNVMUt2bFZMNU1tWXVtSVBXdDN1ejJHaFNUNFZVR01JOEZvYVhuYnBtaEk5RFFoL2tjOHR6bXlMZTd4RHBxWXVZQ29HUUxlbXI3TUZoRDVsZTZaSURzK2hTNXFmTVo1dDMzYWdtSWRtZ3pBQ25uSCtWMkhiRUF3ZTdXbzJUa0kweEVZeTNXaHhEdHo1V01Dd0I4bW0wbE1IZnFwaEpSOWNhcjFaUFUyc3BUcEhpdXdpQnlwcjZMOUVMNGxNcVE3M0tLSXVPWGhxRFhUTFNldlpXNE9LbTJDd1RWTFFiUUtNOVAyc0lyTlpKWkhhVkhxUU02SXo5MVlSSzFlZnRLTEhvYWZKeDJMQlYwL0FVREhFeVpDS1d4VUFMWkxoa0FqODhOV1ZoMnNXd0FQa25KblRvQVlDdXMwQWJxME5TQjV6SmtwMklBS24zRmp1eVRRZ21PZ3BvQndvRWNsVWMyWVRmdzVJMi9ZZ0J0S0RUUE5CdXRtNmNYTkFubGkvMnlwUmxrWkFndzhTOC9ZNEMrSVo1YkRLQXlrdWdNS3h2RS9HSmxycVFQVndIR250UFlDdGFGL3RiNURRYUFLRmRWUEZTeGNodUlkb1VCaHRCUG1wb0JFSzdNZjlvTVFMdUxjZkt5dlFDZ3ZiYXNyelFFcFpldzd3M3FTWXNCSW9RRTlLOEV3R3BvWU4xZkxnSHplVkhCYXRwMkJ0SHpXVEVBMWYzOXNyMDNDRHFxYi84bUE4QmowYU5Tc21KU08xNllPZ3lFcEMxczlJblJGa1NxSWU3WjZla0RwTzNYU3dDN1dLYVgxcmpxZmFWZFpRQ2pYc2tBTytDTjFKWUdRTktneFFDeHEvVUVCSk5JRTFHWVZNdEpSMU53N2R4SkJuZkprRHJEQTBwZGdQNldVZGVOZllUcnQ1VEFLMGs1ZG1VRnE5eGllTHZpK01XR1A2cHZIYUtsU1ZCNThUTHZjV1FKbzkwQjBkZUo1SmNMS1FKWU1oOXBnVzBCS0l4RU1BTlFneTRaNE9QakR4bUF3cGhxd0cxVGNESUFBV25jMjFyT01OTUJzUlVrb3J4Z2dHZTNCTk1teXh2MFZ0RXFndEl5NXZhdjBybERFd1UweDVJQkVLeUltRWI3WUtvTk5BSkpxdVdMYmFEN21wS21aUjc3aTRDUU12UWpLU3dtUDJlQUtnQWxHSUI1TXd1UkhBd2dscHUwQXpCekZwTlVJeXFrbGh6QW1xVkpWSVo1dlVoRDRDeURMd0k1KytzbGdGMllqYUVHL0E0RDJBVDJNQ2RtRFlRWEVPNEE1cFFvR1FCR2VlNW5JeTFRZThTS1NkY1VxSmhsNGR5SkJJUzZYbFVNZ0xoK0ZPU3EwM1RhQmpxOWN4L2hmTkg0aHpveFYxU3lTTlI4dG1TQWtzS28yVVNVYURZamk5RU1RSzNFd1NRRFlCeWNBY29sYjRsVjdHTHBpS2dvbUU5NmhSdmxuVmlxTEtBZmdYTy9aZ0M2ZzIxQitRMTM4Q0pkVk00QTc2cVh3Z3RvWW1Cb1dXWDRDRi9UWGVkTHBhNHRNMjk0eDJaUkVnbjY5SUs2bXkvVER1TkdQSzhRQkJUQnUvWmRoSnl5ak11Y0xaT2psd1VUdlpiTlBsSHoyUnluMkNrcC9JTUM1L2t5Q0hXSkdIc0F0UmpmWXlzNThhR2xLWGdVM2s4Uyt5b0RjQUdnRXpEZGdtVUFwbCtTMVZaK2d3R2VTelhndHhpQXRnaWNGS21hNVRRaEQrMW8wMGhZQ1FLWldYNVIybGlxbGd3UXUzcjZ4N0Z0Wkl5Nnd3N1RGOERRSjZadlJ5azFTZ0JBM2dlUm52UGJBYUpzV1V1MHlHREovV2dSNHpncS9zUDBBS21Ud21oVzlDUmJGbTlCdkxRallxQ2lKajYwWUFCcGRmekRWUWJRbDRKbVNDY2c2Mjh6Yk1yaWQzT0daSTNhb0haQ3FWdGRSczRGOHowVDNac013T3ZLNG9XbXhZVzFpWk5vdmRLWnhFb0V0RDg2Z2Z6UDJOY1B2T1crcVpwMGlZbzVIczI1d3h5VWtSUms0MUl2cG8xOExDQjVSU0V2SDlBdkFrU2pPV1pxVmhkTVJPRWpPYnNWc09laHppUTFLWHhDMng4ZEpab055OGd4SXJjZjBXcDhhREpBSTgwTFlwTmZyekdBdTVkODdmZU5sSUU4RVNSY3poQ3F4TWtBZzRSU3Q3dUFPL1RENVUzd2R4N0k0b1U2OUM0V1l4S2RPOXJYc1djUVFPNEV5ai9mR0xGVE4vWm5qRnlpWXF3SW9UVENEb2sxeEk2b0tIOGp5SUZ2S0dYZlpTay9NNkZySTBDVUxXcUpubG9GRTQvQVJyR3dYRGFDSFVocVFvMElSSnJ0czRoYWtCdjNUc1pvNDBPVEFiamlSUXdrOVAxckRCRDIzajZjdDB4ZHg4aEdGS2l0WjRqWHFQMHFTRUVvZGJ0TDUyY2NMbStDdi9OQUZpLzB2ekhEWWhJTjhZOVpMUnhBVGdLOUZBQmZLblZzYVR1dEoxMFdlMlVWMHoxaGg4UWFuaEpCQ3JzckczZ2xpM2tDMkNoTm9Tc0FpSHJ6SW1sMXdjUVpvSFVuaHlkbW84MEhwQ2FCODQ5bFdibXhlUEltbDRaTGZPamQrR1lVTkVxSVpoMmtJWW1XcXI0c0FEbHQzZW16YjgrUS9kRjBvaUJGUXFsYlhib2hpY1BsVGZDM0h5aUxGK0p2RjRzeGlaNkl2RmE1amZ3WWdlcXRBTDRjTGJiMG5zU2tpMTE5d0xLdGppOWhoNG8xM0l5Sld3cWtrL1VvNFlpQzR6dzBLVHoyeW9oMWU1VC94c3ZzVmdWd24yaFJsQmNGWnRFNUlER3VML25IdEt6ZCtwYXlKNVhESy9qUXUvRnRITVFQMzhxV21FSTZPRHh4RzlMcmxkcCtlNFpZYmN0dktDSWtSVUtwOTFXWHZINGVMbTh5TGErTDRvWGwzMENZemppSnJFNHZjR3RmZU95N0UyaVpmd3FsS0MvcjZXVXRmbGRsUmpFekFaQWtOQ3IveUl2WWd3Y0JpYWhjRWUrUVJVU1hJUXNDN2Jvc3l5UVdhRkYwNXY4eTViSFh0STQvd2xTaFJDeTBqMnA3Mk1hSDNpMHZrVkQzUmVIbHNoWWlZZHVKdFpKWkJ1UnBBdVd3Y2lXT2VxeUNSTG9pODBHU1lvbDFhN2tzdXhKSnFpZm5UUXBndGdGRzBZaFQ0NVJoY2VVQ2NiMjBRdUNiQVAxdWVCS3hpbzV2eXhhMTJERmxTNFE0Y2FKWUN4SUFkMy8vRm53WjBCbERpTXFQeEU4V3JNOXlvbUJZYWdNSitpM0xKSTRMdENnNjhiOHU3bkpYcjJHNS9DT05sUmFVN2ZrM0tnTlJHeDk2Tjd1QmhXVFo1cUlhYWhSckQ2Q2ZiYk01R280VVI3SG1CRlZqRG1JY2M3SVloaDQvT08wZUhWWnRoNHVUSFdpTUtlYXpLcWVYM0RxclFIUHFzL1FvYmVBczBVNndGVjRQNjIwVW1rYjVXc29QcnBVc0tPcEttSTBQNlpZQU9ORVBuaExqNXRBWlBTU2JiWjVpanFGYzZTaUNkVjhSKzRGQVpXZVpSQml3QWkzcXVPM0V3WVZkVDhOeU8xR3hnRHRiRFhuU1NKWittZm4zSWkwV0dXQi9EUTJOclNNelZtUTk1S1hWT0E5c0lEVDhsSWVvaDUyMHR6SzBtSU02M2NnMGIxQnh2S1MvMDBaL2dJUFF5R0hXaFp2c0FVdjJXZlhtMUh2am5HUUNKWmxlcVZlYkdxWHprdXdkRmYzMzlJOTdxWG1qOVd5Y2dIZzN4TnBzbHpOWlpqVG9ObUVCQ3RUZERvemJFRE1SUFYwbVVlalNwQis2cm9waWd0UENJaEJwb3FveWlRVmFkTkxKLzVXalJhNHJodVV5RXhsMnNBd3NuSVFKc29hU0NrS21aZ0F2ejR4bWNoS0pGMEJtNkpaUlJCWTB6dUxQS3NMeHkvSGcrKzlhK2dOVEh6V1pXWndRSm1NaXJKK2ROa29OekJXaHo5SFhHSFNaMUFFbDVRNUVucEo2a1l6RTY4RU9ZMmVkM1ZxUWxEc0ZaSDdhZTBWUlVvclBQWGxDRzJCRXJhRG94c09wc3N5b0VBbm1CcGFnc1J5bUVia0I2UXYxZUdWcFZBWURjK3FsTFVMMTZTcmpsUnIvYU5hNGp6S0o2ZkhERWZIRzVQK0NmRkRFYWRZK3c4V0piUytZeHVMUCtMOWdpd1NUSTl5NGNnZmN5YTROZW9mUWlETXFxSzlkU0N5RzlZMDJwQ3JsMkQ1ME5meHE2My9JOHhKenNPdVRSYmpFRU5aRHA0MU9EOGFDZkJkYXBxYzhkMHJLWXFlOVhia01od0dmc3RDT29oNXNwOVU5V3BWRmEyWlJVUlNVT2pNOEJDbXBtQlFuQzRwQ1FWTEVJbDIwbUxrRkRGOEkyTUs0cmRlb3ZORmpJaVc2OWQzZXRkYXNTNHRXenJ1bThjcUJ6SzFwVTVRNStaaHoycUFXeEJjNUNNTGliZ2ROWUZya09SN0dyT1VNZUc2a2s2akMzMDlrQUdZZmZBS1JNS05ZQ0R3VDdpd0pEY1ZjQ1RnRjVqSjNheXpNMjlvQk1rK1F6OEhPZ0pQRkZyK3pKaFlsYlVZcm5TczZ1cnBUOW4wbUpnSmtQUE9RclZoSGFjUWM4WnFiemFQUm94NnNFTFhkblVWclFHb2o2dHhycEhRVFJNN2FsUWdiMHkvd2tHcVdHVVdxdXpJYXd3aVlEQ0RUeTZLaCtzZ1J2SWdBVVI1dEZpcUUyMWt2RitKM1NnWm9XTWNvOG82akF0bW5QaVpqUmNjWnJEWFFmeGpTckVLRlhKSlFoTWdkUk4rbjhRcXJoLzk3cDJNRXdlbWF5TmowcGllaEpIc3dqc0pDa0dZQnFOSW5ScklFTTJBdUsvTU43VnRSazNrMzUwckZ0TEROWExGM2xwcHgwRUF3NFI2c1JrQU5CanFKbHladE1LczR2VElsb1J6MmVyRHdyOVhkY3k5YVExUURLNG9pWmlSQ1JDTXRwZHczQzRwNnpZSXNNN3A5L1JrREtNVUJTcEVhdnZnRHRCYlo3QURWQm5rWEdaaE9CcEJYb0E0UVpSSTdoYmV5c1Fwa0h5UXFRU29iNXVFODlDdGNCc3VGeTFQdFgzaWhJYlRCM3d6aFIvU0dXd0l4c3FKWklDczI2TVkwUUxKR25pMWZCWFNUM2NDa21ZZmVPU21STEFGY2hSMUJZY0NOeENjK0IwRlNRODZ6OEU1anRPblA5UWZ1YUJueXNrNkRiWkM1NVBXRnZBdDEyalVIKzRNME5iKzdVbzhlOXV6dW9CdVlKMDVHUnp5QlZKNERzNnhkT1Voc2hQWWllWGhSWnZUK3B3elFETTRvVThsc3FrUVY1ZEd5TW1KVTF1eVVxWDg2eUZQQjJtMll6U2dUbzdIT3EzVmtIaThLbUI3S2dJeXM0SlkxWkUrTThFZUF0OGRjcVFBQUEyQ01HcEVoUWlRRDRETzhlaVVTMVpBVkpsY005TTIzWmpRVTNkV09EWVVpaHJla3E5eG03b0J6OEVEVW1lakU1c25YTkxLV252bmdWSnRhamt4bkFDYUVBMk1MdFZqWWhuOWtySTRlQnRreTBGckp4KzZtRjlHQVNXcFFhTmZXbEZHdE1XRS9XUVd1cS96M1N3WkF6dnhobHlWYXBhTjlWS1lZYjRobnh2V1ovR3RyTnBlaTdOcGFvK1htUURzb1VRbFVUWjg4aUlwSlhkWVFockJnc1JFVkZ5WCtqVHQ5TEFIS0FCaTZ6SXI5WXFrQVZXRXBYNVNKbmZtalpBQS9CRHRVRlN3VGM1QTFtWTFWd1JiV0xWTUxBTG5QUHVXMkozMHhCdkNVa0pHOUdvVnRFRUV1MUp0VHlBRng3VVZyVkN4Uzdocmpnclc2aWZCQ3I4RmNob0hhdmcvVkhvVzVGaVVENlAwRzhqeUxNZnNwQStBNnZlVFhSMnNHTUVFSGxkcTlDcGpOWG9FTVJhRUhPclZaQ0tLSXlrb0I0QUU4UmFXaU42YXhLaFFBdXo5REFzZ0Fjdk1NWGtlNWFNMWRvV1FwaWpUM3J6SkFsbk8vaHlDT2NEbHVRR0lPcmhjaFdUMVVDaFFUbGpIRko3SVI3N1NoRktBbmhhV2pWd1NOZ2NTc1FHQXJYbGQ3V1Ewd2daVlJ2TGpFMmpqNFFRV0VaOVpYdGtjdXRiazBad0RweGYxRVRWUGVzSDNKL3drRG1KVUt4bUY2NjVqbTMyb0xOUWgwNy9VZHRYWHlxQ3lVbmNpdzNGd0RsR0ZNV0lCVlFnRUlxNjV2QTlWMEFMMGpzbUpqM2RQa0tMRldRV2VERjcxZHNrRVBVVDBnSGFxQTJVZUhWcDJSQ3Q3VmtyS2lzUUEyQXlUOWlpUE1sTDlZNEg5d0g0K1c4SUJqWmhpNHJFTHhET3JXM1ExYm91MmNkZWptY0NDK0RJUXBKUkZrcEwxUUxoR3AzY3Rkd045bkFGUTBNOGNpelJ0TExsYWk4cUFvdEtMdGZGbVBGVUQzSGNVYUVGbjIrNDFYQ0NJODBWU1pqclhTRVBTbUFuK2xJOHVzMkl5NFdQZENXWWthQkpjWiszWDNETzlEaHROZUM1a2ZhQVc5ZVlRYlltSkJSZ2tSNEUrTVI0RUJqQWpBOHRoOVdPTmVnUE1HRWd1ckZoK1RZVVhsMnpub2hPMlNBY0xOOFJLeUNwalN4aVdBYlhKVUdjSlRyWXI1L3hFRDdHRmpWN09qNVptYkdlRlVuRnZDZzBNelozNTJtTklDMURZdnRNQ01RMXl3UU1QU2cwVXRSOHE2dDg3WUpUQUFuRDFNMHdQN0YrcEFxb1VrcUFKTzlCREVpN0pOTUJGRVFQM0FRVFAxMUZRQjBJdkx5bExObHZTUWRicklBSE5weXJEYVhBS2dpQktCM3g4TGJ6OW5BSFpIYXpNQTdiTlJpaDZGTEFBdVNzQ3htV09aTEFiejcvK0tBUmdzQkhNWnpDaGpGK2NMRktPT1daMlpDa0Q3WHJFUHpCcGhVVG1PREtDYUUxdFRNWUNxMERsOFFrYnU1UXVJQ0JlRmExVjdZT2lESDkxdEtTVnNMaWtqQWdCRmRHc0dHREFmV0t0U3diblVBVnpzV0czS09WRlowWGFYUzBCN1pXaUsyaHRiczVlN0RqQU1lMVBvQzZKbFpMWFkrMGlsM2RFcGFMMEpUNFZ1K2RjWTRMVEp0UmJCdnI0UkJHMDZBelV0Y1ZiUE1peDNFTHM3VFBlb0VSWXJnRE5BUDFyTkFLMHFvT093MDdjWjRPTWFBNWlOd1p4cXpJMWFBR2Z6MW9PR05rdGNWdDBRU21jd3dPVXVnSXNMeTFzNlNLekRobFU1OWJyaEpGTjZSRGZ1SStxcDVlK0xyZDFLT21Odmw0dVZna0djQWJKWEM3b0dBenh4SHlsc09qLzhQUVpnOFhsZjZHZStFZnlrT2RpVWNxOHc2YWhtcW5jVURiNEdxTGdqQnRxZEY5bk9KUU5jeE9yU1UvZDdESkFaeW4wOUdCYlErUVRacUFESXFmbE9tbHYxSFptUnZEdmp0R283UUlYV0dtR2JDWnJxam5PSEREU1ExTnhVd003Q2ljSUpwRHYranBvUmJlMEw2OEJnVjlnQjdsbWxjRzBKdzVneFR2M3JBeTRNUFFkeFpkMFV6ZkR4RnhtQW54bnVPcXIwdHZTQXNiMktOZ1BPcFltd0VPSnlxYVFwb0N5Y01TTzhhMVNuNktRU2VKVUJ6TUgzOEhzTU1LME13NmdUVkNiUGVIUm9uQXFBYzgvbFVwcTVsY1R5dXA2MmcweVVER0NSWDFsQzdueFdxNEZRUkttMzYxVVdIMVN0S3NCV1U5YXpzd3BWYytjK0cxVkZoS0VhVlZFdis3eW1MYkh2TXNTeG5ZZktRR3pKZDJsZzdoOStud0VXUEZyYVYwSWlFd1JnRnJjc002Y0tPVXNRTmcwM2daem05QTFQRU1Qc2xWYVlFU1RMMEJ3WndKQ05QdG5qRFFhQVQvL3hOeGtnTXBUajhlMFEwaXovS21PSEZjQ21abUFtWVFlZzdZYm1Xd1pKbUMvQTR6M056dzFEdTZiVlVUdnVYUDF1dFBqWUhtN04wcytIaGlxUkxaUkt2NFYxbjhNVDRkV29EaDRFemExU0gxNGZVYnVUV2VRT1RlMGlndFpFODdZcXZVbGlRUGNDNEdITzNuWVZUVWpqdEQ1NkxJZk92TWV3dVp1eHB3QUx5RFFwcWlyT2lvekpyMFp1VmxvQnZZdkNHZUtUanhDbWJQQ0xvNEwwRlFaQVVOZnZNZ0QxQy82cUdlQXhDMENyYVZJTitIT2Jta0dDL2hweVdNc3hyKzNqQWphaEkwTXdMTXNqNjlRL29FcjlvQUgxbEZTd0JKSWtJRlJVZlZQQVBDdmNBQ3dlM2R4VDF0V28zTjIwaHQ5WFRZSmtjSE1IcjBzbnNieGtPcG05ZExqeUlOTVdEd253a0tkNGZIclcwYVUwVnE1b2xmUGJ6OUxyaHZnNmRMRElGTW1NZDQyNks1N20vNmtzTGJXdkMyZXd5a09kckw4TUM3OWtnSy92UDJXQWoyc004UG9XSmVDQkZNMHFVN295Z1A3YU5ZZVBISnZzTURQTXM0VkJCa3NkYWFiVWd5KzN4eWxSMWtUSXNsVlI0YVluTGJxeGhmSnFWRHNQZ2piWDhRaTEzRks3WklVVWkrUHBkQmttZ3RGbktFT1VEZ2VyMUpVM0dQREZTc1owayt1VlJDMjJ5dmtKb2RMdkRteEFBUlo0ZWZONFFFeHpyNXFRYWY2enRKUUhSNWFsTkxMMkFndHZHUDJ2TThDUFAyS0E3WFVHSU1LRm1TUDdOZ2NoMjdpa3c1UEptZHkzRENScFoycUJZYU9HRWRBN25SR3BKN1lLVG9tcUtvcFhmZHZ2ZzM3YXV0NDlLNnRSMGZGeVFzaEp4QlE1ZEdBRzZjbHlPN3AwSWxCTUhoZUJaaXd6OFk1SFZaVTNCT0ZINHNGUkg0RXlHVUpaeDlZdzdpVWlieFJaVU95eWhjd2UvdXdCVzZ3d3hEK001SStJaGtYaGpBanh3ZnZ5b2NRUjdWazg4dmNZNFBFbUF3akJ3L1JhNlFCbjIzTjdnZ2t6M2JMSzFNWnQwK3VkeStFQmFuOUdKdDBtRzdVSmorS1NKdlFCOWZBbjZ5T1ZkWkdpNnR1M1Y3alplaldybDZxYWxVMCtCa0V6Zk5Cb0dOQUJDMFgwZ2xzeS9GTWxUQmxxeW5ESlRWbThKQXFEMlIrSThVYkFNU1loaFRFbVk1U1hZcGtjaHg5T28wSUhxVXRNQU1EblJBQkZwTHJoL3BUYUNPdnl3a1RPaGd3Mm5wallBZjk4SzM2UjVXTi9pd0h5UjgwQTFKSTk5bXdKR0FtMksydXp1bm1oeHg1RnFDWFBNWXZYU3VaeVZBWHNESmdpcks2bkVWbkdHTWZKT21OT3ZXZlNOS04zdGJIcW16U2pGQlVnR0t1OG1sVVVibnJoZXNnQVlxT2hVeFVORWJEV0k5Tk43Z25LUkxDNU5pZFJYYTlJeitIZlh1d0lIRUNFU0M3TEdWTnJPekErSzg2SFlDOGsvU3gvUUhSQXBDVWlobkZidVJXUUh4YTl5aHd2aWw1MSt2OHZHU0NEVnNxTnF5aHJaZkpLMUcrQVVHV3NyYjZ3UnJOTEoyZXlpR2xHWExLaVR2NEhHVTgvbVlQam9wYVkxV2NTZ1lkSTlLeHdzd0dOTmxxTWF4TWpyVFRhTUZvOFFYU3NrSUxxaWs1TE5CQ1VMYWZiSHZGeUlEM29JajhUMFZVVUJBT2hMTG9sWEwwcGhtY1V5bXpzWmtVMVNodElIaDdZVStramVYVjZ4L3llR2J3SzFKNUE1M0IvNjVraFBoWk8wK3RoRTJNR0lKQWZCY1QvQWdQTUdXYUdlRXNZbmVhZVZ4eDJBbXBFVDE1bFNtZWdvU2FmWWs3ckQ0MjVoaDN5RWd5THZXbWlXd1BTTTdXcDVjMytFc3J6T0VqR0V6aWZnQmRoYkRzbUc0R1NXQzdjRlR2VEJySGFCbVZhTVMzK3BEb1FzallMZ3BGUWlHNWhUSXR2eHEzVUhvUnkyWjR0TWhVblVkOG9JcU5ubU1TKzJ3dUZrMXJ0K041TlA2TXFwcnpYTUFFK0MybDdZVzZBQXBFY1FPai8rd3h3S09NQjZPMWp2WHNtMlR2dEdYQzVZNUxPSEpLbkI0eStJVVhCQVpnYUxvZnhRK21QT1hBNTdrSXcxbmdMNll6VVNJbDh6YlY0eGdVNmlYVEtBb2Jzd2lLZ1hkRGdHRW9CQkNWL0c0ajNraE5aVHMvZFg3UGNrT3NJdklmNHNvclBUalVhR3FJeUtrS2NJSlNqbWVFQ2dydkRIY2Z6TUE1c29FeUh2UWZUR3orUW40M3hqR0xuT1BjWVcwbjYwYUJwbWxtVTNJWUI0TC8vQmYyREFlYnpGZ09FT1NPaFJja0E3dTJMZXZkRVJtTUNtNFlHN2d5aHFBQS8zWDJ3L3Q0c3dBaEU1RG1rZVV3MGJBMkc5V1VPalZvM0liaEV2bWEvbHpaTUlyblNWeUIxMENNblFUT3lPdlFzdTg3ZjlMZTNFek9Bb2JmNFBwVzBWSHU1N2FjNXNhajV6bU5wYWxRUUxWa0RrSUpvQTVvNzFLem4wQUVWMnp6QUdHQzMrRHJGR0VSak0xd054WU9tVERySHJSV2g5ZzAyMmlZQldEeGU2WDhIQy9Rb3JVeGdnRHBmUlNZa29UZTg0N1hyTWJKYm1CYXRwQXJWYm1ub213RjJRbUZzdVhOMC9wdDJwTlRtV2wzV0lWdWloVVptNmxFVTRjdXE2WVk2SXZJMSs3MjRLUXZ2RUpqRklzYmN5aThCM0VmZzR5b0NMUENSK1J0QzlFSWJUUWxuaE1ScE9WT284cTRiTSs4eXVvVnBKckVmWGcrS3FJcHNkSVVpT3FkUmF4YWkyM3ArSUZFQTlISmxlalBkMmtZQ2paMTZrbUNHTHd2Zm14VkZOOUI2eEp4QXN2NEwrY0VBbThLRWNjKzBBSFcrQ2d5eVIwN3dCMGViME1BMzFxVzNsWlJ5blNBVHQwNGsvY2RwcWZKcWxJazJSRTIvWXFkdGUrOG93bWMwUW1waXl1MW4wQzBzY203OGdjVUFKalU1eWN1WU85M1FBNWdCOHlGNVR0ZTFwL1BoSXRqZWo0YU93NFN6bXlzMmtrVnZmU2dZb0lxTjBmUTB4WmxzaktsMEw1UDVIUVlyY2FIUi9jZTByQ3hmOU80eGxZanhkaVZQcUMwQms0d3A1d2V1QUxZd3NleUpTb29FWVdoQzdEUmhDRVdRektQT1Z4RUpTZlFINjIyeWRqMnNqTnpiakZWV2g1WnNHRU5BVEttSGpRRXROS1JzUGc5a2ZJeDYwdExwdGpaeUlJUzJCNXYwaEVhdzNyOUJ0alB5WC92Y0pqK05BdWZObkZtYkVkWnVRSkE1NW93RnZTZ29nWVdvY3YvaVlSUmtnTFpGeWd0R2lFYUZFOGRYR0tCL2xRR3N1dUM2bjVwVUxBRnpBb01pb25lZ2RTU2FBa0RBaWoxckp1L0FKR1RlOGk0amFVRnQwQnhrcHVuUkJONlVQbHVuOEQ4bEEzeWZZbGVKeVllOEFOQzVjbmZqaXBiK3dCSDhlTWRHS3lzRVE4N0hQbmtEYUxCaGczRUp5dEV4YWVrMjdOcExrdEh3SkZheUNwYUxzTXRDNzRYMW1NR1J1cFpaYXY4TmpQMllLTnFkYXkxd09aN0NrdDdpaFpBTjJYQWpJRUhPY05WM2FaSGxWbEVLeW90Ukkxc1pDdEQwS0p3anUxdWJBZVlGQTFnWW5PVlJkNkZ1U1ExWCtNOVRYbkVGMGVKR1o2d0RrWURQM3dWK0MwRFJNY0VIcnJqSlQ4eWY3ZFpObUNodnorMWt3dm1LMURESkFMWUJmbWNiNHdURGRFYW5Kam1Zb20xbXRGWFJsQUhUQ09hcjdWamZ3UUo3RnF0QVZnamxubnU4ak14dFl4LzRlK0EyZ1U1dU9ac0JxblRYRE1ZSG5obXVtUjRDdDVpeitNYlcrSVNKcGRhRGh2Q29kRFN1cVFPNTlGVnpKQ09EUGU1eDNuY0dnSXRYS2VGWmZWMExxbEswOGpveGRPby91ZFppcGdJemxBeVEybmM2aE5WYlJSRURrcUYxYXdZQVVSVzVCb2loaVhpK0N3WW5BRmZtYWdJWHVpWU1pNlhKVUorbjBLQmNFeU41UXdDZ2ljREhxcHhGMlhVUlVGRzlyQXpLMGtTTjh5dzA5NnIva2Fkc0JnT1VxektDZFkrL3Y0TDhxaFpTYWRoQS9PTTdrUVNXVmlzQThOUmZRQ3E2eC8xdzhLelpvRFhtdXNucFlUaDJsZllENVlyTUM2b3NBZmR6azlZS1ZBMWQwMENGZ0JyNTdRd1E4WmNKcDBGUDJib1JIYWxwYUp0Rkw3VHRnT0dTQWVReGE0am1Dd2JBc3FTL3N1STRjNTV4Q1NCUlhXVlpXUVVsMThpOG5BSk5hYW00YmN5R29SWkxTdHJFNlovMlJvaU5XY0crUWdBa0ErU2VGMHNyeWlUcjdDME15bkJPSE9tR2hMdUtwcHdIT24xTmZNTU1hOG9BbmpwMjhuYzdwcUxacHd4SHFPckFlcU1HYVVXbWRJZDBNR0Nra1ZuTW5xSmVFK1FBZFNPdWhPdUZCOFlhQXlnN1lHbE9hNFU1RU1rQWpIc01Ca2hBVForMHRKN2VPdjRyQVpzYVhsQW9jM01vQkhJMEdJQVpjbTBYZ0VkNFVqcTZsREV4dEpVNXozSnRmTEpOeTRnNFo5ZklNTGxodDI0cFVpZFNPMm4rZlZRZlFXamVSMGhscEdzUytwc0FZSXZNbjI2eHNGU0hrUjZHM1pycDJyWHU3a2crd295NWVFRWJLL2ptMUZCdkxFRHlQeWcyZUtUaVBFSnNPcnNWY3JsMk90aFkrcVR0OTNRYlc4aE82VGw3VHhZa1EyTDVmZzJnWHZjOUtuSnpqUUVZQXJSSUJyQzR4MUV3QU5Sc1BBdDI3YXpoczRpR0p6TEVSRDFZbWVGWFZHOGlycm03bDhtYnNXTXVwZ0diaXEycGs2ektlWlpFOWZ3VmhHdERub2VXOXNXdFZIVEJQUWhxaytaZTYxN25MUEpXNms5cDZRTXFHRUN1alQwdmErbW90VWE3ZFZoZ1VBYlR5bzBkcGF1YktYUG5nQU80WTFyRFV6dXh4R29iN3UwQU1sV2xQREE4TW1OVStDNDBXUUtvRmpubXBUY1hUeFhhdTFYUGU2eTZDMzVqemljRDZPTGVSTmtLUitKWERFRHgzb3NsWUt6dnRrMEdlR2Rkang3K2dScllEcVhsTnREVkZZTE5MWkI3eFdsTis1N0VGYU1qN0xkYkJqc1d4aWtsbWJSbG1mTnNHVVQxRERaRThZVkdoc2t0QktVeEpidEliZnhyMDF4T1FwTS9wU2tQL01EZmJmb2pRd2dwYUN1bVplVkJ0dzV3cjJGOHFYVFQ3clhXVGJEU24wcEs1S21mSzNhZjVZZTV0d1BJVkNPdFltT0VKRFlTQkNLOUZPK1dYV1hYcUlwa3oySzVjR0RHckNkcnRsb1YzcEVEVnFBVWVsZVVpdGFRM1o0aDZUSWdUeEdpWkFBWjY1SUJ3SmZnSW5RUi9sR0gwdUkxSUJRcG5XSGhaL0ZzWFJNM2J1R255VitabG50cHdONUxId0lTU1Vxanc1OEtlaEtWZVZlNGw2WkdocnhIY09RckIxUmRwSGJRSEVSSEE4bi84dzliK29DaVlRdFh4UFhBR2pjN2JiTGI1aUN5dnZpY1V3N0lWQWFzR1Eyc3Iwd043dVdZWEdVQThzdVIzQmlKSkpZbS83RFRKc3BPNkkrQ1M5aW5LKzlvSFY2aWNjeVVic1J1SE9OTTdIR0RWY0d4RVE0N2JPWjZNY0x0bURhajMzaEJUaEZuTlFORWtHcm00R2lGMG5KT2s2MURPaU5mWDZSc1ZTS25keSs5Z1JoUnV2b3h2MGd5bThpNS8wcWlNaGhnRXpQK3VOZDJoQkFYY3NyVng2S0wxUDRuU0s1TnpzTmZRbkw3aWI5Si8yem1md3dHd01lWTdZY3FxcW00NkZZeU1LUHpRTFV2Q0Y3c2pvbWZRcm4xd1RtRDVBWTk2MXdQTXNzMTBrSWNQcVZ6YmZHUUJJTWdiTkJZZ3FYdWxNTjJsdHJGdDRGcmVTRmluTEVONU9adzBNU21ueUFpQkE4eUU3dnRLUmJTc1REbFBSaWdId3hBbUdnbmttTFdvYlNjMDF6WVFqcnZxWUFyaWF2Z08yNi9wdHhHeTBFUWRiUHhXU3cwS3lleWRpZFJxYlJSYlJPNjV1dzJtcmE3U0czOEMxY2ZpQjRrMTUvUzhhODArb0N5TWRFdEdXQVltam03VnpBb2U5WVhzeXFEQTFqamg4QksxZk9GMmhBRHpicmMrRUlzV1BDVys4YzZTak9ac21mTExFSTRtTm8rNTF3cHVERThLS3JZa2xTd1lMVkJwYytXMTRjUjBPanFOY1JHNk1zd3EwL2JxaUJmNGptK1p4c3FiQ3dZSGpEUmJpUlNqRkRhbk5PeHBYWUtNN1JneW1tTmpHalcwSkdTR3o3UTBNUVJqdWNUZVcrdEZ1UmNJYjVyZVk2L2JVYXpoMTFWK3hkUy9sOXYvMFg3Ri8rWkM1RDBaL09zbjJBQWwzV1BHRE5yVVh4Z1FybU9LTThGSzMzREpQZit3cTJlaW9GRksyWEdXbkhWb1JqY3YzSXBieXg2MjMwWm1qRmNiSjlaTVpjYnd5ai95YjA4TVB5c0xrZm5ZMmZIZmx6S2tFL3NwMGVsWFZFL0pITjhVMkhqejh5R21Va3hsOWRpZG5ScXBuVG1Ca3Y5SEpqV1h6NXhaeVEwSmJlYVJGTVI1eXlPaVp6ZFNWUW83aDY1azJzNC9maVU2VlZYMlpUT1JuZVMvSC8rNTMvUTh6OUIvbXdjV0t2MHF2dmR0RlZ6QjR6R21XTWVTd1hVZkpEK2pJTUEvYmtNRkF3Z3Z5Z0FNS3FBaW5BcDczdVFlQ0ExRkxmWWd3NUEyeDBhcmF4a1ZLVlpKRGt4UDhZdys1bUM3TlV5K3lFaEl6MExwR3prcjRxUURJVGtSamJNdDB5S3FTYnNxbUdTZjVYUytmOG43MnhiNGdpQ0lCd1NBU0VTQ0w3bElCd1lEd0luOS8vL1hxYjdxYnFhMmZzVVJCQ3RqWHR1YVFDczdkbCttOTRTcUIzd1BXWk44TFh2cnlKS1JOUkYwOFVUUHk2R0RJMmsrU2JydVNHVGhna1ZSSFBoTkNRL0RmUjN5TDhnZjJydEhrMVdFbnFKZzhsQjF2UC9tVGU5MWwrNGE2UjVBdHhOZy9NRzFTNUFoUWUxMm51bVRMK0xWQTRaQ2IzYSszM3JGK2xpN3dLM1NhdUtoRFR5OXFxS3R1RlQ2L2RvejlRV0JTYll6WjJ5REtudCtnWWZLbVFPUzg0UnhRL0w2dXgxZTQ2MkRnaTlxTHUxNGdLR0hENnF5b2REMzZ6bmVvYTNlUy9VQ25RK2JRWFA5eGMzUU9QNXZzNUwzMCtRaVFuZTAvSGtPNEJ3c1kzL0NYY3ZvelA3RmlBOGNJS3RudEIzL2RwSDdZSmxSQjk3Z3ZINGR0ajdJMGM2RHdZODlwdWFCYW5Kb3NMVDdlTktGaFZJQkM2RmJ6VEJPQTRiNVF3WE8vcE04TVZ6MkhBcnJWWm5WRzM5K0pZTGZMczZEVVRjYUZvZmtUR0dERzBVTDdjdDYvbFJ4bzA1WDFEQmwvOUMyV2tlQVJpYyszNEN1Y2FVMy9IL2ZBYzRFWFJmcjgxVlBwQ2FwWk9BZC9VejdZRFR5SVhIVWU4WXAxYmJRem9MdUpwNkJ3TmdFMFZhUm02eXNZVTdZUEEzNGUyWE1VNjZyZzg0WjBqckNjWndyT3hNUnUzV1VqNUlwc21jYzFoeFpNYVVIVzRsMnRLQmdodDFpeHVRWmlXaSthYUJQcHM1VHM5d1lPTmVxVmVnRk4wNGdVN1pQaTVJNnFYMTEvdmUwNENXSk1DMXhtZTdERkR0LzU1S0lIL2hhZ3p6MGFCUHQyeVJFS1BQRzhLZ1l6WUQ5MXZYdHNab0M0L2hUdkYwdTE4NFo2MnNKaGlMSzloYjIvTktDRDRUcU9YSUtvM0M4Y2ZXYU11SEVISHI1OGhyR2JGanMraXBjMkdjbzNnaFVpL1U2MUR4M29EQ1FQZWh1dStIak94WFhHUFgwWHNTWDNtQ3kxdFBrd2FrMTE0OStkZEVpTDkwQTZqQi8vdklNWGd3NmRTbjM3c292SW9IUDVNNzVmU2JvaFpoMUliSEwzTm9oWkRPakRjZzRleXRKUUJMTXMxSyt4UjNHL1BHWkdGaXZzS2dXYmxSdDNWRlVqUzFpQllkcVNlMDJhUHYyMElaSHllQ2NJdmM5OU55Vno1TnJqR3Z3YnF0bVc0ZEMxQ0NZWXR3Q2dHOFdXSHZWb0F1YlkydFF2UmU2ZFVvWTlTK1J4TWZXTFNkRUV0MGJUamREUkR0L0FEV2s5cDgvTElJV1V3b1lpdHhmN2VKMHpuYzF1R1RaY2JXYmJPcjUvMGlsZnM2MmlKdUhQR2dXTDZnQTY3ZkhyVnhZazRGRS9EU1R6Q25ndHMxVnBhbDlPODJOQWI4YWtoQVNvR2QrRWd6VU5jRXJqekdpTUtHMmtMeDVWaTBrOXFHT0VQKzk0V0JPb3phOG12ZXBCQ0I2NEQwbzl5WGpTVzRCaTg1b1NxV2JadkZoakZycm15N0lsQTNxcjQzRER2ZGJQTGVQYWlmUUsxbzJsMVFham5MVWtYQWJxTHRFZDhhRXpJMUF4QUV1d0djblhnYUI2LzBHSHF6U1ZHNTdxemFUVXp3U3U1RENuVVlOZFB3Yzk0a1VUVGExa2U0WEY3bTBvNDJaWi9xd0lJbHNWVzl0R3ErM2oxU0RuYmxTNitNN1dhdWVvYVR1YS9aT3BTRDFZbENKUDZOZ1diWjVacDJJRXlSa0ZtM1FDLzRYUVpEYkFTWHM3VWt4RXhzRFQ2SGRIVStKTHkwaFFYOEdrdzRRbXVrdHZzV3hOcXhaWjBXUS80NE9Cd3lST1pIZGN3K3VQNmsvVWphNDdFYnhxdE9GUHlCdVFybS9rQ3QxcGdvTXFvenFGL2FreklZS2JMTE5kdi9kYlgzWkVsaW9ZbWtReWRQWnRpQVE5US9jYkJjcmtCOTJ6S25qd3FVcHZKVmhzM3UwWEt0dENQUmV6d3dXcHlEOGdkY0JTTXhUc2NaWHZpOEVyTzgvOG1DWDF4QWJXUEpoeVc2WGcwYjhlYkhNV0ZVYVBQYkpBbHhGVEFKVnpTV3ZnTDVQd2U2ZDB5VkwvYktseEhqaE0zdHhPT2FCemZWTDR3ZVlQMVorOUhMdXM3VmJNcGdRWDQxY0R3ZEF2VUZiRm9LbFhCYlBuN1pTNUtpaTdSTkp0RGlFamgvK29td3ZwQkxRZGM1REVzVHcyNE95M1JyQkxRVFcvNnN4TG9Gc3VCajNvR1VUY29rQkladGJyVlNhWVNPSzI4Vy9HdnZERlliaUdFZ2FnaHRvYWVrbDNhaHAxd0tZZnYvdjFka1dYNmFRQytGd0pycU9SZjdhbHZ4V3FOeEM2SnZEZWorVzB4OHBGeENFSVNqRUpmcEkxWGlCMy9BZDJ6TXFZZllDQU1TOEFOaU5qY21rZGpRZitXNWwrT1hZZlF2VTFuWW9VN2FLUVJCM3ZjVWkxbVA1WmRuL2RNZnpsUWQzc2hZc0FSU3dHZXlwMENCQ3pIdVRJVEhSZVhDYThoZzNnU2Y4ME96cG9aOVpZQ1h5Qnl0TzQ1SXpCSUlTRjB5dGI5Y2lMSFpIenIzaGV0djFhb0FRWkFSTXQyY0ZWTFJ0RGdQM1BhOUJTTnZLUUdmeSs0amJPeWlLL0EvYUtQZ2hlSlY1RDBwTDZ4bEUzZldFM3VEYjFKZXh1RStyNHF1M0FNcGREZkVDZGRnQVR4Tk1KL3hDQUI4Z3lGSU94cTFBSjRoTDRCT0Z2Z1psTDBoMlhsM1cwMnNKNEIvZUtNZGpzSWY2UVFyVTN6QndrWmZ4aldpNXA1VFlkaHFmbUk5c1FZRnNuQXdrVmMyc1VMZ04raXVHMGp4c05YRWUyUUZDZ3BEQk52TTJOako2L2lPbGJxNWpuWTJ5d1A2L0srMkFBcXZkTkxOdkczWnlESUVmcWZBOHJySUxKTm9oeVBBQ2hRVWg0SnZabkdZRDRIZjVMSzVSQTg4RDdoV0FDaFFCQWxkMDVGSFhlRDNGaU9iRjBYZGllYXhudGpiU2hTMmxhVmRoN25YTmZwRDRHY2pXaFNWK1VyV0V3dFIvQUJ0d3pZbStJeFNsd0FBQUFCSlJVNUVya0pnZ2c9PWA7XHJcbiAgcmV0dXJuIGltYWdlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm50KCl7XHJcbiAgcmV0dXJuIGBpbmZvIGZhY2U9XCJSb2JvdG9cIiBzaXplPTE5MiBib2xkPTAgaXRhbGljPTAgY2hhcnNldD1cIlwiIHVuaWNvZGU9MSBzdHJldGNoSD0xMDAgc21vb3RoPTEgYWE9MSBwYWRkaW5nPTI0LDI0LDI0LDI0IHNwYWNpbmc9MTIsMTIgb3V0bGluZT0wXHJcbmNvbW1vbiBsaW5lSGVpZ2h0PTE5MiBiYXNlPTE1MiBzY2FsZVc9MzA3MiBzY2FsZUg9MTUzNiBwYWdlcz0xIHBhY2tlZD0wIGFscGhhQ2hubD0wIHJlZENobmw9NCBncmVlbkNobmw9NCBibHVlQ2hubD00XHJcbnBhZ2UgaWQ9MCBmaWxlPVwicm9ib3RvXzAucG5nXCJcclxuY2hhcnMgY291bnQ9MTk0XHJcbmNoYXIgaWQ9MCAgICB4PTYzNiAgIHk9MTQzOCAgd2lkdGg9NDggICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT0wICAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yICAgIHg9NTc2ICAgeT0xNDM4ICB3aWR0aD00OCAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTAgICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEzICAgeD00NTAgICB5PTE0MzkgIHdpZHRoPTUxICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNSAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzIgICB4PTI5ODcgIHk9MTI0MiAgd2lkdGg9NTEgICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI1ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zMyAgIHg9MTcxNCAgeT03NjkgICB3aWR0aD02NiAgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTQxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTM0ICAgeD0xOTk5ICB5PTEyNjMgIHdpZHRoPTgxICAgIGhlaWdodD04NyAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9NTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzUgICB4PTEyMTQgIHk9OTUxICAgd2lkdGg9MTM2ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zNiAgIHg9MTYxMCAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTk2ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS00ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTM3ICAgeD0xMzQxICB5PTU5NSAgIHdpZHRoPTE1MiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTE3ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzggICB4PTE2NTggIHk9NTkyICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zOSAgIHg9MjA5MiAgeT0xMjYzICB3aWR0aD02MiAgICBoZWlnaHQ9ODUgICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTI4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQwICAgeD0xMDMgICB5PTAgICAgIHdpZHRoPTkwICAgIGhlaWdodD0yMTMgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MCAgICAgeGFkdmFuY2U9NTUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDEgICB4PTAgICAgIHk9MCAgICAgd2lkdGg9OTEgICAgaGVpZ2h0PTIxMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0wICAgICB4YWR2YW5jZT01NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00MiAgIHg9NjY0ICAgeT0xMjk0ICB3aWR0aD0xMTQgICBoZWlnaHQ9MTE0ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQzICAgeD0wICAgICB5PTEzMTcgIHdpZHRoPTEyOCAgIGhlaWdodD0xMjkgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MzQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDQgICB4PTE5MTYgIHk9MTI2NCAgd2lkdGg9NzEgICAgaGVpZ2h0PTg4ICAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xMTEgICB4YWR2YW5jZT0zMSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00NSAgIHg9MjMzICAgeT0xNDU3ICB3aWR0aD04OCAgICBoZWlnaHQ9NjAgICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTc0ICAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQ2ICAgeD0yODI4ICB5PTEyNDUgIHdpZHRoPTY4ICAgIGhlaWdodD02NSAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTEyICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDcgICB4PTAgICAgIHk9NDI5ICAgd2lkdGg9MTA5ICAgaGVpZ2h0PTE3MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00OCAgIHg9MjM5MiAgeT01ODMgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQ5ICAgeD0xMTIgICB5PTExNDMgIHdpZHRoPTkzICAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTAgICB4PTE0NDMgIHk9NzcyICAgd2lkdGg9MTI2ICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01MSAgIHg9MjY2MCAgeT01NzUgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTUyICAgeD0xNzk0ICB5PTk0MyAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTMgICB4PTUzOSAgIHk9Nzc5ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01NCAgIHg9NDA2ICAgeT03NzkgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTU1ICAgeD0yMDgyICB5PTk0MSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTYgICB4PTI1MjYgIHk9NTgxICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01NyAgIHg9MTU4MSAgeT03NzEgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTU4ICAgeD0yMzgzICB5PTExMTMgIHdpZHRoPTY3ICAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTkgICB4PTM3MiAgIHk9MTE0MCAgd2lkdGg9NzMgICAgaGVpZ2h0PTE1NiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT0zNCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02MCAgIHg9NTM5ICAgeT0xMzA3ICB3aWR0aD0xMTMgICBoZWlnaHQ9MTE5ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTgxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTYxICAgeD0xNjg4ICB5PTEyNjkgIHdpZHRoPTExNSAgIGhlaWdodD05MyAgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9NTEgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjIgICB4PTQxMSAgIHk9MTMwOCAgd2lkdGg9MTE2ICAgaGVpZ2h0PTExOSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02MyAgIHg9ODAwICAgeT03NzkgICB3aWR0aD0xMTMgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTY0ICAgeD0xNDIxICB5PTAgICAgIHdpZHRoPTE3NyAgIGhlaWdodD0xOTYgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTYgICAgeGFkdmFuY2U9MTQ0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjUgICB4PTI3MDggIHk9NzUyICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02NiAgIHg9MjIyMSAgeT05MzkgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTY3ICAgeD0xODExICB5PTU5MiAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjggICB4PTE2NTAgIHk9OTQ2ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDUgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02OSAgIHg9MjQ5NiAgeT05MzQgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTcwICAgeD0yNjMwICB5PTkzMiAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzEgICB4PTE5NjAgIHk9NTkwICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMDkgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03MiAgIHg9OTE2ICAgeT05NTUgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTczICAgeD0yOTYgICB5PTExNDIgIHdpZHRoPTY0ICAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzQgICB4PTI3MiAgIHk9NzkwICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTIxICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03NSAgIHg9NzY3ICAgeT05NTUgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTc2ICAgeD0yNzYyICB5PTkyNiAgIHdpZHRoPTExOSAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzcgICB4PTIxOTcgIHk9NzY1ICAgd2lkdGg9MTYzICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xNDAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03OCAgIHg9MTA2NSAgeT05NTIgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTc5ICAgeD0xNTA1ICB5PTU5NCAgIHdpZHRoPTE0MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODAgICB4PTE5MzggIHk9OTQzICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDEgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04MSAgIHg9MjIyMiAgeT0yMDcgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTgzICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTgyICAgeD0xMzYyICB5PTk0OSAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODMgICB4PTIxMDkgIHk9NTg4ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04NCAgIHg9NjE3ICAgeT05NTUgICB3aWR0aD0xMzggICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTg1ICAgeD0xMjggICB5PTc5MiAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODYgICB4PTI4NzAgIHk9NzQ5ICAgd2lkdGg9MTQ3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDIgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04NyAgIHg9MjAwMiAgeT03NjcgICB3aWR0aD0xODMgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTE0MiAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTg4ICAgeD0zMTIgICB5PTk2NiAgIHdpZHRoPTE0MSAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODkgICB4PTE1NyAgIHk9OTY4ICAgd2lkdGg9MTQzICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05MCAgIHg9MTUwNiAgeT05NDcgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTkxICAgeD02NTggICB5PTAgICAgIHdpZHRoPTc5ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9LTIgICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTIgICB4PTI5NDUgIHk9MjA0ICAgd2lkdGg9MTExICAgaGVpZ2h0PTE3MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05MyAgIHg9NTY3ICAgeT0wICAgICB3aWR0aD03OSAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PS0yICAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTk0ICAgeD0xNTcwICB5PTEyNzEgIHdpZHRoPTEwNiAgIGhlaWdodD0xMDUgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTUgICB4PTAgICAgIHk9MTQ1OCAgd2lkdGg9MTIxICAgaGVpZ2h0PTYwICAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xMjggICB4YWR2YW5jZT03MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05NiAgIHg9MjYyMiAgeT0xMjU4ICB3aWR0aD04MiAgICBoZWlnaHQ9NzEgICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTQ5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTk3ICAgeD0xNTg1ICB5PTExMjEgIHdpZHRoPTExOSAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTggICB4PTY3NyAgIHk9NDE4ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05OSAgIHg9MTQ1MyAgeT0xMTIzICB3aWR0aD0xMjAgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwMCAgeD0xMjA5ICB5PTQxMyAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTAxICB4PTEzMjAgIHk9MTEyNSAgd2lkdGg9MTIxICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDIgIHg9MTg2NiAgeT00MDggICB3aWR0aD0xMDEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTYgICAgIHhhZHZhbmNlPTU2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwMyAgeD0xMzQgICB5PTYxMiAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTA0ICB4PTI2MjcgIHk9Mzk1ICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDUgIHg9MTA1MCAgeT03NzYgICB3aWR0aD02NyAgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTEyICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwNiAgeD0xMzI3ICB5PTAgICAgIHdpZHRoPTgyICAgIGhlaWdodD0xOTggICB4b2Zmc2V0PS0zMCAgIHlvZmZzZXQ9MTIgICAgeGFkdmFuY2U9MzggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTA3ICB4PTI0OTUgIHk9NDAxICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2OCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDggIHg9Mjc1NSAgeT0zOTIgICB3aWR0aD02NCAgICBoZWlnaHQ9MTY4ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwOSAgeD0xOTczICB5PTExMTcgIHdpZHRoPTE2OCAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9MTQwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTEwICB4PTIxNTMgIHk9MTExNSAgd2lkdGg9MTE2ICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTEgIHg9MTE4MSAgeT0xMTI2ICB3aWR0aD0xMjcgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExMiAgeD0yNjcgICB5PTYxMSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTEzICB4PTQwMCAgIHk9NjAwICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTQgIHg9MjI4MSAgeT0xMTEzICB3aWR0aD05MCAgICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTU0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExNSAgeD0xNzE2ICB5PTExMjAgIHdpZHRoPTExNyAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODMgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTE2ICB4PTQ1NyAgIHk9MTE0MCAgd2lkdGg9OTUgICAgaGVpZ2h0PTE1NSAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0yMyAgICB4YWR2YW5jZT01MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTcgIHg9MTg0NSAgeT0xMTE3ICB3aWR0aD0xMTYgICBoZWlnaHQ9MTM1ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExOCAgeD0yNzcyICB5PTExMDAgIHdpZHRoPTEyMiAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTE5ICB4PTI0NjIgIHk9MTExMyAgd2lkdGg9MTYzICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT0xMjAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjAgIHg9MjYzNyAgeT0xMTA2ICB3aWR0aD0xMjMgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyMSAgeD0wICAgICB5PTYxMyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTIyICB4PTI5MDYgIHk9MTA5NyAgd2lkdGg9MTE3ICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjMgIHg9NDU4ICAgeT0wICAgICB3aWR0aD05NyAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTMgICAgIHhhZHZhbmNlPTU0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyNCAgeD0yNDUxICB5PTIwNiAgIHdpZHRoPTYxICAgIGhlaWdodD0xODMgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTI1ICB4PTM0OSAgIHk9MCAgICAgd2lkdGg9OTcgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0zICAgICB4YWR2YW5jZT01NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjYgIHg9MjM3OCAgeT0xMjU5ICB3aWR0aD0xMzggICBoZWlnaHQ9NzkgICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTY1ICAgIHhhZHZhbmNlPTEwOSAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2MCAgeD01MTMgICB5PTE0MzkgIHdpZHRoPTUxICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNSAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTYxICB4PTIxNyAgIHk9MTE0MiAgd2lkdGg9NjcgICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjIgIHg9MTM0MSAgeT00MTMgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTI1ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2MyAgeD0xMzAwICB5PTc3NCAgIHdpZHRoPTEzMSAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTMgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTY0ICB4PTcwMiAgIHk9MTEyOSAgd2lkdGg9MTQ5ICAgaGVpZ2h0PTE0OSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0zMCAgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjUgIHg9NDY1ICAgeT05NTUgICB3aWR0aD0xNDAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2NiAgeD0yMzc1ICB5PTIwNiAgIHdpZHRoPTY0ICAgIGhlaWdodD0xODMgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MzggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTY3ICB4PTIwNSAgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjggIHg9MjcxNiAgeT0xMjUxICB3aWR0aD0xMDAgICBoZWlnaHQ9NjUgICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEyICAgIHhhZHZhbmNlPTY3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2OSAgeD05OTUgICB5PTU5OSAgIHdpZHRoPTE2MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTI2ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTcwICB4PTEzNjggIHk9MTI3MyAgd2lkdGg9OTkgICAgaGVpZ2h0PTEwOSAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT03MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzEgIHg9MTEzMSAgeT0xMjc3ICB3aWR0aD0xMTAgICBoZWlnaHQ9MTEwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTU0ICAgIHhhZHZhbmNlPTc1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3MiAgeD0yMjUxICB5PTEyNjEgIHdpZHRoPTExNSAgIGhlaWdodD04MSAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9NjUgICAgeGFkdmFuY2U9ODkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTczICB4PTEzMyAgIHk9MTQ1OCAgd2lkdGg9ODggICAgaGVpZ2h0PTYwICAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD03NCAgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzQgIHg9MTE2OCAgeT01OTcgICB3aWR0aD0xNjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEyNiAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3NSAgeD0zMzMgICB5PTE0NDggIHdpZHRoPTEwNSAgIGhlaWdodD01OSAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NzMgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTc2ICB4PTE4MTUgIHk9MTI2OCAgd2lkdGg9ODkgICAgaGVpZ2h0PTg4ICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT02MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzcgIHg9ODYzICAgeT0xMTI5ICB3aWR0aD0xMjEgICBoZWlnaHQ9MTQ3ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTI5ICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3OCAgeD04OTkgICB5PTEyODggIHdpZHRoPTk3ICAgIGhlaWdodD0xMTEgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NTkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTc5ICB4PTc5MCAgIHk9MTI5MCAgd2lkdGg9OTcgICAgaGVpZ2h0PTExMiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT01OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODAgIHg9MjUyOCAgeT0xMjU4ICB3aWR0aD04MiAgICBoZWlnaHQ9NzEgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTUwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4MSAgeD04NjYgICB5PTU5OSAgIHdpZHRoPTExNyAgIGhlaWdodD0xNjYgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTgyICB4PTI4OTMgIHk9OTIzICAgd2lkdGg9MTEwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT03OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODMgIHg9MjkwOCAgeT0xMjQyICB3aWR0aD02NyAgICBoZWlnaHQ9NjUgICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTYyICAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4NCAgeD0yMTY2ICB5PTEyNjEgIHdpZHRoPTczICAgIGhlaWdodD04MiAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTI4ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTg1ICB4PTE0NzkgIHk9MTI3MSAgd2lkdGg9NzkgICAgaGVpZ2h0PTEwOSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT01OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODYgIHg9MTI1MyAgeT0xMjc0ICB3aWR0aD0xMDMgICBoZWlnaHQ9MTA5ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTczICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4NyAgeD0xMDA4ICB5PTEyNzcgIHdpZHRoPTExMSAgIGhlaWdodD0xMTAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NTQgICAgeGFkdmFuY2U9NzUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTg4ICB4PTI1NDIgIHk9NzU4ICAgd2lkdGg9MTU0ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMTcgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODkgIHg9MjM3MiAgeT03NjAgICB3aWR0aD0xNTggICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEyNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5MCAgeD0xMTI5ICB5PTc3NiAgIHdpZHRoPTE1OSAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTI0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTkxICB4PTkyNSAgIHk9Nzc3ICAgd2lkdGg9MTEzICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTIgIHg9MTYyICAgeT0yMjUgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5MyAgeD0zMjQgICB5PTIxNCAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTk0ICB4PTAgICAgIHk9MjI1ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTUgIHg9MTM1OSAgeT0yMTAgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkwICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNCAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5NiAgeD0xODE0ICB5PTIwOCAgIHdpZHRoPTE1MCAgIGhlaWdodD0xODggICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTk3ICB4PTEwMTYgIHk9MCAgICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5OSAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMjMgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTggIHg9MTc5MiAgeT03NjkgICB3aWR0aD0xOTggICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjYgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTE1MCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5OSAgeD0xMTc4ICB5PTAgICAgIHdpZHRoPTEzNyAgIGhlaWdodD0xOTggICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjAwICB4PTI5MjIgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDEgIHg9NjQxICAgeT0yMTQgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwMiAgeD03NzUgICB5PTIxMyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjAzICB4PTE5NzYgIHk9MjA3ICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE4OCAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDQgIHg9MTAxOCAgeT0yMTEgICB3aWR0aD04MiAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjcgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwNSAgeD0xMTEyICB5PTIxMSAgIHdpZHRoPTgyICAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjA2ICB4PTkwOSAgIHk9MjEzICAgd2lkdGg9OTcgICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTI3ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDcgIHg9MjExMCAgeT0yMDcgICB3aWR0aD0xMDAgICBoZWlnaHQ9MTg4ICAgeG9mZnNldD0tMjggICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwOCAgeD0wICAgICB5PTk2OSAgIHdpZHRoPTE0NSAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA3ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjA5ICB4PTE1MjEgIHk9MjA4ICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE5MCAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTQgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTAgIHg9MjE4NCAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTk1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxMSAgeD0yMDMxICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE3ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjEyICB4PTE4NzggIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTcgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTMgIHg9Mjc2OSAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTkzICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNSAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxNCAgeD0xMjA2ICB5PTIxMCAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTEgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTEzICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjE1ICB4PTI3OSAgIHk9MTMxNiAgd2lkdGg9MTIwICAgaGVpZ2h0PTEyMCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD00MCAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTYgIHg9MjY1NSAgeT0yMDYgICB3aWR0aD0xNDMgICBoZWlnaHQ9MTc0ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEwICAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxNyAgeD0yNjI1ICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjE4ICB4PTI0ODEgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTkgIHg9MjMzNyAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTk0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyMCAgeD0xNjcwICB5PTIwOCAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjIxICB4PTQ4NiAgIHk9MjE0ICAgd2lkdGg9MTQzICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjIgIHg9MjM2MCAgeT05MzkgICB3aWR0aD0xMjQgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyMyAgeD0xMjEgICB5PTQyOSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzEgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NyAgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjI0ICB4PTE2MDQgIHk9NDEwICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjUgIHg9MTQ3MyAgeT00MTIgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyNiAgeD0xNzM1ICB5PTQxMCAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjI3ICB4PTUzMiAgIHk9NjAwICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMSAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjggIHg9MjkyNiAgeT01NjkgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyOSAgeD0yNTI0ICB5PTIwNiAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzcgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MSAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjMwICB4PTk5NiAgIHk9MTEyOSAgd2lkdGg9MTczICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT0xMzUgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzEgIHg9MTk3OSAgeT00MDcgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzMiAgeD0xMDc2ICB5PTQxNSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjMzICB4PTk0MyAgIHk9NDE3ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzQgIHg9ODEwICAgeT00MTcgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzNSAgeD0yNzkzICB5PTU3MiAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjM2ICB4PTc3MiAgIHk9NjAwICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTI5ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzcgIHg9Mjk3MCAgeT0zODggICB3aWR0aD04MiAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzOCAgeD02NjMgICB5PTYwMCAgIHdpZHRoPTk3ICAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0yOSAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjM5ICB4PTAgICAgIHk9MTE0MyAgd2lkdGg9MTAwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTMwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDAgIHg9MjgxMCAgeT0yMDUgICB3aWR0aD0xMjMgICBoZWlnaHQ9MTczICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTUgICAgIHhhZHZhbmNlPTk0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0MSAgeD0wICAgICB5PTc5MiAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTEgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQyICB4PTI2MCAgIHk9NDI5ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDMgIHg9NTM4ICAgeT00MTggICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0NCAgeD0zOTkgICB5PTQxOCAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQ1ICB4PTI4MzEgIHk9MzkwICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMSAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDYgIHg9MjI1MyAgeT01ODMgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0NyAgeD0xNDAgICB5PTEzMTcgIHdpZHRoPTEyNyAgIGhlaWdodD0xMjggICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MzQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQ4ICB4PTU2NCAgIHk9MTEyOSAgd2lkdGg9MTI2ICAgaGVpZ2h0PTE1MyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0zNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDkgIHg9MjExMSAgeT00MDcgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI1MCAgeD0yMjM5ICB5PTQwMiAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjUxICB4PTIzNjcgIHk9NDAyICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNTIgIHg9NjcyICAgeT03NzkgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI1MyAgeD03NDkgICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0yMDEgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjU0ICB4PTg4MyAgIHk9MCAgICAgd2lkdGg9MTIxICAgaGVpZ2h0PTIwMSAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNTUgIHg9MTc0NCAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTk2ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5rZXJuaW5ncyBjb3VudD0xNjg2XHJcbmtlcm5pbmcgZmlyc3Q9MzIgIHNlY29uZD04NCAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD04NiAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTg3ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9ODkgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD0yMjEgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE4XHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD00NiAgYW1vdW50PS0xOFxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NjUgIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTc0ICBhbW91bnQ9LTIxXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD04NCAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTk3ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExNyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5MiBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTMgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk0IGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NSBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTYgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk3IGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyOCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg0ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTg0ICBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTg2ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTg5ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTIyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTc0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTM0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MzkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD00NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDYgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTc0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTg1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIxNyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIxOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIxOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTM0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTM5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0MiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0MyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0NCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0NSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0NiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTY1ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5MiBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5MyBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NCBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NiBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NyBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTk5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwMCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzMiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzNCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzNSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTk3ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyOSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExNSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTM0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTM5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0MiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0MyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0NCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0NSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0NiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTY1ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5MiBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5MyBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NCBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NiBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NyBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTk5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwMCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzMiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzNCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzNSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTk3ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyOSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExNSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD00NCAgc2Vjb25kPTM0ICBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NDQgIHNlY29uZD0zOSAgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTQ2ICBzZWNvbmQ9MzQgIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD00NiAgc2Vjb25kPTM5ICBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD04OSAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD0yMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjcgIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD04NCAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTE4IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUzIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjU1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NDUgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTczIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTA5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTE4IGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTEyMSBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTMgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjU1IGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTY3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTcxICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTc5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTgxICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxNiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5OSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxNCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg1ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxNyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxOSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIyMCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTM0ICBhbW91bnQ9LTI2XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0zOSAgYW1vdW50PS0yNlxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODcgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg0ICBhbW91bnQ9LTIxXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xMTcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNDkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NiAgYW1vdW50PS0xNFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODkgIGFtb3VudD0tMTlcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIyMSBhbW91bnQ9LTE5XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTE4IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMjEgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI1MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjU1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD02NSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTkyIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5MyBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTQgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk1IGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NiBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTcgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NDQgIGFtb3VudD0tMjVcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTQ2ICBhbW91bnQ9LTI1XHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD05NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD03NCAgYW1vdW50PS0xNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTE4IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTIxIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUzIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjU1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTExIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQyIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQzIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ0IGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ1IGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ2IGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODcgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04NCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExNyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0OSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MiBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEyMiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg2ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjEgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTY1ICBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5MiBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5MyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NiBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE3XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD00NiAgYW1vdW50PS0xN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9OTkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTAwIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTAxIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTAzIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTEzIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjMxIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjMyIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjMzIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjM0IGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjM1IGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTIwIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NDUgIGFtb3VudD0tMThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE3MyBhbW91bnQ9LTE4XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDkgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTIgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDEgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04MyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD05NyAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjQgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjUgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjYgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjcgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjggYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjkgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTUgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD03NCAgYW1vdW50PS0xOVxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTExIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQyIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NjUgIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTkyIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTkzIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk0IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk2IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk3IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NDQgIGFtb3VudD0tMThcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE4XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD05OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMDAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMDEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMDMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD00NSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xNzMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD05NyAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjYgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjcgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjkgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD04NCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTY1ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5MiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5MyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTQ0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD00NiAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NDUgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTczIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9OTcgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI4IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9ODYgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD00NSAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xNzMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD02NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD03MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD03OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTcgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTggYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTkgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDYgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NyAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTE3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUwIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTIyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODYgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04OSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyMSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NjUgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTkyIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTkzIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk0IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk1IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk2IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk3IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD00NCAgYW1vdW50PS0xNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NDYgIGFtb3VudD0tMTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTk5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwMCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzMiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzNCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzNSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTQ1ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE3MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0MSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTgzICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTk3ICBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNiBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyOCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyOSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExNSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTc0ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTcxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTgxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MzQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk5ICBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk5ICBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9MzQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9MzkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTEwOSBzZWNvbmQ9MzQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTEwOSBzZWNvbmQ9MzkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTExMCBzZWNvbmQ9MzQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTExMCBzZWNvbmQ9MzkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTM5ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0zNCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0zOSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTggYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEyMSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjUzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTM0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MzkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NDYgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTk3ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyOCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTM0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MzkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD05NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0zNCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTM5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9OTcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MzQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTE5OSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9ODQgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD04NCAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTg0ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9ODQgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTY3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTcxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTc5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTgxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg1ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxOCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxOSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyMCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg3ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMjIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NiAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjIxIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD02NSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTIgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTMgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTQgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTUgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTYgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTcgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ0ICBhbW91bnQ9LTE2XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NiAgYW1vdW50PS0xNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9OTkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAwIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjM0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjM1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDUgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTczIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTA5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEwIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODMgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9OTcgIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI0IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI2IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI3IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI4IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI5IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzQgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MzQgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIzMSBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMSBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MSBzZWNvbmQ9MzQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTI0MSBzZWNvbmQ9MzkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTM5ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0zNCAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTM0ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0zOSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTM5ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0zNCAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTM0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MzkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD05NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0zNCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTM5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9OTcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5gO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAndGljaycsIGhhbmRsZVRpY2sgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XHJcblxyXG4gIGNvbnN0IHRlbXBNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG4gIGNvbnN0IHRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG4gIGxldCBvbGRQYXJlbnQ7XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0VG9wTGV2ZWxGb2xkZXIoZ3JvdXApIHtcclxuICAgIHZhciBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICB3aGlsZSAoZm9sZGVyLmZvbGRlciAhPT0gZm9sZGVyKSBmb2xkZXIgPSBmb2xkZXIuZm9sZGVyO1xyXG4gICAgcmV0dXJuIGZvbGRlcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVRpY2soIHsgaW5wdXQgfSA9IHt9ICl7XHJcbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpbnB1dC5tb3VzZSApe1xyXG4gICAgICBpZiggaW5wdXQucHJlc3NlZCAmJiBpbnB1dC5zZWxlY3RlZCAmJiBpbnB1dC5yYXljYXN0LnJheS5pbnRlcnNlY3RQbGFuZSggaW5wdXQubW91c2VQbGFuZSwgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKSApe1xyXG4gICAgICAgIGlmKCBpbnB1dC5pbnRlcmFjdGlvbi5wcmVzcyA9PT0gaW50ZXJhY3Rpb24gKXtcclxuICAgICAgICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbi5zdWIoIGlucHV0Lm1vdXNlT2Zmc2V0ICkgKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgY29uc3QgaGl0T2JqZWN0ID0gaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdDtcclxuICAgICAgICBpZiggaGl0T2JqZWN0ID09PSBwYW5lbCApe1xyXG4gICAgICAgICAgaGl0T2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcbiAgICAgICAgICB0UG9zaXRpb24uc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBoaXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICAgICAgICBpbnB1dC5tb3VzZVBsYW5lLnNldEZyb21Ob3JtYWxBbmRDb3BsYW5hclBvaW50KCBpbnB1dC5tb3VzZUNhbWVyYS5nZXRXb3JsZERpcmVjdGlvbiggaW5wdXQubW91c2VQbGFuZS5ub3JtYWwgKSwgdFBvc2l0aW9uICk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyggaW5wdXQubW91c2VQbGFuZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xyXG5cclxuICAgIGxldCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gdHJ1ZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XHJcbiAgICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcclxuICAgICAgICBpZiggaW5wdXQucmF5Y2FzdC5yYXkuaW50ZXJzZWN0UGxhbmUoIGlucHV0Lm1vdXNlUGxhbmUsIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uICkgKXtcclxuICAgICAgICAgIGNvbnN0IGhpdE9iamVjdCA9IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3Q7XHJcbiAgICAgICAgICBpZiggaGl0T2JqZWN0ICE9PSBwYW5lbCApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaW5wdXQuc2VsZWN0ZWQgPSBmb2xkZXI7XHJcblxyXG4gICAgICAgICAgaW5wdXQuc2VsZWN0ZWQudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgICAgICAgIHRQb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LnNlbGVjdGVkLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgICAgICAgaW5wdXQubW91c2VPZmZzZXQuY29weSggaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKS5zdWIoIHRQb3NpdGlvbiApO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coIGlucHV0Lm1vdXNlT2Zmc2V0ICk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsc2V7XHJcbiAgICAgIHRlbXBNYXRyaXguZ2V0SW52ZXJzZSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIHRlbXBNYXRyaXggKTtcclxuICAgICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xyXG5cclxuICAgICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuICAgICAgaW5wdXRPYmplY3QuYWRkKCBmb2xkZXIgKTtcclxuICAgIH1cclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSB0cnVlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnZ3JhYmJlZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoIHAgKXtcclxuXHJcbiAgICBsZXQgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ2V0VG9wTGV2ZWxGb2xkZXIoZ3JvdXApO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaW5wdXQubW91c2UgKXtcclxuICAgICAgaW5wdXQuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG5cclxuICAgICAgaWYoIG9sZFBhcmVudCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcbiAgICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJSZWxlYXNlZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW50ZXJhY3Rpb247XHJcbn0iLCJleHBvcnQgY29uc3QgZ3JhYkJhciA9IChmdW5jdGlvbigpe1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFBZ0NBWUFBQUNpblg2RUFBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFLVDJsRFExQlFhRzkwYjNOb2IzQWdTVU5ESUhCeWIyWnBiR1VBQUhqYW5WTm5WRlBwRmozMzN2UkNTNGlBbEV0dlVoVUlJRkpDaTRBVWtTWXFJUWtRU29naG9ka1ZVY0VSUlVVRUc4aWdpQU9Pam9DTUZWRXNESW9LMkFma0lhS09nNk9JaXNyNzRYdWphOWE4OStiTi9yWFhQdWVzODUyenp3ZkFDQXlXU0ROUk5ZQU1xVUllRWVDRHg4VEc0ZVF1UUlFS0pIQUFFQWl6WkNGei9TTUJBUGgrUER3cklzQUh2Z0FCZU5NTENBREFUWnZBTUJ5SC93L3FRcGxjQVlDRUFjQjBrVGhMQ0lBVUFFQjZqa0ttQUVCR0FZQ2RtQ1pUQUtBRUFHRExZMkxqQUZBdEFHQW5mK2JUQUlDZCtKbDdBUUJibENFVkFhQ1JBQ0FUWlloRUFHZzdBS3pQVm9wRkFGZ3dBQlJtUzhRNUFOZ3RBREJKVjJaSUFMQzNBTURPRUF1eUFBZ01BREJSaUlVcEFBUjdBR0RJSXlONEFJU1pBQlJHOGxjODhTdXVFT2NxQUFCNG1iSTh1U1E1UllGYkNDMXhCMWRYTGg0b3pra1hLeFEyWVFKaG1rQXV3bm1aR1RLQk5BL2c4OHdBQUtDUkZSSGdnL1A5ZU00T3JzN09ObzYyRGw4dDZyOEcveUppWXVQKzVjK3JjRUFBQU9GMGZ0SCtMQyt6R29BN0JvQnQvcUlsN2dSb1hndWdkZmVMWnJJUFFMVUFvT25hVi9OdytINDhQRVdoa0xuWjJlWGs1TmhLeEVKYlljcFhmZjVud2wvQVYvMXMrWDQ4L1BmMTRMN2lKSUV5WFlGSEJQamd3c3owVEtVY3o1SUpoR0xjNW85SC9MY0wvL3dkMHlMRVNXSzVXQ29VNDFFU2NZNUVtb3p6TXFVaWlVS1NLY1VsMHY5azR0OHMrd00rM3pVQXNHbytBWHVSTGFoZFl3UDJTeWNRV0hUQTR2Y0FBUEs3YjhIVUtBZ0RnR2lENGM5My8rOC8vVWVnSlFDQVprbVNjUUFBWGtRa0xsVEtzei9IQ0FBQVJLQ0JLckJCRy9UQkdDekFCaHpCQmR6QkMveGdOb1JDSk1UQ1FoQkNDbVNBSEhKZ0theUNRaWlHemJBZEttQXYxRUFkTk1CUmFJYVRjQTR1d2xXNERqMXdEL3BoQ0o3QktMeUJDUVJCeUFnVFlTSGFpQUZpaWxnampnZ1htWVg0SWNGSUJCS0xKQ0RKaUJSUklrdVJOVWd4VW9wVUlGVklIZkk5Y2dJNWgxeEd1cEU3eUFBeWd2eUd2RWN4bElHeVVUM1VETFZEdWFnM0dvUkdvZ3ZRWkhReG1vOFdvSnZRY3JRYVBZdzJvZWZRcTJnUDJvOCtROGN3d09nWUJ6UEViREF1eHNOQ3NUZ3NDWk5qeTdFaXJBeXJ4aHF3VnF3RHU0bjFZOCt4ZHdRU2dVWEFDVFlFZDBJZ1lSNUJTRmhNV0U3WVNLZ2dIQ1EwRWRvSk53a0RoRkhDSnlLVHFFdTBKcm9SK2NRWVlqSXhoMWhJTENQV0VvOFRMeEI3aUVQRU55UVNpVU15SjdtUUFrbXhwRlRTRXRKRzBtNVNJK2tzcVpzMFNCb2prOG5hWkd1eUJ6bVVMQ0FyeUlYa25lVEQ1RFBrRytRaDhsc0tuV0pBY2FUNFUrSW9Vc3BxU2hubEVPVTA1UVpsbURKQlZhT2FVdDJvb1ZRUk5ZOWFRcTJodGxLdlVZZW9FelIxbWpuTmd4WkpTNld0b3BYVEdtZ1hhUGRwcitoMHVoSGRsUjVPbDlCWDBzdnBSK2lYNkFQMGR3d05oaFdEeDRobktCbWJHQWNZWnhsM0dLK1lUS1laMDRzWngxUXdOekhybU9lWkQ1bHZWVmdxdGlwOEZaSEtDcFZLbFNhVkd5b3ZWS21xcHFyZXFndFY4MVhMVkkrcFhsTjlya1pWTTFQanFRblVscXRWcXAxUTYxTWJVMmVwTzZpSHFtZW9iMVEvcEg1Wi9Za0dXY05NdzA5RHBGR2dzVi9qdk1ZZ0MyTVpzM2dzSVdzTnE0WjFnVFhFSnJITjJYeDJLcnVZL1IyN2l6MnFxYUU1UXpOS00xZXpVdk9VWmo4SDQ1aHgrSngwVGdubktLZVg4MzZLM2hUdktlSXBHNlkwVExreFpWeHJxcGFYbGxpclNLdFJxMGZydlRhdTdhZWRwcjFGdTFuN2dRNUJ4MG9uWENkSFo0L09CWjNuVTlsVDNhY0tweFpOUFRyMXJpNnFhNlVib2J0RWQ3OXVwKzZZbnI1ZWdKNU1iNmZlZWIzbitoeDlMLzFVL1czNnAvVkhERmdHc3d3a0J0c016aGc4eFRWeGJ6d2RMOGZiOFZGRFhjTkFRNlZobFdHWDRZU1J1ZEU4bzlWR2pVWVBqR25HWE9NazQyM0diY2FqSmdZbUlTWkxUZXBON3BwU1RibW1LYVk3VER0TXg4M016YUxOMXBrMW16MHgxekxubStlYjE1dmZ0MkJhZUZvc3RxaTJ1R1ZKc3VSYXBsbnV0cnh1aFZvNVdhVllWVnBkczBhdG5hMGwxcnV0dTZjUnA3bE9rMDZybnRabnc3RHh0c20ycWJjWnNPWFlCdHV1dG0yMmZXRm5ZaGRudDhXdXcrNlR2Wk45dW4yTi9UMEhEWWZaRHFzZFdoMStjN1J5RkRwV090NmF6cHp1UDMzRjlKYnBMMmRZenhEUDJEUGp0aFBMS2NScG5WT2IwMGRuRjJlNWM0UHppSXVKUzRMTExwYytMcHNieHQzSXZlUktkUFZ4WGVGNjB2V2RtN09id3UybzI2L3VOdTVwN29mY244dzBueW1lV1ROejBNUElRK0JSNWRFL0M1K1ZNR3Zmckg1UFEwK0JaN1huSXk5akw1RlhyZGV3dDZWM3F2ZGg3eGMrOWo1eW4rTSs0enczM2pMZVdWL01OOEMzeUxmTFQ4TnZubCtGMzBOL0kvOWsvM3IvMFFDbmdDVUJad09KZ1VHQld3TDcrSHA4SWIrT1B6cmJaZmF5MmUxQmpLQzVRUlZCajRLdGd1WEJyU0ZveU95UXJTSDM1NWpPa2M1cERvVlFmdWpXMEFkaDVtR0x3MzRNSjRXSGhWZUdQNDV3aUZnYTBUR1hOWGZSM0VOejMwVDZSSlpFM3B0bk1VODVyeTFLTlNvK3FpNXFQTm8zdWpTNlA4WXVabG5NMVZpZFdFbHNTeHc1TGlxdU5tNXN2dC84N2ZPSDRwM2lDK043RjVndnlGMXdlYUhPd3ZTRnB4YXBMaElzT3BaQVRJaE9PSlR3UVJBcXFCYU1KZklUZHlXT0NubkNIY0puSWkvUk50R0kyRU5jS2g1TzhrZ3FUWHFTN0pHOE5Ya2t4VE9sTE9XNWhDZXBrTHhNRFV6ZG16cWVGcHAySUcweVBUcTlNWU9Ta1pCeFFxb2hUWk8yWitwbjVtWjJ5NnhsaGJMK3hXNkx0eThlbFFmSmE3T1FyQVZaTFFxMlFxYm9WRm9vMXlvSHNtZGxWMmEvelluS09aYXJuaXZON2N5enl0dVFONXp2bi8vdEVzSVM0WksycFlaTFZ5MGRXT2E5ckdvNXNqeHhlZHNLNHhVRks0WldCcXc4dUlxMkttM1ZUNnZ0VjVldWZyMG1lazFyZ1Y3QnlvTEJ0UUZyNnd0VkN1V0ZmZXZjMSsxZFQxZ3ZXZCsxWWZxR25ScytGWW1LcmhUYkY1Y1ZmOWdvM0hqbEc0ZHZ5citaM0pTMHFhdkV1V1RQWnRKbTZlYmVMWjViRHBhcWwrYVhEbTROMmRxMERkOVd0TzMxOWtYYkw1Zk5LTnU3ZzdaRHVhTy9QTGk4WmFmSnpzMDdQMVNrVlBSVStsUTI3dExkdFdIWCtHN1I3aHQ3dlBZMDdOWGJXN3ozL1Q3SnZ0dFZBVlZOMVdiVlpmdEorN1AzUDY2SnF1bjRsdnR0WGExT2JYSHR4d1BTQS8wSEl3NjIxN25VMVIzU1BWUlNqOVlyNjBjT3h4KysvcDN2ZHkwTk5nMVZqWnpHNGlOd1JIbms2ZmNKMy9jZURUcmFkb3g3ck9FSDB4OTJIV2NkTDJwQ212S2FScHRUbXZ0YllsdTZUOHcrMGRicTNucjhSOXNmRDV3MFBGbDVTdk5VeVduYTZZTFRrMmZ5ejR5ZGxaMTlmaTc1M0dEYm9yWjc1MlBPMzJvUGIrKzZFSFRoMGtYL2krYzd2RHZPWFBLNGRQS3kyK1VUVjdoWG1xODZYMjNxZE9vOC9wUFRUOGU3bkx1YXJybGNhN251ZXIyMWUyYjM2UnVlTjg3ZDlMMTU4UmIvMXRXZU9UM2R2Zk42Yi9mRjkvWGZGdDErY2lmOXpzdTcyWGNuN3EyOFQ3eGY5RUR0UWRsRDNZZlZQMXYrM05qdjNIOXF3SGVnODlIY1IvY0doWVBQL3BIMWp3OURCWStaajh1R0RZYnJuamcrT1RuaVAzTDk2ZnluUTg5a3p5YWVGLzZpL3N1dUZ4WXZmdmpWNjlmTzBaalJvWmZ5bDVPL2JYeWwvZXJBNnhtdjI4YkN4aDYreVhnek1WNzBWdnZ0d1hmY2R4M3ZvOThQVCtSOElIOG8vMmo1c2ZWVDBLZjdreG1Uay84RUE1anovR016TGRzQUFEc2thVlJZZEZoTlREcGpiMjB1WVdSdlltVXVlRzF3QUFBQUFBQThQM2h3WVdOclpYUWdZbVZuYVc0OUl1Kzd2eUlnYVdROUlsYzFUVEJOY0VObGFHbEllbkpsVTNwT1ZHTjZhMk01WkNJL1BnbzhlRHA0YlhCdFpYUmhJSGh0Ykc1ek9uZzlJbUZrYjJKbE9tNXpPbTFsZEdFdklpQjRPbmh0Y0hSclBTSkJaRzlpWlNCWVRWQWdRMjl5WlNBMUxqWXRZekV6TWlBM09TNHhOVGt5T0RRc0lESXdNVFl2TURRdk1Ua3RNVE02TVRNNk5EQWdJQ0FnSUNBZ0lDSStDaUFnSUR4eVpHWTZVa1JHSUhodGJHNXpPbkprWmowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzh3TWk4eU1pMXlaR1l0YzNsdWRHRjRMVzV6SXlJK0NpQWdJQ0FnSUR4eVpHWTZSR1Z6WTNKcGNIUnBiMjRnY21SbU9tRmliM1YwUFNJaUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9uaHRjRDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNlpHTTlJbWgwZEhBNkx5OXdkWEpzTG05eVp5OWtZeTlsYkdWdFpXNTBjeTh4TGpFdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cHdhRzkwYjNOb2IzQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2Y0dodmRHOXphRzl3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbmh0Y0UxTlBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZiVzB2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwemRFVjJkRDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDNOVWVYQmxMMUpsYzI5MWNtTmxSWFpsYm5Raklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDBhV1ptUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzUnBabVl2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaWGhwWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOWxlR2xtTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwYjNKVWIyOXNQa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUF5TURFMUxqVWdLRmRwYm1SdmQzTXBQQzk0YlhBNlEzSmxZWFJ2Y2xSdmIydytDaUFnSUNBZ0lDQWdJRHg0YlhBNlEzSmxZWFJsUkdGMFpUNHlNREUyTFRBNUxUSTRWREUyT2pJMU9qTXlMVEEzT2pBd1BDOTRiWEE2UTNKbFlYUmxSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOYjJScFpubEVZWFJsUGpJd01UWXRNRGt0TWpoVU1UWTZNemM2TWpNdE1EYzZNREE4TDNodGNEcE5iMlJwWm5sRVlYUmxQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDR5TURFMkxUQTVMVEk0VkRFMk9qTTNPakl6TFRBM09qQXdQQzk0YlhBNlRXVjBZV1JoZEdGRVlYUmxQZ29nSUNBZ0lDQWdJQ0E4WkdNNlptOXliV0YwUG1sdFlXZGxMM0J1Wnp3dlpHTTZabTl5YldGMFBnb2dJQ0FnSUNBZ0lDQThjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDR6UEM5d2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBnb2dJQ0FnSUNBZ0lDQThjR2h2ZEc5emFHOXdPa2xEUTFCeWIyWnBiR1UrYzFKSFFpQkpSVU0yTVRrMk5pMHlMakU4TDNCb2IzUnZjMmh2Y0RwSlEwTlFjbTltYVd4bFBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlNXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09tRmhZVEZqTVRRekxUVXdabVV0T1RRME15MWhOVGhtTFdFeU0yVmtOVE0zTURkbU1Ed3ZlRzF3VFUwNlNXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUStZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pkbE56ZG1ZbVpqTFRnMVpEUXRNVEZsTmkxaFl6aG1MV0ZqTnpVMFpXUTFPRE0zWmp3dmVHMXdUVTA2Ukc5amRXMWxiblJKUkQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRTFOT2s5eWFXZHBibUZzUkc5amRXMWxiblJKUkQ1NGJYQXVaR2xrT21NMVptTTBaR1l5TFRreFkyTXRaVEkwTVMwNFkyVmpMVE16T0RJeVkyUTFaV0ZsT1R3dmVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2U0dsemRHOXllVDRLSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4eVpHWTZiR2tnY21SbU9uQmhjbk5sVkhsd1pUMGlVbVZ6YjNWeVkyVWlQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZZV04wYVc5dVBtTnlaV0YwWldROEwzTjBSWFowT21GamRHbHZiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbWx1YzNSaGJtTmxTVVErZUcxd0xtbHBaRHBqTldaak5HUm1NaTA1TVdOakxXVXlOREV0T0dObFl5MHpNemd5TW1Oa05XVmhaVGs4TDNOMFJYWjBPbWx1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHAzYUdWdVBqSXdNVFl0TURrdE1qaFVNVFk2TWpVNk16SXRNRGM2TURBOEwzTjBSWFowT25kb1pXNCtDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUGtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBeU1ERTFMalVnS0ZkcGJtUnZkM01wUEM5emRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBzYVQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kyOXVkbVZ5ZEdWa1BDOXpkRVYyZERwaFkzUnBiMjQrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHB3WVhKaGJXVjBaWEp6UG1aeWIyMGdZWEJ3YkdsallYUnBiMjR2ZG01a0xtRmtiMkpsTG5Cb2IzUnZjMmh2Y0NCMGJ5QnBiV0ZuWlM5d2JtYzhMM04wUlhaME9uQmhjbUZ0WlhSbGNuTStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjbVJtT214cFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbXhwSUhKa1pqcHdZWEp6WlZSNWNHVTlJbEpsYzI5MWNtTmxJajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbUZqZEdsdmJqNXpZWFpsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPbUZoWVRGak1UUXpMVFV3Wm1VdE9UUTBNeTFoTlRobUxXRXlNMlZrTlRNM01EZG1NRHd2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB3T1MweU9GUXhOam96TnpveU15MHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwamFHRnVaMlZrUGk4OEwzTjBSWFowT21Ob1lXNW5aV1ErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNekF3TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K016QXdNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDR4UEM5bGVHbG1Pa052Ykc5eVUzQmhZMlUrQ2lBZ0lDQWdJQ0FnSUR4bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNDJORHd2WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K0NpQWdJQ0FnSUNBZ0lEeGxlR2xtT2xCcGVHVnNXVVJwYldWdWMybHZiajR6TWp3dlpYaHBaanBRYVhobGJGbEVhVzFsYm5OcGIyNCtDaUFnSUNBZ0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBnb2dJQ0E4TDNKa1pqcFNSRVkrQ2p3dmVEcDRiWEJ0WlhSaFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvOFAzaHdZV05yWlhRZ1pXNWtQU0ozSWo4K09oRjdSd0FBQUNCalNGSk5BQUI2SlFBQWdJTUFBUG4vQUFDQTZRQUFkVEFBQU9wZ0FBQTZtQUFBRjIrU1g4VkdBQUFBbEVsRVFWUjQydXpac1EzQUlBeEVVVHVUWkpSc2t0NUxSRm1DZFRMYXBVS0NCaWpvL0YwaG4yU2tKeElLWEpKbHJzT1NGd0FBQUFCQTZ2S0k2TzdCVW9yWGRadTEvVkVXRVplWmZiTjVtL1phbWpmSytBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDQmZ1YVNuYTdpL2RkMW1iWCtVU1RyTjdKN04yN1RYMHJ4UnhnbmdaWWlmSUFBQUFKQzRmZ0FBQVAvL0F3QXVNVlB3MjBoeEN3QUFBQUJKUlU1RXJrSmdnZz09YDtcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIC8vIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xyXG4gIC8vIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIC8vIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgIC8vIGNvbG9yOiAweGZmMDAwMCxcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pO1xyXG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuNTtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAsIGltYWdlLmhlaWdodCAvIDEwMDAsIDEsIDEgKTtcclxuXHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xyXG4gICAgcmV0dXJuIG1lc2g7XHJcbiAgfVxyXG5cclxufSgpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBkb3duQXJyb3cgPSAoZnVuY3Rpb24oKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUlBQUFBQkFDQVlBQUFEUzFuOS9BQUFBQ1hCSVdYTUFBQ3hMQUFBc1N3R2xQWmFwQUFBNEsybFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0S1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhNeklnTnprdU1UVTVNamcwTENBeU1ERTJMekEwTHpFNUxURXpPakV6T2pRd0lDQWdJQ0FnSUNBaVBnb2dJQ0E4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGdvZ0lDQWdJQ0E4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmRHbG1aajBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5MGFXWm1MekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9tVjRhV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdlpYaHBaaTh4TGpBdklqNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwRGNtVmhkRzl5Vkc5dmJENUJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdNakF4TlM0MUlDaFhhVzVrYjNkektUd3ZlRzF3T2tOeVpXRjBiM0pVYjI5c1Bnb2dJQ0FnSUNBZ0lDQThlRzF3T2tOeVpXRjBaVVJoZEdVK01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmVHMXdPa055WldGMFpVUmhkR1UrQ2lBZ0lDQWdJQ0FnSUR4NGJYQTZUVzlrYVdaNVJHRjBaVDR5TURFMkxURXdMVEl3VkRJeE9qRTRPakkxTFRBM09qQXdQQzk0YlhBNlRXOWthV1o1UkdGMFpUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVStNakF4TmkweE1DMHlNRlF5TVRveE9Eb3lOUzB3Tnpvd01Ed3ZlRzF3T2sxbGRHRmtZWFJoUkdGMFpUNEtJQ0FnSUNBZ0lDQWdQR1JqT21admNtMWhkRDVwYldGblpTOXdibWM4TDJSak9tWnZjbTFoZEQ0S0lDQWdJQ0FnSUNBZ1BIQm9iM1J2YzJodmNEcERiMnh2Y2sxdlpHVStNend2Y0dodmRHOXphRzl3T2tOdmJHOXlUVzlrWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRTFOT2tsdWMzUmhibU5sU1VRK2VHMXdMbWxwWkRvek1EUXlZakkwWlMxaU16YzJMV0kwTkdJdE9HSTRZeTFsWlRGalkySXpZV1UxTURVOEwzaHRjRTFOT2tsdWMzUmhibU5sU1VRK0NpQWdJQ0FnSUNBZ0lEeDRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBuaHRjQzVrYVdRNk16QTBNbUl5TkdVdFlqTTNOaTFpTkRSaUxUaGlPR010WldVeFkyTmlNMkZsTlRBMVBDOTRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBuaHRjQzVrYVdRNk16QTBNbUl5TkdVdFlqTTNOaTFpTkRSaUxUaGlPR010WldVeFkyTmlNMkZsTlRBMVBDOTRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VRK0NpQWdJQ0FnSUNBZ0lEeDRiWEJOVFRwSWFYTjBiM0o1UGdvZ0lDQWdJQ0FnSUNBZ0lDQThjbVJtT2xObGNUNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBzYVNCeVpHWTZjR0Z5YzJWVWVYQmxQU0pTWlhOdmRYSmpaU0krQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHBoWTNScGIyNCtZM0psWVhSbFpEd3ZjM1JGZG5RNllXTjBhVzl1UGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2YVc1emRHRnVZMlZKUkQ1NGJYQXVhV2xrT2pNd05ESmlNalJsTFdJek56WXRZalEwWWkwNFlqaGpMV1ZsTVdOallqTmhaVFV3TlR3dmMzUkZkblE2YVc1emRHRnVZMlZKUkQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25kb1pXNCtNakF4TmkweE1DMHhPRlF4Tnpvek16b3dOaTB3Tnpvd01Ed3ZjM1JGZG5RNmQyaGxiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK1FXUnZZbVVnVUdodmRHOXphRzl3SUVORElESXdNVFV1TlNBb1YybHVaRzkzY3lrOEwzTjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjbVJtT214cFBnb2dJQ0FnSUNBZ0lDQWdJQ0E4TDNKa1pqcFRaWEUrQ2lBZ0lDQWdJQ0FnSUR3dmVHMXdUVTA2U0dsemRHOXllVDRLSUNBZ0lDQWdJQ0FnUEhScFptWTZUM0pwWlc1MFlYUnBiMjQrTVR3dmRHbG1aanBQY21sbGJuUmhkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V0ZKbGMyOXNkWFJwYjI0K01qZzRNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFlVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXVkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWlVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlVtVnpiMngxZEdsdmJsVnVhWFErTWp3dmRHbG1aanBTWlhOdmJIVjBhVzl1Vlc1cGRENEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlEyOXNiM0pUY0dGalpUNDJOVFV6TlR3dlpYaHBaanBEYjJ4dmNsTndZV05sUGdvZ0lDQWdJQ0FnSUNBOFpYaHBaanBRYVhobGJGaEVhVzFsYm5OcGIyNCtNVEk0UEM5bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlVHbDRaV3haUkdsdFpXNXphVzl1UGpZMFBDOWxlR2xtT2xCcGVHVnNXVVJwYldWdWMybHZiajRLSUNBZ0lDQWdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtDaUFnSUR3dmNtUm1PbEpFUmo0S1BDOTRPbmh0Y0cxbGRHRStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0Nqdy9lSEJoWTJ0bGRDQmxibVE5SW5jaVB6NVVpbHowQUFBQUlHTklVazBBQUhvbEFBQ0Fnd0FBK2Y4QUFJRHBBQUIxTUFBQTZtQUFBRHFZQUFBWGI1SmZ4VVlBQUFKZFNVUkJWSGphN04zTGNjSkFFSVRoUnVXN25jVWVUUWhrUUFpSURNZ0loVUlJY0ZRV0pnSjg4Rktsb3Z3QXJOMmQ2WjQ1Y1pHQS9UOXZpWWZ0eGVWeVFZenVkTEVFQVNBbUFNUUVnQmpKZVdsMXh5bWxOd0FIQU1keEhIdkZ4VThwRFFDV0FGYmpPSDdJN0FDVCtPOEFObmtoRk9Odjhob2M4cHJ3QTdpSmZ4MHBCSlA0MTJtR29ETVFYd3JCTi9HYkl1aU14SmRBOEV2OFpnZzZRL0dwRWR3UnZ3bUN6bGg4U2dRUHhLK09vTVlPTUR3WW53ckJFL0duQ0FiWEFQS1RYLy9qRkp1VVV1ODRmdjlrL091c1MvOFFkQWJsMzg3ZUk0TDhtUGN6bktyb1RsaHlCMWpPZUM1WENHYU1YMkl0cXdGWUFUaXBJU2dRLzVUWDBoZUEvTjYyRklKUzhVdCtUbEQwSWxBSmdjZjRWVjRHS2lEd0dyL1crd0RVQ0R6SHJ3YUFGWUgzK0ZVQnNDRmdpRjhkQUFzQ2x2aE5BSGhId0JTL0dRQ3ZDTmppTndYZ0RRRmovT1lBdkNCZ2pXOENnSFVFelBITkFMQ0tnRDIrS1FEV0VDakVOd2ZBQ2dLVitDWUJUQkQwQU02MUVSU0lmd2JRVzR4dkZrQkdjTXc3UVRVRWhlS3Y4bk5CQURDTVFERytlUUMxRUtqR0I0Q0ZsNzhSbEZKYTR1c1hURjduakpSdnozNWVEL0ZkQVNpSUFLcngzUUVvaEFDcThWMWNBMVM2SnBDTTd4S0FRUVJ1NDdzRllBaUI2L2l1QVJoQTRENitld0FORVZERXB3RFFBQUZOZkJvQUZSRlF4YWNDVUFFQlhYdzZBQVVSVU1hbkJGQUFBVzE4V2dBeklxQ09UdzFnQmdUMDhla0JUQkRzbmpoMHh4NWZBa0JHTUFEWVBuRElOaCtEQUtDSFFDYStGSUE3RVVqRmx3UHdCd0s1K0pJQWZrQWdHUjl3K0pXd09lZjZ6V0RWK1BJQVl1TGZ4Z1dBV0lJQUVCTUFZZ0pBak9SOERnRCs2T3pndjR1eTlnQUFBQUJKUlU1RXJrSmdnZz09JztcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIC8vIHRleHR1cmUuYW5pc290cm9waWNcclxuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XHJcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KTtcclxuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjI7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgY29uc3QgaCA9IDAuMztcclxuICAgIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAgKiBoLCBpbWFnZS5oZWlnaHQgLyAxMDAwICogaCwgMSwgMSApO1xyXG4gICAgZ2VvLnRyYW5zbGF0ZSggLTAuMDA1LCAtMC4wMDQsIDAgKTtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBtYXRlcmlhbCApO1xyXG4gIH1cclxufSgpKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2ttYXJrID0gKGZ1bmN0aW9uKCl7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUJBQ0FZQUFBRFMxbjkvQUFBQUNYQklXWE1BQUN4TEFBQXNTd0dsUFphcEFBQTRLMmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NEtQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TXpJZ056a3VNVFU1TWpnMExDQXlNREUyTHpBMEx6RTVMVEV6T2pFek9qUXdJQ0FnSUNBZ0lDQWlQZ29nSUNBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBnb2dJQ0FnSUNBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZkR2xtWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTBhV1ptTHpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVY0YVdZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZaWGhwWmk4eExqQXZJajRLSUNBZ0lDQWdJQ0FnUEhodGNEcERjbVZoZEc5eVZHOXZiRDVCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nTWpBeE5TNDFJQ2hYYVc1a2IzZHpLVHd2ZUcxd09rTnlaV0YwYjNKVWIyOXNQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwWlVSaGRHVStNakF4TmkweE1DMHhPRlF4Tnpvek16b3dOaTB3Tnpvd01Ed3ZlRzF3T2tOeVpXRjBaVVJoZEdVK0NpQWdJQ0FnSUNBZ0lEeDRiWEE2VFc5a2FXWjVSR0YwWlQ0eU1ERTJMVEV3TFRJd1ZESXhPak16T2pVekxUQTNPakF3UEM5NGJYQTZUVzlrYVdaNVJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEhodGNEcE5aWFJoWkdGMFlVUmhkR1UrTWpBeE5pMHhNQzB5TUZReU1Ub3pNem8xTXkwd056b3dNRHd2ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEdSak9tWnZjbTFoZEQ1cGJXRm5aUzl3Ym1jOEwyUmpPbVp2Y20xaGRENEtJQ0FnSUNBZ0lDQWdQSEJvYjNSdmMyaHZjRHBEYjJ4dmNrMXZaR1UrTXp3dmNHaHZkRzl6YUc5d09rTnZiRzl5VFc5a1pUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUStlRzF3TG1scFpEbzJPRGN4WVRrNVl5MHpOakU1TFRsa05HRXRPRGRrTmkwd1lXRTVZVFJpTldVNE1qYzhMM2h0Y0UxTk9rbHVjM1JoYm1ObFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZOamczTVdFNU9XTXRNell4T1MwNVpEUmhMVGczWkRZdE1HRmhPV0UwWWpWbE9ESTNQQzk0YlhCTlRUcEViMk4xYldWdWRFbEVQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZOamczTVdFNU9XTXRNell4T1MwNVpEUmhMVGczWkRZdE1HRmhPV0UwWWpWbE9ESTNQQzk0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcElhWE4wYjNKNVBnb2dJQ0FnSUNBZ0lDQWdJQ0E4Y21SbU9sTmxjVDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwc2FTQnlaR1k2Y0dGeWMyVlVlWEJsUFNKU1pYTnZkWEpqWlNJK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwaFkzUnBiMjQrWTNKbFlYUmxaRHd2YzNSRmRuUTZZV04wYVc5dVBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09qWTROekZoT1RsakxUTTJNVGt0T1dRMFlTMDROMlEyTFRCaFlUbGhOR0kxWlRneU56d3ZjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uZG9aVzQrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2YzNSRmRuUTZkMmhsYmo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJREl3TVRVdU5TQW9WMmx1Wkc5M2N5azhMM04wUlhaME9uTnZablIzWVhKbFFXZGxiblErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K01qZzRNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDQyTlRVek5Ud3ZaWGhwWmpwRGIyeHZjbE53WVdObFBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwUWFYaGxiRmhFYVcxbGJuTnBiMjQrTVRJNFBDOWxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZVR2w0Wld4WlJHbHRaVzV6YVc5dVBqWTBQQzlsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrQ2lBZ0lEd3ZjbVJtT2xKRVJqNEtQQzk0T25odGNHMWxkR0UrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDancvZUhCaFkydGxkQ0JsYm1ROUluY2lQejV6OVJUM0FBQUFJR05JVWswQUFIb2xBQUNBZ3dBQStmOEFBSURwQUFCMU1BQUE2bUFBQURxWUFBQVhiNUpmeFVZQUFBVHRTVVJCVkhqYTdKemJiNVJGR01aLzJ4YkN2VmhBU0V4VWlJMTQ0dzBoUXRIRUdySGdJU3FnTjZLZ3ROWVdBYjB3MFdvMVhxcmJQYlNsb2tZU3hmTWhlbVgvQWE3d0dBVnE4WFRwMzBEWGk1bUptMGEydTl2My9iNloyWGx1ZHJPSGR3L1BNelBQKzc0elg2RldxeUdGZ1lFQkVscEdEL0FlY0N0d0IvRGJjbStZbTVzVCsvQ3U5UC9uaW02Z0NEd0NYQXQ4RFZ5WDVSZElBc2dQQmFBRWpOUTlkaVB3RmJBNUNTQitUQUZQL2Mvalc0SFBnTDRrZ0hneEN3dzFlUDVtNEdON213UVFFYm9zK1U4MDhkcXR3RWYyTmdrZ0VyYy8weVQ1RG4xMk9kaVNCQkErK2FVV3lYZllBbndEWEo4RUVHNnFOd2tNcnlER1pwc2kzcEFFRUI2cVYzRDdyYUlQK05LbWlra0FnZUF0NEloZ3ZKdnNUSkFFNERrS3dDbmdzRUxzczBrQS9xLzVzOEFoaGRqVHdFRnBkNW9nUzM1VmFlVFBBazhEaTBrQS9wSmZFbDd6SFU3U3VIS1lsZ0FQMXZ5eWtOdGZpaGt0OHBNQVpFa2FWb2hiVllxYkJDQ0lVOENUQ25GTHdKajJsMDhDV05tYS83YVMyNjhDeDZRTlh4S0FySG1lQmg1WFdrN0dzaUEvVHdHTVlmYS9oVXArbWZZYU84MjQvZUdzeU05TEFDOWdtaVB2QXpzREk3L0xyczFEU2lOL0tJOGZsQ1hHZ1ZmdC9WN2dETEFySUFGTWgrcjJmUkRBUzhERWtzYzJBaDhDL1IzczlzdkFhSjVUV2xia3YzeUY1OVpqZHIxczkzamExM0w3RmV2MmF6RUxZTHdCK1E1ck1iM3ViUjRhdnBOS2JuOGFlQWE0bkxlNnRRM2ZSSk92N1FXKzhHZ202TEVqVktPeE00TTVEM0E1N3grcEtZQVg2d3hmczlnQWZBTHM4SUI4cmNhT0t4dlhmRkM1bGdER2dWZmFmSzh6aHJ0eS9FKzBYSGtsTDdlZnBRQW1XcGoybHhQQmJUbjhKN1BvMWZaSDhRelNBbmpOam40SnJNZWNqc21xV0ZRQTNsVnkreVhyOW9sZEFIY0t4N3NhK0R3RFk5aGo4L3lEaXFuZVlpY0k0RkhnUitHWWE1V3pBODNHemhSdzFGZnlOUVR3QzNDUHZaWEVPdUJUekVVVUpMRXFnMVRQVy9LMVRPQ2Z3Q0J3VVRqdU5jaVdqYnN4WlZpTlZDKzMycjR2YWVBZndGM0FnbkRjVFZZRXR3dU5VQTN5eTVqZHUzU3lBQUIrQjNZckxBY2JCT29FN3loTis1TjJ6U2NKd0dBZWVBRDRUamh1TDZhQjFLb242TGJrUDZZMDhvL2pTWVhQRndFQW5BY2VWaERCVlMxbUI2NnhvMEgrRktheHMwaGd5S29kZkFGNEVQaEpxVTZ3M0V5d3locXpRMHJrajRSSWZwWUNBTGdFN0xFemdpUmN4YkMvd2Npdm9GUGVkZVFIaTZ5M2hQMWxqZUc4VW9xNE5Ec29ZSW84V2p0NWdpWS9Ed0hVcDRpL0ttUUhaK3BFVU1EczVORncrMFV5T0xRUnF3RGNjbkF2OEwxdzNIWEFhWnNpdnE1aytJckFDU0pCbnFlRDU0RUR3QWZBTFlKeE53SGZLcG15c2lWL01SWUI1SDB5NkFLd0gvaEJPTzVxWUkyQzRUc2FFL2srQ0FETTFiSDNJbDh4bEVUVkdyNGFrY0dYczRGL0EzZmJHY0UzVkFpb3RoK3FBTUIwRVhkN0pvSkpQTnpHRmFzQXdEU1FCcEhmVk5LdTJ6OUc1UER4ZVBnQzhCQndMdWVSZnlMR05UOEVBWURaVEhJQStRWlNzMnYrOGRqY2ZtZ0NjSFdDKzVGdklDM245a2M3aFh6ZkJlQ000UjdreThZZDUvWkRGUUQ4MTBDNnFQZ1owYnY5a0FWUW55SnFGSXZleEd6bUlBbkFiMXdDN2hNMmhrWGdXVG9Zb1YwbHpEV1FKRkxFNkJvN25TQUFseUx1WTJVTnBBb1pYb290Q1VBZUM1Z0cwczl0a2o5S1F0QUNBTk5BR3FTMVBZYWxSSDQ4QW5BcFlyUGJ5NG9FZG1nakNhRDVGSEV2amJlWHZZRXA3eVpFS0FEbkNmWmJFZndEUEk4NUwrRElmNDRPYU95MGczOEhBTS9lN2d1SVJ4OTRBQUFBQUVsRlRrU3VRbUNDJztcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIC8vIHRleHR1cmUuYW5pc290cm9waWNcclxuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XHJcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KTtcclxuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjI7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgY29uc3QgaCA9IDAuNDtcclxuICAgIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAgKiBoLCBpbWFnZS5oZWlnaHQgLyAxMDAwICogaCwgMSwgMSApO1xyXG4gICAgZ2VvLnRyYW5zbGF0ZSggMC4wMjUsIDAsIDAgKTtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBtYXRlcmlhbCApO1xyXG4gIH1cclxufSgpKTsiLCIvKiogXHJcbiAqIEJpZyBidXR0b24gd2l0aCBhbiBpbWFnZSBvbiAod2hpY2ggbWlnaHQgY29tZSBmcm9tIGEgZmlsZSBvciBleGlzdGluZyB0ZXh0dXJlLFxyXG4gKiB0aGUgdGV4dHVyZSBtaWdodCBiZSBmcm9tIGEgUmVuZGVyVGFyZ2V0Li4uKS5cclxuICogXHJcbiAqIEknZCBwdXQgdGhpcyBtb3JlIHNlcGFyYXRlIGZyb20gdGhlIGRhdGd1aSBtb2R1bGVzIGJ1dCBuZWVkIHRvIHRoaW5rIGEgbGl0dGxlXHJcbiAqIGJpdCBhYm91dCBob3cgdG8gc3RydWN0dXJlIHRoYXQgZXRjLiAgVmVyeSB1bi1EUlksIGJ1dCBJJ20gc3RhcnRpbmcgYnkganVzdFxyXG4gKiBjb3B5aW5nIGV4aXN0aW5nIGJ1dHRvbi5qcyBpbiBpdHMgZW50aXJldHkuXHJcbiAqIFxyXG4gKiBUT0RPOiBub3QganVzdCBzaW1wbGUgJ2JhbmcnIGZ1bmN0aW9uIGJ1dCBjYWxsYmFja3MgZm9yIGhvdmVyIC8gZXRjLlxyXG4gKiBcclxuICogXHJcbiAqIENvcHlyaWdodCAgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBpbmMuIDIwMTYgLyBQZXRlciBUb2RkLCAyMDE3XHJcbiAqIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgU3ViZGl2aXNpb25Nb2RpZmllciBmcm9tICcuLi90aGlyZHBhcnR5L1N1YmRpdmlzaW9uTW9kaWZpZXInO1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSW1hZ2VCdXR0b24oIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgcHJlc3NpbmcgPSB1bmRlZmluZWQsXHJcbiAgaW1hZ2UgPSBcInRleHR1cmVzL3Nwb3RsaWdodC5qcGdcIiwgLy9UT0RPIGJldHRlciBkZWZhdWx0XHJcbiAgd2lkZSA9IGZhbHNlLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBmdW5jdGlvbiBhcHBseUltYWdlVG9NYXRlcmlhbChpbWFnZSwgdGFyZ2V0TWF0ZXJpYWwpIHtcclxuICAgICAgaWYgKHR5cGVvZiBpbWFnZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIC8vVE9ETyBjYWNoZS4gIERvZXMgVGV4dHVyZUxvYWRlciBhbHJlYWR5IGNhY2hlP1xyXG4gICAgICAgIG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCkubG9hZChpbWFnZSwgKHRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgdGV4dHVyZS53cmFwUyA9IHRleHR1cmUud3JhcFQgPSBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nO1xyXG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuaXNUZXh0dXJlKSB7XHJcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZTtcclxuICAgICAgfSBlbHNlIGlmIChpbWFnZS5pc1dlYkdMUmVuZGVyVGFyZ2V0KSB7XHJcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZS50ZXh0dXJlO1xyXG4gICAgICB9IGVsc2UgdGhyb3cgXCJub3Qgc3VyZSBob3cgdG8gaW50ZXJwcmV0IGltYWdlIFwiICsgaW1hZ2U7XHJcbiAgICAgIHRhcmdldE1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gICAvL1hYWCBtYWdpYyBudW1iZXJzLi4uXHJcbiAgY29uc3QgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX1dJRFRIICAqICh3aWRlID8gMC45NCA6IDAuMjUpO1xyXG4gIFxyXG4gIGNvbnN0IEJVVFRPTl9XSURUSCA9IHdpZHRoICogKHdpZGUgPyAwLjk0IDogMC4yNSkgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IExheW91dC5CVVRUT05fREVQVEggKiAyO1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGdyb3VwLmd1aVR5cGUgPSBcImltYWdlYnV0dG9uXCI7XHJcbiAgZ3JvdXAudG9TdHJpbmcgPSAoKSA9PiBgWyR7Z3JvdXAuZ3VpVHlwZX06ICR7cHJvcGVydHlOYW1lfV1gO1xyXG4gIGdyb3VwLnNwYWNpbmcgPSBoZWlnaHQ7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCBhc3BlY3RSYXRpbyA9IEJVVFRPTl9XSURUSCAvIEJVVFRPTl9IRUlHSFQ7XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIDEsIDEgKTtcclxuICBjb25zdCBtb2RpZmllciA9IG5ldyBUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyKCAxICk7XHJcbiAgLy9tb2RpZmllci5tb2RpZnkoIHJlY3QgKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCBCVVRUT05fREVQVEggKTtcclxuXHJcbiAgLy8gIGhpdHNjYW4gdm9sdW1lXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSDtcclxuICBpZiAoIXdpZGUpIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG4gIGVsc2Uge1xyXG4gICAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOICogMC43NTtcclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueSA9IDAuMDE7IC8vWFhYIG1hZ2ljIG51bWJlclxyXG4gIH1cclxuXHJcbiAgdmFyIG1hdGVyaWFsO1xyXG4gIGlmIChpbWFnZS5pc01hdGVyaWFsKSB7XHJcbiAgICBtYXRlcmlhbCA9IGltYWdlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gICAgbWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG4gICAgYXBwbHlJbWFnZVRvTWF0ZXJpYWwoaW1hZ2UsIG1hdGVyaWFsKTtcclxuICB9XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG4gIC8vYnV0dG9uIGxhYmVsIHJlbW92ZWQ7IG1pZ2h0IHdhbnQgb3B0aW9ucyBsaWtlIGEgaG92ZXIgbGFiZWwgaW4gZnV0dXJlLlxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gMC4wMztcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcbiAgaWYgKHdpZGUpIGRlc2NyaXB0b3JMYWJlbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgLy9UT0RPOiBkcmFnIGFuZCBob3ZlclxyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZVByZXNzaW5nICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy9jb21wdXRlIHggJiB5IGFzIG5vcm1hbGlzZWQgY29vcmRpbmF0ZXMgZnJvbSBwLnBvaW50XHJcbiAgICB2YXIgcG9pbnQgPSBoaXRzY2FuVm9sdW1lLndvcmxkVG9Mb2NhbChwLnBvaW50KTtcclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0ocG9pbnQueCwgcG9pbnQueSswLjUpO1xyXG5cclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuMTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzc2luZyggcCApIHtcclxuICAgIHZhciBwb2ludCA9IGhpdHNjYW5Wb2x1bWUud29ybGRUb0xvY2FsKHAucG9pbnQpO1xyXG4gICAgLy9uYiwgbGlrZWx5IHRvIG5lZWQgYSBkaWZmZXJlbnQgc3RyYXRlZ3kgZm9yIGR1YWwgd2llbGRpbmdcclxuICAgIGlmIChwcmVzc2luZykgcHJlc3NpbmcocG9pbnQueCwgcG9pbnQueSswLjUpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCl7XHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiAoIW1hdGVyaWFsLmNvbG9yKSByZXR1cm47XHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4RkZGRkZGICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4Q0NDQ0NDICk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKiogXHJcbiAqIEdyaWQgb2YgYnV0dG9ucyB3aXRoIGltYWdlcyBvbiAod2hpY2ggbWlnaHQgY29tZSBmcm9tIGEgZmlsZSBvciBleGlzdGluZyB0ZXh0dXJlLFxyXG4gKiB0aGUgdGV4dHVyZSBtaWdodCBiZSBmcm9tIGEgUmVuZGVyVGFyZ2V0Li4uKS5cclxuICogXHJcbiAqIEknZCBwdXQgdGhpcyBtb3JlIHNlcGFyYXRlIGZyb20gdGhlIGRhdGd1aSBtb2R1bGVzIGJ1dCBuZWVkIHRvIHRoaW5rIGEgbGl0dGxlXHJcbiAqIGJpdCBhYm91dCBob3cgdG8gc3RydWN0dXJlIHRoYXQgZXRjLiAgVmVyeSB1bi1EUlksIGJ1dCBJJ20gc3RhcnRpbmcgYnkganVzdFxyXG4gKiBjb3B5aW5nIGV4aXN0aW5nIGltYWdlYnV0dG9uLmpzIGluIGl0cyBlbnRpcmV0eS5cclxuICogXHJcbiAqIFRPRE86IG5vdCBqdXN0IHNpbXBsZSAnYmFuZycgZnVuY3Rpb24gYnV0IGNhbGxiYWNrcyBmb3IgaG92ZXIgLyBldGMuXHJcbiAqIFxyXG4gKiBcclxuICogQ29weXJpZ2h0ICBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIGluYy4gMjAxNiAvIFBldGVyIFRvZGQsIDIwMTdcclxuICogXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbWFnZUJ1dHRvbkdyaWQoIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3RzLCAvLyBhcnJheSBvZiB7ZnVuYywgaW1hZ2UgfCB0ZXh0LCB0aXAob3B0aW9uYWwpLCByZWxlYXNlKG9wdGlvbmFsKX1cclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICByb3dIZWlnaHQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEgsXHJcbiAgY29sdW1ucyA9IDRcclxufSA9IHt9ICl7XHJcbiAgXHJcbiAgY29uc3QgYnV0dG9ucyA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiBhcHBseUltYWdlVG9NYXRlcmlhbChpbWFnZSwgdGFyZ2V0TWF0ZXJpYWwpIHtcclxuICAgICAgaWYgKHR5cGVvZiBpbWFnZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIC8vVE9ETyBjYWNoZS4gIERvZXMgVGV4dHVyZUxvYWRlciBhbHJlYWR5IGNhY2hlP1xyXG4gICAgICAgIC8vVE9ETyBJbWFnZSBvbmx5IG9uIGZyb250IGZhY2Ugb2YgYnV0dG9uLlxyXG4gICAgICAgIG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCkubG9hZChpbWFnZSwgKHRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgdGV4dHVyZS53cmFwUyA9IHRleHR1cmUud3JhcFQgPSBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nO1xyXG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuaXNUZXh0dXJlKSB7XHJcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZTtcclxuICAgICAgfSBlbHNlIGlmIChpbWFnZS5pc1dlYkdMUmVuZGVyVGFyZ2V0KSB7XHJcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZS50ZXh0dXJlO1xyXG4gICAgICB9IGVsc2UgdGhyb3cgXCJub3Qgc3VyZSBob3cgdG8gaW50ZXJwcmV0IGltYWdlIFwiICsgaW1hZ2U7XHJcbiAgICAgIHRhcmdldE1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbnN0IEJVVFRPTl9XSURUSCA9IHdpZHRoICogKDEvY29sdW1ucykgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSByb3dIZWlnaHQgPiAwID8gcm93SGVpZ2h0IDogQlVUVE9OX1dJRFRIOyAvL2hlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSDtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5ndWlUeXBlID0gXCJpbWFnZWJ1dHRvbmdyaWRcIjtcclxuICBncm91cC50b1N0cmluZyA9ICgpID0+IGBbJHtncm91cC5ndWlUeXBlfTogJHtvYmplY3RzfV1gO1xyXG4gIGdyb3VwLmd1aUNoaWxkcmVuID0gYnV0dG9ucztcclxuICBcclxuICBjb25zdCByb3dzID0gTWF0aC5jZWlsKG9iamVjdHMubGVuZ3RoIC8gY29sdW1ucyk7XHJcbiAgY29uc3QgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX01BUkdJTiArIEJVVFRPTl9IRUlHSFQgKiByb3dzO1xyXG4gIGdyb3VwLnNwYWNpbmcgPSBoZWlnaHQ7IFxyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBwYW5lbC5hZGQoY29udHJvbGxlcklEKTtcclxuXHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIDEsIDEgKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIIC8gMiwgLUJVVFRPTl9IRUlHSFQgLyAyLCBCVVRUT05fREVQVEggKTtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIG9iamVjdHMuZm9yRWFjaChvYmogPT4ge1xyXG4gICAgbGV0IHN1Ymdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBzdWJncm91cC5ndWlUeXBlID0gXCJpbWFnZUJ1dHRvbkdyaWRFbGVtZW50XCI7XHJcbiAgICBncm91cC5hZGQoc3ViZ3JvdXApO1xyXG4gICAgYnV0dG9ucy5wdXNoKHN1Ymdyb3VwKTtcclxuXHJcbiAgICBjb25zdCBjb2wgPSBpICUgY29sdW1ucztcclxuICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoaSAvIGNvbHVtbnMpO1xyXG5cclxuICAgIHN1Ymdyb3VwLnBvc2l0aW9uLnggPSAwLjAyNSArIExheW91dC5QQU5FTF9NQVJHSU4gKyBCVVRUT05fV0lEVEggKiBjb2w7XHJcbiAgICBzdWJncm91cC5wb3NpdGlvbi55ID0gKGhlaWdodC8yKSAtQlVUVE9OX0hFSUdIVCAqIHJvdztcclxuICAgIHN1Ymdyb3VwLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEg7XHJcblxyXG4gICAgLy8gIGhpdHNjYW4gdm9sdW1lLlxyXG4gICAgLy8gVGhpcyBtYXRlcmlhbCBjb3VsZCBwcm9iYWJseSBiZSByZXVzZWQuXHJcbiAgICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICAgIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG5cclxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgICBtYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XHJcbiAgICBpZiAob2JqLmltYWdlKSBhcHBseUltYWdlVG9NYXRlcmlhbChvYmouaW1hZ2UsIG1hdGVyaWFsKTtcclxuICAgIGlmIChvYmoudGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0Q3JlYXRvci5jcmVhdGUob2JqLnRleHQpO1xyXG4gICAgICAgIHN1Ymdyb3VwLmFkZCh0ZXh0KTtcclxuICAgICAgICBzdWJncm91cC50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0ZXh0LnBvc2l0aW9uLnggPSAwLjMgKiBCVVRUT05fV0lEVEg7XHJcbiAgICAgICAgdGV4dC5wb3NpdGlvbi55ID0gLUJVVFRPTl9IRUlHSFQ7XHJcbiAgICAgICAgdGV4dC5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMS4yO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICAgIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcbiAgICAvL2J1dHRvbiBsYWJlbCAmIGRlc2NyaXB0b3IgbGFiZWwgcmVtb3ZlZC5cclxuICAgIC8vVG9vbHRpcCB0ZXh0IG9wdGlvbiBhZGRlZC4gIE1pZ2h0IHdhbnQgdG8gYmUgYWJsZSB0byBwYXNzIGluIHJpY2hlciB0aGluZ3MuLi5cclxuICAgIC8vbWF5YmUgYW4gYXJiaXRyYXJ5IFRIUkVFIG9iamVjdCB3b3VsZCB3b3JrIHdlbGwuLi5cclxuICAgIGlmIChvYmoudGlwKSB7XHJcbiAgICAgICAgY29uc3QgdGlwVGV4dCA9IHRleHRDcmVhdG9yLmNyZWF0ZShvYmoudGlwKTtcclxuICAgICAgICBjb25zdCB0aXBHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIHRpcEdyb3VwLnBvc2l0aW9uLnggID0gMC41ICogQlVUVE9OX1dJRFRIO1xyXG4gICAgICAgIHRpcEdyb3VwLnBvc2l0aW9uLnkgPSAtMS4yICogQlVUVE9OX0hFSUdIVDtcclxuICAgICAgICB0aXBHcm91cC5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMi41O1xyXG4gICAgICAgIHRpcEdyb3VwLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgc3ViZ3JvdXAuYWRkKHRpcEdyb3VwKTtcclxuICAgICAgICB0aXBHcm91cC5hZGQodGlwVGV4dCk7XHJcbiAgICAgICAgc3ViZ3JvdXAudGlwVGV4dCA9IHRpcEdyb3VwO1xyXG4gICAgICAgIC8vVE9ETzogY29tcHV0ZSB0ZXh0IGdlb21ldHJ5IGFuZCBhZGp1c3QuXHJcbiAgICAgICAgLy9Fc3RpbWF0ZSBmb3Igbm93LiBXaWR0aCBpcyBkb2RneSBlc3BlY2lhbGx5IGFzIGZvbnQgaXMgbm90IG1vbm9zcGFjZS5cclxuICAgICAgICBjb25zdCB3ID0gMC4wMSArIG9iai50aXAubGVuZ3RoICogQlVUVE9OX1dJRFRIIC8gMTAsIGggPSBMYXlvdXQuUEFORUxfSEVJR0hUICogMC44O1xyXG4gICAgICAgIGNvbnN0IHBhZGRlZFcgPSB3ICsgMC4wMztcclxuICAgICAgICBjb25zdCB0aXBSZWN0ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkocGFkZGVkVywgTGF5b3V0LlBBTkVMX0hFSUdIVCwgMSwgMSk7XHJcbiAgICAgICAgY29uc3QgdGlwQmFja2dyb3VuZCA9IG5ldyBUSFJFRS5NZXNoKHRpcFJlY3QsIFNoYXJlZE1hdGVyaWFscy5UT09MVElQKTtcclxuICAgICAgICB0aXBCYWNrZ3JvdW5kLnBvc2l0aW9uLnggPSAwOyAvL3BhZGRlZFcgLyAyO1xyXG4gICAgICAgIHRpcEJhY2tncm91bmQucG9zaXRpb24ueSA9IGggLyAyO1xyXG4gICAgICAgIHRpcEJhY2tncm91bmQucG9zaXRpb24ueiA9IC1CVVRUT05fREVQVEggKiAwLjU7XHJcbiAgICAgICAgdGlwR3JvdXAuYWRkKHRpcEJhY2tncm91bmQpO1xyXG5cclxuICAgICAgICAvLyB0aXBUZXh0LnBvc2l0aW9uLnggPSAwLjUgKiAoQlVUVE9OX1dJRFRIIC0gdyk7XHJcbiAgICAgICAgdGlwVGV4dC5wb3NpdGlvbi54ID0gLTAuNSAqIHc7XHJcbiAgICAgICAgLy8gdGlwVGV4dC5wb3NpdGlvbi55ID0gLTEuMiAqIEJVVFRPTl9IRUlHSFQ7XHJcbiAgICAgICAgLy8gdGlwVGV4dC5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMi41O1xyXG4gICAgICAgIC8vIHRpcFRleHQudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvL3BhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBjb250cm9sbGVySUQgKTtcclxuICAgIHN1Ymdyb3VwLmFkZCggaGl0c2NhblZvbHVtZSApO1xyXG4gICAgcGFuZWwuYWRkKHN1Ymdyb3VwKTtcclxuXHJcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgICAgICBpZiggc3ViZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLmZ1bmMoKTtcclxuICAgICAgICBzdWJncm91cC5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC40O1xyXG4gICAgICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoKXtcclxuICAgICAgICBzdWJncm91cC5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIO1xyXG4gICAgICAgIGlmIChvYmoucmVsZWFzZSkgb2JqLnJlbGVhc2UoKTtcclxuICAgIH1cclxuICAgIC8vcXVpY2sgY29sb3IgaGFjay4uLlxyXG4gICAgY29uc3QgaG92ZXJDb2wgPSBvYmoudGV4dCA/IDB4ODg4IDogMHhGRkZGRkY7XHJcbiAgICBjb25zdCBub0hvdmVyQ29sID0gb2JqLnRleHQgPyAweDExMSA6IDB4Q0NDQ0NDO1xyXG4gICAgc3ViZ3JvdXAudXBkYXRlVmlldyA9ICgpID0+IHtcclxuXHJcbiAgICAgICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBob3ZlckNvbCApO1xyXG4gICAgICAgICAgICBpZiAoc3ViZ3JvdXAudGlwVGV4dCkgc3ViZ3JvdXAudGlwVGV4dC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBub0hvdmVyQ29sICk7XHJcbiAgICAgICAgICAgIGlmIChzdWJncm91cC50aXBUZXh0KSBzdWJncm91cC50aXBUZXh0LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdWJncm91cC51cGRhdGVWaWV3KCk7XHJcblxyXG4gICAgc3ViZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICAgIHN1Ymdyb3VwLmhpdHNjYW4gPSBoaXRzY2FuVm9sdW1lOyAvL1hYWDogbWFraW5nIHRoaXMgc2luZ2xlIGVsZW1lbnQgcmF0aGVyIHRoYW4gYXJyYXksXHJcbiAgICAvL3RoYXQgbWVhbnMgdGhlc2UgJ3N1Ymdyb3VwJyBidXR0b25zIGFyZW4ndCBhY3RpbmcgZXhhY3RseSBhcyBub3JtYWwgZGF0LkdVSVZSIGNvbnRyb2xsZXJzXHJcbiAgICBpKys7XHJcbiAgfSk7XHJcblxyXG4gIGdyb3VwLmhpdHNjYW4gPSBidXR0b25zLm1hcChiPT5iLmhpdHNjYW4pOy8vLnB1c2gocGFuZWwpO1xyXG4gIGdyb3VwLmhpdHNjYW4ucHVzaChwYW5lbCk7XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKSB7XHJcbiAgICAgIGJ1dHRvbnMuZm9yRWFjaChiPT5iLnVwZGF0ZVZpZXcoKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBidXR0b25zLmZvckVhY2goYj0+e1xyXG4gICAgICAgIGIuaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIH0pO1xyXG4gICAgLy9pbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGVMYWJlbCggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgY3JlYXRlU2xpZGVyIGZyb20gJy4vc2xpZGVyJztcclxuaW1wb3J0IGNyZWF0ZUNoZWNrYm94IGZyb20gJy4vY2hlY2tib3gnO1xyXG5pbXBvcnQgY3JlYXRlQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcclxuaW1wb3J0IGNyZWF0ZUZvbGRlciBmcm9tICcuL2ZvbGRlcic7XHJcbmltcG9ydCBjcmVhdGVEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuLy9QSlQ6IEknZCByYXRoZXIgaW5qZWN0IGN1c3RvbSBleHRlbnNpb25zIGxpa2UgdGhpcywgYnV0IHdpbGwgd29yayB0aGF0IG91dCBsYXRlci5cclxuaW1wb3J0IGNyZWF0ZUltYWdlQnV0dG9uIGZyb20gJy4vaW1hZ2VidXR0b24nO1xyXG5pbXBvcnQgY3JlYXRlSW1hZ2VCdXR0b25HcmlkIGZyb20gJy4vaW1hZ2VidXR0b25ncmlkJztcclxuaW1wb3J0IGNyZWF0ZUtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnO1xyXG5pbXBvcnQgKiBhcyBTREZUZXh0IGZyb20gJy4vc2RmdGV4dCc7XHJcblxyXG5jb25zdCBHVUlWUiA9IChmdW5jdGlvbiBEQVRHVUlWUigpe1xyXG5cclxuICAvKlxyXG4gICAgU0RGIGZvbnRcclxuICAqL1xyXG4gIGNvbnN0IHRleHRDcmVhdG9yID0gU0RGVGV4dC5jcmVhdG9yKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAgTGlzdHMuXHJcbiAgICBJbnB1dE9iamVjdHMgYXJlIHRoaW5ncyBsaWtlIFZJVkUgY29udHJvbGxlcnMsIGNhcmRib2FyZCBoZWFkc2V0cywgZXRjLlxyXG4gICAgQ29udHJvbGxlcnMgYXJlIHRoZSBEQVQgR1VJIHNsaWRlcnMsIGNoZWNrYm94ZXMsIGV0Yy5cclxuICAqL1xyXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xyXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XHJcblxyXG4gIC8qXHJcbiAgICBGdW5jdGlvbnMgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgYSBnaXZlbiBjb250cm9sbGVyIGlzIHZpc2libGUgKGJ5IHdoaWNoIHdlXHJcbiAgICBtZWFuIG5vdCBoaWRkZW4sIG5vdCAndmlzaWJsZScgaW4gdGVybXMgb2YgdGhlIGNhbWVyYSBvcmllbnRhdGlvbiBldGMpLCBhbmRcclxuICAgIGZvciByZXRyaWV2aW5nIHRoZSBsaXN0IG9mIHZpc2libGUgaGl0c2Nhbk9iamVjdHMgZHluYW1pY2FsbHkuXHJcbiAgICBUaGlzIG1pZ2h0IGJlbmVmaXQgZnJvbSBzb21lIGNhY2hpbmcgZXNwZWNpYWxseSBpbiBjYXNlcyB3aXRoIGxhcmdlIGNvbXBsZXggR1VJcy5cclxuICAgIEkgaGF2ZW4ndCBtZWFzdXJlZCB0aGUgaW1wYWN0IG9mIGdhcmJhZ2UgY29sbGVjdGlvbiBldGMuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBpc0NvbnRyb2xsZXJWaXNpYmxlKGNvbnRyb2wpIHtcclxuICAgIGlmICghY29udHJvbC52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICB2YXIgZm9sZGVyID0gY29udHJvbC5mb2xkZXI7XHJcbiAgICB3aGlsZSAoZm9sZGVyLmZvbGRlciAhPT0gZm9sZGVyKXtcclxuICAgICAgZm9sZGVyID0gZm9sZGVyLmZvbGRlcjtcclxuICAgICAgaWYgKGZvbGRlci5pc0NvbGxhcHNlZCgpIHx8ICFmb2xkZXIudmlzaWJsZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldFZpc2libGVDb250cm9sbGVycygpIHtcclxuICAgIC8vIG5vdCB0ZXJyaWJseSBlZmZpY2llbnRcclxuICAgIHJldHVybiBjb250cm9sbGVycy5maWx0ZXIoIGlzQ29udHJvbGxlclZpc2libGUgKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCkge1xyXG4gICAgY29uc3QgdG1wID0gZ2V0VmlzaWJsZUNvbnRyb2xsZXJzKCkubWFwKCBvID0+IHsgcmV0dXJuIG8uaGl0c2NhbjsgfSApXHJcbiAgICByZXR1cm4gdG1wLnJlZHVjZSgoYSwgYikgPT4geyByZXR1cm4gYS5jb25jYXQoYil9LCBbXSk7XHJcbiAgfVxyXG5cclxuICBsZXQgbW91c2VFbmFibGVkID0gZmFsc2U7XHJcbiAgbGV0IG1vdXNlUmVuZGVyZXIgPSB1bmRlZmluZWQ7XHJcblxyXG4gIGZ1bmN0aW9uIGVuYWJsZU1vdXNlKCBjYW1lcmEsIHJlbmRlcmVyICl7XHJcbiAgICBtb3VzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgbW91c2VSZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgbW91c2VJbnB1dC5tb3VzZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgIHJldHVybiBtb3VzZUlucHV0Lmxhc2VyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZGlzYWJsZU1vdXNlKCl7XHJcbiAgICBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAgVGhlIGRlZmF1bHQgbGFzZXIgcG9pbnRlciBjb21pbmcgb3V0IG9mIGVhY2ggSW5wdXRPYmplY3QuXHJcbiAgKi9cclxuICBjb25zdCBsYXNlck1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjoweDU1YWFmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0pO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUxhc2VyKCl7XHJcbiAgICBjb25zdCBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKCkgKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApICk7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLkxpbmUoIGcsIGxhc2VyTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQSBcImN1cnNvclwiLCBlZyB0aGUgYmFsbCB0aGF0IGFwcGVhcnMgYXQgdGhlIGVuZCBvZiB5b3VyIGxhc2VyLlxyXG4gICovXHJcbiAgY29uc3QgY3Vyc29yTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NDQ0NDQ0LCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSApO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUN1cnNvcigpe1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMDYsIDQsIDQgKSwgY3Vyc29yTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBDcmVhdGVzIGEgZ2VuZXJpYyBJbnB1dCB0eXBlLlxyXG4gICAgVGFrZXMgYW55IFRIUkVFLk9iamVjdDNEIHR5cGUgb2JqZWN0IGFuZCB1c2VzIGl0cyBwb3NpdGlvblxyXG4gICAgYW5kIG9yaWVudGF0aW9uIGFzIGFuIGlucHV0IGRldmljZS5cclxuXHJcbiAgICBBIGxhc2VyIHBvaW50ZXIgaXMgaW5jbHVkZWQgYW5kIHdpbGwgYmUgdXBkYXRlZC5cclxuICAgIENvbnRhaW5zIHN0YXRlIGFib3V0IHdoaWNoIEludGVyYWN0aW9uIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIG9yIGhvdmVyLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gY3JlYXRlSW5wdXQoIGlucHV0T2JqZWN0ID0gbmV3IFRIUkVFLkdyb3VwKCkgKXtcclxuICAgIGNvbnN0IGlucHV0ID0ge1xyXG4gICAgICByYXljYXN0OiBuZXcgVEhSRUUuUmF5Y2FzdGVyKCBuZXcgVEhSRUUuVmVjdG9yMygpLCBuZXcgVEhSRUUuVmVjdG9yMygpICksXHJcbiAgICAgIGxhc2VyOiBjcmVhdGVMYXNlcigpLFxyXG4gICAgICBjdXJzb3I6IGNyZWF0ZUN1cnNvcigpLFxyXG4gICAgICBvYmplY3Q6IGlucHV0T2JqZWN0LFxyXG4gICAgICBwcmVzc2VkOiBmYWxzZSxcclxuICAgICAgZ3JpcHBlZDogZmFsc2UsXHJcbiAgICAgIGV2ZW50czogbmV3IEVtaXR0ZXIoKSxcclxuICAgICAgaW50ZXJhY3Rpb246IHtcclxuICAgICAgICBncmlwOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcHJlc3M6IHVuZGVmaW5lZCxcclxuICAgICAgICBob3ZlcjogdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuYWRkKCBpbnB1dC5jdXJzb3IgKTtcclxuXHJcbiAgICByZXR1cm4gaW5wdXQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIE1vdXNlSW5wdXQuXHJcbiAgICBBbGxvd3MgeW91IHRvIGNsaWNrIG9uIHRoZSBzY3JlZW4gd2hlbiBub3QgaW4gVlIgZm9yIGRlYnVnZ2luZy5cclxuICAqL1xyXG4gIGNvbnN0IG1vdXNlSW5wdXQgPSBjcmVhdGVNb3VzZUlucHV0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU1vdXNlSW5wdXQoKXtcclxuICAgIGNvbnN0IG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoLTEsLTEpO1xyXG5cclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoKTtcclxuICAgIGlucHV0Lm1vdXNlID0gbW91c2U7XHJcbiAgICBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICBpbnB1dC5tb3VzZU9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICBpbnB1dC5tb3VzZVBsYW5lID0gbmV3IFRIUkVFLlBsYW5lKCk7XHJcbiAgICBpbnB1dC5pbnRlcnNlY3Rpb25zID0gW107XHJcblxyXG4gICAgLy8gIHNldCBteSBlbmFibGVNb3VzZVxyXG4gICAgaW5wdXQubW91c2VDYW1lcmEgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgLy8gaWYgYSBzcGVjaWZpYyByZW5kZXJlciBoYXMgYmVlbiBkZWZpbmVkXHJcbiAgICAgIGlmIChtb3VzZVJlbmRlcmVyKSB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50UmVjdCA9IG1vdXNlUmVuZGVyZXIuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBtb3VzZS54ID0gKCAoZXZlbnQuY2xpZW50WCAtIGNsaWVudFJlY3QubGVmdCkgLyBjbGllbnRSZWN0LndpZHRoKSAqIDIgLSAxO1xyXG4gICAgICAgIG1vdXNlLnkgPSAtICggKGV2ZW50LmNsaWVudFkgLSBjbGllbnRSZWN0LnRvcCkgLyBjbGllbnRSZWN0LmhlaWdodCkgKiAyICsgMTtcclxuICAgICAgfVxyXG4gICAgICAvLyBkZWZhdWx0IHRvIGZ1bGxzY3JlZW5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcclxuICAgICAgICBtb3VzZS55ID0gLSAoIGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKSAqIDIgKyAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpZiAoaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gcHJldmVudCBtb3VzZSBkb3duIGZyb20gdHJpZ2dlcmluZyBvdGhlciBsaXN0ZW5lcnMgKHBvbHlmaWxsLCBldGMpXHJcbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaW5wdXQucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0sIHRydWUgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGlucHV0O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgZnVuY3Rpb24gdXNlcnMgcnVuIHRvIGdpdmUgREFUIEdVSSBhbiBpbnB1dCBkZXZpY2UuXHJcbiAgICBBdXRvbWF0aWNhbGx5IGRldGVjdHMgZm9yIFZpdmVDb250cm9sbGVyIGFuZCBiaW5kcyBidXR0b25zICsgaGFwdGljIGZlZWRiYWNrLlxyXG5cclxuICAgIFJldHVybnMgYSBsYXNlciBwb2ludGVyIHNvIGl0IGNhbiBiZSBkaXJlY3RseSBhZGRlZCB0byBzY2VuZS5cclxuXHJcbiAgICBUaGUgbGFzZXIgd2lsbCB0aGVuIGhhdmUgdHdvIG1ldGhvZHM6XHJcbiAgICBsYXNlci5wcmVzc2VkKCksIGxhc2VyLmdyaXBwZWQoKVxyXG5cclxuICAgIFRoZXNlIGNhbiB0aGVuIGJlIGJvdW5kIHRvIGFueSBidXR0b24gdGhlIHVzZXIgd2FudHMuIFVzZWZ1bCBmb3IgYmluZGluZyB0b1xyXG4gICAgY2FyZGJvYXJkIG9yIGFsdGVybmF0ZSBpbnB1dCBkZXZpY2VzLlxyXG5cclxuICAgIEZvciBleGFtcGxlLi4uXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbigpeyBsYXNlci5wcmVzc2VkKCB0cnVlICk7IH0gKTtcclxuICAqL1xyXG4gIGZ1bmN0aW9uIGFkZElucHV0T2JqZWN0KCBvYmplY3QgKXtcclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoIG9iamVjdCApO1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLnByZXNzZWQgPSBmdW5jdGlvbiggZmxhZyApe1xyXG4gICAgICAvLyBvbmx5IHBheSBhdHRlbnRpb24gdG8gcHJlc3NlcyBvdmVyIHRoZSBHVUlcclxuICAgICAgaWYgKGZsYWcgJiYgKGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuZ3JpcHBlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIGlucHV0LmdyaXBwZWQgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5jdXJzb3IgPSBpbnB1dC5jdXJzb3I7XHJcblxyXG4gICAgaWYoIFRIUkVFLlZpdmVDb250cm9sbGVyICYmIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlZpdmVDb250cm9sbGVyICl7XHJcbiAgICAgIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIG9iamVjdCwgaW5wdXQubGFzZXIucHJlc3NlZCwgaW5wdXQubGFzZXIuZ3JpcHBlZCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0T2JqZWN0cy5wdXNoKCBpbnB1dCApO1xyXG5cclxuICAgIHJldHVybiBpbnB1dC5sYXNlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBIZXJlIGFyZSB0aGUgbWFpbiBkYXQgZ3VpIGNvbnRyb2xsZXIgdHlwZXMuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgbWluID0gMC4wLCBtYXggPSAxMDAuMCApe1xyXG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCB7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgbWluLCBtYXgsXHJcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggc2xpZGVyICk7XHJcblxyXG4gICAgcmV0dXJuIHNsaWRlcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgY2hlY2tib3ggPSBjcmVhdGVDaGVja2JveCh7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBjaGVja2JveCApO1xyXG5cclxuICAgIHJldHVybiBjaGVja2JveDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH1cclxuICBcclxuICAvKipcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIHRvIGNhbGwgYmFjayB3aGVuIGJ1dHRvbiBwcmVzc2VkXHJcbiAgICogQHBhcmFtIHsqfSBpbWFnZSBjYW4gYmUgZmlsZW5hbWUsIFdlYkdMUmVuZGVyVGFyZ2V0IG9yIE1hdGVyaWFsXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSB3aWRlIHdoZXRoZXIgdG8gbWFrZSBidXR0b24gZmlsbCBlbnRpcmUgd2lkdGggb2YgcGFuZWwgKGFwaSBzdWJqZWN0IHRvIGNoYW5nZSlcclxuICAgKi9cclxuICBmdW5jdGlvbiBhZGRJbWFnZUJ1dHRvbihmdW5jLCBpbWFnZSwgd2lkZSkge1xyXG4gICAgY29uc3Qgb2JqZWN0ID0geyBmOiBmdW5jIH07XHJcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSAnZic7XHJcblxyXG5cclxuICAgIC8vc2VlIGFsc28gZm9sZGVyLmpzIHdoZXJlIHRoaXMgaXMgYWRkZWQgdG8gZ3JvdXAgb2JqZWN0Li4uXHJcbiAgICAvL2FzIHN1Y2ggdGhpcyBmdW5jdGlvbiBhbHNvIG5lZWRzIHRvIGJlIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byBjcmVhdGVGb2xkZXIuXHJcbiAgICAvL3BlcmhhcHMgYWxsIG9mIHRoZXNlICdhZGRYJyBmdW5jdGlvbnMgY291bGQgYmUgaW5pdGlhbGx5IHB1dCBvbnRvIGFuIG9iamVjdCBzbyB0aGF0XHJcbiAgICAvL25ldyBhZGRpdGlvbnMgY291bGQgYmUgYWRkZWQgc2xpZ2h0bHkgbW9yZSBlYXNpbHkuXHJcbiAgICBjb25zdCBidXR0b24gPSBjcmVhdGVJbWFnZUJ1dHRvbih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBvYmplY3QsIHByb3BlcnR5TmFtZSwgaW1hZ2UsIHdpZGVcclxuICAgIH0pO1xyXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICBUaGlzIGludGVyZmFjZSBtYXkgYmUgc3ViamVjdCB0byBjaGFuZ2UuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBhZGRJbWFnZUJ1dHRvbkdyaWQoLi4uYXJncykge1xyXG4gICAgY29uc3Qgb2JqZWN0cyA9IGFyZ3M7XHJcbiAgICBjb25zdCBncmlkID0gY3JlYXRlSW1hZ2VCdXR0b25HcmlkKHt0ZXh0Q3JlYXRvciwgb2JqZWN0cywgY29sdW1uczogNX0pO1xyXG4gICAgY29udHJvbGxlcnMucHVzaChncmlkKTtcclxuICAgIHJldHVybiBncmlkO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkS2V5Ym9hcmQoa2V5TGlzdGVuZXIpIHtcclxuICAgIGlmICgha2V5TGlzdGVuZXIpIGtleUxpc3RlbmVyID0gKGspID0+IGNvbnNvbGUubG9nKGBrZXlEb3duICR7a31gKTtcclxuICAgIGNvbnN0IGtiID0gY3JlYXRlS2V5Ym9hcmQoe2tleUxpc3RlbmVyLCB0ZXh0Q3JlYXRvcn0pO1xyXG4gICAgY29udHJvbGxlcnMucHVzaChrYik7XHJcbiAgICByZXR1cm4ga2I7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9wdGlvbnMgKXtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gY3JlYXRlRHJvcGRvd24oe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGRyb3Bkb3duICk7XHJcbiAgICByZXR1cm4gZHJvcGRvd247XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEFuIGltcGxpY2l0IEFkZCBmdW5jdGlvbiB3aGljaCBkZXRlY3RzIGZvciBwcm9wZXJ0eSB0eXBlXHJcbiAgICBhbmQgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IGNvbnRyb2xsZXIuXHJcblxyXG4gICAgRHJvcGRvd246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9iamVjdFR5cGUgKVxyXG5cclxuICAgIFNsaWRlcjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZOdW1iZXJUeXBlLCBtaW4sIG1heCApXHJcblxyXG4gICAgQ2hlY2tib3g6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mQm9vbGVhblR5cGUgKVxyXG5cclxuICAgIEJ1dHRvbjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZGdW5jdGlvblR5cGUgKVxyXG5cclxuICAgIE5vdCB1c2VkIGRpcmVjdGx5LiBVc2VkIGJ5IGZvbGRlcnMuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApe1xyXG5cclxuICAgIGlmKCBvYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG5cclxuICAgIGlmKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS53YXJuKCAnbm8gcHJvcGVydHkgbmFtZWQnLCBwcm9wZXJ0eU5hbWUsICdvbiBvYmplY3QnLCBvYmplY3QgKTtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc09iamVjdCggYXJnMyApIHx8IGlzQXJyYXkoIGFyZzMgKSApe1xyXG4gICAgICByZXR1cm4gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzTnVtYmVyKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc0Jvb2xlYW4oIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNGdW5jdGlvbiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGFkZCBjb3VsZG4ndCBmaWd1cmUgaXQgb3V0LCBwYXNzIGl0IGJhY2sgdG8gZm9sZGVyXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2ltcGxlU2xpZGVyKCBtaW4gPSAwLCBtYXggPSAxICl7XHJcbiAgICBjb25zdCBwcm94eSA9IHtcclxuICAgICAgbnVtYmVyOiBtaW5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFkZFNsaWRlciggcHJveHksICdudW1iZXInLCBtaW4sIG1heCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2ltcGxlRHJvcGRvd24oIG9wdGlvbnMgPSBbXSApe1xyXG4gICAgY29uc3QgcHJveHkgPSB7XHJcbiAgICAgIG9wdGlvbjogJydcclxuICAgIH07XHJcblxyXG4gICAgaWYoIG9wdGlvbnMgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBwcm94eS5vcHRpb24gPSBpc0FycmF5KCBvcHRpb25zICkgPyBvcHRpb25zWyAwIF0gOiBvcHRpb25zWyBPYmplY3Qua2V5cyhvcHRpb25zKVswXSBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhZGREcm9wZG93biggcHJveHksICdvcHRpb24nLCBvcHRpb25zICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRTaW1wbGVDaGVja2JveCggZGVmYXVsdE9wdGlvbiA9IGZhbHNlICl7XHJcbiAgICBjb25zdCBwcm94eSA9IHtcclxuICAgICAgY2hlY2tlZDogZGVmYXVsdE9wdGlvblxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWRkQ2hlY2tib3goIHByb3h5LCAnY2hlY2tlZCcgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZUJ1dHRvbiggZm4gKXtcclxuICAgIGNvbnN0IHByb3h5ID0ge1xyXG4gICAgICBidXR0b246IChmbiE9PXVuZGVmaW5lZCkgPyBmbiA6IGZ1bmN0aW9uKCl7fVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWRkQnV0dG9uKCBwcm94eSwgJ2J1dHRvbicgKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgTm90IHVzZWQgZGlyZWN0bHk7IHVzZWQgYnkgZm9sZGVycy5cclxuICBSZW1vdmUgY29udHJvbGxlcnMgZnJvbSB0aGUgZ2xvYmFsIGxpc3Qgb2YgYWxsIGNvbnRyb2xsZXJzIGtub3duIHRvIGRhdC5HVUlWUi5cclxuICBDYWxscyByZW1vdmVUZXN0IGZpcnN0IHRvIGNoZWNrIGlucHV0IGFyZ3VtZW50cy4gIHJldHVybnMgZmFsc2UgaWYgdGhpcyB0ZXN0IGZhaWxzLlxyXG4gIHJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLlxyXG5cclxuICBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBkb2VzIG5vdCByZWN1cnNpdmVseSByZW1vdmUgZWxlbWVudHMgZnJvbSBmb2xkZXJzOyB0aGF0IGlzIGRlYWx0IHdpdGggaW4gdGhlIGZvbGRlciBjb2RlIHdoaWNoIGNhbGxzIHRoaXMuXHJcbiAgXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVtb3ZlKCAuLi5hcmdzICl7XHJcbiAgICBsZXQgYXJnU2V0ID0gWyAuLi5uZXcgU2V0KGFyZ3MpIF07IC8vanVzdCBpbiBjYXNlIHRoZXJlIHdlcmUgcmVwZWF0ZWQgZWxlbWVudHMgaW4gYXJncywgdHVybiBpbnRvIFNldCB0aGVuIGJhY2sgdG8gYXJyYXkuXHJcbiAgICBpZiAoICFyZW1vdmVUZXN0KC4uLmFyZ1NldCkgKSByZXR1cm4gZmFsc2U7XHJcbiAgICBhcmdTZXQuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICB2YXIgaSA9IGNvbnRyb2xsZXJzLmluZGV4T2YoIG9iaiApO1xyXG4gICAgICBpZiAoIGkgPiAtMSkgY29udHJvbGxlcnMuc3BsaWNlKCBpLCAxICk7XHJcbiAgICAgIGVsc2UgeyAvLyBJIGNhbid0IHNlZSBob3cgdGhpcydkIGhhcHBlbiBub3cgd2UgZ3VhcmQgYWdhaW5zdCByZXBlYXRlZCBlbGVtZW50cy5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIkludGVybmFsIGVycm9yIGluIHJlbW92ZSwgbm90IGFudGljaXBhdGVkIGJ5IHJlbW92ZVRlc3QuIEludGVybmFsIGRhdC5HVUlWUiBzdGF0ZSBtYXkgYmUgaW5jb25zaXN0ZW50LlwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIFZlcmlmeSB0aGF0IGFsbCBvZiB0aGUgaXRlbXMgaW4gcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBleGlzdGluZyBjb250cm9sbGVycyB0aGF0IHNob3VsZCBiZSBvayB0byByZW1vdmUuXHJcblxyXG4gIFJldHVybnMgZmFsc2UgaWYgdGhlcmUgYXJlIGFueSBtaXNtYXRjaGVzLCB0cnVlIGlmIGJlbGlldmVkIG9rIHRvIGNvbnRpbnVlIHdpdGggYWN0dWFsIHJlbW92ZSgpXHJcblxyXG4gIElmIGFueSBvZiB0aGUgcHJvdmlkZWQgYXJncyBhcmUgZm9sZGVycyAoaGF2ZSBpc0ZvbGRlciBwcm9wZXJ0eSkgdGhpcyBpcyBjYWxsZWQgcmVjdXJzaXZlbHkuXHJcbiAgVGhpcyB3aWxsIHJlc3VsdCBpbiByZWR1bmRhbnQgd29yayBhcyBlYWNoIGZvbGRlciB3aWxsIGFsc28gY2FsbCBpdCBhZ2FpbiBhcyBpdCdzIHJlbW92ZWQsIGJ1dCB0aGlzIGlzIGNoZWFwXHJcbiAgYW5kIGl0IG1lYW5zIHRoYXQgYW55IGVycm9yIHNob3VsZCBiZSBjYXVnaHQgYXMgZWFybHkgYXMgcG9zc2libGUgYW5kIHRoZSB3aG9sZSBwcm9jZXNzIGFib3J0ZWQuXHJcbiAgKi9cclxuICBmdW5jdGlvbiByZW1vdmVUZXN0KCAuLi5hcmdzICkge1xyXG4gICAgZm9yICh2YXIgaT0wOyBpPGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG9iaiA9IGFyZ3NbaV07XHJcbiAgICAgIGlmIChjb250cm9sbGVycy5pbmRleE9mKG9iaikgPT09IC0xIHx8ICFvYmouZm9sZGVyLmhhc0NoaWxkKG9iaikpIHtcclxuICAgICAgICAvL1RPRE86IHRvU3RyaW5nIGltcGxlbWVudGF0aW9ucyBmb3IgY29udHJvbGxlcnNcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbid0IHJlbW92ZSBjb250cm9sbGVyIFwiICsgb2JqKTsgLy9ub3Qgc3VyZSB0aGUgcHJlZmVycmVkIHdheSBvZiByZXBvcnRpbmcgcHJvYmxlbSB0byB1c2VyLlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmlzRm9sZGVyKSB7XHJcbiAgICAgICAgaWYgKCFyZW1vdmVUZXN0KCAuLi5vYmouZ3VpQ2hpbGRyZW4gKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxyXG5cclxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cclxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXHJcblxyXG4gICAgRm9sZGVycyBhcmUgZ2l2ZW4gdGhlIGFkZCgpIGZ1bmN0aW9uYWxpdHkgc28gdGhhdCB0aGV5IGNhbiBkb1xyXG4gICAgZm9sZGVyLmFkZCggLi4uICkgdG8gY3JlYXRlIGNvbnRyb2xsZXJzLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSggbmFtZSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gY3JlYXRlRm9sZGVyKHtcclxuICAgICAgdGV4dENyZWF0b3IsXHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIGd1aUFkZDogYWRkLFxyXG4gICAgICBndWlSZW1vdmU6IHJlbW92ZSxcclxuICAgICAgYWRkQ29udHJvbGxlckZ1bmNzOiB7XHJcbiAgICAgICAgYWRkU2xpZGVyOiBhZGRTaW1wbGVTbGlkZXIsXHJcbiAgICAgICAgYWRkRHJvcGRvd246IGFkZFNpbXBsZURyb3Bkb3duLFxyXG4gICAgICAgIGFkZENoZWNrYm94OiBhZGRTaW1wbGVDaGVja2JveCxcclxuICAgICAgICBhZGRCdXR0b246IGFkZFNpbXBsZUJ1dHRvbixcclxuICAgICAgICBhZGRJbWFnZUJ1dHRvbjogYWRkSW1hZ2VCdXR0b24sXHJcbiAgICAgICAgYWRkSW1hZ2VCdXR0b25QYW5lbDogYWRkSW1hZ2VCdXR0b25HcmlkLFxyXG4gICAgICAgIGFkZEtleWJvYXJkOiBhZGRLZXlib2FyZFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBmb2xkZXIgKTtcclxuXHJcbiAgICByZXR1cm4gZm9sZGVyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQZXJmb3JtIHRoZSBuZWNlc3NhcnkgdXBkYXRlcywgcmF5Y2FzdHMgb24gaXRzIG93biBSQUYuXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XHJcbiAgY29uc3QgdE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgdmFyIGhpdHNjYW5PYmplY3RzID0gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBtb3VzZUlucHV0LmludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIG1vdXNlSW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yfSA9IHt9LCBpbmRleCApe1xyXG4gICAgICBvYmplY3QudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICAgIHRQb3NpdGlvbi5zZXQoMCwwLDApLnNldEZyb21NYXRyaXhQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIHRNYXRyaXguaWRlbnRpdHkoKS5leHRyYWN0Um90YXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0RGlyZWN0aW9uLnNldCgwLDAsLTEpLmFwcGx5TWF0cml4NCggdE1hdHJpeCApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgICAgcmF5Y2FzdC5zZXQoIHRQb3NpdGlvbiwgdERpcmVjdGlvbiApO1xyXG5cclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDAgXS5jb3B5KCB0UG9zaXRpb24gKTtcclxuXHJcbiAgICAgIC8vICBkZWJ1Zy4uLlxyXG4gICAgICAvLyBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHRQb3NpdGlvbiApLmFkZCggdERpcmVjdGlvbi5tdWx0aXBseVNjYWxhciggMSApICk7XHJcblxyXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcblxyXG4gICAgICBpbnB1dE9iamVjdHNbIGluZGV4IF0uaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnM7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dE9iamVjdHMuc2xpY2UoKTtcclxuXHJcbiAgICBpZiggbW91c2VFbmFibGVkICl7XHJcbiAgICAgIGlucHV0cy5wdXNoKCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGNvbnRyb2xsZXIgKXtcclxuICAgICAgLy9uYiwgd2UgY291bGQgZG8gYSBtb3JlIHRob3JvdWdoIGNoZWNrIGZvciB2aXNpYmlsdHksIG5vdCBzdXJlIGhvdyBpbXBvcnRhbnRcclxuICAgICAgLy90aGlzIGJpdCBpcyBhdCB0aGlzIHN0YWdlLi4uXHJcbiAgICAgIGlmIChjb250cm9sbGVyLnZpc2libGUpIGNvbnRyb2xsZXIudXBkYXRlQ29udHJvbCggaW5wdXRzICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUxhc2VyKCBsYXNlciwgcG9pbnQgKXtcclxuICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggcG9pbnQgKTtcclxuICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XHJcbiAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKXtcclxuICAgIGlmKCBpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcclxuICAgICAgY29uc3QgZmlyc3RIaXQgPSBpbnRlcnNlY3Rpb25zWyAwIF07XHJcbiAgICAgIHVwZGF0ZUxhc2VyKCBsYXNlciwgZmlyc3RIaXQucG9pbnQgKTtcclxuICAgICAgY3Vyc29yLnBvc2l0aW9uLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgY3Vyc29yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsYXNlci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZU1vdXNlSW50ZXJzZWN0aW9uKCBpbnRlcnNlY3Rpb24sIGxhc2VyLCBjdXJzb3IgKXtcclxuICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBpbnRlcnNlY3Rpb24gKTtcclxuICAgIHVwZGF0ZUxhc2VyKCBsYXNlciwgY3Vyc29yLnBvc2l0aW9uICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnRlcnNlY3Rpb24oIHJheWNhc3QsIG1vdXNlLCBjYW1lcmEgKXtcclxuICAgIHJheWNhc3Quc2V0RnJvbUNhbWVyYSggbW91c2UsIGNhbWVyYSApO1xyXG4gICAgY29uc3QgaGl0c2Nhbk9iamVjdHMgPSBnZXRWaXNpYmxlSGl0c2Nhbk9iamVjdHMoKTtcclxuICAgIHJldHVybiByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VJbnRlcnNlY3RzUGxhbmUoIHJheWNhc3QsIHYsIHBsYW5lICl7XHJcbiAgICByZXR1cm4gcmF5Y2FzdC5yYXkuaW50ZXJzZWN0UGxhbmUoIHBsYW5lLCB2ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yLG1vdXNlLG1vdXNlQ2FtZXJhfSA9IHt9ICl7XHJcbiAgICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGlmIChtb3VzZUNhbWVyYSkge1xyXG4gICAgICBpbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW50ZXJzZWN0aW9uKCByYXljYXN0LCBtb3VzZSwgbW91c2VDYW1lcmEgKTtcclxuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgbWV0aG9kcy5cclxuICAqL1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY3JlYXRlLFxyXG4gICAgYWRkSW5wdXRPYmplY3QsXHJcbiAgICBlbmFibGVNb3VzZSxcclxuICAgIGRpc2FibGVNb3VzZVxyXG4gIH07XHJcblxyXG59KCkpO1xyXG5cclxuaWYoIHdpbmRvdyApe1xyXG4gIGlmKCB3aW5kb3cuZGF0ID09PSB1bmRlZmluZWQgKXtcclxuICAgIHdpbmRvdy5kYXQgPSB7fTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5kYXQuR1VJVlIgPSBHVUlWUjtcclxufVxyXG5cclxuaWYoIG1vZHVsZSApe1xyXG4gIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZGF0OiBHVUlWUlxyXG4gIH07XHJcbn1cclxuXHJcbmlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gIGRlZmluZShbXSwgR1VJVlIpO1xyXG59XHJcblxyXG4vKlxyXG4gIEJ1bmNoIG9mIHN0YXRlLWxlc3MgdXRpbGl0eSBmdW5jdGlvbnMuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XHJcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNCb29sZWFuKG4pe1xyXG4gIHJldHVybiB0eXBlb2YgbiA9PT0gJ2Jvb2xlYW4nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xyXG4gIGNvbnN0IGdldFR5cGUgPSB7fTtcclxuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG4vLyAgb25seSB7fSBvYmplY3RzIG5vdCBhcnJheXNcclxuLy8gICAgICAgICAgICAgICAgICAgIHdoaWNoIGFyZSB0ZWNobmljYWxseSBvYmplY3RzIGJ1dCB5b3UncmUganVzdCBiZWluZyBwZWRhbnRpY1xyXG5mdW5jdGlvbiBpc09iamVjdCAoaXRlbSkge1xyXG4gIHJldHVybiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FycmF5KCBvICl7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG8gKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICBDb250cm9sbGVyLXNwZWNpZmljIHN1cHBvcnQuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LCBjb250cm9sbGVyLCBwcmVzc2VkLCBncmlwcGVkICl7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcmRvd24nLCAoKT0+cHJlc3NlZCggdHJ1ZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcnVwJywgKCk9PnByZXNzZWQoIGZhbHNlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc2Rvd24nLCAoKT0+Z3JpcHBlZCggdHJ1ZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHN1cCcsICgpPT5ncmlwcGVkKCBmYWxzZSApICk7XHJcblxyXG4gIGNvbnN0IGdhbWVwYWQgPSBjb250cm9sbGVyLmdldEdhbWVwYWQoKTtcclxuICBmdW5jdGlvbiB2aWJyYXRlKCB0LCBhICl7XHJcbiAgICBpZiggZ2FtZXBhZCAmJiBnYW1lcGFkLmhhcHRpY0FjdHVhdG9ycy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGdhbWVwYWQuaGFwdGljQWN0dWF0b3JzWyAwIF0ucHVsc2UoIHQsIGEgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NUYXAoKXtcclxuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoMS1hLCAwLjUpLCAxMCwgMjAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NFY2hvKCl7XHJcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDQsIDEuMCAqICgxLWEpKSwgMTAwLCA0ICk7XHJcbiAgfVxyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdvbkNvbnRyb2xsZXJIZWxkJywgZnVuY3Rpb24oIGlucHV0ICl7XHJcbiAgICB2aWJyYXRlKCAwLjMsIDAuMyApO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdncmFiYmVkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NUYXAoKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYlJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3Bpbm5lZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzVGFwKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3BpblJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldEludGVydmFsVGltZXMoIGNiLCBkZWxheSwgdGltZXMgKXtcclxuICBsZXQgeCA9IDA7XHJcbiAgbGV0IGlkID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCl7XHJcbiAgICBjYiggeCwgdGltZXMsIHgvdGltZXMgKTtcclxuICAgIHgrKztcclxuICAgIGlmKCB4Pj10aW1lcyApe1xyXG4gICAgICBjbGVhckludGVydmFsKCBpZCApO1xyXG4gICAgfVxyXG4gIH0sIGRlbGF5ICk7XHJcbiAgcmV0dXJuIGlkO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUludGVyYWN0aW9uKCBoaXRWb2x1bWUgKXtcclxuICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xyXG5cclxuICBsZXQgYW55SG92ZXIgPSBmYWxzZTtcclxuICBsZXQgYW55UHJlc3NpbmcgPSBmYWxzZTtcclxuICBsZXQgYW55QWN0aXZlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHRWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGNvbnN0IGF2YWlsYWJsZUlucHV0cyA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoIGlucHV0T2JqZWN0cyApe1xyXG5cclxuICAgIGFueUhvdmVyID0gZmFsc2U7XHJcbiAgICBhbnlQcmVzc2luZyA9IGZhbHNlO1xyXG4gICAgYW55QWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG5cclxuICAgICAgaWYoIGF2YWlsYWJsZUlucHV0cy5pbmRleE9mKCBpbnB1dCApIDwgMCApe1xyXG4gICAgICAgIGF2YWlsYWJsZUlucHV0cy5wdXNoKCBpbnB1dCApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB7IGhpdE9iamVjdCwgaGl0UG9pbnQgfSA9IGV4dHJhY3RIaXQoIGlucHV0ICk7XHJcblxyXG4gICAgICB2YXIgaG92ZXIgPSBoaXRWb2x1bWUgPT09IGhpdE9iamVjdDtcclxuICAgICAgYW55SG92ZXIgPSBhbnlIb3ZlciB8fCBob3ZlcjtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAncHJlc3NlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAncHJlc3MnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25QcmVzc2VkJyxcclxuICAgICAgICBob2xkTmFtZTogJ3ByZXNzaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VkJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAnZ3JpcHBlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAnZ3JpcCcsXHJcbiAgICAgICAgZG93bk5hbWU6ICdvbkdyaXBwZWQnLFxyXG4gICAgICAgIGhvbGROYW1lOiAnZ3JpcHBpbmcnLFxyXG4gICAgICAgIHVwTmFtZTogJ29uUmVsZWFzZUdyaXAnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoICd0aWNrJywge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XHJcbiAgICAgIH0gKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBleHRyYWN0SGl0KCBpbnB1dCApe1xyXG4gICAgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDAgKXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoaXRQb2ludDogdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCksXHJcbiAgICAgICAgaGl0T2JqZWN0OiB1bmRlZmluZWQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhpdFBvaW50OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQsXHJcbiAgICAgICAgaGl0T2JqZWN0OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgaW5wdXQsIGhvdmVyLFxyXG4gICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcclxuICB9ID0ge30gKXtcclxuXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBoaXRPYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGhvdmVyaW5nIGFuZCBidXR0b24gZG93biBidXQgbm8gaW50ZXJhY3Rpb25zIGFjdGl2ZSB5ZXRcclxuICAgIGlmKCBob3ZlciAmJiBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSB0cnVlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGV2ZW50cy5lbWl0KCBkb3duTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgaWYoIHBheWxvYWQubG9ja2VkICl7XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gaW50ZXJhY3Rpb247XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSBpbnRlcmFjdGlvbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG4gICAgICBhbnlBY3RpdmUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBidXR0b24gc3RpbGwgZG93biBhbmQgdGhpcyBpcyB0aGUgYWN0aXZlIGludGVyYWN0aW9uXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxyXG4gICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCBob2xkTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgaW5wdXQuZXZlbnRzLmVtaXQoICdvbkNvbnRyb2xsZXJIZWxkJyApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBidXR0b24gbm90IGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gPT09IGZhbHNlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcclxuICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gdW5kZWZpbmVkO1xyXG4gICAgICBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9IHVuZGVmaW5lZDtcclxuICAgICAgZXZlbnRzLmVtaXQoIHVwTmFtZSwge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc01haW5Ib3Zlcigpe1xyXG5cclxuICAgIGxldCBub01haW5Ib3ZlciA9IHRydWU7XHJcbiAgICBmb3IoIGxldCBpPTA7IGk8YXZhaWxhYmxlSW5wdXRzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHNbIGkgXS5pbnRlcmFjdGlvbi5ob3ZlciAhPT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgbm9NYWluSG92ZXIgPSBmYWxzZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCBub01haW5Ib3ZlciApe1xyXG4gICAgICByZXR1cm4gYW55SG92ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGF2YWlsYWJsZUlucHV0cy5maWx0ZXIoIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgICByZXR1cm4gaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPT09IGludGVyYWN0aW9uO1xyXG4gICAgfSkubGVuZ3RoID4gMCApe1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSB7XHJcbiAgICBob3ZlcmluZzogaXNNYWluSG92ZXIsXHJcbiAgICBwcmVzc2luZzogKCk9PmFueVByZXNzaW5nLFxyXG4gICAgdXBkYXRlLFxyXG4gICAgZXZlbnRzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiAqIFxyXG4gKiBUT0RPOiBTaGlmdCwgcmV0dXJuLCBiYWNrc3BhY2UuLi4gY3Vyc29ycy4uLlxyXG4gKiBNYXliZSBzb21ldGhpbmcgbGlrZSBtb2JpbGUgaW5wdXQgd2hlcmUgeW91IHN3aXRjaCBiZXR3ZWVuIGxldHRlcnMgJiBudW1iZXJzIC8gc3ltYm9sc1xyXG4gKiBcclxuICogU29tZXRoaW5nIGxpa2UgYSBzcGxpdCBrZXlib2FyZCBhbGEgaHR0cHM6Ly9tZWRpdW0uY29tL2Fhcm9ubi92ci10ZXh0LWlucHV0LXNwbGl0LWtleWJvYXJkLWU1YmYzZmQ4N2E0Y1xyXG4gKiBtaWdodCBiZSBiZXR0ZXIuXHJcbiAqIFxyXG4gKiBQZXRlciBUb2RkIDIwMTdcclxuICovXHJcblxyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgY3JlYXRlSW1hZ2VCdXR0b25HcmlkIGZyb20gJy4vaW1hZ2VidXR0b25ncmlkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUtleWJvYXJkKCB7IFxyXG4gICAga2V5TGlzdGVuZXIsXHJcbiAgICB0ZXh0Q3JlYXRvclxyXG59ID0ge30pIHtcclxuICAgIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gICAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuICAgIGV2ZW50cy5vbigna2V5RG93bicsIGtleUxpc3RlbmVyKTtcclxuICAgIFxyXG4gICAgY29uc3QgbG93ZXJDaGFycyA9IFwiMTIzNDU2Nzg5MC09cXdlcnR5dWlvcFtdYXNkZmdoamtsOycjXFxcXHp4Y3Zibm0sLi8gXCIuc3BsaXQoJycpO1xyXG4gICAgbGV0IG9iamVjdHMgPSBsb3dlckNoYXJzLm1hcChrID0+IHtcclxuICAgICAgICByZXR1cm4geyBmdW5jOiAoKSA9PiBldmVudHMuZW1pdCgna2V5RG93bicsIGspLCB0ZXh0OiBrIH07XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGxvd2VyS2V5cyA9IGNyZWF0ZUltYWdlQnV0dG9uR3JpZCh7dGV4dENyZWF0b3IsIG9iamVjdHMsIGNvbHVtbnM6IDEyfSk7XHJcbiAgICBncm91cC5hZGQobG93ZXJLZXlzKTtcclxuXHJcbiAgICBjb25zdCB1cHBlckNoYXJzID0gXCIhXFxcIsKjJCVeJiooKV8rUVdFUlRZVUlPUHt9QVNERkdISktMOkB+fFpYQ1ZCTk08Pj8gXCIuc3BsaXQoJycpO1xyXG4gICAgb2JqZWN0cyA9IHVwcGVyQ2hhcnMubWFwKGsgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IGZ1bmM6ICgpID0+IGV2ZW50cy5lbWl0KCdrZXlEb3duJywgayksIHRleHQ6IGsgfTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgdXBwZXJLZXlzID0gY3JlYXRlSW1hZ2VCdXR0b25HcmlkKHt0ZXh0Q3JlYXRvciwgb2JqZWN0cywgY29sdW1uczogMTJ9KTtcclxuICAgIHVwcGVyS2V5cy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICBncm91cC5hZGQodXBwZXJLZXlzKTtcclxuXHJcbiAgICBsZXQgc2hpZnQgPSBmYWxzZTtcclxuICAgIGZ1bmN0aW9uIHNoaWZ0VG9nZ2xlKCkge1xyXG4gICAgICAgIHNoaWZ0ID0gIXNoaWZ0O1xyXG4gICAgICAgIGxvd2VyS2V5cy52aXNpYmxlID0gIXNoaWZ0O1xyXG4gICAgICAgIHVwcGVyS2V5cy52aXNpYmxlID0gc2hpZnQ7XHJcbiAgIH1cclxuICAgIFxyXG4gICAgb2JqZWN0cyA9IFtcclxuICAgICAgICB7IHRleHQ6IFwic2hpZnRcIiwgZnVuYzogc2hpZnRUb2dnbGUgfSxcclxuICAgICAgICB7IHRleHQ6IFwiYmFja3NwYWNlXCIsIGZ1bmM6ICgpID0+IGV2ZW50cy5lbWl0KCdrZXlEb3duJywgJ1xcYicpIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcImVudGVyXCIsIGZ1bmM6ICgpID0+IGV2ZW50cy5lbWl0KCdrZXlEb3duJywgJ1xcbicpIH1cclxuICAgIF1cclxuICAgIGNvbnN0IHNwZWNpYWxLZXlzID0gY3JlYXRlSW1hZ2VCdXR0b25HcmlkKHt0ZXh0Q3JlYXRvciwgb2JqZWN0cywgY29sdW1uczogMywgcm93SGVpZ2h0OiAwLjF9KTtcclxuICAgIGdyb3VwLmFkZChzcGVjaWFsS2V5cyk7XHJcbiAgICBzcGVjaWFsS2V5cy5wb3NpdGlvbi55ID0gLTAuNSAqIChsb3dlcktleXMuc3BhY2luZyArIHNwZWNpYWxLZXlzLnNwYWNpbmcpO1xyXG4gICAgZ3JvdXAuc3BhY2luZyA9IGxvd2VyS2V5cy5zcGFjaW5nICsgc3BlY2lhbEtleXMuc3BhY2luZztcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ3JvdXAsICdoaXRzY2FuJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gW1xyXG4gICAgICAgICAgICBzcGVjaWFsS2V5cy5oaXRzY2FuLCBzaGlmdCA/IHVwcGVyS2V5cy5oaXRzY2FuIDogbG93ZXJLZXlzLmhpdHNjYW5cclxuICAgICAgICBdLnJlZHVjZSgoYSwgYikgPT4geyByZXR1cm4gYS5jb25jYXQoYil9LCBbXSlcclxuICAgIH0pO1xyXG5cclxuICAgIHVwcGVyS2V5cy5mb2xkZXIgPSBsb3dlcktleXMuZm9sZGVyID0gc3BlY2lhbEtleXMuZm9sZGVyID0gZ3JvdXA7XHJcbiAgICBncm91cC51cGRhdGVDb250cm9sID0gKGlucHV0cykgPT4ge1xyXG4gICAgICAgIHNwZWNpYWxLZXlzLnVwZGF0ZUNvbnRyb2woaW5wdXRzKTtcclxuICAgICAgICBsb3dlcktleXMudXBkYXRlQ29udHJvbChpbnB1dHMpO1xyXG4gICAgICAgIHVwcGVyS2V5cy51cGRhdGVDb250cm9sKGlucHV0cyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBncm91cDtcclxufVxyXG4iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhbGlnbkxlZnQoIG9iaiApe1xyXG4gIGlmKCBvYmogaW5zdGFuY2VvZiBUSFJFRS5NZXNoICl7XHJcbiAgICBvYmouZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICBjb25zdCB3aWR0aCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueTtcclxuICAgIG9iai5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoLCAwLCAwICk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxuICBlbHNlIGlmKCBvYmogaW5zdGFuY2VvZiBUSFJFRS5HZW9tZXRyeSApe1xyXG4gICAgb2JqLmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBvYmouYm91bmRpbmdCb3gubWF4LnggLSBvYmouYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICBvYmoudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGgsIHVuaXF1ZU1hdGVyaWFsICl7XHJcbiAgY29uc3QgbWF0ZXJpYWwgPSB1bmlxdWVNYXRlcmlhbCA/IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHhmZmZmZmZ9KSA6IFNoYXJlZE1hdGVyaWFscy5QQU5FTDtcclxuICBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICksIG1hdGVyaWFsICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgMCApO1xyXG5cclxuICBpZiggdW5pcXVlTWF0ZXJpYWwgKXtcclxuICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgfVxyXG5cclxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50V2lkdGggPSB3aWR0aDtcclxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50SGVpZ2h0ID0gaGVpZ2h0O1xyXG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnREZXB0aCA9IGRlcHRoO1xyXG5cclxuICByZXR1cm4gcGFuZWw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZVBhbmVsKHBhbmVsLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCkge1xyXG4gIHBhbmVsLmdlb21ldHJ5LnNjYWxlKHdpZHRoL3BhbmVsLnVzZXJEYXRhLmN1cnJlbnRXaWR0aCwgaGVpZ2h0L3BhbmVsLnVzZXJEYXRhLmN1cnJlbnRIZWlnaHQsIGRlcHRoL3BhbmVsLnVzZXJEYXRhLmN1cnJlbnREZXB0aCk7XHJcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudFdpZHRoID0gd2lkdGg7XHJcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudEhlaWdodCA9IGhlaWdodDtcclxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50RGVwdGggPSBkZXB0aDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBjb2xvciApe1xyXG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ09OVFJPTExFUl9JRF9XSURUSCwgaGVpZ2h0LCBDT05UUk9MTEVSX0lEX0RFUFRIICksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggQ09OVFJPTExFUl9JRF9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgY29sb3IgKTtcclxuICByZXR1cm4gcGFuZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEb3duQXJyb3coKXtcclxuICBjb25zdCB3ID0gMC4wMDk2O1xyXG4gIGNvbnN0IGggPSAwLjAxNjtcclxuICBjb25zdCBzaCA9IG5ldyBUSFJFRS5TaGFwZSgpO1xyXG4gIHNoLm1vdmVUbygwLDApO1xyXG4gIHNoLmxpbmVUbygtdyxoKTtcclxuICBzaC5saW5lVG8odyxoKTtcclxuICBzaC5saW5lVG8oMCwwKTtcclxuXHJcbiAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoIHNoICk7XHJcbiAgZ2VvLnRyYW5zbGF0ZSggMCwgLWggKiAwLjUsIDAgKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUEFORUxfV0lEVEggPSAxLjA7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9IRUlHSFQgPSAwLjA4O1xyXG5leHBvcnQgY29uc3QgUEFORUxfREVQVEggPSAwLjAxO1xyXG5leHBvcnQgY29uc3QgUEFORUxfU1BBQ0lORyA9IDAuMDAxO1xyXG5leHBvcnQgY29uc3QgUEFORUxfTUFSR0lOID0gMC4wMTU7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9MQUJFTF9URVhUX01BUkdJTiA9IDAuMDY7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9WQUxVRV9URVhUX01BUkdJTiA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1dJRFRIID0gMC4wMjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfREVQVEggPSAwLjAwMTtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9ERVBUSCA9IDAuMDE7XHJcbmV4cG9ydCBjb25zdCBGT0xERVJfV0lEVEggPSAxLjAyNjtcclxuZXhwb3J0IGNvbnN0IFNVQkZPTERFUl9XSURUSCA9IDEuMDtcclxuZXhwb3J0IGNvbnN0IEZPTERFUl9IRUlHSFQgPSAwLjA5O1xyXG5leHBvcnQgY29uc3QgRk9MREVSX0dSQUJfSEVJR0hUID0gMC4wNTEyO1xyXG5leHBvcnQgY29uc3QgQk9SREVSX1RISUNLTkVTUyA9IDAuMDE7XHJcbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9TSVpFID0gMC4wNTsiLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcblxyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uR3JpcHBlZCcsIGhhbmRsZU9uR3JpcCApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZUdyaXAnLCBoYW5kbGVPbkdyaXBSZWxlYXNlICk7XHJcblxyXG4gIGxldCBvbGRQYXJlbnQ7XHJcbiAgbGV0IG9sZFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICBsZXQgb2xkUm90YXRpb24gPSBuZXcgVEhSRUUuRXVsZXIoKTtcclxuXHJcbiAgY29uc3Qgcm90YXRpb25Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIHJvdGF0aW9uR3JvdXAuc2NhbGUuc2V0KCAwLjMsIDAuMywgMC4zICk7XHJcbiAgcm90YXRpb25Hcm91cC5wb3NpdGlvbi5zZXQoIC0wLjAxNSwgMC4wMTUsIDAuMCApO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25HcmlwKCBwICl7XHJcblxyXG4gICAgY29uc3QgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IHRydWUgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9sZFBvc2l0aW9uLmNvcHkoIGZvbGRlci5wb3NpdGlvbiApO1xyXG4gICAgb2xkUm90YXRpb24uY29weSggZm9sZGVyLnJvdGF0aW9uICk7XHJcblxyXG4gICAgZm9sZGVyLnBvc2l0aW9uLnNldCggMCwwLDAgKTtcclxuICAgIGZvbGRlci5yb3RhdGlvbi5zZXQoIDAsMCwwICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24ueCA9IC1NYXRoLlBJICogMC41O1xyXG5cclxuICAgIG9sZFBhcmVudCA9IGZvbGRlci5wYXJlbnQ7XHJcblxyXG4gICAgcm90YXRpb25Hcm91cC5hZGQoIGZvbGRlciApO1xyXG5cclxuICAgIGlucHV0T2JqZWN0LmFkZCggcm90YXRpb25Hcm91cCApO1xyXG5cclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IHRydWU7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdwaW5uZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25HcmlwUmVsZWFzZSggeyBpbnB1dE9iamVjdCwgaW5wdXQgfT17fSApe1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIG9sZFBhcmVudCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcclxuICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBmb2xkZXIucG9zaXRpb24uY29weSggb2xkUG9zaXRpb24gKTtcclxuICAgIGZvbGRlci5yb3RhdGlvbi5jb3B5KCBvbGRSb3RhdGlvbiApO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdwaW5SZWxlYXNlZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW50ZXJhY3Rpb247XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IFNERlNoYWRlciBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZic7XHJcbmltcG9ydCBjcmVhdGVHZW9tZXRyeSBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dCc7XHJcbmltcG9ydCBwYXJzZUFTQ0lJIGZyb20gJ3BhcnNlLWJtZm9udC1hc2NpaSc7XHJcblxyXG5pbXBvcnQgKiBhcyBGb250IGZyb20gJy4vZm9udCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICl7XHJcblxyXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xyXG4gIGNvbnN0IGltYWdlID0gRm9udC5pbWFnZSgpO1xyXG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcclxuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xyXG5cclxuICByZXR1cm4gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKFNERlNoYWRlcih7XHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KSk7XHJcbn1cclxuXHJcbmNvbnN0IHRleHRTY2FsZSA9IDAuMDAwMjQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRvcigpe1xyXG5cclxuICBjb25zdCBmb250ID0gcGFyc2VBU0NJSSggRm9udC5mbnQoKSApO1xyXG5cclxuICBjb25zdCBjb2xvck1hdGVyaWFscyA9IHt9O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yID0gMHhmZmZmZmYsIHNjYWxlID0gMS4wICl7XHJcblxyXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBjcmVhdGVHZW9tZXRyeSh7XHJcbiAgICAgIHRleHQ6IHN0cixcclxuICAgICAgYWxpZ246ICdsZWZ0JyxcclxuICAgICAgd2lkdGg6IDEwMDAwLFxyXG4gICAgICBmbGlwWTogdHJ1ZSxcclxuICAgICAgZm9udFxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGNvbnN0IGxheW91dCA9IGdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBsZXQgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXTtcclxuICAgIGlmKCBtYXRlcmlhbCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF0gPSBjcmVhdGVNYXRlcmlhbCggY29sb3IgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5KCBuZXcgVEhSRUUuVmVjdG9yMygxLC0xLDEpICk7XHJcblxyXG4gICAgY29uc3QgZmluYWxTY2FsZSA9IHNjYWxlICogdGV4dFNjYWxlO1xyXG5cclxuICAgIG1lc2guc2NhbGUubXVsdGlwbHlTY2FsYXIoIGZpbmFsU2NhbGUgKTtcclxuXHJcbiAgICBtZXNoLnBvc2l0aW9uLnkgPSBsYXlvdXQuaGVpZ2h0ICogMC41ICogZmluYWxTY2FsZTtcclxuXHJcbiAgICByZXR1cm4gbWVzaDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGUoIHN0ciwgeyBjb2xvcj0weGZmZmZmZiwgc2NhbGU9MS4wIH0gPSB7fSApe1xyXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICBsZXQgbWVzaCA9IGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IsIHNjYWxlICk7XHJcbiAgICBncm91cC5hZGQoIG1lc2ggKTtcclxuICAgIGdyb3VwLmxheW91dCA9IG1lc2guZ2VvbWV0cnkubGF5b3V0O1xyXG5cclxuICAgIGdyb3VwLnVwZGF0ZUxhYmVsID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgICBtZXNoLmdlb21ldHJ5LnVwZGF0ZSggc3RyICk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBncm91cDtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjcmVhdGUsXHJcbiAgICBnZXRNYXRlcmlhbDogKCk9PiBtYXRlcmlhbFxyXG4gIH1cclxuXHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBQQU5FTCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHhmZmZmZmYsIHZlcnRleENvbG9yczogVEhSRUUuVmVydGV4Q29sb3JzIH0gKTtcclxuZXhwb3J0IGNvbnN0IExPQ0FUT1IgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuZXhwb3J0IGNvbnN0IEZPTERFUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwMDAgfSApO1xyXG5leHBvcnQgY29uc3QgVE9PTFRJUCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHgyMDUwODAsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjggfSApO1xyXG4iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxyXG4gIG1pbiA9IDAuMCwgbWF4ID0gMS4wLFxyXG4gIHN0ZXAgPSAwLjEsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IFNMSURFUl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBhbHBoYTogMS4wLFxyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIHN0ZXA6IHN0ZXAsXHJcbiAgICB1c2VTdGVwOiB0cnVlLFxyXG4gICAgcHJlY2lzaW9uOiAxLFxyXG4gICAgbGlzdGVuOiBmYWxzZSxcclxuICAgIG1pbjogbWluLFxyXG4gICAgbWF4OiBtYXgsXHJcbiAgICBvbkNoYW5nZWRDQjogdW5kZWZpbmVkLFxyXG4gICAgb25GaW5pc2hlZENoYW5nZTogdW5kZWZpbmVkLFxyXG4gICAgcHJlc3Npbmc6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgc3RhdGUuc3RlcCA9IGdldEltcGxpZWRTdGVwKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwICk7XHJcbiAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuZ3VpVHlwZSA9IFwic2xpZGVyXCI7XHJcbiAgZ3JvdXAudG9TdHJpbmcgPSAoKSA9PiBgWyR7Z3JvdXAuZ3VpVHlwZX06ICR7cHJvcGVydHlOYW1lfV1gO1xyXG5cclxuICAvLyAgZmlsbGVkIHZvbHVtZVxyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIFNMSURFUl9XSURUSCwgU0xJREVSX0hFSUdIVCwgU0xJREVSX0RFUFRIICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoU0xJREVSX1dJRFRIKjAuNSwwLDApO1xyXG4gIC8vIExheW91dC5hbGlnbkxlZnQoIHJlY3QgKTtcclxuXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG4gIGhpdHNjYW5Wb2x1bWUubmFtZSA9ICdoaXRzY2FuVm9sdW1lJztcclxuXHJcbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxyXG4gIGNvbnN0IHNsaWRlckJHID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHNsaWRlckJHLmdlb21ldHJ5LCBDb2xvcnMuU0xJREVSX0JHICk7XHJcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG4gIHNsaWRlckJHLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEggKyBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGZpbGxlZFZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuICBjb25zdCBlbmRMb2NhdG9yID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMC4wNSwgMC4wNSwgMC4wNSwgMSwgMSwgMSApLCBTaGFyZWRNYXRlcmlhbHMuTE9DQVRPUiApO1xyXG4gIGVuZExvY2F0b3IucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSDtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZW5kTG9jYXRvciApO1xyXG4gIGVuZExvY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCB2YWx1ZUxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOICsgd2lkdGggKiAwLjU7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGgqMi41O1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzMjU7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIHBhbmVsLm5hbWUgPSAncGFuZWwnO1xyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBzbGlkZXJCRywgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlcigpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWYWx1ZUxhYmVsKCB2YWx1ZSApe1xyXG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcclxuICAgICAgdmFsdWVMYWJlbC51cGRhdGVMYWJlbCggcm91bmRUb0RlY2ltYWwoIHN0YXRlLnZhbHVlLCBzdGF0ZS5wcmVjaXNpb24gKS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICB2YWx1ZUxhYmVsLnVwZGF0ZUxhYmVsKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCl7XHJcbiAgICBmaWxsZWRWb2x1bWUuc2NhbGUueCA9XHJcbiAgICAgIE1hdGgubWluKFxyXG4gICAgICAgIE1hdGgubWF4KCBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICkgKiB3aWR0aCwgMC4wMDAwMDEgKSxcclxuICAgICAgICB3aWR0aFxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlT2JqZWN0KCB2YWx1ZSApe1xyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGFscGhhICl7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggYWxwaGEgKTtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tQWxwaGEoIHN0YXRlLmFscGhhLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBnZXRTdGVwcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5zdGVwICk7XHJcbiAgICB9XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldENsYW1wZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsaXN0ZW5VcGRhdGUoKXtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tT2JqZWN0KCk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tT2JqZWN0KCl7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIHN0YXRlLm9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc3RlcCA9IGZ1bmN0aW9uKCBzdGVwICl7XHJcbiAgICBzdGF0ZS5zdGVwID0gc3RlcDtcclxuICAgIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwIClcclxuICAgIHN0YXRlLnVzZVN0ZXAgPSB0cnVlO1xyXG5cclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggKTtcclxuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcclxuXHJcbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcclxuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XHJcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBwYWxldHRlSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuXHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIGxpc3RlblVwZGF0ZSgpO1xyXG4gICAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgICB1cGRhdGVTbGlkZXIoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5taW4gPSBmdW5jdGlvbiggbSApe1xyXG4gICAgc3RhdGUubWluID0gbTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XHJcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgdXBkYXRlU2xpZGVyKCApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm1heCA9IGZ1bmN0aW9uKCBtICl7XHJcbiAgICBzdGF0ZS5tYXggPSBtO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB1cGRhdGVTbGlkZXIoICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5jb25zdCB0YSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IHRiID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuY29uc3QgdFRvQSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IGFUb0IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuZnVuY3Rpb24gZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHNlZ21lbnQgKXtcclxuICB0YS5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIHRiLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuXHJcbiAgY29uc3QgcHJvamVjdGVkID0gdGIucHJvamVjdE9uVmVjdG9yKCB0YSApO1xyXG5cclxuICB0VG9BLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuXHJcbiAgYVRvQi5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICBjb25zdCBzaWRlID0gdFRvQS5ub3JtYWxpemUoKS5kb3QoIGFUb0IgKSA+PSAwID8gMSA6IC0xO1xyXG5cclxuICBjb25zdCBsZW5ndGggPSBzZWdtZW50LmEuZGlzdGFuY2VUbyggc2VnbWVudC5iICkgKiBzaWRlO1xyXG5cclxuICBsZXQgYWxwaGEgPSBwcm9qZWN0ZWQubGVuZ3RoKCkgLyBsZW5ndGg7XHJcbiAgaWYoIGFscGhhID4gMS4wICl7XHJcbiAgICBhbHBoYSA9IDEuMDtcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMC4wICl7XHJcbiAgICBhbHBoYSA9IDAuMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xyXG4gIHJldHVybiAoMS12YWx1ZSkqbWluICsgdmFsdWUqbWF4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBfcmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xyXG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRBbHBoYSggYWxwaGEgKXtcclxuICBpZiggYWxwaGEgPiAxICl7XHJcbiAgICByZXR1cm4gMVxyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwICl7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIGlmKCB2YWx1ZSA8IG1pbiApe1xyXG4gICAgcmV0dXJuIG1pbjtcclxuICB9XHJcbiAgaWYoIHZhbHVlID4gbWF4ICl7XHJcbiAgICByZXR1cm4gbWF4O1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEltcGxpZWRTdGVwKCB2YWx1ZSApe1xyXG4gIGlmKCB2YWx1ZSA9PT0gMCApe1xyXG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxyXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BbHBoYSggYWxwaGEsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFscGhhRnJvbVZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcclxuICBpZiggdmFsdWUgJSBzdGVwICE9IDApIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKCB2YWx1ZSAvIHN0ZXAgKSAqIHN0ZXA7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbnVtRGVjaW1hbHMoeCkge1xyXG4gIHggPSB4LnRvU3RyaW5nKCk7XHJcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcclxuICAgIHJldHVybiB4Lmxlbmd0aCAtIHguaW5kZXhPZignLicpIC0gMTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcclxuICBjb25zdCB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5UbztcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgc3RyLCB3aWR0aCA9IDAuNCwgZGVwdGggPSAwLjAyOSwgZmdDb2xvciA9IDB4ZmZmZmZmLCBiZ0NvbG9yID0gQ29sb3JzLkRFRkFVTFRfQkFDSywgc2NhbGUgPSAxLjAgKXtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5ndWlUeXBlID0gXCJ0ZXh0bGFiZWxcIjtcclxuICBncm91cC50b1N0cmluZyA9ICgpID0+IGBbJHtncm91cC5ndWlUeXBlfTogJHtzdHJ9XWA7XHJcblxyXG4gIGNvbnN0IGludGVybmFsUG9zaXRpb25pbmcgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGludGVybmFsUG9zaXRpb25pbmcgKTtcclxuXHJcbiAgY29uc3QgdGV4dCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RyLCB7IGNvbG9yOiBmZ0NvbG9yLCBzY2FsZSB9ICk7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIHRleHQgKTtcclxuXHJcblxyXG4gIGdyb3VwLnNldFN0cmluZyA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIHRleHQudXBkYXRlTGFiZWwoIHN0ci50b1N0cmluZygpICk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc2V0TnVtYmVyID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGVMYWJlbCggc3RyLnRvRml4ZWQoMikgKTtcclxuICB9O1xyXG5cclxuICB0ZXh0LnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgYmFja0JvdW5kcyA9IDAuMDE7XHJcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcclxuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGg7XHJcbiAgY29uc3QgdG90YWxIZWlnaHQgPSAwLjA0ICsgbWFyZ2luICogMjtcclxuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XHJcbiAgbGFiZWxCYWNrR2VvbWV0cnkuYXBwbHlNYXRyaXgoIG5ldyBUSFJFRS5NYXRyaXg0KCkubWFrZVRyYW5zbGF0aW9uKCB0b3RhbFdpZHRoICogMC41IC0gbWFyZ2luLCAwLCAwICkgKTtcclxuXHJcbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsQmFja01lc2guZ2VvbWV0cnksIGJnQ29sb3IgKTtcclxuXHJcbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggbGFiZWxCYWNrTWVzaCApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcucG9zaXRpb24ueSA9IC10b3RhbEhlaWdodCAqIDAuNTtcclxuXHJcbiAgZ3JvdXAuYmFjayA9IGxhYmVsQmFja01lc2g7XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qXHJcbiAqXHRAYXV0aG9yIHp6ODUgLyBodHRwOi8vdHdpdHRlci5jb20vYmx1cnNwbGluZSAvIGh0dHA6Ly93d3cubGFiNGdhbWVzLm5ldC96ejg1L2Jsb2dcclxuICpcdEBhdXRob3IgY2VudGVyaW9ud2FyZSAvIGh0dHA6Ly93d3cuY2VudGVyaW9ud2FyZS5jb21cclxuICpcclxuICpcdFN1YmRpdmlzaW9uIEdlb21ldHJ5IE1vZGlmaWVyXHJcbiAqXHRcdHVzaW5nIExvb3AgU3ViZGl2aXNpb24gU2NoZW1lXHJcbiAqXHJcbiAqXHRSZWZlcmVuY2VzOlxyXG4gKlx0XHRodHRwOi8vZ3JhcGhpY3Muc3RhbmZvcmQuZWR1L35tZGZpc2hlci9zdWJkaXZpc2lvbi5odG1sXHJcbiAqXHRcdGh0dHA6Ly93d3cuaG9sbWVzM2QubmV0L2dyYXBoaWNzL3N1YmRpdmlzaW9uL1xyXG4gKlx0XHRodHRwOi8vd3d3LmNzLnJ1dGdlcnMuZWR1L35kZWNhcmxvL3JlYWRpbmdzL3N1YmRpdi1zZzAwYy5wZGZcclxuICpcclxuICpcdEtub3duIElzc3VlczpcclxuICpcdFx0LSBjdXJyZW50bHkgZG9lc24ndCBoYW5kbGUgXCJTaGFycCBFZGdlc1wiXHJcbiAqL1xyXG5cclxuVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllciA9IGZ1bmN0aW9uICggc3ViZGl2aXNpb25zICkge1xyXG5cclxuXHR0aGlzLnN1YmRpdmlzaW9ucyA9ICggc3ViZGl2aXNpb25zID09PSB1bmRlZmluZWQgKSA/IDEgOiBzdWJkaXZpc2lvbnM7XHJcblxyXG59O1xyXG5cclxuLy8gQXBwbGllcyB0aGUgXCJtb2RpZnlcIiBwYXR0ZXJuXHJcblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XHJcblxyXG5cdHZhciByZXBlYXRzID0gdGhpcy5zdWJkaXZpc2lvbnM7XHJcblxyXG5cdHdoaWxlICggcmVwZWF0cyAtLSA+IDAgKSB7XHJcblxyXG5cdFx0dGhpcy5zbW9vdGgoIGdlb21ldHJ5ICk7XHJcblxyXG5cdH1cclxuXHJcblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcclxuXHJcbn07XHJcblxyXG4oIGZ1bmN0aW9uKCkge1xyXG5cclxuXHQvLyBTb21lIGNvbnN0YW50c1xyXG5cdHZhciBXQVJOSU5HUyA9ICEgdHJ1ZTsgLy8gU2V0IHRvIHRydWUgZm9yIGRldmVsb3BtZW50XHJcblx0dmFyIEFCQyA9IFsgJ2EnLCAnYicsICdjJyBdO1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RWRnZSggYSwgYiwgbWFwICkge1xyXG5cclxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xyXG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XHJcblxyXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xyXG5cclxuXHRcdHJldHVybiBtYXBbIGtleSBdO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBwcm9jZXNzRWRnZSggYSwgYiwgdmVydGljZXMsIG1hcCwgZmFjZSwgbWV0YVZlcnRpY2VzICkge1xyXG5cclxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xyXG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XHJcblxyXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xyXG5cclxuXHRcdHZhciBlZGdlO1xyXG5cclxuXHRcdGlmICgga2V5IGluIG1hcCApIHtcclxuXHJcblx0XHRcdGVkZ2UgPSBtYXBbIGtleSBdO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHR2YXIgdmVydGV4QSA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEEgXTtcclxuXHRcdFx0dmFyIHZlcnRleEIgPSB2ZXJ0aWNlc1sgdmVydGV4SW5kZXhCIF07XHJcblxyXG5cdFx0XHRlZGdlID0ge1xyXG5cclxuXHRcdFx0XHRhOiB2ZXJ0ZXhBLCAvLyBwb2ludGVyIHJlZmVyZW5jZVxyXG5cdFx0XHRcdGI6IHZlcnRleEIsXHJcblx0XHRcdFx0bmV3RWRnZTogbnVsbCxcclxuXHRcdFx0XHQvLyBhSW5kZXg6IGEsIC8vIG51bWJlcmVkIHJlZmVyZW5jZVxyXG5cdFx0XHRcdC8vIGJJbmRleDogYixcclxuXHRcdFx0XHRmYWNlczogW10gLy8gcG9pbnRlcnMgdG8gZmFjZVxyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdG1hcFsga2V5IF0gPSBlZGdlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRlZGdlLmZhY2VzLnB1c2goIGZhY2UgKTtcclxuXHJcblx0XHRtZXRhVmVydGljZXNbIGEgXS5lZGdlcy5wdXNoKCBlZGdlICk7XHJcblx0XHRtZXRhVmVydGljZXNbIGIgXS5lZGdlcy5wdXNoKCBlZGdlICk7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdlbmVyYXRlTG9va3VwcyggdmVydGljZXMsIGZhY2VzLCBtZXRhVmVydGljZXMsIGVkZ2VzICkge1xyXG5cclxuXHRcdHZhciBpLCBpbCwgZmFjZSwgZWRnZTtcclxuXHJcblx0XHRmb3IgKCBpID0gMCwgaWwgPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcclxuXHJcblx0XHRcdG1ldGFWZXJ0aWNlc1sgaSBdID0geyBlZGdlczogW10gfTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gZmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XHJcblxyXG5cdFx0XHRmYWNlID0gZmFjZXNbIGkgXTtcclxuXHJcblx0XHRcdHByb2Nlc3NFZGdlKCBmYWNlLmEsIGZhY2UuYiwgdmVydGljZXMsIGVkZ2VzLCBmYWNlLCBtZXRhVmVydGljZXMgKTtcclxuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYiwgZmFjZS5jLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xyXG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5jLCBmYWNlLmEsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG5ld0ZhY2UoIG5ld0ZhY2VzLCBhLCBiLCBjICkge1xyXG5cclxuXHRcdG5ld0ZhY2VzLnB1c2goIG5ldyBUSFJFRS5GYWNlMyggYSwgYiwgYyApICk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWlkcG9pbnQoIGEsIGIgKSB7XHJcblxyXG5cdFx0cmV0dXJuICggTWF0aC5hYnMoIGIgLSBhICkgLyAyICkgKyBNYXRoLm1pbiggYSwgYiApO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG5ld1V2KCBuZXdVdnMsIGEsIGIsIGMgKSB7XHJcblxyXG5cdFx0bmV3VXZzLnB1c2goIFsgYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKSBdICk7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblx0Ly8gUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiBTdWJkaXZpc2lvblxyXG5cdFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLnNtb290aCA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XHJcblxyXG5cdFx0dmFyIHRtcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG5cdFx0dmFyIG9sZFZlcnRpY2VzLCBvbGRGYWNlcywgb2xkVXZzO1xyXG5cdFx0dmFyIG5ld1ZlcnRpY2VzLCBuZXdGYWNlcywgbmV3VVZzID0gW107XHJcblxyXG5cdFx0dmFyIG4sIGwsIGksIGlsLCBqLCBrO1xyXG5cdFx0dmFyIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXM7XHJcblxyXG5cdFx0Ly8gbmV3IHN0dWZmLlxyXG5cdFx0dmFyIHNvdXJjZUVkZ2VzLCBuZXdFZGdlVmVydGljZXMsIG5ld1NvdXJjZVZlcnRpY2VzO1xyXG5cclxuXHRcdG9sZFZlcnRpY2VzID0gZ2VvbWV0cnkudmVydGljZXM7IC8vIHsgeCwgeSwgen1cclxuXHRcdG9sZEZhY2VzID0gZ2VvbWV0cnkuZmFjZXM7IC8vIHsgYTogb2xkVmVydGV4MSwgYjogb2xkVmVydGV4MiwgYzogb2xkVmVydGV4MyB9XHJcblx0XHRvbGRVdnMgPSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF07XHJcblxyXG5cdFx0dmFyIGhhc1V2cyA9IG9sZFV2cyAhPT0gdW5kZWZpbmVkICYmIG9sZFV2cy5sZW5ndGggPiAwO1xyXG5cclxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcdCAqXHJcblx0XHQgKiBTdGVwIDA6IFByZXByb2Nlc3MgR2VvbWV0cnkgdG8gR2VuZXJhdGUgZWRnZXMgTG9va3VwXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5cdFx0bWV0YVZlcnRpY2VzID0gbmV3IEFycmF5KCBvbGRWZXJ0aWNlcy5sZW5ndGggKTtcclxuXHRcdHNvdXJjZUVkZ2VzID0ge307IC8vIEVkZ2UgPT4geyBvbGRWZXJ0ZXgxLCBvbGRWZXJ0ZXgyLCBmYWNlc1tdICB9XHJcblxyXG5cdFx0Z2VuZXJhdGVMb29rdXBzKCBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXMgKTtcclxuXHJcblxyXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFx0ICpcclxuXHRcdCAqXHRTdGVwIDEuXHJcblx0XHQgKlx0Rm9yIGVhY2ggZWRnZSwgY3JlYXRlIGEgbmV3IEVkZ2UgVmVydGV4LFxyXG5cdFx0ICpcdHRoZW4gcG9zaXRpb24gaXQuXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5cdFx0bmV3RWRnZVZlcnRpY2VzID0gW107XHJcblx0XHR2YXIgb3RoZXIsIGN1cnJlbnRFZGdlLCBuZXdFZGdlLCBmYWNlO1xyXG5cdFx0dmFyIGVkZ2VWZXJ0ZXhXZWlnaHQsIGFkamFjZW50VmVydGV4V2VpZ2h0LCBjb25uZWN0ZWRGYWNlcztcclxuXHJcblx0XHRmb3IgKCBpIGluIHNvdXJjZUVkZ2VzICkge1xyXG5cclxuXHRcdFx0Y3VycmVudEVkZ2UgPSBzb3VyY2VFZGdlc1sgaSBdO1xyXG5cdFx0XHRuZXdFZGdlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcblx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAzIC8gODtcclxuXHRcdFx0YWRqYWNlbnRWZXJ0ZXhXZWlnaHQgPSAxIC8gODtcclxuXHJcblx0XHRcdGNvbm5lY3RlZEZhY2VzID0gY3VycmVudEVkZ2UuZmFjZXMubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly8gY2hlY2sgaG93IG1hbnkgbGlua2VkIGZhY2VzLiAyIHNob3VsZCBiZSBjb3JyZWN0LlxyXG5cdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDIgKSB7XHJcblxyXG5cdFx0XHRcdC8vIGlmIGxlbmd0aCBpcyBub3QgMiwgaGFuZGxlIGNvbmRpdGlvblxyXG5cdFx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAwLjU7XHJcblx0XHRcdFx0YWRqYWNlbnRWZXJ0ZXhXZWlnaHQgPSAwO1xyXG5cclxuXHRcdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDEgKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJ1N1YmRpdmlzaW9uIE1vZGlmaWVyOiBOdW1iZXIgb2YgY29ubmVjdGVkIGZhY2VzICE9IDIsIGlzOiAnLCBjb25uZWN0ZWRGYWNlcywgY3VycmVudEVkZ2UgKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3RWRnZS5hZGRWZWN0b3JzKCBjdXJyZW50RWRnZS5hLCBjdXJyZW50RWRnZS5iICkubXVsdGlwbHlTY2FsYXIoIGVkZ2VWZXJ0ZXhXZWlnaHQgKTtcclxuXHJcblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcclxuXHJcblx0XHRcdGZvciAoIGogPSAwOyBqIDwgY29ubmVjdGVkRmFjZXM7IGogKysgKSB7XHJcblxyXG5cdFx0XHRcdGZhY2UgPSBjdXJyZW50RWRnZS5mYWNlc1sgaiBdO1xyXG5cclxuXHRcdFx0XHRmb3IgKCBrID0gMDsgayA8IDM7IGsgKysgKSB7XHJcblxyXG5cdFx0XHRcdFx0b3RoZXIgPSBvbGRWZXJ0aWNlc1sgZmFjZVsgQUJDWyBrIF0gXSBdO1xyXG5cdFx0XHRcdFx0aWYgKCBvdGhlciAhPT0gY3VycmVudEVkZ2UuYSAmJiBvdGhlciAhPT0gY3VycmVudEVkZ2UuYiApIGJyZWFrO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGFkamFjZW50VmVydGV4V2VpZ2h0ICk7XHJcblx0XHRcdG5ld0VkZ2UuYWRkKCB0bXAgKTtcclxuXHJcblx0XHRcdGN1cnJlbnRFZGdlLm5ld0VkZ2UgPSBuZXdFZGdlVmVydGljZXMubGVuZ3RoO1xyXG5cdFx0XHRuZXdFZGdlVmVydGljZXMucHVzaCggbmV3RWRnZSApO1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coY3VycmVudEVkZ2UsIG5ld0VkZ2UpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHQgKlxyXG5cdFx0ICpcdFN0ZXAgMi5cclxuXHRcdCAqXHRSZXBvc2l0aW9uIGVhY2ggc291cmNlIHZlcnRpY2VzLlxyXG5cdFx0ICpcclxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHRcdHZhciBiZXRhLCBzb3VyY2VWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQ7XHJcblx0XHR2YXIgY29ubmVjdGluZ0VkZ2UsIGNvbm5lY3RpbmdFZGdlcywgb2xkVmVydGV4LCBuZXdTb3VyY2VWZXJ0ZXg7XHJcblx0XHRuZXdTb3VyY2VWZXJ0aWNlcyA9IFtdO1xyXG5cclxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IG9sZFZlcnRpY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xyXG5cclxuXHRcdFx0b2xkVmVydGV4ID0gb2xkVmVydGljZXNbIGkgXTtcclxuXHJcblx0XHRcdC8vIGZpbmQgYWxsIGNvbm5lY3RpbmcgZWRnZXMgKHVzaW5nIGxvb2t1cFRhYmxlKVxyXG5cdFx0XHRjb25uZWN0aW5nRWRnZXMgPSBtZXRhVmVydGljZXNbIGkgXS5lZGdlcztcclxuXHRcdFx0biA9IGNvbm5lY3RpbmdFZGdlcy5sZW5ndGg7XHJcblxyXG5cdFx0XHRpZiAoIG4gPT0gMyApIHtcclxuXHJcblx0XHRcdFx0YmV0YSA9IDMgLyAxNjtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG4gPiAzICkge1xyXG5cclxuXHRcdFx0XHRiZXRhID0gMyAvICggOCAqIG4gKTsgLy8gV2FycmVuJ3MgbW9kaWZpZWQgZm9ybXVsYVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTG9vcCdzIG9yaWdpbmFsIGJldGEgZm9ybXVsYVxyXG5cdFx0XHQvLyBiZXRhID0gMSAvIG4gKiAoIDUvOCAtIE1hdGgucG93KCAzLzggKyAxLzQgKiBNYXRoLmNvcyggMiAqIE1hdGguIFBJIC8gbiApLCAyKSApO1xyXG5cclxuXHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMSAtIG4gKiBiZXRhO1xyXG5cdFx0XHRjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gYmV0YTtcclxuXHJcblx0XHRcdGlmICggbiA8PSAyICkge1xyXG5cclxuXHRcdFx0XHQvLyBjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzXHJcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzJyk7XHJcblxyXG5cdFx0XHRcdGlmICggbiA9PSAyICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICcyIGNvbm5lY3RpbmcgZWRnZXMnLCBjb25uZWN0aW5nRWRnZXMgKTtcclxuXHRcdFx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDMgLyA0O1xyXG5cdFx0XHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDEgLyA4O1xyXG5cclxuXHRcdFx0XHRcdC8vIHNvdXJjZVZlcnRleFdlaWdodCA9IDE7XHJcblx0XHRcdFx0XHQvLyBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gMDtcclxuXHJcblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAxICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICdvbmx5IDEgY29ubmVjdGluZyBlZGdlJyApO1xyXG5cclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDAgKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJzAgY29ubmVjdGluZyBlZGdlcycgKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3U291cmNlVmVydGV4ID0gb2xkVmVydGV4LmNsb25lKCkubXVsdGlwbHlTY2FsYXIoIHNvdXJjZVZlcnRleFdlaWdodCApO1xyXG5cclxuXHRcdFx0dG1wLnNldCggMCwgMCwgMCApO1xyXG5cclxuXHRcdFx0Zm9yICggaiA9IDA7IGogPCBuOyBqICsrICkge1xyXG5cclxuXHRcdFx0XHRjb25uZWN0aW5nRWRnZSA9IGNvbm5lY3RpbmdFZGdlc1sgaiBdO1xyXG5cdFx0XHRcdG90aGVyID0gY29ubmVjdGluZ0VkZ2UuYSAhPT0gb2xkVmVydGV4ID8gY29ubmVjdGluZ0VkZ2UuYSA6IGNvbm5lY3RpbmdFZGdlLmI7XHJcblx0XHRcdFx0dG1wLmFkZCggb3RoZXIgKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRtcC5tdWx0aXBseVNjYWxhciggY29ubmVjdGluZ1ZlcnRleFdlaWdodCApO1xyXG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXguYWRkKCB0bXAgKTtcclxuXHJcblx0XHRcdG5ld1NvdXJjZVZlcnRpY2VzLnB1c2goIG5ld1NvdXJjZVZlcnRleCApO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFx0ICpcclxuXHRcdCAqXHRTdGVwIDMuXHJcblx0XHQgKlx0R2VuZXJhdGUgRmFjZXMgYmV0d2VlbiBzb3VyY2UgdmVydGljZXNcclxuXHRcdCAqXHRhbmQgZWRnZSB2ZXJ0aWNlcy5cclxuXHRcdCAqXHJcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblx0XHRuZXdWZXJ0aWNlcyA9IG5ld1NvdXJjZVZlcnRpY2VzLmNvbmNhdCggbmV3RWRnZVZlcnRpY2VzICk7XHJcblx0XHR2YXIgc2wgPSBuZXdTb3VyY2VWZXJ0aWNlcy5sZW5ndGgsIGVkZ2UxLCBlZGdlMiwgZWRnZTM7XHJcblx0XHRuZXdGYWNlcyA9IFtdO1xyXG5cclxuXHRcdHZhciB1diwgeDAsIHgxLCB4MjtcclxuXHRcdHZhciB4MyA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblx0XHR2YXIgeDQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cdFx0dmFyIHg1ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRGYWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcclxuXHJcblx0XHRcdGZhY2UgPSBvbGRGYWNlc1sgaSBdO1xyXG5cclxuXHRcdFx0Ly8gZmluZCB0aGUgMyBuZXcgZWRnZXMgdmVydGV4IG9mIGVhY2ggb2xkIGZhY2VcclxuXHJcblx0XHRcdGVkZ2UxID0gZ2V0RWRnZSggZmFjZS5hLCBmYWNlLmIsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xyXG5cdFx0XHRlZGdlMiA9IGdldEVkZ2UoIGZhY2UuYiwgZmFjZS5jLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcclxuXHRcdFx0ZWRnZTMgPSBnZXRFZGdlKCBmYWNlLmMsIGZhY2UuYSwgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XHJcblxyXG5cdFx0XHQvLyBjcmVhdGUgNCBmYWNlcy5cclxuXHJcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBlZGdlMSwgZWRnZTIsIGVkZ2UzICk7XHJcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmEsIGVkZ2UxLCBlZGdlMyApO1xyXG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5iLCBlZGdlMiwgZWRnZTEgKTtcclxuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYywgZWRnZTMsIGVkZ2UyICk7XHJcblxyXG5cdFx0XHQvLyBjcmVhdGUgNCBuZXcgdXYnc1xyXG5cclxuXHRcdFx0aWYgKCBoYXNVdnMgKSB7XHJcblxyXG5cdFx0XHRcdHV2ID0gb2xkVXZzWyBpIF07XHJcblxyXG5cdFx0XHRcdHgwID0gdXZbIDAgXTtcclxuXHRcdFx0XHR4MSA9IHV2WyAxIF07XHJcblx0XHRcdFx0eDIgPSB1dlsgMiBdO1xyXG5cclxuXHRcdFx0XHR4My5zZXQoIG1pZHBvaW50KCB4MC54LCB4MS54ICksIG1pZHBvaW50KCB4MC55LCB4MS55ICkgKTtcclxuXHRcdFx0XHR4NC5zZXQoIG1pZHBvaW50KCB4MS54LCB4Mi54ICksIG1pZHBvaW50KCB4MS55LCB4Mi55ICkgKTtcclxuXHRcdFx0XHR4NS5zZXQoIG1pZHBvaW50KCB4MC54LCB4Mi54ICksIG1pZHBvaW50KCB4MC55LCB4Mi55ICkgKTtcclxuXHJcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDMsIHg0LCB4NSApO1xyXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgwLCB4MywgeDUgKTtcclxuXHJcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDEsIHg0LCB4MyApO1xyXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgyLCB4NSwgeDQgKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT3ZlcndyaXRlIG9sZCBhcnJheXNcclxuXHRcdGdlb21ldHJ5LnZlcnRpY2VzID0gbmV3VmVydGljZXM7XHJcblx0XHRnZW9tZXRyeS5mYWNlcyA9IG5ld0ZhY2VzO1xyXG5cdFx0aWYgKCBoYXNVdnMgKSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF0gPSBuZXdVVnM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2RvbmUnKTtcclxuXHJcblx0fTtcclxuXHJcbn0gKSgpO1xyXG4iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZHR5cGUpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIEludDhBcnJheVxuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBJbnQxNkFycmF5XG4gICAgY2FzZSAnaW50MzInOlxuICAgICAgcmV0dXJuIEludDMyQXJyYXlcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheVxuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gVWludDE2QXJyYXlcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gRmxvYXQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICByZXR1cm4gRmxvYXQ2NEFycmF5XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5XG4gICAgY2FzZSAndWludDhfY2xhbXBlZCc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXlcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VCTUZvbnRBc2NpaShkYXRhKSB7XG4gIGlmICghZGF0YSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgcHJvdmlkZWQnKVxuICBkYXRhID0gZGF0YS50b1N0cmluZygpLnRyaW0oKVxuXG4gIHZhciBvdXRwdXQgPSB7XG4gICAgcGFnZXM6IFtdLFxuICAgIGNoYXJzOiBbXSxcbiAgICBrZXJuaW5nczogW11cbiAgfVxuXG4gIHZhciBsaW5lcyA9IGRhdGEuc3BsaXQoL1xcclxcbj98XFxuL2cpXG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgaW4gQk1Gb250IGZpbGUnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZURhdGEgPSBzcGxpdExpbmUobGluZXNbaV0sIGkpXG4gICAgaWYgKCFsaW5lRGF0YSkgLy9za2lwIGVtcHR5IGxpbmVzXG4gICAgICBjb250aW51ZVxuXG4gICAgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ3BhZ2UnKSB7XG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuaWQgIT09ICdudW1iZXInKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgaWQ9TicpXG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuZmlsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBmaWxlPVwicGF0aFwiJylcbiAgICAgIG91dHB1dC5wYWdlc1tsaW5lRGF0YS5kYXRhLmlkXSA9IGxpbmVEYXRhLmRhdGEuZmlsZVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcnMnIHx8IGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmdzJykge1xuICAgICAgLy8uLi4gZG8gbm90aGluZyBmb3IgdGhlc2UgdHdvIC4uLlxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcicpIHtcbiAgICAgIG91dHB1dC5jaGFycy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5nJykge1xuICAgICAgb3V0cHV0Lmtlcm5pbmdzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0W2xpbmVEYXRhLmtleV0gPSBsaW5lRGF0YS5kYXRhXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiBzcGxpdExpbmUobGluZSwgaWR4KSB7XG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcdCsvZywgJyAnKS50cmltKClcbiAgaWYgKCFsaW5lKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIHNwYWNlID0gbGluZS5pbmRleE9mKCcgJylcbiAgaWYgKHNwYWNlID09PSAtMSkgXG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm8gbmFtZWQgcm93IGF0IGxpbmUgXCIgKyBpZHgpXG5cbiAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIHNwYWNlKVxuXG4gIGxpbmUgPSBsaW5lLnN1YnN0cmluZyhzcGFjZSArIDEpXG4gIC8vY2xlYXIgXCJsZXR0ZXJcIiBmaWVsZCBhcyBpdCBpcyBub24tc3RhbmRhcmQgYW5kXG4gIC8vcmVxdWlyZXMgYWRkaXRpb25hbCBjb21wbGV4aXR5IHRvIHBhcnNlIFwiIC8gPSBzeW1ib2xzXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2xldHRlcj1bXFwnXFxcIl1cXFMrW1xcJ1xcXCJdL2dpLCAnJykgIFxuICBsaW5lID0gbGluZS5zcGxpdChcIj1cIilcbiAgbGluZSA9IGxpbmUubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIudHJpbSgpLm1hdGNoKCgvKFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKS9nKSlcbiAgfSlcblxuICB2YXIgZGF0YSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkdCA9IGxpbmVbaV1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFswXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGkgPT09IGxpbmUubGVuZ3RoIC0gMSkge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFsxXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ID0ge1xuICAgIGtleToga2V5LFxuICAgIGRhdGE6IHt9XG4gIH1cblxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIG91dC5kYXRhW3Yua2V5XSA9IHYuZGF0YTtcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF0YShkYXRhKSB7XG4gIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gXCJcIlxuXG4gIGlmIChkYXRhLmluZGV4T2YoJ1wiJykgPT09IDAgfHwgZGF0YS5pbmRleE9mKFwiJ1wiKSA9PT0gMClcbiAgICByZXR1cm4gZGF0YS5zdWJzdHJpbmcoMSwgZGF0YS5sZW5ndGggLSAxKVxuICBpZiAoZGF0YS5pbmRleE9mKCcsJykgIT09IC0xKVxuICAgIHJldHVybiBwYXJzZUludExpc3QoZGF0YSlcbiAgcmV0dXJuIHBhcnNlSW50KGRhdGEsIDEwKVxufVxuXG5mdW5jdGlvbiBwYXJzZUludExpc3QoZGF0YSkge1xuICByZXR1cm4gZGF0YS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMClcbiAgfSlcbn0iLCJ2YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG52YXIgYW5BcnJheSA9IHJlcXVpcmUoJ2FuLWFycmF5JylcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpXG5cbnZhciBDVyA9IFswLCAyLCAzXVxudmFyIENDVyA9IFsyLCAxLCAzXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVF1YWRFbGVtZW50cyhhcnJheSwgb3B0KSB7XG4gICAgLy9pZiB1c2VyIGRpZG4ndCBzcGVjaWZ5IGFuIG91dHB1dCBhcnJheVxuICAgIGlmICghYXJyYXkgfHwgIShhbkFycmF5KGFycmF5KSB8fCBpc0J1ZmZlcihhcnJheSkpKSB7XG4gICAgICAgIG9wdCA9IGFycmF5IHx8IHt9XG4gICAgICAgIGFycmF5ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0ID09PSAnbnVtYmVyJykgLy9iYWNrd2FyZHMtY29tcGF0aWJsZVxuICAgICAgICBvcHQgPSB7IGNvdW50OiBvcHQgfVxuICAgIGVsc2VcbiAgICAgICAgb3B0ID0gb3B0IHx8IHt9XG5cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvcHQudHlwZSA9PT0gJ3N0cmluZycgPyBvcHQudHlwZSA6ICd1aW50MTYnXG4gICAgdmFyIGNvdW50ID0gdHlwZW9mIG9wdC5jb3VudCA9PT0gJ251bWJlcicgPyBvcHQuY291bnQgOiAxXG4gICAgdmFyIHN0YXJ0ID0gKG9wdC5zdGFydCB8fCAwKSBcblxuICAgIHZhciBkaXIgPSBvcHQuY2xvY2t3aXNlICE9PSBmYWxzZSA/IENXIDogQ0NXLFxuICAgICAgICBhID0gZGlyWzBdLCBcbiAgICAgICAgYiA9IGRpclsxXSxcbiAgICAgICAgYyA9IGRpclsyXVxuXG4gICAgdmFyIG51bUluZGljZXMgPSBjb3VudCAqIDZcblxuICAgIHZhciBpbmRpY2VzID0gYXJyYXkgfHwgbmV3IChkdHlwZSh0eXBlKSkobnVtSW5kaWNlcylcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCBudW1JbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xuICAgICAgICB2YXIgeCA9IGkgKyBzdGFydFxuICAgICAgICBpbmRpY2VzW3ggKyAwXSA9IGogKyAwXG4gICAgICAgIGluZGljZXNbeCArIDFdID0gaiArIDFcbiAgICAgICAgaW5kaWNlc1t4ICsgMl0gPSBqICsgMlxuICAgICAgICBpbmRpY2VzW3ggKyAzXSA9IGogKyBhXG4gICAgICAgIGluZGljZXNbeCArIDRdID0gaiArIGJcbiAgICAgICAgaW5kaWNlc1t4ICsgNV0gPSBqICsgY1xuICAgIH1cbiAgICByZXR1cm4gaW5kaWNlc1xufSIsInZhciBjcmVhdGVMYXlvdXQgPSByZXF1aXJlKCdsYXlvdXQtYm1mb250LXRleHQnKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIGNyZWF0ZUluZGljZXMgPSByZXF1aXJlKCdxdWFkLWluZGljZXMnKVxudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ3RocmVlLWJ1ZmZlci12ZXJ0ZXgtZGF0YScpXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbnZhciB2ZXJ0aWNlcyA9IHJlcXVpcmUoJy4vbGliL3ZlcnRpY2VzJylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vbGliL3V0aWxzJylcblxudmFyIEJhc2UgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVRleHRHZW9tZXRyeSAob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dEdlb21ldHJ5KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgQmFzZS5jYWxsKHRoaXMpXG5cbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIHRoZXNlIGFzIGRlZmF1bHQgdmFsdWVzIGZvciBhbnkgc3Vic2VxdWVudFxuICAvLyBjYWxscyB0byB1cGRhdGUoKVxuICB0aGlzLl9vcHQgPSBhc3NpZ24oe30sIG9wdClcblxuICAvLyBhbHNvIGRvIGFuIGluaXRpYWwgc2V0dXAuLi5cbiAgaWYgKG9wdCkgdGhpcy51cGRhdGUob3B0KVxufVxuXG5pbmhlcml0cyhUZXh0R2VvbWV0cnksIEJhc2UpXG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG9wdCkge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgY29uc3RydWN0b3IgZGVmYXVsdHNcbiAgb3B0ID0gYXNzaWduKHt9LCB0aGlzLl9vcHQsIG9wdClcblxuICBpZiAoIW9wdC5mb250KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzcGVjaWZ5IGEgeyBmb250IH0gaW4gb3B0aW9ucycpXG4gIH1cblxuICB0aGlzLmxheW91dCA9IGNyZWF0ZUxheW91dChvcHQpXG5cbiAgLy8gZ2V0IHZlYzIgdGV4Y29vcmRzXG4gIHZhciBmbGlwWSA9IG9wdC5mbGlwWSAhPT0gZmFsc2VcblxuICAvLyB0aGUgZGVzaXJlZCBCTUZvbnQgZGF0YVxuICB2YXIgZm9udCA9IG9wdC5mb250XG5cbiAgLy8gZGV0ZXJtaW5lIHRleHR1cmUgc2l6ZSBmcm9tIGZvbnQgZmlsZVxuICB2YXIgdGV4V2lkdGggPSBmb250LmNvbW1vbi5zY2FsZVdcbiAgdmFyIHRleEhlaWdodCA9IGZvbnQuY29tbW9uLnNjYWxlSFxuXG4gIC8vIGdldCB2aXNpYmxlIGdseXBoc1xuICB2YXIgZ2x5cGhzID0gdGhpcy5sYXlvdXQuZ2x5cGhzLmZpbHRlcihmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHJldHVybiBiaXRtYXAud2lkdGggKiBiaXRtYXAuaGVpZ2h0ID4gMFxuICB9KVxuXG4gIC8vIHByb3ZpZGUgdmlzaWJsZSBnbHlwaHMgZm9yIGNvbnZlbmllbmNlXG4gIHRoaXMudmlzaWJsZUdseXBocyA9IGdseXBoc1xuXG4gIC8vIGdldCBjb21tb24gdmVydGV4IGRhdGFcbiAgdmFyIHBvc2l0aW9ucyA9IHZlcnRpY2VzLnBvc2l0aW9ucyhnbHlwaHMpXG4gIHZhciB1dnMgPSB2ZXJ0aWNlcy51dnMoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSlcbiAgdmFyIGluZGljZXMgPSBjcmVhdGVJbmRpY2VzKHtcbiAgICBjbG9ja3dpc2U6IHRydWUsXG4gICAgdHlwZTogJ3VpbnQxNicsXG4gICAgY291bnQ6IGdseXBocy5sZW5ndGhcbiAgfSlcblxuICAvLyB1cGRhdGUgdmVydGV4IGRhdGFcbiAgYnVmZmVyLmluZGV4KHRoaXMsIGluZGljZXMsIDEsICd1aW50MTYnKVxuICBidWZmZXIuYXR0cih0aGlzLCAncG9zaXRpb24nLCBwb3NpdGlvbnMsIDIpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICd1dicsIHV2cywgMilcblxuICAvLyB1cGRhdGUgbXVsdGlwYWdlIGRhdGFcbiAgaWYgKCFvcHQubXVsdGlwYWdlICYmICdwYWdlJyBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAvLyBkaXNhYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgncGFnZScpXG4gIH0gZWxzZSBpZiAob3B0Lm11bHRpcGFnZSkge1xuICAgIHZhciBwYWdlcyA9IHZlcnRpY2VzLnBhZ2VzKGdseXBocylcbiAgICAvLyBlbmFibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIGJ1ZmZlci5hdHRyKHRoaXMsICdwYWdlJywgcGFnZXMsIDEpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdTcGhlcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nU3BoZXJlID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmUoKVxuICB9XG5cbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMgPSAwXG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5jZW50ZXIuc2V0KDAsIDAsIDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZVNwaGVyZShwb3NpdGlvbnMsIHRoaXMuYm91bmRpbmdTcGhlcmUpXG4gIGlmIChpc05hTih0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cykpIHtcbiAgICBjb25zb2xlLmVycm9yKCdUSFJFRS5CdWZmZXJHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTogJyArXG4gICAgICAnQ29tcHV0ZWQgcmFkaXVzIGlzIE5hTi4gVGhlICcgK1xuICAgICAgJ1wicG9zaXRpb25cIiBhdHRyaWJ1dGUgaXMgbGlrZWx5IHRvIGhhdmUgTmFOIHZhbHVlcy4nKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ0JveCA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpXG4gIH1cblxuICB2YXIgYmJveCA9IHRoaXMuYm91bmRpbmdCb3hcbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgYmJveC5tYWtlRW1wdHkoKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVCb3gocG9zaXRpb25zLCBiYm94KVxufVxuIiwidmFyIGl0ZW1TaXplID0gMlxudmFyIGJveCA9IHsgbWluOiBbMCwgMF0sIG1heDogWzAsIDBdIH1cblxuZnVuY3Rpb24gYm91bmRzIChwb3NpdGlvbnMpIHtcbiAgdmFyIGNvdW50ID0gcG9zaXRpb25zLmxlbmd0aCAvIGl0ZW1TaXplXG4gIGJveC5taW5bMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1pblsxXSA9IHBvc2l0aW9uc1sxXVxuICBib3gubWF4WzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5tYXhbMV0gPSBwb3NpdGlvbnNbMV1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICB2YXIgeCA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAwXVxuICAgIHZhciB5ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDFdXG4gICAgYm94Lm1pblswXSA9IE1hdGgubWluKHgsIGJveC5taW5bMF0pXG4gICAgYm94Lm1pblsxXSA9IE1hdGgubWluKHksIGJveC5taW5bMV0pXG4gICAgYm94Lm1heFswXSA9IE1hdGgubWF4KHgsIGJveC5tYXhbMF0pXG4gICAgYm94Lm1heFsxXSA9IE1hdGgubWF4KHksIGJveC5tYXhbMV0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUJveCA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICBvdXRwdXQubWluLnNldChib3gubWluWzBdLCBib3gubWluWzFdLCAwKVxuICBvdXRwdXQubWF4LnNldChib3gubWF4WzBdLCBib3gubWF4WzFdLCAwKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlU3BoZXJlID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIHZhciBtaW5YID0gYm94Lm1pblswXVxuICB2YXIgbWluWSA9IGJveC5taW5bMV1cbiAgdmFyIG1heFggPSBib3gubWF4WzBdXG4gIHZhciBtYXhZID0gYm94Lm1heFsxXVxuICB2YXIgd2lkdGggPSBtYXhYIC0gbWluWFxuICB2YXIgaGVpZ2h0ID0gbWF4WSAtIG1pbllcbiAgdmFyIGxlbmd0aCA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KVxuICBvdXRwdXQuY2VudGVyLnNldChtaW5YICsgd2lkdGggLyAyLCBtaW5ZICsgaGVpZ2h0IC8gMiwgMClcbiAgb3V0cHV0LnJhZGl1cyA9IGxlbmd0aCAvIDJcbn1cbiIsIm1vZHVsZS5leHBvcnRzLnBhZ2VzID0gZnVuY3Rpb24gcGFnZXMgKGdseXBocykge1xuICB2YXIgcGFnZXMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMSlcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBpZCA9IGdseXBoLmRhdGEucGFnZSB8fCAwXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gIH0pXG4gIHJldHVybiBwYWdlc1xufVxuXG5tb2R1bGUuZXhwb3J0cy51dnMgPSBmdW5jdGlvbiB1dnMgKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpIHtcbiAgdmFyIHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICB2YXIgYncgPSAoYml0bWFwLnggKyBiaXRtYXAud2lkdGgpXG4gICAgdmFyIGJoID0gKGJpdG1hcC55ICsgYml0bWFwLmhlaWdodClcblxuICAgIC8vIHRvcCBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHUwID0gYml0bWFwLnggLyB0ZXhXaWR0aFxuICAgIHZhciB2MSA9IGJpdG1hcC55IC8gdGV4SGVpZ2h0XG4gICAgdmFyIHUxID0gYncgLyB0ZXhXaWR0aFxuICAgIHZhciB2MCA9IGJoIC8gdGV4SGVpZ2h0XG5cbiAgICBpZiAoZmxpcFkpIHtcbiAgICAgIHYxID0gKHRleEhlaWdodCAtIGJpdG1hcC55KSAvIHRleEhlaWdodFxuICAgICAgdjAgPSAodGV4SGVpZ2h0IC0gYmgpIC8gdGV4SGVpZ2h0XG4gICAgfVxuXG4gICAgLy8gQkxcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MVxuICAgIC8vIFRMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBUUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gQlJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MVxuICB9KVxuICByZXR1cm4gdXZzXG59XG5cbm1vZHVsZS5leHBvcnRzLnBvc2l0aW9ucyA9IGZ1bmN0aW9uIHBvc2l0aW9ucyAoZ2x5cGhzKSB7XG4gIHZhciBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG5cbiAgICAvLyBib3R0b20gbGVmdCBwb3NpdGlvblxuICAgIHZhciB4ID0gZ2x5cGgucG9zaXRpb25bMF0gKyBiaXRtYXAueG9mZnNldFxuICAgIHZhciB5ID0gZ2x5cGgucG9zaXRpb25bMV0gKyBiaXRtYXAueW9mZnNldFxuXG4gICAgLy8gcXVhZCBzaXplXG4gICAgdmFyIHcgPSBiaXRtYXAud2lkdGhcbiAgICB2YXIgaCA9IGJpdG1hcC5oZWlnaHRcblxuICAgIC8vIEJMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gICAgLy8gVExcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gVFJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIEJSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICB9KVxuICByZXR1cm4gcG9zaXRpb25zXG59XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU0RGU2hhZGVyIChvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9XG4gIHZhciBvcGFjaXR5ID0gdHlwZW9mIG9wdC5vcGFjaXR5ID09PSAnbnVtYmVyJyA/IG9wdC5vcGFjaXR5IDogMVxuICB2YXIgYWxwaGFUZXN0ID0gdHlwZW9mIG9wdC5hbHBoYVRlc3QgPT09ICdudW1iZXInID8gb3B0LmFscGhhVGVzdCA6IDAuMDAwMVxuICB2YXIgcHJlY2lzaW9uID0gb3B0LnByZWNpc2lvbiB8fCAnaGlnaHAnXG4gIHZhciBjb2xvciA9IG9wdC5jb2xvclxuICB2YXIgbWFwID0gb3B0Lm1hcFxuXG4gIC8vIHJlbW92ZSB0byBzYXRpc2Z5IHI3M1xuICBkZWxldGUgb3B0Lm1hcFxuICBkZWxldGUgb3B0LmNvbG9yXG4gIGRlbGV0ZSBvcHQucHJlY2lzaW9uXG4gIGRlbGV0ZSBvcHQub3BhY2l0eVxuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIHVuaWZvcm1zOiB7XG4gICAgICBvcGFjaXR5OiB7IHR5cGU6ICdmJywgdmFsdWU6IG9wYWNpdHkgfSxcbiAgICAgIG1hcDogeyB0eXBlOiAndCcsIHZhbHVlOiBtYXAgfHwgbmV3IFRIUkVFLlRleHR1cmUoKSB9LFxuICAgICAgY29sb3I6IHsgdHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKGNvbG9yKSB9XG4gICAgfSxcbiAgICB2ZXJ0ZXhTaGFkZXI6IFtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnLFxuICAgICAgJ2F0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uOycsXG4gICAgICAndW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgbW9kZWxWaWV3TWF0cml4OycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJ3ZVdiA9IHV2OycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogcG9zaXRpb247JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJyksXG4gICAgZnJhZ21lbnRTaGFkZXI6IFtcbiAgICAgICcjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcjZXh0ZW5zaW9uIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyA6IGVuYWJsZScsXG4gICAgICAnI2VuZGlmJyxcbiAgICAgICdwcmVjaXNpb24gJyArIHByZWNpc2lvbiArICcgZmxvYXQ7JyxcbiAgICAgICd1bmlmb3JtIGZsb2F0IG9wYWNpdHk7JyxcbiAgICAgICd1bmlmb3JtIHZlYzMgY29sb3I7JyxcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCBtYXA7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG5cbiAgICAgICdmbG9hdCBhYXN0ZXAoZmxvYXQgdmFsdWUpIHsnLFxuICAgICAgJyAgI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSBsZW5ndGgodmVjMihkRmR4KHZhbHVlKSwgZEZkeSh2YWx1ZSkpKSAqIDAuNzA3MTA2NzgxMTg2NTQ3NTc7JyxcbiAgICAgICcgICNlbHNlJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9ICgxLjAgLyAzMi4wKSAqICgxLjQxNDIxMzU2MjM3MzA5NTEgLyAoMi4wICogZ2xfRnJhZ0Nvb3JkLncpKTsnLFxuICAgICAgJyAgI2VuZGlmJyxcbiAgICAgICcgIHJldHVybiBzbW9vdGhzdGVwKDAuNSAtIGFmd2lkdGgsIDAuNSArIGFmd2lkdGgsIHZhbHVlKTsnLFxuICAgICAgJ30nLFxuXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAnICB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuICAgICAgJyAgZmxvYXQgYWxwaGEgPSBhYXN0ZXAodGV4Q29sb3IuYSk7JyxcbiAgICAgICcgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IsIG9wYWNpdHkgKiBhbHBoYSk7JyxcbiAgICAgIGFscGhhVGVzdCA9PT0gMFxuICAgICAgICA/ICcnXG4gICAgICAgIDogJyAgaWYgKGdsX0ZyYWdDb2xvci5hIDwgJyArIGFscGhhVGVzdCArICcpIGRpc2NhcmQ7JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJylcbiAgfSwgb3B0KVxufVxuIiwidmFyIGZsYXR0ZW4gPSByZXF1aXJlKCdmbGF0dGVuLXZlcnRleC1kYXRhJylcbnZhciB3YXJuZWQgPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMuYXR0ciA9IHNldEF0dHJpYnV0ZVxubW9kdWxlLmV4cG9ydHMuaW5kZXggPSBzZXRJbmRleFxuXG5mdW5jdGlvbiBzZXRJbmRleCAoZ2VvbWV0cnksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAxXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICd1aW50MTYnXG5cbiAgdmFyIGlzUjY5ID0gIWdlb21ldHJ5LmluZGV4ICYmIHR5cGVvZiBnZW9tZXRyeS5zZXRJbmRleCAhPT0gJ2Z1bmN0aW9uJ1xuICB2YXIgYXR0cmliID0gaXNSNjkgPyBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoJ2luZGV4JykgOiBnZW9tZXRyeS5pbmRleFxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgaWYgKGlzUjY5KSBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ2luZGV4JywgbmV3QXR0cmliKVxuICAgIGVsc2UgZ2VvbWV0cnkuaW5kZXggPSBuZXdBdHRyaWJcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUgKGdlb21ldHJ5LCBrZXksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAzXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICdmbG9hdDMyJ1xuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgIEFycmF5LmlzQXJyYXkoZGF0YVswXSkgJiZcbiAgICBkYXRhWzBdLmxlbmd0aCAhPT0gaXRlbVNpemUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lc3RlZCB2ZXJ0ZXggYXJyYXkgaGFzIHVuZXhwZWN0ZWQgc2l6ZTsgZXhwZWN0ZWQgJyArXG4gICAgICBpdGVtU2l6ZSArICcgYnV0IGZvdW5kICcgKyBkYXRhWzBdLmxlbmd0aClcbiAgfVxuXG4gIHZhciBhdHRyaWIgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoa2V5KVxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKGtleSwgbmV3QXR0cmliKVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgZGF0YSA9IGRhdGEgfHwgW11cbiAgaWYgKCFhdHRyaWIgfHwgcmVidWlsZEF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSkge1xuICAgIC8vIGNyZWF0ZSBhIG5ldyBhcnJheSB3aXRoIGRlc2lyZWQgdHlwZVxuICAgIGRhdGEgPSBmbGF0dGVuKGRhdGEsIGR0eXBlKVxuXG4gICAgdmFyIG5lZWRzTmV3QnVmZmVyID0gYXR0cmliICYmIHR5cGVvZiBhdHRyaWIuc2V0QXJyYXkgIT09ICdmdW5jdGlvbidcbiAgICBpZiAoIWF0dHJpYiB8fCBuZWVkc05ld0J1ZmZlcikge1xuICAgICAgLy8gV2UgYXJlIG9uIGFuIG9sZCB2ZXJzaW9uIG9mIFRocmVlSlMgd2hpY2ggY2FuJ3RcbiAgICAgIC8vIHN1cHBvcnQgZ3Jvd2luZyAvIHNocmlua2luZyBidWZmZXJzLCBzbyB3ZSBuZWVkXG4gICAgICAvLyB0byBidWlsZCBhIG5ldyBidWZmZXJcbiAgICAgIGlmIChuZWVkc05ld0J1ZmZlciAmJiAhd2FybmVkKSB7XG4gICAgICAgIHdhcm5lZCA9IHRydWVcbiAgICAgICAgY29uc29sZS53YXJuKFtcbiAgICAgICAgICAnQSBXZWJHTCBidWZmZXIgaXMgYmVpbmcgdXBkYXRlZCB3aXRoIGEgbmV3IHNpemUgb3IgaXRlbVNpemUsICcsXG4gICAgICAgICAgJ2hvd2V2ZXIgdGhpcyB2ZXJzaW9uIG9mIFRocmVlSlMgb25seSBzdXBwb3J0cyBmaXhlZC1zaXplIGJ1ZmZlcnMuJyxcbiAgICAgICAgICAnXFxuVGhlIG9sZCBidWZmZXIgbWF5IHN0aWxsIGJlIGtlcHQgaW4gbWVtb3J5LlxcbicsXG4gICAgICAgICAgJ1RvIGF2b2lkIG1lbW9yeSBsZWFrcywgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzcG9zZSAnLFxuICAgICAgICAgICd5b3VyIGdlb21ldHJpZXMgYW5kIGNyZWF0ZSBuZXcgb25lcywgb3IgdXBkYXRlIHRvIFRocmVlSlMgcjgyIG9yIG5ld2VyLlxcbicsXG4gICAgICAgICAgJ1NlZSBoZXJlIGZvciBkaXNjdXNzaW9uOlxcbicsXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC85NjMxJ1xuICAgICAgICBdLmpvaW4oJycpKVxuICAgICAgfVxuXG4gICAgICAvLyBCdWlsZCBhIG5ldyBhdHRyaWJ1dGVcbiAgICAgIGF0dHJpYiA9IG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoZGF0YSwgaXRlbVNpemUpO1xuICAgIH1cblxuICAgIGF0dHJpYi5pdGVtU2l6ZSA9IGl0ZW1TaXplXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXG4gICAgLy8gTmV3IHZlcnNpb25zIG9mIFRocmVlSlMgc3VnZ2VzdCB1c2luZyBzZXRBcnJheVxuICAgIC8vIHRvIGNoYW5nZSB0aGUgZGF0YS4gSXQgd2lsbCB1c2UgYnVmZmVyRGF0YSBpbnRlcm5hbGx5LFxuICAgIC8vIHNvIHlvdSBjYW4gY2hhbmdlIHRoZSBhcnJheSBzaXplIHdpdGhvdXQgYW55IGlzc3Vlc1xuICAgIGlmICh0eXBlb2YgYXR0cmliLnNldEFycmF5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhdHRyaWIuc2V0QXJyYXkoZGF0YSlcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
