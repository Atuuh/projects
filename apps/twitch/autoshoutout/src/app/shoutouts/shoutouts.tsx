import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ShoutoutsProps {}

const StyledShoutouts = styled.div`
  color: pink;
`;

export function Shoutouts(props: ShoutoutsProps) {
  return (
    <StyledShoutouts>
      <h1>Welcome to Shoutouts!</h1>
    </StyledShoutouts>
  );
}

export default Shoutouts;
