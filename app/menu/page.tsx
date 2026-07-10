'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MENU_ITEMS, CATEGORIES } from '@/lib/mock-data';
import { MenuItem } from '@/lib/types';

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc'>('name');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non_veg'>('all');

  // Filter and sort logic
  const filteredItems = useMemo(() => {
    let items = [...MENU_ITEMS];

    // Search filter
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Veg/Non-Veg filter
    if (vegFilter !== 'all') {
      items = items.filter((item) => item.vegType === vegFilter);
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price_asc') {
        return a.price - b.price;
      } else if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return items;
  }, [searchTerm, selectedCategory, sortBy, vegFilter]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-card py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Menu</h1>
            <p className="text-lg opacity-90">Explore our delicious selection of authentic Chinese dishes</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-card border-b border-border sticky top-16 z-40 py-4 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Category Tabs */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === null
                        ? 'bg-primary text-card'
                        : 'bg-background text-foreground border border-border hover:border-primary'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary text-card'
                          : 'bg-background text-foreground border border-border hover:border-primary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Veg Filter */}
              <div className="flex gap-2 md:flex-nowrap flex-wrap">
                <select
                  value={vegFilter}
                  onChange={(e) => setVegFilter(e.target.value as 'all' | 'veg' | 'non_veg')}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Items</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non_veg">Non-Vegetarian</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price_asc' | 'price_desc')}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {filteredItems.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl font-semibold text-foreground mb-2">No items found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                    setVegFilter('all');
                  }}
                  className="bg-primary text-card px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
