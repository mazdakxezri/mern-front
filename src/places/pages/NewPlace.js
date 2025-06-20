import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../shared/Hooks/http-hook";
import "./NewPlace.css";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/Hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let formData = new FormData();

      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (error) {}
  };

  return (
    <div className="new-place-page">
      <div className="new-place-page__overlay"></div>
      <ErrorModal error={error} onClear={errorHandler} />
      <div className="new-place-page__content">
        <div className="new-place-page__header">
          <h1 className="new-place-page__title">Share Your Place</h1>
          <p className="new-place-page__subtitle">Tell us about your favorite location</p>
        </div>
        
        <form className="new-place-form" onSubmit={placeSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          
          <div className="new-place-form__group">
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              icon="📝"
            />
          </div>

          <div className="new-place-form__group">
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid description (at least 6 characters)."
              onInput={inputHandler}
              icon="📄"
            />
          </div>

          <div className="new-place-form__group">
            <Input
              id="address"
              element="input"
              label="Address"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid address."
              onInput={inputHandler}
              icon="📍"
            />
          </div>

          <div className="new-place-form__group">
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          </div>

          <Button type="submit" disabled={!formState.isValid}>
            Share Place
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewPlace;
