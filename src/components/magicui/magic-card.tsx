"use client";

import { cn } from "@/lib/utils";
import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface MagicContainerProps {
  children?: ReactNode;
  className?: any;
}

const MagicContainer = ({ children, className }: MagicContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [boxes, setBoxes] = useState<Array<HTMLElement>>([]);

  useEffect(() => {
    init();
    containerRef.current &&
      setBoxes(
        Array.from(containerRef.current.children).map((el) => el as HTMLElement)
      );
  }, []);

  useEffect(() => {
    init();
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", init);
    };
  }, [setBoxes]);

  useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition]);

  const init = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth;
      containerSize.current.h = containerRef.current.offsetHeight;
    }
  };

  const onMouseMove = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { w, h } = containerSize.current;
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;

      mouse.current.x = x;
      mouse.current.y = y;
      boxes.forEach((box) => {
        const boxX =
          -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
        const boxY =
          -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
        box.style.setProperty("--mouse-x", `${boxX}px`);
        box.style.setProperty("--mouse-y", `${boxY}px`);

        if (inside) {
          box.style.setProperty("--opacity", `1`);
        } else {
          box.style.setProperty("--opacity", `0`);
        }
      });
    }
  };

  return (
    <div className={cn("h-full w-full", className)} ref={containerRef}>
      {children}
    </div>
  );
};

interface MagicCardProps {
  as?: ReactElement;
  className?: string;
  children?: ReactNode;
  size?: number;
  spotlight?: boolean;
  spotlightColor?: string;
  isolated?: boolean;
  background?: string;
  [key: string]: any;
}

const MagicCard: React.FC<MagicCardProps> = ({
  className,
  children,
  size = 300,
  spotlight = true,
  borderColor = "rgba(255, 255, 255, 0.5)",
  isolated = true,
  ...props
}) => {
  return (
    <div
      style={
        {
          "--mask-size": `${size}px`,
          "--border-color": `${borderColor}`,
        } as CSSProperties
      }
      className={cn(
        "relative z-0 h-full w-full rounded-xl p-4",
        "bg-gray-200 dark:bg-gray-800",
        "bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--border-color),transparent_100%)]",
        className
      )}
      {...props}
    >
      {children}

      <div className="absolute inset-[1px] -z-20 rounded-xl bg-white dark:bg-gray-900" />
    </div>
  );
};

export { MagicCard, MagicContainer };
