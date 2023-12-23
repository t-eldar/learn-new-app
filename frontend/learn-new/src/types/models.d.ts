export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  scores?: TestScore[];
  courses?: Course[];
};
export type TestScore = {
  id: number;
  testingDate: Date;
  score: number;

  userId: string;
  user?: User;

  testId: number;
  test?: Test;

  questionScores?: QuestionScore[];
};
export type QuestionScore = {
  id: number;
  isCorrect: boolean;
  userAnswerText: string;

  testScoreId: number;
  testScore?: TestScore;

  userId: string;
  user?: User;

  questionId: number;
  question?: Question;
};
export type Course = {
  id: number;
  coverImageUrl: string;
  name: string;
  description: string;
  dateCreated: Date;

  userId: string;
  user?: User;

  lessons?: Lesson[];
};
export type Lesson = {
  id: number;
  title: string;
  content: string;
  isHidden: boolean;

  courseId: number;
  course?: Course;

  userId: string;
  user?: User;

  tests?: Test[];
};
export type Answer = {
  id: number;
  text: string;
  isCorrect: boolean;

  questionId: number;
  question?: Question;

  userId: string;
  user?: User;
};
export type Question = {
  id: number;
  content: string;
  areAnswersChoicable: boolean;

  testId: number;
  test?: Test;

  userId: string;
  user?: User;

  answers?: Answer[];
};
export type Test = {
  id: number;
  title: string;

  lessonId: number;
  lesson?: Lesson;

  userId: string;
  user?: User;

  questions?: Question[];
};

export type SignInRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpRequest = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

export type CheckTestRequest = {
  testId: number;
  answerRequests: UserAnswerRequest[];
};

export type UserAnswerRequest = {
  userId: string;
  questionId: number;
  answerText: string;
};
export type CreateAnswerRequest = Omit<Answer, "user" | "question" | "id">;
export type UpdateAnswerRequest = Pick<Answer, "id"> &
  Partial<Omit<Answer, "user" | "userId" | "question" | "id">>;

export type CreateCourseRequest = Omit<
  Course,
  "user" | "lessons" | "id" | "dateCreated"
>;
export type UpdateCourseRequest = Pick<Course, "id"> &
  Partial<Pick<Course, "name" | "description" | "coverImageUrl">>;

export type CreateLessonRequest = Omit<Lesson, "course" | "user" | "tests" | "id">;
export type UpdateLessonRequest = Pick<Lesson, "id"> &
  Partial<Pick<Lesson, "title" | "content" | "courseId" | "isHidden">>;

export type CreateQuestionRequest = Omit<Question, "test" | "user" | "answers" | "id">;
export type UpdateQuestionRequest = Pick<Question, "id"> &
  Partial<Pick<Question, "content" | "testId" | "areAnswersChoicable">>;

export type CreateEmptyTestRequest = Omit<
  Test,
  "lesson" | "user" | "questions" | "id"
>;
export type EmptyAnswer = Omit<CreateAnswerRequest, "questionId" | "userId">;
export type EmptyQuestion = Omit<CreateQuestionRequest, "testId" | "userId"> & {
  answers: EmptyAnswer[];
};
export type CreateFullTestRequest = Omit<
  Test,
  "lesson" | "user" | "questions" | "id"
> & {
  questions: EmptyQuestion[];
};
export type UpdateTestRequest = Pick<Test, "id"> &
  Partial<Pick<Test, "title" | "lessonId">>;
