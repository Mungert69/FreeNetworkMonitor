import { useNavigate } from "react-router-dom";

const GuideButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/#blog-post1");
  }

  return (
    <button type="button" onClick={handleClick}>
      Guide 1 
    </button>
  );
}

export default GuideButton;
