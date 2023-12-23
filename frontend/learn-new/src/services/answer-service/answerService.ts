import { combineURLs } from "@/utils";
import {
  Answer,
  CreateAnswerRequest,
  UpdateAnswerRequest,
} from "@/types/models";

const baseURL = "/api/answers";

export const getAllAnswersByQuestionId = async (questionId: number) => {
  const url = combineURLs(baseURL, `/by-question-id/${questionId}}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Answer[];
};

export const getAllAnswersByTestId = async (testId: number) => {
  const url = combineURLs(baseURL, `/by-test-id/${testId}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Answer[];
};

export const getCorrectAnswerByQuestionId = async (questionId: number) => {
  const url = combineURLs(baseURL, `/by-question-id/${questionId}/correct`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Answer;
};

export const getCorrectAnswersByTestId = async (testId: number) => {
  const url = combineURLs(baseURL, `/by-test-id/${testId}/correct`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Answer[];
};

export const getAnswerById = async (id: number) => {
  const url = combineURLs(baseURL, `/${id}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Answer;
};

export const createAnswer = async (request: CreateAnswerRequest) => {
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...request }),
  });
  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Answer[];
};

export const deleteAnswer = async (id: number) => {
  const url = combineURLs(baseURL, `/${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  return response.ok;
};

export const updateAnswer = async (answer: UpdateAnswerRequest) => {
  const url = combineURLs(baseURL, `/${answer.id}`);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...answer }),
  });

  return response.ok;
};
