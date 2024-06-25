"use client";

import React, { useEffect } from "react";

const Text = () => {
  useEffect(() => {
    console.log("layout.ts");
  }, []);
  return <div>Text</div>;
};

export default Text;
