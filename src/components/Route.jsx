import { useContext } from "react";
import { UserContext } from "./UserContext";
import Message from "./Message";
import LoginRegister from "./Login&Register";

export default function Route() {
    const { usernameDetails } = useContext(UserContext);
    // console.log('usernameDetails', usernameDetails);
    if (usernameDetails) {
        return <Message/>
    }
    return (
     <LoginRegister />
    );
  }