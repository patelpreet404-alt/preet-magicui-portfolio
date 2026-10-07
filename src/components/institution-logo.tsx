import Image from "next/image";

interface Props {
  name: string;
  src?: string;
}

export function InstitutionLogo({ name, src }: Props) {
  return (
    <div
      className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-sm"
      aria-hidden="true"
    >
      {src ? (
        <Image src={src} alt="" width={44} height={44} className="h-full w-full object-contain" />
      ) : (
        <span className="text-[10px] font-semibold text-foreground">
          {name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
        </span>
      )}
    </div>
  );
}
