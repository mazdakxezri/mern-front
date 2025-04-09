import React, { useContext, useEffect, useState } from "react";

import Button from "../../shared/components/FormElements/Button";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const LikePlace = ({ placeId, currentLikes }) => {
  const { userId, token } = useContext(AuthContext);
  const [likes, setLikes] = useState(currentLikes || []);
  const isLiked = likes.includes(userId);

  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  let toggleLike;
  useEffect(() => {
    let toggleLike = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`,
          "PATCH",
          JSON.stringify({
            action: isLiked ? "unlike" : "like",
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        const data = await response.json();
        setLikes(data.likes);
      } catch (err) {
        console.error("Failed to toggle like:", err);
      }
    };
    toggleLike();
  }, [sendRequest, placeId, isLiked, token]);

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Button inverse onClick={toggleLike}>
        {isLoading && <LoadingSpinner asOverlay />}
        {isLiked ? "❤️ Unlike" : "🤍 Like"} ({likes.length})
      </Button>
    </>
  );
};

export default LikePlace;
