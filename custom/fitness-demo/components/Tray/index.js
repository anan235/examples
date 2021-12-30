import React from 'react';
import ChatTray from './Chat';
import RecordTray from './Record';
import ScreenShareTray from './ScreenShare';

export const Tray = () => {
  return (
    <>
      <ChatTray />
      <ScreenShareTray />
      <RecordTray />
    </>
  );
};

export default Tray;
