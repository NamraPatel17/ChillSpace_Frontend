import React, { useState } from "react";

export const ImageWithFallback = ({
  src,
  alt,
  fallback =
    "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?auto=format&fit=crop&w=800&q=80",
  className = ""
}) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
};

