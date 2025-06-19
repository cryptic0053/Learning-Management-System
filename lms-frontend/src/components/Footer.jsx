import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/80 py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Brand Name. All rights reserved.
    </footer>
  );
};

export default Footer;
