import { AuthUser } from "@/types/authentication";
import { SignInRequest, SignUpRequest } from "@/types/models";

const baseURL = "/api";

export const signIn = async (request: SignInRequest) => {
  const response = await fetch(`${baseURL}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(request),
  });  

  return response.ok;
};

export const signUp = async (request: SignUpRequest) => {
  const response = await fetch(`${baseURL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(request),
  });

  return response.ok;
};

export const signOut = async () => {
  const response = await fetch(`${baseURL}/sign-out`, {
    method: "GET",
    credentials: "include",
  });

  return response.ok;
};

export const getUserInfo = async () => {
  const response = await fetch(`${baseURL}/user-info`, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as AuthUser;
};
