import { combineURLs } from "@/utils";
import {
  CreateFullTestRequest,
  CreateEmptyTestRequest,
  Test,
  UpdateTestRequest,
} from "@/types/models";

const baseURL = "/api/tests";

export const getAllTests = async () => {
  const response = await fetch(baseURL, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Test[];
};

export const getTestsByLessonId = async (lessonId: number) => {
  const url = combineURLs(baseURL, `/by-lesson-id/${lessonId}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Test[];
};

export const getTestById = async (id: number) => {
  const url = combineURLs(baseURL, `/${id}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  return JSON.parse(text) as Test;
};

export const deleteTest = async (id: number) => {
  const url = combineURLs(baseURL, `/${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  return response.ok;
};

export const createTest = async (
  request: CreateEmptyTestRequest | CreateFullTestRequest
) => {
  let url: string;
  if ("questions" in request) {
    url = combineURLs(baseURL, "/create-full/");
  } else {
    url = combineURLs(baseURL, "/create-empty/");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...request }),
  });

  return response.ok;
};

export const updateTest = async (request: UpdateTestRequest) => {
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
