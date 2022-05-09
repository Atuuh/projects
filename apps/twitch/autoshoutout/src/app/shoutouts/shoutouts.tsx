import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ShoutoutsProps {
  usernames: string[]

}

const StyledShoutouts = styled.div`
  color: pink;
`;

export function Shoutouts({usernames}: ShoutoutsProps) {

const check

  return (
    <StyledShoutouts>
      <h1>Welcome to Shoutouts!</h1>
    </StyledShoutouts>
  );
}

export default Shoutouts;
