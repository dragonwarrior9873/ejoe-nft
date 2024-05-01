"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Label from "@/components/Label/Label";
import Avatar from "@/shared/Avatar/Avatar";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
import { getUserDetailsByEthAddress } from "@/apis/profile.apis";
import { ErrorToast } from "@/components/Toast/Error";
import { SuccessToast } from "@/components/Toast/Success";
import { setEthAccount } from "@/lib/features/userSlice";
interface SocialLinks {
  x?: string;
  telegram?: string;
  instagram?: string;
  facebook?: string;
}

interface UserProfile {
  userName?: string;
  userProfile?: Blob | string | null;
  emailAddress?: string;
  userBio?: string;
  website?: string;
  socialLinks?: SocialLinks;
}
const AccountPage = ({}) => {
  const AccountState = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const initialProfile: UserProfile = {
    userName: "",
    userProfile: "",
    emailAddress: "",
    userBio: "",
    website: "",
    socialLinks: {
      x: "",
      telegram: "",
      instagram: "",
      facebook: "",
    },
  };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  console.log(profile);
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    console.log(name, value);
    setProfile((prevState) => ({
      ...prevState,
      ...(name.includes(".")
        ? {
            [name.split(".")[0]]: {
              ...prevState[name.split(".")[0]],
              [name.split(".")[1]]: value,
            },
          }
        : { [name]: value }),
    }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
    }
  };
  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (profile?.userName !== undefined) {
        formData.append("userName", profile.userName);
      }
      if (profile?.emailAddress !== undefined) {
        formData.append("emailAddress", profile.emailAddress);
      }
      if (profile?.userBio !== undefined) {
        formData.append("userBio", profile.userBio);
      }
      if (profile?.website !== undefined) {
        formData.append("website", profile.website);
      }
      if (profile?.socialLinks?.x !== undefined) {
        formData.append("x", profile.socialLinks.x);
      }
      if (profile?.socialLinks?.telegram !== undefined) {
        formData.append("telegram", profile.socialLinks.telegram);
      }
      if (profile?.socialLinks?.instagram !== undefined) {
        formData.append("instagram", profile.socialLinks.instagram);
      }
      if (profile?.socialLinks?.facebook !== undefined) {
        formData.append("facebook", profile.socialLinks.facebook);
      }
      if (AccountState?.account !== undefined) {
        let ETH = AccountState?.account;
        formData.append("EthAddress", ETH);
      }
      if (selectedImage) {
        formData.append("userProfile", selectedImage);
      }
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        SuccessToast({ message: "Profile updated successfully!" });
        getUserInfo();
        store.dispatch(
          setEthAccount({
            isConnect: true,
            account: AccountState?.account,
            balance: AccountState?.balance,
            userName: response?.data?.result?.userName ?? "",
            userAvatar: response?.data?.result?.userProfile ?? "",
          })
        );
        setLoading(false);
      } else {
        setLoading(false);
        ErrorToast({ message: "Failed to update profile:" });
        console.error("Failed to update profile:", response.data);
      }
    } catch (error) {
      setLoading(false);
      ErrorToast({ message: "Error updating profile:" });
      console.error("Error updating profile:", error);
    }
  };

  const getUserInfo = async () => {
    const response = await getUserDetailsByEthAddress(AccountState?.account);
    console.log(response);
    setProfile({
      userName: response?.userName || "",
      emailAddress: response?.emailAddress || "",
      userProfile: response?.userProfile || "",
      userBio: response?.userBio || "",
      website: response?.website || "",
      socialLinks: {
        x: response?.socialLink?.x || "",
        telegram: response?.socialLink?.telegram || "",
        instagram: response?.socialLink?.instagram || "",
        facebook: response?.socialLink?.facebook || "",
      },
    });
  };
  useEffect(() => {
    if (AccountState?.isConnect) {
      getUserInfo();
    }
  }, [AccountState]);

  return (
    <div className={`nc-AccountPage`}>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
            {/* HEADING */}
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-semibold">
                Profile settings
              </h2>
              <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                You can set preferred display name, create your profile URL and
                manage other personal settings.
              </span>
            </div>
            <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex items-start">
                <div className="relative rounded-full overflow-hidden flex">
                  <Avatar
                    imgUrl={
                      selectedImage
                        ? URL.createObjectURL(selectedImage) // Convert Blob to URL
                        : profile?.userProfile // Check if userProfile is a string
                        ? typeof profile.userProfile === "string"
                          ? `${
                              process.env.NEXT_PUBLIC_BACKEND_BASE_URL
                            }/api/images?imageName=${encodeURIComponent(
                              profile.userProfile
                            )}`
                          : ""
                        : "/user-demo-avatar.svg" // Default avatar path
                    }
                    sizeClass="w-32 h-32"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="mt-1 text-xs">Change Image</span>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-5 sm:space-y-6 md:sm:space-y-7">
                {/* ---- */}
                <div>
                  <Label>Username</Label>
                  <Input
                    className="mt-1.5"
                    name="userName"
                    value={profile.userName}
                    onChange={handleChange}
                    defaultValue="Eden Tuan"
                  />
                </div>

                {/* ---- */}
                <div>
                  <Label>Email</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <EnvelopeIcon className="w-5 h-5" />
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="example@email.com"
                      name="emailAddress"
                      value={profile.emailAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ---- */}
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    rows={5}
                    className="mt-1.5"
                    name="userBio"
                    value={profile.userBio}
                    onChange={handleChange}
                    placeholder="Something about yourself in a few words."
                  />
                </div>

                {/* ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-2.5">
                  <div>
                    <Label>Website</Label>

                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        https://
                      </span>
                      <Input
                        className="!rounded-l-none"
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>telegram</Label>
                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 25 2 C 12.309288 2 2 12.309297 2 25 C 2 37.690703 12.309288 48 25 48 C 37.690712 48 48 37.690703 48 25 C 48 12.309297 37.690712 2 25 2 z M 25 4 C 36.609833 4 46 13.390175 46 25 C 46 36.609825 36.609833 46 25 46 C 13.390167 46 4 36.609825 4 25 C 4 13.390175 13.390167 4 25 4 z M 34.087891 14.035156 C 33.403891 14.035156 32.635328 14.193578 31.736328 14.517578 C 30.340328 15.020578 13.920734 21.992156 12.052734 22.785156 C 10.984734 23.239156 8.9960938 24.083656 8.9960938 26.097656 C 8.9960938 27.432656 9.7783594 28.3875 11.318359 28.9375 C 12.146359 29.2325 14.112906 29.828578 15.253906 30.142578 C 15.737906 30.275578 16.25225 30.34375 16.78125 30.34375 C 17.81625 30.34375 18.857828 30.085859 19.673828 29.630859 C 19.666828 29.798859 19.671406 29.968672 19.691406 30.138672 C 19.814406 31.188672 20.461875 32.17625 21.421875 32.78125 C 22.049875 33.17725 27.179312 36.614156 27.945312 37.160156 C 29.021313 37.929156 30.210813 38.335938 31.382812 38.335938 C 33.622813 38.335938 34.374328 36.023109 34.736328 34.912109 C 35.261328 33.299109 37.227219 20.182141 37.449219 17.869141 C 37.600219 16.284141 36.939641 14.978953 35.681641 14.376953 C 35.210641 14.149953 34.672891 14.035156 34.087891 14.035156 z M 34.087891 16.035156 C 34.362891 16.035156 34.608406 16.080641 34.816406 16.181641 C 35.289406 16.408641 35.530031 16.914688 35.457031 17.679688 C 35.215031 20.202687 33.253938 33.008969 32.835938 34.292969 C 32.477938 35.390969 32.100813 36.335938 31.382812 36.335938 C 30.664813 36.335938 29.880422 36.08425 29.107422 35.53125 C 28.334422 34.97925 23.201281 31.536891 22.488281 31.087891 C 21.863281 30.693891 21.201813 29.711719 22.132812 28.761719 C 22.899812 27.979719 28.717844 22.332938 29.214844 21.835938 C 29.584844 21.464938 29.411828 21.017578 29.048828 21.017578 C 28.923828 21.017578 28.774141 21.070266 28.619141 21.197266 C 28.011141 21.694266 19.534781 27.366266 18.800781 27.822266 C 18.314781 28.124266 17.56225 28.341797 16.78125 28.341797 C 16.44825 28.341797 16.111109 28.301891 15.787109 28.212891 C 14.659109 27.901891 12.750187 27.322734 11.992188 27.052734 C 11.263188 26.792734 10.998047 26.543656 10.998047 26.097656 C 10.998047 25.463656 11.892938 25.026 12.835938 24.625 C 13.831938 24.202 31.066062 16.883437 32.414062 16.398438 C 33.038062 16.172438 33.608891 16.035156 34.087891 16.035156 z"></path>
                        </svg>
                      </span>
                      <Input
                        className="!rounded-l-none"
                        placeholder="yourtelegram"
                        sizeClass="h-11 px-4 pl-2 pr-3"
                        name="socialLinks.telegram"
                        value={profile.socialLinks?.telegram}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
                  <div>
                    <Label>Facebook</Label>
                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 45 74"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M26.645 42.6953V72H13.1834V42.6953H2V30.8129H13.1834V26.4896C13.1834 10.4393 19.8883 2 34.0747 2C38.4238 2 39.5111 2.69896 41.8928 3.26849V15.0215C39.2263 14.5555 38.4756 14.2966 35.7056 14.2966C32.4179 14.2966 30.6575 15.2286 29.0525 17.0666C27.4475 18.9046 26.645 22.0888 26.645 26.645V30.8388H41.8928L37.8025 42.7212H26.645V42.6953Z"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                        </svg>
                      </span>
                      <Input
                        className="!rounded-l-none"
                        placeholder="yourfacebook"
                        sizeClass="h-11 px-4 pl-2 pr-3"
                        name="socialLinks.facebook"
                        value={profile.socialLinks?.facebook}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Twitter</Label>
                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 79 65"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 54.4003C14.4009 54.8168 20.8727 53.0867 27.1844 48.5051C20.8087 47.4158 16.3873 44.5003 13.9844 38.477C15.8427 38.2207 17.4767 38.7013 19.399 37.9324C13.1194 35.1771 9.05048 31.0441 8.89029 23.8994C10.8767 24.0596 12.3825 25.3732 14.7534 25.181C8.98642 19.5422 7.22427 13.3908 10.8446 5.92575C16.8679 12.8461 23.9164 17.5558 32.5348 19.7665C33.0154 19.8946 33.4639 20.0228 33.9445 20.1189C36.1552 20.6315 38.7824 21.7208 40.128 21.5606C42.4348 21.2723 40.128 18.6131 40.7047 15.1529C42.5309 4.38789 54.3852 -0.514024 63.1638 5.79759C65.7269 7.65584 67.7453 7.6238 70.2764 6.50245C71.59 5.92575 72.9356 5.34905 74.5055 4.67624C74.1531 7.75195 71.7822 9.45 69.8919 11.7247C72.0385 12.2053 73.7686 11.5966 75.755 10.9558C75.0822 13.1665 73.4162 14.416 71.9103 15.6335C70.3404 16.883 69.7317 18.1966 69.6676 20.247C68.7065 51.2925 33.4319 75.2895 9.30681 56.1944C6.96798 54.3362 9.24271 56.1944 7 54.4003Z"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                        </svg>
                      </span>
                      <Input
                        className="!rounded-l-none"
                        placeholder="yourtwitter"
                        sizeClass="h-11 px-4 pl-2 pr-3"
                        name="socialLinks.x"
                        value={profile.socialLinks?.x}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_17_63)">
                            <path
                              d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70312 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3312 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2812 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
                              fill="currentColor"
                            />
                            <path
                              d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
                              fill="currentColor"
                            />
                            <path
                              d="M39.6937 11.1843C39.6937 12.778 38.4 14.0624 36.8156 14.0624C35.2219 14.0624 33.9375 12.7687 33.9375 11.1843C33.9375 9.59053 35.2313 8.30615 36.8156 8.30615C38.4 8.30615 39.6937 9.5999 39.6937 11.1843Z"
                              fill="currentColor"
                            />
                          </g>
                        </svg>
                      </span>
                      <Input
                        className="!rounded-l-none"
                        placeholder="yourinstagram"
                        sizeClass="h-11 px-4 pl-2 pr-3"
                        name="socialLinks.instagram"
                        value={profile.socialLinks?.instagram}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* ---- */}
                <div>
                  <Label>Wallet Address</Label>
                  <div className="mt-1.5 relative text-neutral-700 dark:text-neutral-300">
                    <Input
                      className="!pr-10 "
                      name="walletAddress"
                      value={AccountState?.account}
                      disabled
                    />

                    <span className="absolute right-2.5 cursor-pointer top-1/2 -translate-y-1/2 ">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* ---- */}
                <div className="pt-2">
                  <ButtonPrimary
                    className="w-full"
                    type="submit"
                    loading={loading}
                  >
                    Update profile
                  </ButtonPrimary>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
