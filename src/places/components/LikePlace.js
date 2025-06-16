import React, { useContext, useState } from "react";

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

  const toggleLike = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${placeId}/like`,
        "PATCH",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setLikes(responseData.likes);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Button inverse onClick={toggleLike} disabled={isLoading}>
        {isLoading && <LoadingSpinner asOverlay />}
        {isLiked ? "❤️ Unlike" : "🤍 Like"} ({likes.length})
      </Button>
    </>
  );
};

export default LikePlace;
