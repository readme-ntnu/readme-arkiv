import { User } from "firebase/auth";
import { createContext } from "react";
export const AuthUserContext = createContext<User | null>(null);
