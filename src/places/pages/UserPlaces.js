import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./UserPlaces.css";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPalces] = useState();
  const [userName, setUserName] = useState("");
  const userId = useParams().userId;

  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  useEffect(() => {
    const getPlacesByUserId = async () => {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
        );
        setLoadedPalces(data.places);
        if (data.places && data.places.length > 0) {
          setUserName(data.places[0].creator.name);
        }
      } catch (error) {}
    };

    getPlacesByUserId();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPalces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <div className="user-places-page">
      <div className="user-places-page__overlay"></div>
      <ErrorModal error={error} onClear={errorHandler} />
      <div className="user-places-page__content">
        
        
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        
        {!isLoading && loadedPlaces && loadedPlaces.length === 0 && (
          <div className="user-places-page__empty">
            <h2>Not Found place for {userName}</h2>
          </div>
        )}
        
        {!isLoading && loadedPlaces && loadedPlaces.length > 0 && (
          <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
        )}
      </div>
    </div>
  );
};

export default UserPlaces;
