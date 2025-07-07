import { Image } from "@imagekit/react";
export default function IKImage({
  src,
  className = "",
  width,
  height,
  alt = "",
}: {
  src: string;
  className: string;
  width: number;
  height: number;
  alt: string;
}) {
  return (
    <Image
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      width={width}
      height={height}
      className={className}
      alt={alt}
    />
  );
}
