"use client";

import React, { FC, useState } from "react";
import Label from "@/components/Label/Label";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import FormItem from "@/components/FormItem";
import { RadioGroup } from "@headlessui/react";
import { nftsImgs } from "@/contains/fakeData";
import MySwitch from "@/components/MySwitch";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import NcImage from "@/shared/NcImage/NcImage";
import * as Yup from "yup";
import { useFormik, ErrorMessage } from "formik";
import { promiseToast } from "@/components/Toast/Promise";
import { UploadMetadata } from "@/hooks/useNFTStorage";
import { MintNFT } from "@/hooks/useMintNFT";
import { useSelector } from "react-redux";
import { SuccessToast } from "@/components/Toast/Success";
import { redirect, useRouter } from "next/navigation";
import { ConvertImageToBlob } from "@/utils/ImageToBlob";
const plans = [
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[0],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[1],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[2],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[3],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[4],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[5],
  },
];
const validationSchema = Yup.object({
  itemName: Yup.string().required("Item name is required"),
  description: Yup.string().nullable(),
  royalties: Yup.number()
    .min(0, "Royalties cannot be negative")
    .required("Royalties are required"),
  price: Yup.number()
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  property: Yup.string().required("Property is required"),
  instantSalePrice: Yup.boolean(),
  putOnSale: Yup.boolean(),
  image: Yup.mixed().required("Please upload a image"),
  category: Yup.string().required("Category is required"),
  approve: Yup.boolean(),
  endDate: Yup.date().test(
    "end-date-validation",
    "End date is required when 'put on sale' is true",
    function (value) {
      const { putOnSale } = this.parent;

      if (putOnSale) {
        // If `putOnSale` is true, `endDate` must be provided and cannot be in the past
        if (!value) {
          return this.createError({
            path: "endDate",
            message: "End date is required when 'put on sale' is true",
          });
        } else if (value <= new Date()) {
          return this.createError({
            path: "endDate",
            message: "End date cannot be in the past",
          });
        }
      }
      // Return true to pass validation if the condition is not met
      return true;
    }
  ),
});

