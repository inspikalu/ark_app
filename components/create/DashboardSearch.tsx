'use client'
import Link from "next/link";
import React, { useRef } from "react";
import { FiSearch, FiHelpCircle } from "react-icons/fi";


const governingStructures = [
  {
    "structureName": "Absolute Monarchy",
    "pathName": "absolute-monarchy",
    "structureDescription": "One person has total control over decisions, usually chosen by the community."
  },
  {
    "structureName": "Flat DAO",
    "pathName": "flat-dao",
    "structureDescription": "Everyone has an equal say, and decisions are made together with no leader."
  },
  {
    "structureName": "Military Junta",
    "pathName": "military-junta",
    "structureDescription": "A small, trusted group makes important decisions, especially during tough times."
  },
  {
    "structureName": "Conviction",
    "pathName": "conviction",
    "structureDescription": "Members show their support by staking tokens or votes, with decisions passed based on long-term backing."
  },
  {
    "structureName": "Sortition",
    "pathName": "sortition",
    "structureDescription": "Leaders or decision-makers are randomly picked, making it fair and unbiased."
  },
  {
    "structureName": "Meritocracy",
    "pathName": "meritocracy",
    "structureDescription": "Power and voting rights are given based on how much someone has contributed to the group."
  },
  {
    "structureName": "Polycentric",
    "pathName": "polycentric",
    "structureDescription": "Multiple groups make decisions independently, allowing for flexibility and avoiding central control."
  },
  {
    "structureName": "Direct",
    "pathName": "direct",
    "structureDescription": "Everyone votes directly on proposals, ensuring open and transparent decisions."
  },
  {
    "structureName": "Sociocracy",
    "pathName": "sociocracy",
    "structureDescription": "Decisions are made in smaller, independent groups, with each group having the power to decide, ensuring everyone’s voice is heard."
  }
];


const LocationSearch = () => {
  return (
    <form className="w-full max-w-md">
      <div className="flex">
        <div className="relative w-full">
          <input
            type="search"
            id="location-search"
            className="block p-2.5 w-full min-w-[15rem] z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50 border-s-2 border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-teal-500"
            placeholder="Search PAO directory"
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 h-full flex items-center justify-center p-4 text-sm font-medium text-white bg-teal-800 border border-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-700"
          >
            <FiSearch className="w-4 h-4" />
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

const CreatePAOModal = ({ modalRef }: { modalRef: React.RefObject<HTMLDialogElement> }) => {
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box p-6 bg-gradient-to-br from-teal-500 to-teal-900 text-white">
        <h3 className="font-bold text-lg">Choose Governance Model!</h3>
        <ul>
          {governingStructures.map((item, index) => (
            <div key={`${item.structureName}${index}`}>
              <li key={index} className="flex flex-row items-center justify-start gap-3 py-4">
                <Link href={`/new/${item.pathName}`}>
                  {item.structureName}
                </Link>
                <div className="dropdown">
                  <div tabIndex={0} role="button" ><FiHelpCircle size={20} /></div>
                  <ul tabIndex={0} className="dropdown-content menu bg-teal-800 rounded-box z-[1] w-52 p-2 shadow">
                    <li><a>{item.structureDescription}</a></li>
                  </ul>
                </div>
              </li>


              {index <= 9 && <hr />}
            </div>

          ))}
        </ul>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn rounded-md bg-teal-800 hover:bg-teal-900 border-white">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

const DashSearch = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <LocationSearch />
          <div className="flex gap-4">
            <button className="px-4 py-2 hover:text-teal-400 hover:bg-black rounded bg-teal-800 text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
              Filter
            </button>
            <button
              className="px-4 py-2 hover:text-teal-400 hover:bg-black rounded bg-teal-800 text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
              onClick={openModal}
            >
              Create PAO
            </button>
          </div>
          <CreatePAOModal modalRef={modalRef} />
        </div>
      </div>
    </div>
  );
};

const DashboardSearch = () => {
  return (
    <div className="w-full bg-gradient-to-br from-teal-900 to-black text-white">
      <DashSearch />
    </div>
  );
};

export default DashboardSearch;
