import { useEffect, useState, useContext } from "react";
import Design from "./Design";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

export default function Message() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { usernameDetails, id, setId, setUsernameDetails } =
    useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3003");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`/messages/${selectedUserId}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Failed to fetch messages:", err));
    }
  }, [selectedUserId]);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      // setMessages((prev) => [...prev, { ...messageData }]);
      setMessages((prev) => uniqBy([...prev, messageData], "id"));
    }
  }

  function logout() {
    axios.post("/logout").then(() => {
      setId(null);
      setUsernameDetails(null);
    });
  }

  function sendMessage(ev) {
    ev.preventDefault();

    const message = {
      recipient: selectedUserId,
      text: newMessage,
    };

    ws.send(JSON.stringify(message));

    setMessages((prev) => [
      ...prev,
      {
        ...message,
        sender: id,
        id: Date.now(),
      },
    ]);

    setNewMessage(""); // Clear input
  }

  const onlinePeopleMinusUser = { ...onlinePeople };

  delete onlinePeopleMinusUser[id];

  const messagesWithoutDupes = uniqBy(messages, "id");

  const sortedMessages = [...messagesWithoutDupes].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <div className="w-full sm:w-1/3 bg-white flex flex-col">
        <div className="flex-grow">
          <div className="text-red-500 font-bold flex gap-2 p-4 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
            </svg>
            ChatBling
          </div>
          <div>
            <div className="text-gray-500 text-base pl-4 pb-1 flex gap-1">
              Welcome,
              <h4 className="text-gray-800 font-bold"> {usernameDetails}</h4>
            </div>
          </div>
          {Object.keys(onlinePeopleMinusUser).map((userId) => (
            <div
              key={userId}
              onClick={() => setSelectedUserId(userId)}
              className={
                "border-b border-gray-100 pl-4 flex items-center gap-2 py-2 rounded-lg mx-0.5 cursor-pointer" +
                (userId === selectedUserId ? " bg-custom-blue text-white" : "")
              }
            >
              <Design username={onlinePeople[userId]} userId={"userId"} />
              <span className="text-grey-800">{onlinePeople[userId]}</span>
            </div>
          ))}
        </div>

        <div className="p-2 text-center">
          <button
            onClick={logout}
            className="text-sm bg-blue-100 hover:bg-red-500 hover:text-white border rounded"
          >
            LogOut
          </button>
        </div>
      </div>
      <div className="flex flex-col h-full sm:w-2/3 bg-custom-blue p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className=" h-full flex items-center justify-center">
              <div className="text-gray-500">
                &larr; Select a user to start conversation
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll position-absolute inset-0">
                {sortedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-md text-sm " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessage}
              placeholder="Type Message"
              onChange={(ev) => setNewMessage(ev.target.value)}
              className="bg-white flex-grow border rounded p-2"
            />
            <button className="bg-blue-500 p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
