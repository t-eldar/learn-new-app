import { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  VStack,
  Stack,
  Button,
} from "@chakra-ui/react";
import { FiMenu, FiUser } from "react-icons/fi";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import { ColorModeToggle } from "@/components/buttons/color-mode-toggle";
import { UserButton } from "@/components/buttons/user-button";

type LinkItem = {
  name: string;
  route: string;
  icon: IconType;
};

type SidebarProps = {
  children: ReactNode;
  items: LinkItem[];
};

export const Sidebar = ({ items, children }: SidebarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minHeight="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        items={items}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent items={items} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

type SidebarContentProps = BoxProps & {
  items: LinkItem[];
  onClose: () => void;
};

const SidebarContent = ({ items, onClose, ...rest }: SidebarContentProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex height="100vh" direction="column" justifyContent="space-between">
        <Flex direction="column">
          <Flex
            h="20"
            alignItems="center"
            mx="8"
            justifyContent="space-between"
          >
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              LearnNew
            </Text>
            <CloseButton
              display={{ base: "flex", md: "none" }}
              onClick={onClose}
            />
          </Flex>
          {items.map((link) => (
            <NavItem route={link.route} key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          ))}
        </Flex>
        <Stack
          margin="3"
          direction="column"
          width="min-content"
          height="min-content"
        >
          <UserButton />
          <ColorModeToggle />
        </Stack>
      </Flex>
    </Box>
  );
};

type NavItemProps = FlexProps & {
  icon: IconType;
  route: string;
  children: ReactNode;
};
const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
  return (
    <Link
      as={RouterLink}
      to={route}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "blue.300",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

type MobileProps = FlexProps & {
  onOpen: () => void;
};
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        LearnNew
      </Text>
    </Flex>
  );
};
