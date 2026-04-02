import { Heart } from "lucide-react";

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
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      className={`heart-btn inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
        isFavourite
          ? "active bg-red-50 border-red-200 text-red-500"
          : "bg-red-500 border-slate-400 text-slate-600 shadow-sm hover:bg-white hover:border-red-300 hover:text-red-500 hover:shadow"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-110 active:scale-95"} ${className}`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${isFavourite ? "fill-current" : "fill-transparent"}`}
      />
    </button>
  );
};

export default FavouriteHeartButton;
