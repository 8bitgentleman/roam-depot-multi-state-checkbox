import { toggleRenderComponent } from "./entry-helpers";

const componentName = 'mult-state-checkbox'

function onload({extensionAPI}) {
  const panelConfig = {
    tabTitle: componentName,
    settings: [
        // {id:		  "strikethrough",
        //   name:		"Strikethrough DONE tasks",
        //   description: "Adds CSS to strike through DONE tasks",
        //   action:	  {type:	 "switch",
        //                 onChange: (evt) => { 
        //                   // toggleStrikethroughCSS(evt.target.checked); 
        //                   console.log("toggle strikethrough CSS!", evt.target.checked); }}}
    ]
  };

  extensionAPI.settings.panel.create(panelConfig);

  const checkboxObserver = createButtonObserver({
    attribute: componentName,
    render: (b) => renderQueryBlock(b, onloadArgs),
  });
 

  console.log(`load ${componentName} plugin`)
}

function onunload() {
  console.log(`unload ${componentName} plugin`)
  // toggleRenderComponent(false, titleblockUID, cssBlockParentUID, version, renderString, replacementString, cssBlockUID, codeBlockUID, componentName)
}

export default {
  onload,
  onunload
};