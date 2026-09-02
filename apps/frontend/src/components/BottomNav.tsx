type Page = "profile" | "pets";

type BottomNavProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
};

function BottomNav({
  currentPage,
  onPageChange,
}: BottomNavProps) {
  return (
    <nav
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        bg-white/95
        px-4
        pt-3
        pb-[calc(1rem+env(safe-area-inset-bottom))]
        backdrop-blur
      "
    >
      <div className="mx-auto flex max-w-md gap-2">
  <button
    type="button"
    onClick={() => onPageChange("profile")}
    className={`flex flex-1 items-center justify-center rounded-2xl py-4 text-sm font-medium transition active:scale-[0.98] ${
      currentPage === "profile"
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    Profile
  </button>

  <button
    type="button"
    onClick={() => onPageChange("pets")}
    className={`flex flex-1 items-center justify-center rounded-2xl py-4 text-sm font-medium transition active:scale-[0.98] ${
      currentPage === "pets"
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    Pets
  </button>
</div>
    </nav>
  );
}
export default BottomNav;
