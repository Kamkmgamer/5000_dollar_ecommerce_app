"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/lib/products";

interface VariantSelectorProps {
  product: Product;
  onVariantChange: (variant: ProductVariant | null) => void;
  selectedVariantId?: string;
}

export default function VariantSelector({
  product,
  onVariantChange,
  selectedVariantId,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const matchingVariant = product.variants.find((variant) => {
      return Object.entries(variant.attributes).every(
        ([key, val]) => newOptions[key] === val
      );
    });

    onVariantChange(matchingVariant || null);
  };

  const getAvailableValues = (optionName: string): string[] => {
    const option = product.variantOptions.find((o) => o.name === optionName);
    if (!option) return [];

    return option.values.filter((value) => {
      const testOptions = { ...selectedOptions, [optionName]: value };
      return product.variants.some((variant) => {
        return Object.entries(variant.attributes).every(
          ([key, val]) => testOptions[key] === val || !testOptions[key]
        );
      });
    });
  };

  const isValueAvailable = (optionName: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: value };
    return product.variants.some((variant) => {
      const matches = Object.entries(variant.attributes).every(
        ([key, val]) => testOptions[key] === val
      );
      return matches && variant.stock > 0;
    });
  };

  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;

  return (
    <div className="variant-selector">
      {product.variantOptions.map((option) => (
        <div key={option.name} className="variant-option-group">
          <label className="variant-label">
            {option.name}
            {selectedOptions[option.name] && (
              <span className="variant-selected">: {selectedOptions[option.name]}</span>
            )}
          </label>
          <div className="variant-buttons">
            {getAvailableValues(option.name).map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isValueAvailable(option.name, value);

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={`variant-btn ${isSelected ? "selected" : ""} ${!isAvailable ? "unavailable" : ""}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selectedVariant && (
        <div className="selected-variant-info">
          <div className="variant-price-row">
            <span className="variant-price">${selectedVariant.price.toFixed(2)}</span>
            {selectedVariant.compareAtPrice && (
              <span className="variant-compare-price">
                ${selectedVariant.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className={`variant-stock ${selectedVariant.stock < 10 ? "low" : ""}`}>
            {selectedVariant.stock > 0
              ? `${selectedVariant.stock} in stock`
              : "Out of stock"}
          </p>
          <p className="variant-sku">SKU: {selectedVariant.sku}</p>
        </div>
      )}
    </div>
  );
}
