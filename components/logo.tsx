// components/Logo.tsx
import Image from "next/image";
import logo from "../public/logo.svg"; // Import from public folder

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

export default function Logo({
  width = 120,
  height = 60,
  className,
}: LogoProps) {
  return (
    <Image
      src={logo} // Adjust the path as necessary
      alt="Company Logo"
      width={width}
      height={height}
      className={className}
      priority // ensures logo loads quickly
    />
  );
}
