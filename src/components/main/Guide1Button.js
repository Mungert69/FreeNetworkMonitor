import { useHistory } from "react-router-dom";
const GuideButton = () =>{
 let history = useHistory();
 const handleClick = () => {
  history.push("/#blog-post1");
 }
 return (
  <button type="button" onClick={handleClick}>
   Guide 1 
  </button>
 );
}
export default GuideButton;