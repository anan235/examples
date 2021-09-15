import React from 'react';

import App from '@dailyjs/basic-call/components/App';
import { TranscriptionProvider } from '../../contexts/TranscriptionProvider';

// Extend our basic call app component with the Live Transcription context
export const AppWithTranscription = () => (
  <TranscriptionProvider>
    <App />
  </TranscriptionProvider>
);

export default AppWithTranscription;
