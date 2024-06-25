"use client";

import { useEffect } from "react";

interface CreditsProps {
  id: string;
}

const Credits = ({ id }: CreditsProps) => {
  useEffect(() => {
    console.log("client or server ????");
  }, []);
  return <div>Credits</div>;
};

export { Credits };
