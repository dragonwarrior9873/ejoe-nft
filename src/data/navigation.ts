import _ from "lodash";
import { NavItemType } from "@/shared/Navigation/NavigationItem";

const ncNanoId = _.uniqueId;

const otherPageChildMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home demo 1",
  },
  {
    id: ncNanoId(),
    href: "/home-2",
    name: "Home demo 2",
  },
  {
    id: ncNanoId(),
    href: "/home-3",
    name: "Home demo 3",
  },
  {
    id: ncNanoId(),
    href: "/collection",
    name: "Collection page",
  },
  {
    id: ncNanoId(),
    href: "/search",
    name: "Search page",
  },
  {
    id: ncNanoId(),
    href: "/author",
    name: "Author profile",
  },
  {
    id: ncNanoId(),
    href: "/nft-detail",
    name: "NFT detail",
  },
  {
    id: ncNanoId(),
    href: "/account",
    name: "Account settings",
  },
  {
    id: ncNanoId(),
    href: "/upload-item",
    name: "Upload Item",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/upload-item",
        name: "Upload Item",
      },
      {
        id: ncNanoId(),
        href: "/connect-wallet",
        name: "Connect Wallet",
      },
    ],
  },

  {
    id: ncNanoId(),
    href: "/about",
    name: "Other Pages",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/about",
        name: "About",
      },
      {
        id: ncNanoId(),
        href: "/contact",
        name: "Contact us",
      },
      {
        id: ncNanoId(),
        href: "/login",
        name: "Login",
      },
      {
        id: ncNanoId(),
        href: "/signup",
        name: "Signup",
      },
      {
        id: ncNanoId(),
        href: "/subscription",
        name: "Subscription",
      },
    ],
  },
  {
    id: ncNanoId(),
    href: "/blog",
    name: "Blog Pages",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/blog",
        name: "Blog Page",
      },
      {
        id: ncNanoId(),
        href: "/blog-single",
        name: "Blog Single",
      },
    ],
  },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Discover",
    type: "dropdown",
    children: otherPageChildMenus,
  },
  {
    id: ncNanoId(),
    href: "/upload-item",
    name: "Help center",
  },
];
