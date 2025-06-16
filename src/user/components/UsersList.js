import React from "react";

import "./UsersList.css";
import Card from "../../shared/components/UIElements/Card";
import UserItem from "./UserItem";

const UsersList = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="center">
        <Card className="users-list__empty">
          <h2>No Users Found</h2>
          <p>Be the first to share your favorite places!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="users-list__container">
      <ul className="users-list">
        {users.map((user) => (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
