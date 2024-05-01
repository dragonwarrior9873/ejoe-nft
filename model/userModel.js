// import mongoose, { Schema, Document } from "mongoose";
// interface NFTItem {
//   image: string;
//   // Add other properties as needed, such as:
//   // - tokenId: number;
//   // - name: string;
//   // - etc.
// }

// interface User extends Document {
//   userBio?: string;
//   userName?: string;
//   userProfile?: string;
//   userEthAddress?: string;
//   phoneNumber?: number;
//   storeName?: string;
//   emailAddress?: string;
//   website?: string;
//   socialLink?: {
//     x?: string;
//     telegram?: string;
//     whatsapp?: string;
//     facebook?: string;
//   };
//   FavoriteNFTs?: NFTItem[];
//   FavoriteAuctionNfts?: NFTItem[];
//   createdAt?: number;
// }

// const userSchema: Schema<User> = new mongoose.Schema(
//   {
//     userBio: { type: String },
//     userName: { type: String },
//     userProfile: { type: String },
//     userEthAddress: { type: String },
//     phoneNumber: { type: Number },
//     storeName: { type: String },
//     emailAddress: { type: String },
//     website: { type: String },
//     socialLink: {
//       x: { type: String },
//       telegram: { type: String },
//       whatsapp: { type: String },
//       facebook: { type: String },
//     },
//     FavoriteNFTs: {
//       type: [new Schema<NFTItem>({ image: String /* and other properties*/ })],
//       default: [],
//     },
//     FavoriteAuctionNfts: {
//       type: [new Schema<NFTItem>({ image: String /* and other properties*/ })],
//       default: [],
//     },
//     createdAt: { type: Number, default: Date.now() },
//   },
//   {
//     timestamps: true,
//   }
// );

// const UserModel =
//   mongoose.models.User || mongoose.model<User>("User", userSchema);

// export default UserModel;

// // interface NFTItem {
// //   image: string;
// //   // Add other properties as needed, such as:
// //   // - tokenId: number;
// //   // - name: string;
// //   // - etc.
// // }
// // // Define an interface for the User schema
// // interface User extends Document {
// //   userBio?: string;
// //   userName?: string;
// //   userProfile?: string;
// //   userEthAddress?: string;
// //   phoneNumber?: number;
// //   storeName?: string;
// //   emailAddress?: string;
// //   website?: string;
// //   socialLink?: {
// //     x?: string;
// //     telegram?: string;
// //     whatsapp?: string;
// //     facebook?: string;
// //   };
// //   FavoriteNFTs?: any[];
// //   FavoriteAuctionNfts?: any[];
// //   createdAt?: number;
// // }

// // // Define the User schema
// // const userSchema: Schema<User> = new mongoose.Schema(
// //   {
// //     userBio: { type: String },
// //     userName: { type: String },
// //     userProfile: { type: String },
// //     userEthAddress: { type: String },
// //     phoneNumber: { type: Number },
// //     storeName: { type: String },
// //     emailAddress: { type: String },
// //     website: { type: String },
// //     socialLink: {
// //       x: { type: String },
// //       telegram: { type: String },
// //       whatsapp: { type: String },
// //       facebook: { type: String },
// //     },
// //     FavoriteNFTs: { type: [new Schema<NFTItem>({ image: String /* and other properties*/ })], default: [] },
// //     FavoriteAuctionNfts: { type: [new Schema<NFTItem>({ image: String /* and other properties*/ })], default: [] },
// //     createdAt: { type: Number, default: Date.now() },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // // Check if the User model already exists and use the existing model if it does
// // const UserModel =
// //   mongoose.models.User || mongoose.model<User>("User", userSchema);

// // // Export the User model
// // export default UserModel;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    userBio: {
      type: String,
      default:
        "Enthusiastic digital art aficionado, exploring the boundless realms of NFTs to curate unique collections and support emerging artists. Passionate about decentralized technologies and the transformative power of blockchain in reshaping the art industry. Collector of rare and innovative digital assets, fostering creativity and innovation within the vibrant NFT community. Let's connect and embark on an exhilarating journey through the ever-evolving landscape of digital art!",
    },
    userName: { type: String },
    userProfile: { type: String },
    userEthAddress: { type: String, unique: true },
    phoneNumber: { type: Number },
    storeName: { type: String },
    emailAddress: { type: String },
    website: { type: String },
    socialLink: {
      x: { type: String },
      telegram: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },
    FavoriteNFTs: {
      type: [],
      default: [],
    },
    FavoriteAuctionNfts: {
      type: [],
      default: [],
    },
    createdAt: { type: Number, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;
