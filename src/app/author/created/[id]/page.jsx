"use client";
import ArchiveFilterListBox from "@/components/ArchiveFilterListBox";
import CardNFT from "@/components/CardNFT";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Pagination from "@/shared/Pagination/Pagination";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const CreatedPage = ({ params }) => {
  console.log(params);
  const pathname = usePathname();
  let navs = [
    {
      name: "Created",
      href: `/author/created/${params?.id}`,
    },
    {
      name: "Liked",
      href: `/author/liked/${params?.id}`,
    },
    {
      name: "Following",
      href: `/author/following/${params?.id}`,
    },
    {
      name: "Followers",
      href: `/author/followers/${params?.id}`,
    },
  ];
  console.log(navs);
  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between ">
        <div className="flex space-x-0 sm:space-x-1.5 overflow-x-auto ">
          {navs.map((item, index) => {
            const active = item.href === pathname;
            return (
              <Link
                key={index}
                className={`flex-shrink-0 block font-medium px-4 py-2 text-sm sm:px-6 sm:py-2.5 capitalize rounded-full focus:outline-none ${
                  active
                    ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900"
                    : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100/70 dark:hover:bg-neutral-800"
                } `}
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="mt-5 lg:mt-0 flex items-end justify-end">
          <ArchiveFilterListBox />
        </div>
      </div>
      <div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
          {Array.from("11111111").map((_, index) => (
            <CardNFT key={index} />
          ))}
        </div>
        <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <Pagination />
          <ButtonPrimary loading>Show me more</ButtonPrimary>
        </div>
      </div>
    </>
  );
};

export default CreatedPage;
