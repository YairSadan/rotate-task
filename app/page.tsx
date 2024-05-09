"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
type Rectangle = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  angle: number;
  isFocused: boolean;
};
let counter = 100;
export default function Home() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [allowRotation, setAllowRotation] = useState(false);
  const rectangleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setAllowRotation((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function createRectangle() {
    setRectangles((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        width: 100,
        height: 50,
        x: counter,
        y: counter,
        angle: 0,
        isFocused: false,
      },
    ]);
    counter += 10;
    console.log(counter);
  }

  const handleMouseMove = (e: { clientX: any; clientY: any }) => {
    if (!allowRotation) return;
    if (!rectangleRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      rectangleRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    setRectangles((prev) =>
      prev.map((rectangle) =>
        rectangle.isFocused
          ? {
              ...rectangle,
              angle,
            }
          : rectangle
      )
    );
  };

  return (
    <div style={{ cursor: allowRotation ? "nwse-resize" : "auto" }}>
      <div className="flex justify-center items-center h-screen">
        <Button onClick={createRectangle}>Create rectangle</Button>
      </div>
      {rectangles.map((rectangle: any, index: number) => (
        <div
          ref={rectangleRef}
          onMouseMove={handleMouseMove}
          onClick={() => (rectangle.isFocused = !rectangle.isFocused)}
          key={index}
          className="absolute border-2 border-black"
          style={{
            cursor: allowRotation && rectangle.isFocused ? "move" : "auto",
            width: rectangle.width,
            height: rectangle.height,
            left: rectangle.x,
            top: rectangle.y,
            transform: `rotate(${rectangle.angle}deg)`,
          }}
        />
      ))}
    </div>
  );
}
