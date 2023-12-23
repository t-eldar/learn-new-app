import { useEffect } from "react";

import { InfoResult } from "@/components/info-result";
import { useAuthentication } from "@/hooks/use-authentication";
import { createCourse } from "@/services/course-service";
import { isImageUrl } from "@/utils";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ChangeEventHandler, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export const CreateCoursePage = () => {
  const { authUser } = useAuthentication() ?? { authUser: undefined };

  const [isValid, setIsValid] = useState(false);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [description, setDescription] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const { error, status, refetch } = useQuery(
    "create-course",
    async () => {
      await createCourse({
        userId: authUser!.id,
        name,
        coverImageUrl: imageUrl,
        description: description,
      });
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setName(e.currentTarget.value);
  };
  const handleImageUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const value = e.currentTarget.value;

    if (isImageUrl(value)) {
      setImageUrl(e.currentTarget.value);
      setIsImage(true);
      setIsValid(true);
    } else {
      toast({
        title: "Неверная ссылка",
        status: "error",
        isClosable: true,
      });
      setIsValid(false);
      setImageUrl("");
      setIsImage(false);
    }
  };
  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    e.preventDefault();
    setDescription(e.currentTarget.value);
  };

  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!authUser) {
      toast({
        status: "error",
        title: "Вы не авторизованы!",
        isClosable: true,
      });
      return;
    } else {
      refetch();
    }
  };

  useEffect(() => {
    if (status === "success") {
      toast({
        status: "success",
        title: "Курс создан",
      });
      navigate("/");
    }
  }, [status]);

  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading
            marginY="3"
            bgGradient="linear(to-r, blue.400, blue.600)"
            backgroundClip="text"
          >
            Создать свой курс
          </Heading>
          <FormControl>
            <FormLabel fontSize="2xl">Название</FormLabel>
            <Input value={name} onChange={handleTitleChange} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="2xl">Сслыка на картинку</FormLabel>
            <Input value={imageUrl} onChange={handleImageUrlChange} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="2xl">Описание</FormLabel>
            <Textarea value={description} onChange={handleDescriptionChange} />
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            ></Stack>
            <Button
              onClick={handleCreate}
              colorScheme={"blue"}
              variant={"solid"}
            >
              Создать
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        {isImage ? (
          <Image alt={"Custom Image"} objectFit={"cover"} src={imageUrl} />
        ) : (
          <Flex direction="column" justifyContent="center" alignItems="center">
            <InfoResult title="Добавьте свою обложку!" />
          </Flex>
        )}
      </Flex>
    </Stack>
  );
};
