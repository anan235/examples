// import PrebuiltCall from '../components/PrebuiltCall';
import React, { useState } from 'react';
import Call from '../components/Call';
import Home from '../components/Home';
import Header from '@dailyjs/shared/components/Header';
import getDemoProps from '@dailyjs/shared/lib/demoProps';

export default function Index({ isConfigured = false }) {
  const [room, setRoom] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [callFrame, setCallFrame] = useState(null);

  return (
    <div className="index-container">
      <Header
        demoTitle={'Daily Prebuilt demo'}
        repoLink={
          'https://github.com/daily-demos/examples/tree/main/prebuilt-ui/basic-embed'
        }
      />
      <main>
        {room ? (
          <Call
            room={room}
            expiry={expiry}
            setRoom={setRoom}
            setCallFrame={setCallFrame}
            callFrame={callFrame}
          />
        ) : (
          <Home
            setRoom={setRoom}
            setExpiry={setExpiry}
            isConfigured={isConfigured}
          />
        )}
      </main>
      <style jsx>{`
        .index-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow: auto;
          max-width: 1200px;
          margin: auto;
        }

        main {
          padding: 2rem;
          flex: 1;
        }

        :global(.field) {
          margin-top: var(--spacing-sm);
        }

        :global(.card) {
          margin: 8px;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const defaultProps = getDemoProps();

  return {
    props: defaultProps,
  };
}