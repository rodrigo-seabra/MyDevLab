import Image from "next/image";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`relative block h-10 w-[180px] ${className}`.trim()}>
      <Image
        alt="MyDevLab"
        className="theme-logo-light absolute inset-0 h-10 w-auto"
        height={77}
        priority
        src="/images/logo-h-black.svg"
        width={180}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="theme-logo-dark absolute inset-0 h-10 w-auto"
        height={77}
        priority
        src="/images/logo-h-white.svg"
        width={180}
      />
    </span>
  );
}
