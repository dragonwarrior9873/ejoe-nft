import React, { FC } from "react";
import Image, { ImageProps } from "next/image";

export interface NcImageProps extends Omit<ImageProps, "alt"> {
  containerClassName?: string;
  alt?: string;
}

const NcImage: FC<NcImageProps> = ({
  containerClassName = "relative",
  alt = "nc-imgs",
  src,
  fill,
  className = "object-cover w-full h-full",
  sizes = "(max-width: 600px) 480px, 800px",
  ...args
}) => {
  console.log(src);

  return (
    <div className={containerClassName}>
      {/* <Image
      crossOrigin="anonymous"
          className={className}
          alt={alt}
          sizes={sizes}
          {...args}
          src={src}
          fill={fill}
        /> */}
      {src ? (
        <img
          crossOrigin="anonymous"
          className={className}
          alt={alt}
          sizes={sizes}
          {...args}
          src={src as string}
          // fill={fill}
        />
      ) : null}
    </div>
  );
};

export default NcImage;
