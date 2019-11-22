import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  input {
    flex: 1;
    padding: 10px 15px;
    border-radius: 4px;
    border: 1px solid #eee;
    font-size: 16px;
  }
`;

const rotate = keyframes`
   from{
     transform: rotate(0deg);
   }

   to{
     transform: rotate(360deg);
   }
`;
export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
    font-weight: bold;
    & + li {
      border-top: 1px solid #eee;
    }
    a {
      text-decoration: none;
      color: #7159c1;
    }
  }
`;
