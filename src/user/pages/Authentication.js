import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/Hooks/form-hook";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Authentication = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(data.userId, data.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        auth.login(data.userId, data.token);
      } catch (error) {}
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__overlay"></div>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="authentication__header">
          {isLoginMode ? "Welcome Back!" : "Create Account"}
        </h2>
        <p className="authentication__subtitle">
          {isLoginMode
            ? "Please login to your account"
            : "Join our community of travelers"}
        </p>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              errorText="Please enter a name."
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              icon="👤"
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
            icon="✉️"
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
            icon="🔒"
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Sign Up"}
          </Button>
        </form>

        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Login"}
        </Button>
      </Card>
    </div>
  );
};

export default Authentication;
