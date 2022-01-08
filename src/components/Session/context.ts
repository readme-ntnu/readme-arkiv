import { User } from "firebase/auth";
import React from "react";
export const AuthUserContext = React.createContext<User | null>(null);
