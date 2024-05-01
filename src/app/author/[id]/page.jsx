"use client";
import { getUserDetailsByEthAddress } from "@/apis/profile.apis";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { ErrorToast } from "@/components/Toast/Error";
import CreatedTab from "../../../components/Author/CreatedTab";
import OwnedNFTTab from "../../../components/Author/OwnedNFTTab";
import CreatedAuctionNftTab from "../../../components/Author/CreatedAuctionNftTab";
import OwnedAuctionTab from "../../../components/Author/OwnedAuctionTab";
import FavNftTab from "../../../components/Author/FavNftTab";
import FavAuctionNftTab from "../../../components/Author/FavAuctionNftTab";
import { Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const AuthorPage = ({ params }) => {
  const EthAccount = useSelector((state) => state.user);
  const [loading, setLoading] = useState("");
  const [userDetail, setUserDetail] = useState(null);
  const TABS = [
    "Created NFTs",
    "Owned NFTs",
    "Created Auction NFTs",
    "Owned Auction NFTs",
    "Fav NFTs",
    "Fav Auction NFTs",
    // "Following",
    // "Followers",
  ];

  const renderTabItem = (item) => {
    switch (item) {
      case "Created NFTs":
        return <CreatedTab params={params} />;

      case "Owned NFTs":
        return <OwnedNFTTab params={params} />;

      case "Created Auction NFTs":
        return <CreatedAuctionNftTab params={params} />;
      case "Owned Auction NFTs":
        return <OwnedAuctionTab params={params} />;
      case "Fav NFTs":
        return <FavNftTab params={params} userDetail={userDetail} />;
      case "Fav Auction NFTs":
        return <FavAuctionNftTab params={params} userDetail={userDetail} />;

      default:
        return null;
    }
  };
  const getProfileData = async () => {
    try {
      setLoading("profile");
      const result = await getUserDetailsByEthAddress(params?.id);
      console.log(result);
      setUserDetail(result);
      setLoading("");
    } catch (error) {
      console.log(error);
      setLoading("");
      ErrorToast({ message: "Something wrong.Please refresh the page" });
    }
  };
  useEffect(() => {
    if (params?.id) {
      getProfileData();
    }
  }, [params]);
  return (
    <div className={` `}>
      <ProfileHeader data={userDetail} />
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          <div className="w-full pdx-2 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex flex-wrap gap-y-7 justify-start pd-1 space-x-2.5 rounded-full bordedr border-neutral-300 dark:border-neutral-500">
                {TABS.map((tab) =>
                  params.id !== EthAccount?.account &&
                  (tab === "Fav NFTs" || tab === "Fav Auction NFTs") ? null : (
                    <Tab
                      key={tab}
                      className={({ selected }) =>
                        `px-3.5 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm leading-5 font-medium rounded-full focus:outline-none focus:ring-2 ring-primary-300 ${
                          selected
                            ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                            : "text-neutral-700 dark:text-neutral-300 bg-neutral-100/70 dark:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                        }`
                      }
                    >
                      {tab}
                    </Tab>
                  )
                )}
              </Tab.List>

              <Tab.Panels className="mt-4">
                {TABS.map((tab, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={
                      "rounded-xl focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 "
                    }
                  >
                    {renderTabItem(tab)}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthorPage;
