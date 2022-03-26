import React from "react";
import { NavLink , NavIcon , NavItems } from "./Social.elements";

function Social() {
  return (
    <>
         <div className="flexContainer">
             <div className="flexItems">
             <a href="https://www.instagram.com/vipcardroom/" target="_blank"> <img src={"config/images/instagram.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://twitter.com/vipcardroom" target="_blank"><img src={"config/images/twitter.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://discord.com/invite/vipcardroom" target="_blank"> <img src={"config/images/discord.png"}  /></a>
             </div>
         </div>
    </>
  )
}


export default Social