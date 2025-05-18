import type { ReactNode } from "react";

interface IconBtn {
  color: string;
  children: ReactNode;
  onClick?: () => void;
}

function IconBtn({ color, children, onClick }: IconBtn) {
  return (
    <button
      type="button"
      className={
        "btn iconBtn standardButton rounded-4 p-2.5 btn-" + color + " "
      }
      onClick={onClick}
    >
      <span className="material-symbols-rounded fs-3">{children}</span>
    </button>
  );
}

export default IconBtn;
