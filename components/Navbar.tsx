'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { MainNav } from './main-nav';

import { Button } from './ui/button';
import { UserIcon } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {session && (
            <div className="relative">
              <Button
                onClick={handleDropdownToggle}
                className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center focus:outline-none"
              >
                <UserIcon className="h-6 w-6 text-white" />
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={() => signOut()}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
