import { combineURLs } from "@/utils";
import {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "@/types/models";

const baseURL = "/api/questions";

export const getQuestionsByTestId = async (testId: number) => {
  const url = combineURLs(baseURL, `/by-test-id/${testId}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();

  return JSON.parse(text) as Question[];
};

export const getQuestionById = async (id: number) => {
  const url = combineURLs(baseURL, `/${id}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();

  return JSON.parse(text) as Question;
};

export const deleteQuestion = async (id: number) => {
  const url = combineURLs(baseURL, `/${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  return response.ok;
};

export const createQuestion = async (request: CreateQuestionRequest) => {
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...request }),
  });

  return response.ok;
};

export const updateQuestion = async (request: UpdateQuestionRequest) => {
  const url = combineURLs(baseURL, `/${request.id}`);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...request }),
  });

  return response.ok;
};
