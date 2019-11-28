import styled, { keyframes, css } from 'styled-components';

const rotate = keyframes`
   from{
     transform: scale(.5);
   }

   to{
     transform:scale(2);
   }
`;

export const RepositoryMain = styled.div`
  margin-top: 100px;
`;
export const Loading = styled.div`
  color: #fff;

  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  svg {
    width: 50px;
    height: 50px;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    color: #7159c1;
    text-decoration: none;
  }
  img {
    width: 100px;
    border-radius: 50%;
    margin-top: 10px;
  }

  strong {
    font-size: 19px;
    font-weight: bold;
  }

  p {
    margin-top: 5px;
    max-width: 500px;
    font-size: 12px;
    text-align: center;
  }
`;

export const Filter = styled.div.attrs(props => ({
  type: 'submit',
  active: props.active,
}))`
  margin: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin-right: 5px;
    padding: 2px;
    width: 60px;
    font-size: 10px;
    background: #efefef;
    border: none;
    font-weight: bold;
    color: #4a90e2;

    &[active='1'] {
      background: #9b9b9b;
      color: #efefef;
    }
  }
`;
export const Issues = styled.ul`
  list-style: none;
  a {
    text-decoration: none;
  }

  li {
    display: flex;

    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px 0;
    & + li {
      margin-top: 10px;
    }

    align-items: center;
    img {
      width: 40px;
      border-radius: 50%;
    }
    div {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    strong {
      a {
        font-size: 12px;
        color: #71591c;
      }
      span {
        span {
          margin-left: 10px;
          background: #7159c1;
          color: #eee;
          border-radius: 2px;
          font-size: 9px;
          padding: 3px;
        }
      }
    }

    p {
      font-size: 11px;
      font-weight: 600;
    }
  }
`;

export const Page = styled.div`
  display: flex;
  justify-content: center;
  background: none;
  text-align: center;

  button {
    width: 30px;
    margin-left: 2px;
    border: 0.5px solid #bbbbbb;
    font-size: 12px;
    border-radius: 4px;
    background: #f9f9f9;
    color: #4a90e2;
  }

  button:hover {
    background: #efefef;
    color: #9b9b9b;
  }
  button#backward {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      padding: 2px;
      color: #4a90e2;
    }
  }
  button#foward {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      padding: 2px;
      color: #4a90e2;
    }
  }
`;
