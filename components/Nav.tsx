"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  signOut,
  getProviders,
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Nav = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

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
        {session?.user ? (
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
                  className="rounded-full"
                  src={session?.user?.image as string}
                  alt="profile"
                  width={40}
                  height={40}
                />
              </Link>
            }
          </div>
        ) : (
          <RenderProviders providers={providers} status={status} />
        )}
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <>
            <Image
              className="rounded-full"
              src={session?.user?.image as string}
              alt="profile"
              width={40}
              height={40}
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  className="dropdown_link"
                  href="/create-prompt"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <Link
                  className="dropdown_link"
                  href="/profile"
                  onClick={() => setToggleDropdown(false)}
                >
                  Profile
                </Link>
                <div className="w-full h-px bg-gray-300 my-1" />
                <button
                  className="black_btn w-full"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <RenderProviders providers={providers} status={status} />
        )}
      </div>
    </nav>
  );
};

interface RenderProvidersProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
  status: "authenticated" | "loading" | "unauthenticated";
}

const RenderProviders = ({ providers, status }: RenderProvidersProps) => {
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (providers) {
    return Object.values(providers).map((provider) => (
      <button
        key={provider.name}
        onClick={() => signIn(provider.id)}
        className="black_btn"
      >
        Sign in
      </button>
    ));
  }
};

export default Nav;
