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

import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as Graphic from './graphic';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';
import * as Palette from './palette';
import { getTopLevelFolder } from './utils';
import { FOLDER_WIDTH } from './layout';

export default function createFolder({
  textCreator,
  name,
  guiAdd,
  guiRemove,
  addControllerFuncs
} = {} ){

  const MAX_FOLDER_ITEMS_IN_COLUMN = 25;

  const width = Layout.FOLDER_WIDTH;
  const depth = Layout.PANEL_DEPTH;

  const state = {
    collapsed: false,
    previousParent: undefined
  };

  const group = new THREE.Group();
  group.guiType = "folder";
  group.toString = () => `[${group.guiType}: ${name}]`;

  const collapseGroup = new THREE.Group();
  group.add( collapseGroup );

  var isAccordion = false;
  /** When true, will keep only one child folder of this folder open at a time.
   * Siblings automatically close.
   */
  Object.defineProperty( group, 'accordion', {
    get: () => {
      return isAccordion;
    },
    set: ( newValue ) => {
      if ( newValue && !isAccordion ) group.guiChildren.filter( c=>c.isFolder ).map( c=>c.close() );
      isAccordion = newValue;
      performLayout();
    }
  });

  //expose as public interface so that children can call it when their spacing changes
  group.performLayout = performLayout;
  group.isCollapsed = () => { return state.collapsed }
  
  //useful to have access to this as well. Using in remove implementation
  Object.defineProperty(group, 'guiChildren', {
    //perhaps modalEditor should also count as a member of this...
    //currently can't see anything in implementation that would require that
    get: () => { return collapseGroup.children }
  });
  // returns true if all of the supplied args are members of this folder
  group.hasChild = function ( ...args ){
    return !args.includes((obj) => { return group.guiChildren.indexOf(obj) === -1});
  }

  group.folderName = name; //for debugging
  
  //  Yeah. Gross.
  const addOriginal = THREE.Group.prototype.add;
  //as long as no-one expects this to behave like a regular THREE.Group, the changed definition of remove shouldn't hurt
  const removeOriginal = THREE.Group.prototype.remove; 

  function addImpl( o ){
    addOriginal.call( group, o );
  }
  function removeImpl( o ){
    removeOriginal.call( group, o );
  }

  //addImpl( collapseGroup ); //redundant.

  const panel = Layout.createPanel( width, Layout.FOLDER_HEIGHT, depth, true );
  addImpl( panel );

  const descriptorLabel = textCreator.create( name );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 1.5;
  descriptorLabel.position.y = -0.03;
  descriptorLabel.position.z = depth;
  panel.add( descriptorLabel );

  const downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry( downArrow.geometry, 0xffffff );
  downArrow.position.set( 0.05, 0, depth  * 1.01 );
  panel.add( downArrow );

  const grabber = Layout.createPanel( width, Layout.FOLDER_GRAB_HEIGHT, depth, true );
  grabber.position.y = Layout.FOLDER_HEIGHT * 0.86; //XXX: magic number
  grabber.name = 'grabber';
  addImpl( grabber );

  const grabBar = Graphic.grabBar();
  grabBar.position.set( width * 0.5, 0, depth * 1.001 );
  grabber.add( grabBar );
  group.isFolder = true;
  group.hideGrabber = function() { grabber.visible = false };
  group.showGrabber = function() { grabber.visible = true };
  group.hideHeader = function() { 
    group.hideGrabber();
    //descriptorLabel.visible = downArrow.visible = panel.visible = false;
    panel.visible = false;
  };
  group.showHeader = () => {
    //grabber.visible = descriptorLabel.visible = downArrow.visible = panel.visible = true;
    panel.visible = true;
  };

  const headerItems = new THREE.Group();
  panel.add(headerItems);

  const detachButtonMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
  const h = Layout.FOLDER_HEIGHT * 0.8;
  const detachButtonRect = new THREE.BoxGeometry( h, h, Layout.BUTTON_DEPTH*2 );
  const detachButton = new THREE.Mesh(  detachButtonRect, detachButtonMaterial );
  detachButton.visible = false;
  detachButton.position.x = Layout.FOLDER_WIDTH - Layout.FOLDER_HEIGHT;
  //panel.add(detachButton);
  headerItems.add(detachButton);
  const detachButtonInteraction = createInteraction(detachButton);
  detachButton.interaction = detachButtonInteraction;
  detachButtonInteraction.events.on( 'onPressed', function( p ){
    if (group.detachedParent) {
      group.reattach();
    } else group.detach();
    p.locked = true;
  });

  let isDetachable = false;
  Object.defineProperty( group, 'detachable', {
    get: () => {
      return isDetachable;
    },
    set: ( newValue ) => {
      if (newValue === isDetachable) return;
      detachButton.visible = newValue;
      isDetachable = newValue;
    }
  });


  group.add = function( ...args ){
    const newController = guiAdd( ...args );

    if( newController ){
      group.addController( newController );
      return newController;
    }
    else{
      return new THREE.Group();
    }
  };

  group.addHeaderItem = function(obj){
    headerItems.add(obj);
  }

  /*
    Some controllers may bring up sub-GUIs which have the potential
    to overlap / clash.  This ensures only one is present at a time.

    This should also apply to dropdown menus, and it should be more
    aggressively cleared when any interaction happens that *isn't*
    showing something...
  */
  group.setModalEditor = function(e){
    //This could go wrong if folder hierarchy changes significantly.
    //Should be good enough for rock'n'roll (famous last words).
    //I could make it so that only one of these things was ever visible
    //across the entire system.  That'd be easy to make robust, anyway...
    //and saves headaches down the line.
    const folder = getTopLevelFolder(group);
    if (folder.modalEditor) folder.modalEditor.visible = false;
    folder.modalEditor = e;
    if (!e) return;
    e.visible = true;
    folder.modalWasSetInCurrentFrame = true;
    //add a flag to all children recursively so that interaction system can identify them as belonging to a modal editor
    //TODO: skip if already done...
    function decorateChildren(parent) {
      parent.children.forEach(c => {
        c.userData.partOfModal = e;
        decorateChildren(c);
      });
    }
    decorateChildren(e);
  };

  /**
   * Removes the current modal editor from this folder
   * **but not if it was added during the current controller update,
   * as indicated by a flag set in setModalController and reset in index.js update**
   */
  group.clearModalEditor = function() {
    const folder = getTopLevelFolder(group);
    if (!folder.modalWasSetInCurrentFrame) {
      //folder.setModalEditor(null);
      if (folder.modalEditor) {
        folder.modalEditor.visible = false;
        folder.modalEditor = null;
      }
    }
  };


  /* 
  Removes the given controllers from the GUI.  Once removed, the controllers will effectively be invalid for use
  as they will also be removed from the global list of all dat.GUIVR controllers.  Use 'detach' instead if it is
  desired to reuse GUI elements elsewhere.

  If the arguments are invalid, it will attempt to detect this before making any changes, 
  aborting the process and returning false from this method.

  Note: as with add, this overwrites an existing property of THREE.Group.
  As long as no-one expects folders to behave like regular THREE.Groups, that shouldn't matter.
  */
  group.remove = function( ...args ){
    const ok = guiRemove( ...args ); // any invalid arguments should cause this to return false
    if (!ok) return false;
    args.forEach( function( obj ){
      console.assert(group.hasChild(obj), "internal problem with housekeeping logic of dat.GUIVR folder not caught by sanity check");
      if (obj.isFolder) {
        obj.remove( ...obj.guiChildren );
      }
      collapseGroup.remove(obj);
    });
    //TODO: defer actual layout performance; set a flag and make sure it gets done before any rendering or hit-testing happens.
    performLayout();
    return true;
  };

  /**
   * Detach a child folder from this folder hierarchy, such that it can be used elsewhere in scene hierarchy.
   * 
   * (will not be visible until user explicitly adds elsewhere)
   */
  group.detachChild = (child) => {
    if (!child.isFolder || child.folder !== group) return false;
    child.showHeader();
    child.folder = child;
    child.detachedParent = group;
    collapseGroup.remove(child);
    //THREE.Object3D.prototype.remove.call(group, child);
    removeImpl(child);
    performLayout();
    return group; //or child?
  };

  /*
    Detach this object from its parent, and reattach to scenegraph as a sibling of the 'top level' folder in
    the hierarchy this previously was a member of.
  */
  group.detach = () => {
    if (group.folder === group) return false;
    //automatically add to THREE parent of top level folder and try to set appropriate scale / transform...
    const topFolder = getTopLevelFolder(group);
    group.folder.detachChild(group);
    
    topFolder.parent.add(group);
    const m = topFolder.matrix.clone();
    group.applyMatrix(m);
    m.setPosition(new THREE.Vector3());
    const t = new THREE.Vector3(Layout.FOLDER_WIDTH, 0, 0).applyMatrix4(m);
    group.position.add(t);
    group.open();
    group.showGrabber();
    //group.detachable = false;
    return group;
  };
  group.detachFromParent = group.detach;
  group.reattach = () => {
    if (!group.detachedParent) return false;
    group.detachedParent.addFolder(group);
    console.log(group.matrix.elements);
    group.detachedParent = null;
    return true;
  }

  group.addController = function( ...args ){
    args.forEach( function( obj ){
      collapseGroup.add( obj );
      obj.folder = group;
      if (obj.isFolder) {
        obj.hideGrabber();
        obj.close();
      }
    });

    performLayout();
  };

  group.addFolder = function( ...args ){
    args.forEach( function (obj) {
      collapseGroup.add( obj );
      obj.folder = group;
      obj.scale.set(1,1,1);
      obj.hideGrabber();
      obj.close();
    });

    performLayout();
  };

  function performLayout(){
    performHeaderLayout();
    const spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;
    const emptyFolderSpace = Layout.FOLDER_HEIGHT + Layout.PANEL_SPACING;
    var totalSpacing = emptyFolderSpace;

    collapseGroup.children.forEach( (c) => { c.visible = !state.collapsed } );
    //children should be ordered by guiIndex.
    //if they don't already have one, it can be added here:
    //this should be the only place that we need to consider that property
    //it allows for detaching elements and reattaching in similar place, even if some siblings are also detached.
    let lastGuiIndex = 0;
    collapseGroup.children.forEach( (c, i) => {
      if (c.guiIndex === undefined) {
        c.guiIndex = lastGuiIndex+=1;
      } else lastGuiIndex = c.guiIndex;
    });
    collapseGroup.children.sort((a, b) => { return a.guiIndex - b.guiIndex });

    if ( state.collapsed ) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;

      var y = 0, lastHeight = emptyFolderSpace;

      collapseGroup.children.forEach( function( child, index ){
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
        if (index < MAX_FOLDER_ITEMS_IN_COLUMN)
          totalSpacing += h;
        child.position.x = 0.026;

        if ((index+1) % MAX_FOLDER_ITEMS_IN_COLUMN === 0) y = 0;

        // child.position.y -= (index%MAX_FOLDER_ITEMS_IN_COLUMN+1) * ( DROPDOWN_OPTION_HEIGHT );
        child.position.x += width * Math.floor(index / MAX_FOLDER_ITEMS_IN_COLUMN);
      });
    }
    
    group.spacing = totalSpacing;
    
    //make sure parent folder also performs layout.
    if (group.folder !== group) group.folder.performLayout();
    
    // if we're a subfolder, use a smaller panel
    let panelWidth = Layout.FOLDER_WIDTH;
    if (group.folder !== group) {
      panelWidth = Layout.SUBFOLDER_WIDTH;
    }
    
    Layout.resizePanel(panel, panelWidth, Layout.FOLDER_HEIGHT, depth)

  }

  function performHeaderLayout() {
    let dx = Layout.FOLDER_HEIGHT;
    let x = Layout.FOLDER_WIDTH;
    headerItems.children.forEach((c) => {
      if (!c.visible) return;
      x -= dx;
      c.position.x = x;
      x -= dx*0.2; //TODO: dehackify
    });
  }
  
  function updateView(){
    if( interaction.hovering() ){
      panel.material.color.setHex( Colors.HIGHLIGHT_BACK );
    }
    else{
      panel.material.color.setHex( Colors.DEFAULT_FOLDER_BACK );
    }

    if( grabInteraction.hovering() ){
      grabber.material.color.setHex( Colors.HIGHLIGHT_BACK );
    }
    else{
      grabber.material.color.setHex( Colors.DEFAULT_FOLDER_BACK );
    }

    //TODO: more consistent hover styling
    if ( detachButtonInteraction.hovering() ) {
      detachButtonMaterial.color.setHex( 0xFFFFFF );
    } else {
      detachButtonMaterial.color.setHex( 0x888888 );
    }
  }

  const interaction = createInteraction( panel );
  interaction.events.on( 'onPressed', function( p ){
    if (state.collapsed) group.open();
    else group.close();
    p.locked = true;
  });

  group.open = function() {
    if (!state.collapsed) return;
    if (group.folder !== group && group.folder.accordion) {
      group.folder.guiChildren.filter(c=>c.isFolder && c !== group).forEach(c=>c.close());
    }
    state.collapsed = false;
    addImpl(collapseGroup);
    performLayout();
  };

  group.close = function() {
    if (state.collapsed) return;
    state.collapsed = true;
    removeImpl(collapseGroup);
    performLayout();
  };

  group.folder = group;

  const grabInteraction = Grab.create( { group, panel: grabber } );
  const paletteInteraction = Palette.create( { group, panel } );
  group.updateControl = function( inputObjects ){
    //nb: if the control is not visible / active, then it won't interfere...    
    //but "if (!isDetachable)" here causes problems.
    
    headerItems.children.forEach(o => o.interaction.update(inputObjects));
    //detachButtonInteraction.update( inputObjects );
    interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    paletteInteraction.update( inputObjects );

    updateView();
  };

  group.name = function( str ){
    descriptorLabel.updateLabel( str );
    return group;
  };

  //group.hitscan = [ panel, grabber, detachButton ];
  Object.defineProperty(group, 'hitscan', {
    get: () => {
      const hs = headerItems.children.filter(c=>c.visible).reduce((a, b) => {return a.concat(b)}, [panel, grabber]);
      return hs;
    }
  });

  group.beingMoved = false;

  for (let k in addControllerFuncs) {
    group[k] = (...args) => {
      const controller = addControllerFuncs[k](...args);
      if ( controller ){
        group.addController( controller );
        return controller;
      }
      else {
        return new THREE.Group();
      }
    }
  }

  return group;
}