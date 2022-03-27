import styled from "styled-components";

export const Wrapper = styled.div`
  min-height: 120vh;
  max-width: 120vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0, 0.9);
  position: absolute;
  top: 0%;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  color: #fff4cf;
  font-family: "wonder";
  
`;

export const CountText = styled.div`
  font-size: 2.9vw;
`;

export const Timer = styled.div`
  margin-top: 0.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2vw;
`;

export const Count = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Digit = styled.div`
  font-size: 11vw;
  -webkit-text-stroke: 2px var(--primary);
  text-stroke: 2px var(--primary);
  color: #000;
`;

export const Value = styled.div`
  margin-top: -1vw;
  font-size: 2vw;
`;