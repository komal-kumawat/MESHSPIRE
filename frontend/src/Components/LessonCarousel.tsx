import React, { useRef, useState, useEffect } from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

interface LessonCarouselProps {
  children: React.ReactNode[];
}

const LessonCarousel: React.FC<LessonCarouselProps> = ({ children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    checkScrollability();
  }, [children]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  if (children.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div
        className="flex w-full overflow-x-auto scroll-smooth no-scrollbar mb-6 px-2 sm:px-0"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div className="flex flex-row gap-4 sm:gap-5">
          {children.map((child, index) => (
            <div key={index} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {children.length > 1 && (
        <div className="flex justify-center sm:justify-end gap-2 mr-0 sm:mr-10">
          <button
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 transition-all hover:bg-gray-200"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </button>
          <button
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 transition-all hover:bg-gray-200"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonCarousel;
