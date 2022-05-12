import styled from 'styled-components';
import tmi, { Events } from 'tmi.js';
import { useEffect, useRef, useState } from 'react';

const StyledApp = styled.div`
  // Your style here
`;

const client = new tmi.Client({
  channels: ['ginomachino'],
});

const useCustomHook = () => {
  const clientRef = useRef<tmi.Client | null>(null);
  const [names, setNames] = useState<string[]>([]);

  const onMessage: Events['message'] = (channel, user, message) => {
    const uniqueNames = new Set(names);
    const userName = user['display-name'];
    if (userName && !uniqueNames.has(userName)) {
      setNames((prevNames) => {
        const newNames = [...prevNames, userName];
        return Array.from(new Set(newNames));
      });
    }
  };

  useEffect(() => {
    if (clientRef.current) {
      return;
    }
    client.connect();
    client.on('message', onMessage);
    clientRef.current = client;
  }, []);

  return { names };
};

export function App() {
  const { names } = useCustomHook();
  return (
    <StyledApp>
      <h1>Names</h1>
      <ul>
        {names.map((name) => (
          <li>{name}</li>
        ))}
      </ul>
    </StyledApp>
  );
}

export default App;
