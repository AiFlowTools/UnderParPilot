"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
}

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-gray-500 dark:bg-gray-400";

    if (isCenter) {
      height = "h-8";
      color = "bg-green-600 dark:bg-green-400";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-green-600 dark:bg-green-400";
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass}`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
  onItemSelect,
  selectedItem,
}: {
  originalItems: CarouselItem[];
  onItemSelect?: (item: CarouselItem) => void;
  selectedItem?: string;
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  // Find the initial index based on selectedItem
  const getInitialIndex = () => {
    if (selectedItem) {
      const foundIndex = originalItems.findIndex(item => item.title === selectedItem);
      if (foundIndex !== -1) {
        return itemsPerSet + foundIndex; // Start with middle set
      }
    }
    return itemsPerSet; // Default to first item in middle set
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex());
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(getInitialIndex());

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    // Find the original item index
    const targetOriginalIndex = newIndex % itemsPerSet;
    const selectedOriginalItem = originalItems[targetOriginalIndex];

    // Find all instances of this item across the 3 copies
    const possibleIndices = [
      targetOriginalIndex, // First copy
      targetOriginalIndex + itemsPerSet, // Second copy
      targetOriginalIndex + itemsPerSet * 2, // Third copy
    ];

    // Find the closest index to current position
    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);

    // Call the callback with the selected item
    if (onItemSelect && selectedOriginalItem) {
      onItemSelect(selectedOriginalItem);
    }
  };

  const handlePrevious = () => {
    if (isResetting) return;
    const newIndex = activeIndex - 1;
    setActiveIndex(newIndex);
    
    // Get the original item and call callback
    const targetOriginalIndex = newIndex % itemsPerSet;
    const selectedOriginalItem = originalItems[targetOriginalIndex];
    if (onItemSelect && selectedOriginalItem) {
      onItemSelect(selectedOriginalItem);
    }
  };

  const handleNext = () => {
    if (isResetting) return;
    const newIndex = activeIndex + 1;
    setActiveIndex(newIndex);
    
    // Get the original item and call callback
    const targetOriginalIndex = newIndex % itemsPerSet;
    const selectedOriginalItem = originalItems[targetOriginalIndex];
    if (onItemSelect && selectedOriginalItem) {
      onItemSelect(selectedOriginalItem);
    }
  };

  // Handle infinite scrolling
  useEffect(() => {
    if (isResetting) return;

    // If we're in the first set, jump to the equivalent position in the middle set
    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
    // If we're in the last set, jump to the equivalent position in the middle set
    else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting, activeIndex]);

  // Calculate target position - center the active item
  const centerPosition = Math.floor(itemsPerSet / 2);
  const targetX = -200 + (centerPosition - (activeIndex % itemsPerSet)) * 200;

  // Get current page info
  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full h-[120px] flex flex-col justify-center relative">
        <div className="flex items-center justify-center">
          <RulerLines top />
        </div>
        <div className="flex items-center justify-center w-full h-full relative overflow-hidden">
          <motion.div
            className="flex items-center gap-[50px]"
            animate={{
              x: isResetting ? targetX : targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 1,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(index)}
                  className={`text-lg md:text-xl font-bold whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 0.75,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: "150px",
                  }}
                >
                  {item.title}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center">
          <RulerLines top={false} />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous item"
        >
          <Rewind className="w-4 h-4 text-green-600" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {currentPage}
          </span>
          <span className="text-sm text-gray-500">
            /
          </span>
          <span className="text-sm font-medium text-gray-600">
            {totalPages}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next item"
        >
          <FastForward className="w-4 h-4 text-green-600" />
        </button>
      </div>
    </div>
  );
}