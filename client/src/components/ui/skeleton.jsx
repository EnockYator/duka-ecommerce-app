import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(" shimmer rounded-md bg-gray-300", className)}
      {...props} />
  );
}

export { Skeleton }
