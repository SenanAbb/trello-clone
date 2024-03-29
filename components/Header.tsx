"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "@/lib/fetchSuggestion";

export default function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  // GPT functionality
  // useEffect(() => {
  //   if (board.columns.size === 0) return;
  //   setLoading(true);
  //   const suggestion = fetchSuggestion(board).then((suggestion) => {
  //     setSuggestion(suggestion);
  //     setLoading(false);
  //   });
  // }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="
            absolute 
            top-0 
            left-0 
            w-full 
            h-96 
            bg-gradient-to-br
            from-pink-400 to-[#0055D1] 
            rounded-md 
            filter 
            blur-3xl 
            opacity-45 
            -z-50
           "
        />

        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/1280px-Trello_logo.svg.png"
          alt="Trello logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        {/* Search box */}
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              {searchString}
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="Sanan Abbasov" round color="#0055D1" size="50" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-5">
        <p className="flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit italic max-w-3xl text-[#0055D1] bg-white">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1 
          ${loading && "animate-spin"}`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising for the day..."}
        </p>
      </div>
    </header>
  );
}
