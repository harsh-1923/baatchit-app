import React, { useRef, useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";

import { useAuth } from "../contexts/AuthContext";

import { auth } from "../firebase";

export default function Chats() {
  const navigate = useNavigate();
  const didMountRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function handleLogout() {
    await auth.signOut();
    navigate("/");
  }

  async function getFile(url) {
    console.log(url);
    let response = await fetch(url);
    let data = await response.blob();
    return new File([data], "test.jpg", { type: "image/jpeg" });
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;

      if (!user || user === null) {
        // history.push("/")
        navigate("/");
        return;
      }

      axios
        .get("https://api.chatengine.io/users/me/", {
          headers: {
            "project-id": "ec601db7-9cf8-4f8b-a9bf-143324095cac",
            "user-name": user.email,
            "user-secret": user.uid,
          },
        })
        .then(() => setLoading(false))
        .catch((e) => {
          let formdata = new FormData();
          console.log(user.email)
          formdata.append("email", user.email);
          formdata.append("username", user.email);
          formdata.append("secret", user.uid);
          console.log(user);

          getFile(user.photoURL).then((avatar) => {
            formdata.append("avatar", avatar, avatar.name);

            axios
              .post("https://api.chatengine.io/users/", formdata, {
                headers: {
                  "private-key": "3e58bd83-9e35-4cf5-b173-8314272e5697",
                },
              })
              .then(() => setLoading(false))
              .catch((e) => console.log("e", e.response));
          });
        });
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
  }, [user]);

  if (!user || loading) return <div />;

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">Flint Messages</div>

        <div onClick={handleLogout} className="logout-tab">
          Logout
        </div>
      </div>

      <ChatEngine
        height="calc(100vh - 66px)"
        projectID="ec601db7-9cf8-4f8b-a9bf-143324095cac"
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
}
