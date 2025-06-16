import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import "./Users.css";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );

        if (responseData && responseData.users) {
          setLoadedUsers(responseData.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    getUsers();
  }, [sendRequest]);

  return (
    <div className="users-page">
      <div className="users-page__overlay"></div>
      <div className="users-page__content">
        <h1 className="users-page__title">Discover Amazing Places</h1>
        <p className="users-page__subtitle">Connect with travelers and explore their favorite destinations</p>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedUsers && <UsersList users={loadedUsers} />}
      </div>
    </div>
  );
};

export default Users;
