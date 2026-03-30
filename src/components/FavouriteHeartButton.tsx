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
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
        isFavourite
          ? "bg-red-50 border-red-200 text-red-500 scale-100"
          : "bg-white border-blue-100 text-slate-500 hover:text-red-500"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-110 active:scale-95"} ${className}`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${isFavourite ? "fill-current" : "fill-transparent"}`}
      />
    </button>
  );
};

export default FavouriteHeartButton;
