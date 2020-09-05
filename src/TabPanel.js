import React from 'react';
import "./App.css";

function TabPanel(props) {
  const { children, index, activatedTab } = props;

  return (
    <div id={`tabpanel-${index}`} hidden={index !== activatedTab}>
      {children}
    </div>
  );
}

export default TabPanel;
