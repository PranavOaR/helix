"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

interface ExpandableCardProps {
  title: string;
  src: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
}

export function ExpandableCard({
  title,
  src,
  description,
  icon,
  children,
  className,
  classNameExpanded,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm h-full w-full z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] overflow-y-auto py-8 px-4 sm:py-12 sm:px-8">
            <div className="min-h-full flex items-center justify-center">
              <motion.div
                layoutId={`card-${title}-${id}`}
                ref={cardRef}
                className={cn(
                  "w-full max-w-[900px] flex flex-col rounded-2xl bg-white shadow-2xl relative",
                  classNameExpanded
                )}
                {...props}
              >
                {/* Image Section */}
                <motion.div layoutId={`image-${title}-${id}`} className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={src}
                      alt={title}
                      className="w-full h-48 sm:h-64 object-cover object-center rounded-t-2xl"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                </motion.div>

              {/* Content Section */}
              <div className="relative flex-1">
                <div className="flex justify-between items-start p-6 sm:p-8">
                  <div className="flex-1">
                    <motion.p
                      layoutId={`description-${description}-${id}`}
                      className="text-brand-orange font-medium text-sm uppercase tracking-wider mb-2"
                    >
                      {description}
                    </motion.p>
                    <motion.h3
                      layoutId={`title-${title}-${id}`}
                      className="font-bold text-brand-navy text-2xl sm:text-3xl lg:text-4xl"
                    >
                      {title}
                    </motion.h3>
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    aria-label="Close card"
                    layoutId={`button-${title}-${id}`}
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy hover:bg-brand-orange hover:text-white border border-brand-navy/10 hover:border-brand-orange transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange ml-4"
                    onClick={() => setActive(false)}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Expanded Content */}
                <div className="px-6 sm:px-8 pb-8">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-brand-navy/70 text-base sm:text-lg leading-relaxed flex flex-col gap-6 [&_h4]:text-brand-navy [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:sm:text-xl [&_h4]:mt-2"
                  >
                    {children}
                  </motion.div>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed Card */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`Learn more about ${title}`}
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        onKeyDown={(e) => e.key === "Enter" && setActive(true)}
        className={cn(
          "group p-3 flex flex-col bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:shadow-brand-orange/10 transition-all duration-300",
          className
        )}
      >
        {/* Image */}
        <motion.div layoutId={`image-${title}-${id}`} className="overflow-hidden rounded-xl">
          <img
            src={src}
            alt={title}
            className="w-full h-44 sm:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Content */}
        <div className="flex justify-between items-end mt-4 gap-4">
          <div className="flex-1 min-w-0">
            <motion.p
              layoutId={`description-${description}-${id}`}
              className="text-brand-orange text-xs sm:text-sm font-medium uppercase tracking-wider mb-1"
            >
              {description}
            </motion.p>
            <motion.h3
              layoutId={`title-${title}-${id}`}
              className="text-brand-navy font-bold text-lg sm:text-xl truncate"
            >
              {title}
            </motion.h3>
          </div>

          {/* Icon & Expand Button */}
          <motion.button
            aria-label="Expand card"
            layoutId={`button-${title}-${id}`}
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-orange/10 to-brand-red-light/10 text-brand-orange group-hover:from-brand-orange group-hover:to-brand-red-light group-hover:text-white border border-brand-orange/20 group-hover:border-transparent transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
