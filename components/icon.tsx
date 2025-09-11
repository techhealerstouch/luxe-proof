// components/Icon.tsx
import Image from "next/image";
import logo from "../public/icon.svg"; // Import from public folder

type IconProps = {
  width?: number;
  height?: number;
  className?: string;
};

export default function IconCompany({
  width = 120,
  height = 60,
  className,
}: IconProps) {
  return (
    <Image
      src={logo} // Adjust the path as necessary
      alt="Icon Logo"
      width={width}
      height={height}
      className={className}
      priority // ensures logo loads quickly
    />
  );
}
