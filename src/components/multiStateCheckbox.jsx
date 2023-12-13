import { createComponentRender } from "roamjs-components/components/ComponentContainer";
import React, { useState } from 'react';
import { Button, Icon } from '@blueprintjs/core';

// Define the different states and their corresponding properties
const states = [
  { label: 'TODO', icon: 'blank', intent: 'none', outlined: true },
  { label: 'DOING', icon: 'arrow-right', intent: 'warning' },
  { label: 'BLOCKED', icon: 'pause', intent: 'danger' },
  { label: 'DONE', icon: 'tick', intent: 'success' }, // BlueprintJS uses 'tick' for the checkmark icon
  { label: 'CANCELED', icon: 'cross', intent: 'none', customStyles: { background: 'gray' }, iconStyle: { color: 'white' }},
];

function findStateIndex(str, states, uid) {
  // Create a regex pattern that matches any of the state labels
  const pattern = new RegExp(states.map(state => `#\\[\\[${state.label}\\]\\]`).join('|'), 'g');
  
  // Find the matching state index
  const match = pattern.exec(str);
  if (match) {
    // If a state tag is found, update the block return the index of that state
    return states.findIndex(state => `#[[${state.label}]]` === match[0]);
  }
  // else add the state to the string
  console.log(`${str} #[[TODO]]`);
  
  window.roamAlphaAPI.updateBlock({"block":{"uid": uid,"string": `${str} #[[TODO]]`}})
  // If no state tag is found, return the default index (0 for TODO)
  return 0;
}

const MultiStateCheckbox = ({ blockUid, isEditBlock, showAlias }) => {
    let initialBlockString = window.roamAlphaAPI.data.pull("[:block/string]", `[:block/uid \"${blockUid}\"]`)[':block/string']
    const initialStateIndex = findStateIndex(initialBlockString, states, blockUid);
    const [currentStateIndex, setCurrentStateIndex] = useState(initialStateIndex);
    
  const handleClick = () => {
    // Calculate the next state index using modulo to wrap around
    const nextStateIndex = (currentStateIndex + 1) % states.length;
    const currentStateLabel = states[currentStateIndex].label;
    const nextStateLabel = states[nextStateIndex].label;
    
    // Get the block string for the parent Roam Research block
    let blockString = window.roamAlphaAPI.data.pull("[:block/string]", `[:block/uid \"${blockUid}\"]`)[':block/string']

    //create a regex patter to find the state tag in the string
    const pattern = new RegExp("#\\[\\[" + currentStateLabel + "\\]\\](?=( |$))");
    
    //replace the state tag with the next state tag
    const resultString = blockString.replace(pattern, `#[[${nextStateLabel}]]`);

    //update the block string
    window.roamAlphaAPI.updateBlock({"block":{"uid": blockUid,"string": resultString}})

    // console.log(pattern, resultString);
        
    // Loop through the states
    setCurrentStateIndex((prevStateIndex) => (prevStateIndex + 1) % states.length);
    // Here you could potentially use blockUid to perform some logic or side effects
    // console.log(`BlockUID: ${blockUid}, New State: ${states[(currentStateIndex + 1) % states.length].label}`);
  };

  const currentState = states[currentStateIndex];

  // Apply custom styles if they exist for the current state
  const customStyles = currentState.customStyles || {};

  // Define default styles
  const defaultStyles = {
    minWidth: '12px',
    minHeight: '12px',
    width: '16px',
    height: '16px',
    outline: 'none',
    color:'white',
  };

  return (
    <Button
    icon={
      <Icon
        icon={currentState.icon}
        // Apply the icon style if it exists for the current state
        style={currentState.iconStyle || {}}
      />
    }
      iconColor="white"
      intent={currentState.intent}
      outlined={currentState.outlined}
      onClick={handleClick}
      small={true}
      className='multi-state-checkbox'
      style={{ ...defaultStyles, ...customStyles }}
    >
    </Button>
  );
};

export const renderMultiCheckbox = createComponentRender(
    ({ blockUid }) => <MultiStateCheckbox blockUid={blockUid} isEditBlock showAlias style={'display: inline-block;'} />,
    "multi-state-checkbox-parent"
  );