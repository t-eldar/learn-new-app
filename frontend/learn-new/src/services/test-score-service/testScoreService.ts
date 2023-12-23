import { combineURLs } from "@/utils";
import { TestScore } from "@/types/models";

const baseURL = "/api/test-scores";

export const getTestScoreByUserAndTestId = async (
  userId: string,
  testId: number
) => {
  const url = combineURLs(baseURL, `/by-user-and-test-ids/${userId}&${testId}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }
  console.log(text);

  return JSON.parse(text) as TestScore;
};

// export const deleteTestScore = async (id: number) => {
//   const url =  (combineURLs(baseURL, `/${id}`));

//   const response = await fetch(url, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   return response.ok;
// };

// export const createTestScore = async (testScore: TestScore) => {
//   const response = await fetch(baseURL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     body: JSON.stringify({ ...testScore }),
//   });

//   return response.ok;
// };
