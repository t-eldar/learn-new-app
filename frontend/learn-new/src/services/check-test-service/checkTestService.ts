import { CheckTestRequest, TestScore } from "@/types/models";

const baseURL = "/api/check-test";

export const checkTest = async (request: CheckTestRequest) => {
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

  return JSON.parse(text) as TestScore;
};
