export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const SERVICES: Service[] = [
  {
    slug: "new-extensions",
    title: "New Extensions",
    description:
      "Expand your home with expertly built extensions — from single-storey kitchens to full multi-room additions.",
    icon: "🏗️",
  },
  {
    slug: "refurbishment",
    title: "Refurbishment",
    description:
      "Complete property refurbishments that modernise, restore and add value to your space, inside and out.",
    icon: "🛠️",
  },
  {
    slug: "electrical-work",
    title: "Electrical Work",
    description:
      "Safe, certified electrical installations, rewiring, lighting and fault-finding by qualified electricians.",
    icon: "⚡",
  },
  {
    slug: "plumbing-work",
    title: "Plumbing Work",
    description:
      "Reliable plumbing services covering bathrooms, kitchens, heating, leaks and full pipe installations.",
    icon: "🔧",
  },
  {
    slug: "painting",
    title: "Painting",
    description:
      "Professional interior and exterior painting and decorating for a clean, lasting, high-quality finish.",
    icon: "🎨",
  },
];
