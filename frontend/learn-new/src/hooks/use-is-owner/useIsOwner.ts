import { useState, useEffect } from "react";
import { useAuthentication } from "../use-authentication";

export const useIsOwner = (resource: { userId: string } | undefined) => {
  const [isOwner, setIsOwner] = useState(false);

  const { authUser } = useAuthentication() ?? { authUser: undefined };

  useEffect(() => {
    if (typeof resource === "undefined" || typeof authUser === "undefined") {
      return;
    }

    if (resource.userId === authUser.id) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [resource, authUser]);

  return { isOwner };
};
