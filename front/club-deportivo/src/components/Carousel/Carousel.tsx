import React from 'react';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div className="flex w-[300%] h-full animate-slow-scroll">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Imagen ${index + 1}`}
            className="w-1/3 flex-shrink-0 object-cover rounded-lg"
            width={800}
            height={600}
          />
        ))}
      </div>
    </div>
  );
}