import { createGlobalStyle } from "styled-components";
import wonder from "./fonts/wonder.otf";
const FontStyles = createGlobalStyle`

@font-face {
  font-family: 'wonder';
  src: url(${wonder}) format('openType');
}
`;

export default FontStyles;