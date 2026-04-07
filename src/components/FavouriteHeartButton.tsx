import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

const FavouriteHeartButton = ({
  isFavourite,
  onToggle,
  disabled,
  className = "",
}: {
  isFavourite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      className={`heart-btn inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
        isFavourite
          ? "active bg-red-50 border-red-500 text-red-500"
          : "bg-slate-50 border-slate-600 text-slate-600 shadow-sm hover:bg-white hover:border-red-500 hover:text-red-500 hover:shadow"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-110 active:scale-95"} ${className}`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${isFavourite ? "fill-current" : "fill-transparent"}`}
      />
    </button>
  );
};

export default FavouriteHeartButton;
