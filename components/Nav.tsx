"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  signOut,
  getProviders,
  ClientSafeProvider,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Nav = () => {
  const isUserLoggedIn = true;
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };

    fetchProviders();
  }, []);

  return (
    <nav className="flex-between mb-16 w-full pt-6">
      <Link href="/" className="flex gap-2">
        <Image
          src="./assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      {/* Desktop Nav */}
      <div className="sm:flex hidden ">
        {isUserLoggedIn ? (
          <div className="flex gap-4 items-center">
            <Link href="/create-prompt">
              <button className="black_btn">Create Prompt</button>
            </Link>
            <button onClick={() => signOut} className="outline_btn">
              Sign out
            </button>
            {
              <Link href="/profile">
                <Image
                  src="./assets/images/logo.svg"
                  alt="profile"
                  width={30}
                  height={30}
                />
              </Link>
            }
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
