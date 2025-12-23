import clsx from "clsx";

type Props = {
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};

export function EventStatusBadge({ status }: Props) {
  return (
    <span
      className={clsx(
        "px-2 py-1 rounded-full text-xs font-medium",
        {
          DRAFT: "bg-gray-100 text-gray-700",
          ACTIVE: "bg-green-100 text-green-700",
          COMPLETED: "bg-blue-100 text-blue-700",
          CANCELLED: "bg-red-100 text-red-700",
        }[status]
      )}
    >
      {status}
    </span>
  );
}
