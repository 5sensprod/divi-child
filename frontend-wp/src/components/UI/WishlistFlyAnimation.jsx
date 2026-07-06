import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const WishlistFlyAnimation = () => {
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const handleFly = (event) => {
      const { buttonX, buttonY, direction = "add" } = event.detail || {};
      const target = document.querySelector("[data-wishlist-header-icon]");

      if (!target || buttonX == null || buttonY == null) {
        console.warn("Animation wishlist impossible", {
          target,
          buttonX,
          buttonY,
          direction,
        });
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const headerX = targetRect.left + targetRect.width / 2;
      const headerY = targetRect.top + targetRect.height / 2;

      const isRemove = direction === "remove";

      const startX = isRemove ? headerX : buttonX;
      const startY = isRemove ? headerY : buttonY;
      const endX = isRemove ? buttonX : headerX;
      const endY = isRemove ? buttonY : headerY;

      const id = `${Date.now()}-${Math.random()}`;

      setAnimations((prev) => [
        ...prev,
        {
          id,
          startX,
          startY,
          endX,
          endY,
          direction,
        },
      ]);

      window.setTimeout(() => {
        setAnimations((prev) => prev.filter((item) => item.id !== id));
      }, 900);
    };

    window.addEventListener("wishlist:fly-to-header", handleFly);

    return () => {
      window.removeEventListener("wishlist:fly-to-header", handleFly);
    };
  }, []);

  return (
    <>
      {animations.map(({ id, startX, startY, endX, endY, direction }) => {
        const isRemove = direction === "remove";

        return (
          <div
            key={id}
            className="pointer-events-none fixed z-[99999]"
            style={{
              left: startX,
              top: startY,
              "--fly-x": `${endX - startX}px`,
              "--fly-y": `${endY - startY}px`,
            }}
          >
            <span
              className={`absolute -left-5 -top-5 h-10 w-10 rounded-full border animate-wishlist-ripple ${
                isRemove ? "border-gray-300/70" : "border-pink-400/70"
              }`}
            />

            <Heart
              className={`absolute -left-3 -top-3 h-6 w-6 animate-wishlist-fly ${
                isRemove ? "text-pink-500" : "fill-pink-500 text-pink-500"
              }`}
            />
          </div>
        );
      })}
    </>
  );
};

export default WishlistFlyAnimation;
