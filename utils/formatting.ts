export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format time ago
export const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

// Helper function to check if edit is allowed (within 3 days of creation)
export const isEditAllowedFor3Days = (createdDate: string | null): boolean => {
  if (!createdDate) return false;

  const created = new Date(createdDate);
  const now = new Date();
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

  return now.getTime() - created.getTime() <= threeDaysInMs;
};

// Helper function to get remaining edit days
export const getRemainingEditDays = (createdDate: string | null): number => {
  if (!createdDate) return 0;

  const created = new Date(createdDate);
  const now = new Date();

  created.setHours(0, 0, 0, 0);
  const currentDate = new Date(now);
  currentDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (currentDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, 3 - diffInDays);
};
