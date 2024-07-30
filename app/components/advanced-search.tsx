"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { StarRating } from "./star-rating";
import { XCircleIcon } from "@heroicons/react/24/outline";

export function AdvancedSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [optimisticItemsPerPage, setOptimisticItemsPerPage] = useOptimistic(
    searchParams?.get("itemsPerPage") || "10",
  );
  const [pending, startTransition] = useTransition();

  const handleItemsPerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("itemsPerPage", value);

    setOptimisticItemsPerPage(value);

    startTransition(() => {
      replace(`${pathname}?${params?.toString()}`);
    });
  };

  function clearRatingSearch() {
    const params = new URLSearchParams(searchParams);
    params.set("rating", "0");

    startTransition(() => {
      replace(`${pathname}?${params?.toString()}`);
    });
  }

  const rating = searchParams?.get("rating");
  const textQuery = searchParams?.get("q");
  const aiSearch = searchParams?.get("ai");

  return (
    <>
      <div
        className={`${aiSearch ? "text-indigo-400" : ""} font-semibold border-b border-stone-600 pb-2`}
      >
        Advanced Search
      </div>
      <div className="text-xs">
        Showing results for{" "}
        <span className="font-bold">&quot;{textQuery}&quot;</span>
      </div>
      <div>
        <p className="uppercase text-sm">Customer Reviews</p>

        <div className="flex items-center space-x-2">
          <StarRating />
          <span className="text-sm">& up</span>
          {rating && rating !== "0" && (
            <button
              onClick={clearRatingSearch}
              className="text-white/80 hover:text-white/100 text-xs flex items-center"
            >
              <XCircleIcon className="h-4 mr-1" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="uppercase text-sm mb-2">Items per page</p>
        <div className="flex space-x-2">
          {["9", "12", "15"].map((value) => (
            <button
              key={value}
              className={`${aiSearch ? "border-indigo-800" : ""} px-3 py-1 border rounded-md text-sm transition-colors ${
                optimisticItemsPerPage === value
                  ? aiSearch
                    ? "bg-indigo-800 text-indigo-200"
                    : "bg-stone-600 text-white"
                  : aiSearch
                    ? "text-indigo-400"
                    : "border-stone-600 text-stone-600"
              }`}
              onClick={() => handleItemsPerPageChange(value)}
              disabled={pending} // Optionally disable button while transitioning
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
