import React from 'react';

// Footer component definition
function Footer() {
  return (
    
    <footer className="mt-16 text-sm opacity-70 text-center pb-8">
      &copy; {new Date().getFullYear()} My React App. All rights reserved.
    </footer>
  );
}

export default Footer;
