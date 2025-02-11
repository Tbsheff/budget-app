import { useEffect, useState } from "react";

const TranslationWidget = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Initial position
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const addYandexTranslateScript = () => {
      if (!document.getElementById("yandex-translate-script")) {
        const script = document.createElement("script");
        script.id = "yandex-translate-script";
        script.src =
          "https://translate.yandex.net/website-widget/v1/widget.js?widgetId=yandexWidget&lang=en";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    };

    addYandexTranslateScript();
  }, []);

  // Mouse Down - Start Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Mouse Move - Dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  // Mouse Up - Stop Dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        cursor: "grab",
      }}
    >
      <div id="yandexWidget"></div>
    </div>
  );
};

export default TranslationWidget;