const PageUploadItem = ({}) => {
  const UserEthAccount = useSelector((state) => state.user);
  const [selected, setSelected] = useState(plans[1]);
  const [selectedImageName, setSelectedImageName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialValues = {
    image: "",
    itemName: "",
    externalLink: "",
    description: "",
    royalties: "",
    price: "",
    property: "",
    instantSalePrice: true,
    putOnSale: false,
    endDate: "",
    category: "",
    approve: true,
  };
  const HandleMintNFT = async (formNftData) => {
    try {
      setLoading(true);
      const Uri = await promiseToast(
        "NFT Minting please wait... ⛓",
        "NFT uploaded Sign the transaction! 🎉",
        "Something Error happened! 💔",
        UploadMetadata,
        formNftData
      );
      await promiseToast(
        "Waiting for transaction... ⛓",
        "NFT minted successfully! 🎉",
        "Something error happened! 💔",
        async () => {
          return MintNFT(
            UserEthAccount.account,
            formNftData.price,
            Uri.url,
            formNftData.royalties,
            formNftData.putOnSale ? false : formNftData.approve,
            formNftData.putOnSale,
            formNftData.putOnSale ? formNftData.price : 0,
            formNftData.putOnSale && formNftData.endDate
              ? Math.floor(new Date(formNftData.endDate).getTime() / 1000)
              : 0,
            formNftData.category,
            "image"
          );
        }
      )
        .then(async (response) => {
          // SuccessToast(
          //   <div>
          //     NFT Mint successfully 🎉! <br />
          //     <div className="line-clamp-1">
          //       Gas used:{" "}
          //       <b className="font-normal text-darkBlue-50">
          //         {response.gasUsed.toString()}
          //       </b>{" "}
          //       wei
          //     </div>
          //   </div>
          // );
          setLoading(false);
          console.log(response);
          router.push(`/author/${UserEthAccount?.account}`);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
          ErrorToast(<div>Something error happen, try again! 💔</div>);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      HandleMintNFT(values);
    },
  });
  const handleFileChange = async (event) => {
    const selectedFile = event.currentTarget.files[0];
    setSelectedImageName(selectedFile.name);
    const blobImage = await ConvertImageToBlob(event.currentTarget.files[0]);
    formik.setFieldValue("image", blobImage);
  };

  return (
    <div className={`nc-PageUploadItem`}>
      <div className="container">
        <div className="my-12 sm:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Create New Item
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL, and
              manage other personal settings.
            </span>
          </div>

          <hr className="w-full border-t-2 border-neutral-100 dark:border-neutral-700" />

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Image, Video, Audio, or 3D Model */}
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">Image</h3>
              {/* , Video, Audio, or 3D Model */}
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                {/* File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                OGG, GLB, GLTF. Max size: 100 MB */}
                File types supported: JPG,JPEG, PNG, SVG Max size: 30 MB
              </span>
              <div className="mt-5">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".jpg, .jpeg, .svg, .png"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      {/* <p className="pl-1">or drag and drop</p> */}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedImageName ? (
                        selectedImageName
                      ) : (
                        <>PNG, JPG, JPEG, SVG, up to 30MB</>
                      )}
                    </p>
                  </div>
                </div>
                {formik.touched.file && formik.errors.file && (
                  <p className="text-red-500 text-sm">{formik.errors.file}</p>
                )}
              </div>
            </div>

            {/* Form Items */}
            <FormItem label="Item Name">
              <Input
                name="itemName"
                type="text"
                className="input"
                placeholder="Enter item name"
                value={formik.values.itemName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.itemName && formik.errors.itemName && (
                <p className="text-red-500 text-sm">{formik.errors.itemName}</p>
              )}
            </FormItem>

            {/* <FormItem
              label="External link"
              desc="Ciscrypt will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  https://
                </span>
                <Input
                  className="!rounded-l-none"
                  type="text"
                  placeholder="abc.com"
                  name="externalLink"
                  value={formik.values.externalLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.externalLink && formik.errors.externalLink && (
                <p className="text-red-500 text-sm">
                  {formik.errors.externalLink}
                </p>
              )}
            </FormItem> */}

            <FormItem
              label="Description"
              desc={
                <div>
                  {`The description will be included on the item's detail page underneath its image.`}{" "}
                  <span className="text-green-500">Markdown</span> syntax is
                  supported.
                </div>
              }
            >
              <Textarea
                rows={6}
                className="mt-1.5"
                placeholder="..."
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              )}
            </FormItem>

            {/* Choose collection */}
            {/* <div>
              <Label>Choose collection</Label>
              <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                Choose an existing collection or create a new one
              </div>
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">
                  Server size
                </RadioGroup.Label>
                <div className="flex overflow-auto py-2 space-x-4 customScrollBar">
                  {plans.map((plan, index) => (
                    <RadioGroup.Option
                      key={index}
                      value={plan}
                      className={({ active, checked }) =>
                        `${
                          active
                            ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                            : ""
                        }
                        ${
                          checked
                            ? "bg-teal-600 text-white"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }
                        relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none`
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <div className="flex items-center justify-between">
                                  <RadioGroup.Description
                                    as="div"
                                    className={"rounded-full w-16"}
                                  >
                                    <NcImage
                                      containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
                                      src={plan.featuredImage}
                                    />
                                  </RadioGroup.Description>
                                  {checked && (
                                    <div className="flex-shrink-0 text-white">
                                      <CheckIcon className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-semibold mt-3 ${
                                    checked ? "text-white" : ""
                                  }`}
                                >
                                  {plan.name}
                                </RadioGroup.Label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div> */}

            {/* Royalties, Size, Property */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-2.5">
              {/* Royalties */}
              <FormItem label="Royalties">
                <Input
                  name="royalties"
                  type="number"
                  placeholder="20%"
                  value={formik.values.royalties}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.royalties && formik.errors.royalties && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.royalties}
                  </p>
                )}
              </FormItem>

              {/* Size */}
              <FormItem label="Price ($)">
                <Input
                  name="price"
                  type="text"
                  placeholder="2.0"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-sm">{formik.errors.price}</p>
                )}
              </FormItem>

              {/* Property */}
              <FormItem label="Property">
                <Input
                  name="property"
                  type="text"
                  placeholder="Property"
                  value={formik.values.property}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.property && formik.errors.property && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.property}
                  </p>
                )}
              </FormItem>
              <FormItem label="Category">
                <select
                  id="category"
                  className=" text-neutral-500 rounded-lg focus:ring-0  block w-full p-2.5 bg-darkBlue-600 border-gray-600/30 placeholder-gray-500  text-sm sm:text-base"
                  name="category"
                  onChange={(e) =>
                    formik.setFieldValue("category", e.target.value)
                  }
                  required
                >
                  <option value="Arts">Arts</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Music">Music</option>
                  <option value="News">News</option>
                  <option value="Sports">Sports</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category}
                  </p>
                )}
              </FormItem>

              {formik.values.putOnSale && (
                <FormItem label="Select end date">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formik.values.endDate}
                    onChange={(e) =>
                      formik.setFieldValue("endDate", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    className="text-neutral-500 rounded-lg focus:ring-0  block w-full p-2.5 bg-darkBlue-600 border-gray-600/30 placeholder-gray-500  text-sm sm:text-base"
                    required
                  />

                  {formik.touched.endDate && formik.errors.endDate && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.endDate}
                    </p>
                  )}
                </FormItem>
              )}
            </div>
            <MySwitch
              enabled={formik.values.putOnSale}
              onChange={(field, value) => {
                formik.setFieldValue("instantSalePrice", !value);
                formik.setFieldValue(field, value);
              }}
              field="putOnSale"
              label="Put on sale"
              desc="You’ll receive bids on this item"
            />
            {/* MySwitch */}
            <MySwitch
              label="Instant sale price"
              desc="Enter the price for which the item will be instantly sold"
              enabled={formik.values.instantSalePrice}
              onChange={(field, value) => {
                formik.setFieldValue("putOnSale", !value);
                formik.setFieldValue(field, value);
              }}
              field="instantSalePrice"
              onBlur={formik.handleBlur}
            />

            {/* Submit and Preview buttons */}
            <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
              <ButtonPrimary loading={loading} type="submit" className="flex-1">
                Upload item
              </ButtonPrimary>
              {/* <ButtonSecondary href="/nft-detail" className="flex-1">
                Preview item
              </ButtonSecondary> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className={`nc-PageUploadItem`}>
  //     <div className="container">
  //       <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
  //         {/* HEADING */}
  //         <div className="max-w-2xl">
  //           <h2 className="text-3xl sm:text-4xl font-semibold">
  //             Create New Item
  //           </h2>
  //           <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
  //             You can set preferred display name, create your profile URL and
  //             manage other personal settings.
  //           </span>
  //         </div>

  //         <hr className="w-full border-t-2 border-neutral-100 dark:border-neutral-700" />

  //         <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
  //           <div>
  //             <h3 className="text-lg sm:text-2xl font-semibold">
  //               Image, Video, Audio, or 3D Model
  //             </h3>
  //             <span className="text-neutral-500 dark:text-neutral-400 text-sm">
  //               File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
  //               OGG, GLB, GLTF. Max size: 100 MB
  //             </span>
  //             <div className="mt-5 ">
  //               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
  //                 <div className="space-y-1 text-center">
  //                   <svg
  //                     className="mx-auto h-12 w-12 text-neutral-400"
  //                     stroke="currentColor"
  //                     fill="none"
  //                     viewBox="0 0 48 48"
  //                     aria-hidden="true"
  //                   >
  //                     <path
  //                       d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
  //                       strokeWidth="2"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     ></path>
  //                   </svg>
  //                   <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
  //                     <label
  //                       htmlFor="file-upload"
  //                       className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
  //                     >
  //                       <span>Upload a file</span>
  //                       <input
  //                         id="file-upload"
  //                         name="file-upload"
  //                         type="file"
  //                         className="sr-only"
  //                         onChange={handleFileChange}
  //                       />
  //                     </label>
  //                     <p className="pl-1">or drag and drop</p>
  //                   </div>
  //                   <p className="text-xs text-neutral-500 dark:text-neutral-400">
  //                     PNG, JPG, GIF up to 10MB
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* ---- */}
  //           <FormItem label="Item Name">
  //             <Input
  //               defaultValue="NFT name"
  //               name="itemName"
  //               type="text"
  //               className="input"
  //               placeholder="Enter item name"
  //             />
  //             <ErrorMessage
  //               name="itemName"
  //               component="div"
  //               className="text-red-500 text-sm"
  //             />
  //           </FormItem>

  //           {/* ---- */}
  //           <FormItem
  //             label="External link"
  //             desc="Ciscrypt will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
  //           >
  //             <div className="flex">
  //               <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
  //                 https://
  //               </span>
  //               <Input
  //                 className="!rounded-l-none"
  //                 type="text"
  //                 placeholder="abc.com"
  //                 name="externalLink"
  //               />
  //             </div>
  //             <ErrorMessage
  //               name="externalLink"
  //               component="div"
  //               className="text-red-500 text-sm"
  //             />
  //           </FormItem>

  //           {/* ---- */}
  //           <FormItem
  //             label="Description"
  //             desc={
  //               <div>
  //                 {`The description will be included on the item's detail page
  //                 underneath its image.`}{" "}
  //                 <span className="text-green-500">Markdown</span> syntax is
  //                 supported.
  //               </div>
  //             }
  //           >
  //             <Textarea rows={6} className="mt-1.5" placeholder="..." />
  //           </FormItem>

  //           <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

  //           <div>
  //             <Label>Choose collection</Label>
  //             <div className="text-neutral-500 dark:text-neutral-400 text-sm">
  //               Choose an exiting collection or create a new one
  //             </div>
  //             <RadioGroup value={selected} onChange={setSelected}>
  //               <RadioGroup.Label className="sr-only">
  //                 Server size
  //               </RadioGroup.Label>
  //               <div className="flex overflow-auto py-2 space-x-4 customScrollBar">
  //                 {plans.map((plan, index) => (
  //                   <RadioGroup.Option
  //                     key={index}
  //                     value={plan}
  //                     className={({ active, checked }) =>
  //                       `${
  //                         active
  //                           ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
  //                           : ""
  //                       }
  //                 ${
  //                   checked
  //                     ? "bg-teal-600 text-white"
  //                     : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
  //                 }
  //                   relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none `
  //                     }
  //                   >
  //                     {({ active, checked }) => (
  //                       <>
  //                         <div className="flex items-center justify-between w-full">
  //                           <div className="flex items-center">
  //                             <div className="text-sm">
  //                               <div className="flex items-center justify-between">
  //                                 <RadioGroup.Description
  //                                   as="div"
  //                                   className={"rounded-full w-16"}
  //                                 >
  //                                   <NcImage
  //                                     containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
  //                                     src={plan.featuredImage}
  //                                   />
  //                                 </RadioGroup.Description>
  //                                 {checked && (
  //                                   <div className="flex-shrink-0 text-white">
  //                                     <CheckIcon className="w-6 h-6" />
  //                                   </div>
  //                                 )}
  //                               </div>
  //                               <RadioGroup.Label
  //                                 as="p"
  //                                 className={`font-semibold mt-3  ${
  //                                   checked ? "text-white" : ""
  //                                 }`}
  //                               >
  //                                 {plan.name}
  //                               </RadioGroup.Label>
  //                             </div>
  //                           </div>
  //                         </div>
  //                       </>
  //                     )}
  //                   </RadioGroup.Option>
  //                 ))}
  //               </div>
  //             </RadioGroup>
  //           </div>

  //           {/* ---- */}
  //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
  //             {/* ---- */}
  //             <FormItem label="Royalties">
  //               <Input placeholder="20%" />
  //             </FormItem>
  //             {/* ---- */}
  //             <FormItem label="Size">
  //               <Input placeholder="165Mb" />
  //             </FormItem>
  //             {/* ---- */}
  //             <FormItem label="Propertie">
  //               <Input placeholder="Propertie" />
  //             </FormItem>
  //           </div>

  //           {/* ---- */}
  //           <MySwitch enabled />

  //           {/* ---- */}
  //           <MySwitch
  //             label="Instant sale price"
  //             desc="Enter the price for which the item will be instantly sold"
  //           />

  //           {/* ---- */}
  //           <MySwitch
  //             enabled
  //             label="Unlock once purchased"
  //             desc="Content will be unlocked after successful transaction"
  //           />

  //           {/* ---- */}
  //           <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
  //             <ButtonPrimary href="/nft-detail" className="flex-1">
  //               Upload item
  //             </ButtonPrimary>
  //             <ButtonSecondary href="/nft-detail" className="flex-1">
  //               Preview item
  //             </ButtonSecondary>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PageUploadItem;
