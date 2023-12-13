import createButtonObserver from "roamjs-components/dom/createButtonObserver";
import { renderMultiCheckbox } from "./components/multiStateCheckbox";
import getUids from "roamjs-components/dom/getUids";
import getUidsFromButton from "roamjs-components/dom/getUidsFromButton";

const componentName = 'multi-state-checkbox'

// store observers globally so they can be disconnected 
var runners = {
  observers: [],
}
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
  const onloadArgs = extensionAPI
  extensionAPI.settings.panel.create(panelConfig);

  const checkboxObserver = createButtonObserver({
    attribute: componentName,
    render: (b) => {
      renderMultiCheckbox(b, onloadArgs)
    }
  });
  runners['observers'] = [checkboxObserver]

  console.log(`load ${componentName} plugin`)
}

function onunload() {
  for (let index = 0; index < runners['observers'].length; index++) {
    const element = runners['observers'][index];
    element.disconnect()
  }
  console.log(`unload ${componentName} plugin`)
  // toggleRenderComponent(false, titleblockUID, cssBlockParentUID, version, renderString, replacementString, cssBlockUID, codeBlockUID, componentName)
}

export default {
  onload,
  onunload
};