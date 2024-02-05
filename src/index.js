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
  
  // create the observer for a roam button {{multi-state-checkbox}}
  const checkboxObserver = createButtonObserver({
    attribute: componentName,
    render: (b) => {
      renderMultiCheckbox(b, onloadArgs)
    }
  });
  runners['observers'] = [checkboxObserver]

  // FIXME this cycles endlessly sometimes...
  extensionAPI.ui.commandPalette.addCommand({
      label: 'Cycle multi-state TODO', 
      callback: () => {
        const blockUid = window.roamAlphaAPI.ui.getFocusedBlock()?.['block-uid'] || null;
        if (blockUid !== null) {
          let blockString = window.roamAlphaAPI.data.pull("[:block/string]", `[:block/uid \"${blockUid}\"]`)[':block/string']
          const states = ['TODO', 'DOING', 'BLOCKED', 'DONE','CANCELED']
          // Create a regex pattern that matches any of the state labels
          const pattern = new RegExp(states.map(state => `#\\[\\[${state}\\]\\]`).join('|'), 'g');
          
          // Find the matching state index
          const match = pattern.exec(blockString);
          if (match) {
            // If a state tag is found, update the block return the index of that state
            const currentStateIndex =  states.findIndex(state => `#[[${state}]]` === match[0])
            const currentStateLabel = states[currentStateIndex]
            const nextStateIndex = (currentStateIndex + 1) % states.length;
            const nextStateLabel = states[nextStateIndex]
            //create a regex patter to find the state tag in the string
            const pattern2 = new RegExp("#\\[\\[" + currentStateLabel + "\\]\\](?=( |$))");
            
            //replace the state tag with the next state tag
            const resultString = blockString.replace(pattern2, `#[[${nextStateLabel}]]`);

            //update the block string
            window.roamAlphaAPI.updateBlock({"block":{"uid": blockUid,"string": resultString}})

          }
        }
        
    }})

  console.log(`load ${componentName} plugin`)
}

function onunload() {
  for (let index = 0; index < runners['observers'].length; index++) {
    const element = runners['observers'][index];
    element.disconnect()
  }
  console.log(`unload ${componentName} plugin`)
}

export default {
  onload,
  onunload
};