"use client";

import {
  createContext,
  ReactNode,
  use,
  useContext,
  useEffect,
  useState,
} from "react";

type accountType = {
  username: string;
  githubId: number;
};
type accountContextType = {
  account: accountType;
  fetchAccount: () => void;
};

const AccountContext = createContext<accountContextType>({
  account: { username: "", githubId: 0 },
  fetchAccount: () => {},
});

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<accountType>({
    username: "",
    githubId: 0,
  });

  const fetchAccount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/user`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setAccount(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <AccountContext.Provider value={{ account, fetchAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
};
