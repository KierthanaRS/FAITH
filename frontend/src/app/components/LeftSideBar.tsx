import React, { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FaLongArrowAltRight } from "react-icons/fa";

interface LeftSidebarProps {
  companyName: string;
  models: string[];
  history: { id: string; name: string }[];
  user: {
    id: string,
    avatar: string;
    name: string;
    email: string;
  };
  model:string,
  isLoggedIn: boolean;
  onModelChange: (model: string) => void;
  onHistorySelect: (historyId: string) => void;
  onHistoryAdd: () => void;
  selectedHistoryId: string | null;
  onLogoutClick: () => void;
  onLoginClick: () => void;

}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  companyName,
  models,
  history,
  model,
  user,
  isLoggedIn,
  onModelChange,
  onHistorySelect,
  onHistoryAdd,
  selectedHistoryId,
  onLogoutClick,
  onLoginClick,
}) => {
  const router = useRouter();
  const [show,setShow]=useState(true);
  useEffect(() => {
    if (model === "Use other model") {
      setShow(false);
    }
    else{
      setShow(true)
    }
  }, [model]);

  const handleSearch = (data: string) => {
    if (data.trim() === "") {
      return;
    }
    const searchTerm = data.toLowerCase();
    let found = false;

    history.map((item) => {
      if (item.name.toLowerCase().includes(searchTerm)) {
        found = true;
        onHistorySelect(item.id);
      }
    });

    if (!found) {
      alert("No such chat history found");
    }
  };

  return (
    <div className="w-64 bg-sidebar text-textcolor h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between">
        <div className="font-semibold mb-2 relative group flex">
          <h1
            onClick={() => router.push("/aboutUs")}
            className="text-5xl bg-gradient-to-r from-violet-500  to-pink-500 inline-block text-transparent bg-clip-text cursor-pointer"
          >
            {companyName}
          </h1>
         
            <IoMdInformationCircleOutline className="ml-[2rem] mt-[6%] text-violet-500 cursor-progress" />
            <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded group-hover:block">
              Click the logo to know more about our platform.
            </span>
          </div>
        </div>

        {isLoggedIn && (
          <div className="flex items-center justify-between mt-5">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 px-2 py-1 rounded-md text-white focus:outline-none w-[75%]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
            {show && (
            <FaRegEdit
              className="text-gray-100 size-5 cursor-pointer"
              onClick={onHistoryAdd}
            />
            )}
           
          </div>
        )}
      </div>

      <div className="p-4">
        <select
          className="w-full p-2 bg-gray-800 rounded-md text-white"
          onChange={(e) => onModelChange(e.target.value)}
        >
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {(isLoggedIn) && (
        <div className="flex-1 p-4 overflow-y-auto">
          {show && (
            <>
              <h2 className="text-lg font-bold mb-2">History</h2>
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedHistoryId === item.id
                        ? "bg-violet-500 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                    onClick={() => onHistorySelect(item.id)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4 border-t border-gray-700">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4 cursor-pointer">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-sm font-bold text-gray-400">{user.name}</h3>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        ) : (
          <button
            className="w-full p-2 bg-gray-700 rounded-md text-white mt-[210%] hover:bg-gray-800"
            onClick={onLoginClick}
          >
            Login
          </button>
        )}

        {isLoggedIn && (
          <div className="mt-4">
            <button
              className="w-full p-2 bg-gray-700 rounded-md text-white hover:bg-gray-800"
              onClick={onLogoutClick}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
