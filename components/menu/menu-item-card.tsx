'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { MenuItem } from '@/lib/types';
import { formatPrice, getSpiceLevelLabel, getVegTypeLabel } from '@/lib/utils-restaurant';
import { useRestaurant } from '@/lib/context/restaurant-context';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useRestaurant();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setShowNotification(true);
    setQuantity(1);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const spiceLevelColors = {
    mild: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hot: 'bg-orange-100 text-orange-800',
    very_hot: 'bg-red-100 text-red-800',
  };

  const vegBgColor = item.vegType === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary">
      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden group">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{item.name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${spiceLevelColors[item.spiceLevel]}`}>
            {getSpiceLevelLabel(item.spiceLevel)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${vegBgColor}`}>
            {getVegTypeLabel(item.vegType)}
          </span>
        </div>

        {/* Price and Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">{formatPrice(item.price)}</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-background rounded transition-colors"
            >
              <Minus className="w-4 h-4 text-foreground" />
            </button>
            <span className="px-3 py-1 font-semibold text-foreground min-w-[2rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:bg-background rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-card py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Add to Cart
        </button>

        {/* Added Notification */}
        {showNotification && (
          <div className="mt-2 text-center text-sm text-green-600 font-semibold animate-pulse">
            ✓ Added to cart
          </div>
        )}
      </div>
    </div>
  );
};
