"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getImages } from "@/app/getDataApi";

type ImageType = {
  id: string;
  alt: string | null;
  small: string;
  regular: string;
  full: string;
  photographer: string;
};

export default function Images({ name }: { name: string }) {
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function updateImages() {
      const data = await getImages(name);
      if (data) {
        setImages(data);
        setCurrentIndex(0);
      }
    }
    updateImages();
  }, [name]);

  const nextImage = () => {
    if (images) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div
        className="
          relative w-full max-w-md overflow-hidden rounded-3xl
          border border-[rgb(45,213,255)]
          bg-[linear-gradient(135deg,rgba(15,30,46,0.96),rgba(12,45,58,0.92),rgba(0,0,0,0.88))]
          p-6 text-white backdrop-blur-md
        "
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(42,106,122,0.18),transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,98,126,0.12),transparent_45%)] pointer-events-none" />
        <p className="relative z-10 text-white/60 text-center">
          No images available for {name}
        </p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className="
        relative w-full max-w-md overflow-hidden rounded-3xl
        border border-[rgb(45,213,255)]
        bg-[linear-gradient(135deg,rgba(5,30,45,0.96),rgba(10,55,65,0.92),rgba(0,20,30,0.88))]
        p-6 text-white backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.02]
      "
    >
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24, 63, 73, 0.18),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(18, 50, 63, 0.12),transparent_45%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 border-b border-white/20 pb-4">
          <p className="text-xl md:text-3xl ml-3 font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
            Images Gallery
          </p>
        </div>

        {/* Image Counter */}
        <div className="text-right text-sm text-cyan-100/50 mb-2">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Main Image Container */}
        <div className="relative group">
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl">
            <Image
              src={currentImage.small}
              alt={currentImage.alt || `Image of ${name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Photographer Credit */}
        <div className="mt-4 px-4 py-2 rounded-xl bg-white/5">
          <p className="text-xs text-cyan-100/70 text-center">
            Photo by {currentImage.photographer} on Unsplash
          </p>
        </div>
      </div>
    </div>
  );
}
