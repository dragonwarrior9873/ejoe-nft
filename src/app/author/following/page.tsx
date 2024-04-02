import CardAuthorBox4 from "@/components/CardAuthorBox4/CardAuthorBox4";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Pagination from "@/shared/Pagination/Pagination";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 lg:mt-10">
        {Array.from("11111111").map((_, index) => (
          <CardAuthorBox4 following key={index} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
        <Pagination />
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default page;
