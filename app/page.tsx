"use client";
import { PageLayout } from "@/components/layout/page-layout";
import { useRestaurant } from "@/lib/context/restaurant-context";
import type { MenuItem, SpiceLevel, VegType } from "@/lib/types";
import Image from "next/image";
export default function Home() {
  const { addToCart } = useRestaurant();
  const featuredDishes: MenuItem[] = [
    {
      id: "kung-pao-chicken",
      name: "Kung Pao Chicken",
      description: "Crispy chicken with peanuts",
      price: 8.99,
      image: "/menu-items/kung-pao-chicken.png",
      category: "Chicken",
      spiceLevel: "medium",
      vegType: "non_veg",
      servings: 1,
      preparationTime: 20,
    },
    {
      id: "singapore-mei-fun",
      name: "Singapore Mei Fun",
      description: "Spiced rice noodles",
      price: 8.99,
      image: "/menu-items/singapore-mei-fun.png",
      category: "Noodles",
      spiceLevel: "mild",
      vegType: "non_veg",
      servings: 1,
      preparationTime: 15,
    },
    {
      id: "mapo-tofu",
      name: "Mapo Tofu",
      description: "Silky tofu in spicy sauce",
      price: 7.99,
      image: "/menu-items/mapo-tofu.png",
      category: "Vegetarian",
      spiceLevel: "hot",
      vegType: "veg",
      servings: 1,
      preparationTime: 15,
    },
  ];
  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted to-background py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              Welcome to <span className="text-primary">Takeway</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Authentic Chinese cuisine delivered with premium quality and
              exceptional service
            </p>
            <a
              href="/menu"
              className="inline-block bg-primary text-card px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Order Now
            </a>
          </div>
        </section>

        {/* Featured Section */}
        {/* Featured Section */}
        <section className="py-16 px-4 bg-card">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Featured <span className="text-accent">Dishes</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border"
                >
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {dish.name}
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    {dish.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">
                      ${dish.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => addToCart(dish, 1)}
                      className="bg-primary text-card px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Browse <span className="text-accent">Categories</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {["Starters", "Soups", "Dumplings", "Noodles", "Desserts"].map(
                (category) => (
                  <a
                    key={category}
                    href="/menu"
                    className="bg-card border border-border rounded-xl p-4 text-center font-semibold text-foreground hover:bg-primary hover:text-card hover:border-primary transition-all duration-300 cursor-pointer"
                  >
                    {category}
                  </a>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              <span className="text-accent">Special</span> Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Order Combo Deal",
                  desc: "Buy 2 dishes and get 15% off",
                  color: "bg-primary",
                },
                {
                  title: "Free Delivery",
                  desc: "On orders over $30",
                  color: "bg-accent",
                },
              ].map((offer) => (
                <div
                  key={offer.title}
                  className={`${offer.color} text-card rounded-xl p-8 text-center font-semibold shadow-lg`}
                >
                  <h3 className="text-2xl mb-2">{offer.title}</h3>
                  <p className="text-sm opacity-90">{offer.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 px-4 bg-card">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
              Customer <span className="text-accent">Reviews</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Johnson",
                  rating: 5,
                  text: "Exceptional food quality and fast delivery. Best Chinese restaurant in town!",
                },
                {
                  name: "Mike Chen",
                  rating: 5,
                  text: "Authentic flavors and generous portions. Love ordering from Dragon Palace.",
                },
                {
                  name: "Emma Williams",
                  rating: 5,
                  text: "Perfect for takeout. The packaging is excellent and food arrives hot.",
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="bg-background rounded-xl p-6 border border-border"
                >
                  <div className="flex items-center mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-accent text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">
                    &quot;{review.text}&quot;
                  </p>
                  <p className="font-semibold text-primary">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
