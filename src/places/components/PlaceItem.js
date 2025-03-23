import React, { useContext, useState } from "react";

import "./PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
// import Map from "../../shared/components/UIElements/Map";
import Alternative from "../../shared/components/UIElements/Alternative";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = ({
  image,
  title,
  address,
  description,
  id,
  coordinates,
  creator,
  onDelete,
}) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const openConfirmModalHandler = () => {
    setShowConfirm(true);
  };
  const closeConfirmModalHandler = () => {
    setShowConfirm(false);
  };
  const confirmDeletHandler = async () => {
    setShowConfirm(false);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      onDelete(id);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Alternative />
          {/* <Map center={coordinates} zoom={16} /> */}
        </div>
      </Modal>
      <Modal
        show={showConfirm}
        onCancel={closeConfirmModalHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={closeConfirmModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeletHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <div className="place-item__info">
          <p>
            Do you want to proceed and delete this place? Please note that, it
            can't be undone thereafter.
          </p>
        </div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={process.env.REACT_APP_ASSET_URL + `/${image}`}
              alt={title}
            />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === creator && (
              <>
                <Button to={`/places/${id}`}>EDIT</Button>
                <Button danger onClick={openConfirmModalHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
