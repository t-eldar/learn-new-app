import { useEffect } from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { AuthenticationContext } from "@/context/authentication-context";

import { Layout } from "@/components/layout";
import { SignInForm } from "@/components/forms/sign-in-form";
import { SignUpForm } from "@/components/forms/sign-up-form";

import { HomePage } from "@/pages/home";
import { CoursesPage } from "@/pages/courses/CoursesPage";
import { CoursePage } from "@/pages/course";
import { LessonPage } from "@/pages/lesson";
import { useState } from "react";
import { AuthUser } from "@/types/authentication";
import { RequireAuthentication } from "@/hoc/require-authentication/RequireAuthentication";
import { TestPage } from "@/pages/test-page";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { CreateCoursePage } from "@/pages/create-course";
import { getUserInfo } from "@/services/auth-service";
import { CreateLessonPage } from "@/pages/create-lesson";
import { CreateTestPage } from "@/pages/create-test";

export const App = () => {
  const [authUser, setAuthUser] = useState<AuthUser>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    data: userInfo,
    error: userInfoError,
    refetch: getAuthUser,
  } = useQuery("user-info", getUserInfo, {
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    getAuthUser();
  }, []);

  useEffect(() => {
    if (userInfo && !userInfoError) {
      setAuthUser(userInfo);
      setIsLoggedIn(true);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthUser(undefined);
    }
  }, [isLoggedIn]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="sign-in" element={<SignInForm />} />
        <Route path="sign-up" element={<SignUpForm />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="lessons/:lessonId" element={<LessonPage />} />
        <Route
          path="tests/:testId"
          element={
            <RequireAuthentication>
              <TestPage />
            </RequireAuthentication>
          }
        />
        <Route
          path="create-course"
          element={
            <RequireAuthentication>
              <CreateCoursePage />
            </RequireAuthentication>
          }
        />
        <Route
          path="create-lesson"
          element={
            <RequireAuthentication>
              <CreateLessonPage />
            </RequireAuthentication>
          }
        />
        <Route
          path="create-test"
          element={
            <RequireAuthentication>
              <CreateTestPage />
            </RequireAuthentication>
          }
        />
      </Route>
    )
  );
  return (
    <>
      <AuthenticationContext.Provider
        value={{ authUser, setAuthUser, isLoggedIn, setIsLoggedIn }}
      >
        <RouterProvider router={router} />
      </AuthenticationContext.Provider>
    </>
  );
};
