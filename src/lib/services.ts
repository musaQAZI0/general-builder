export interface Service { slug: string; title: string; description: string; icon: string; }
export const SERVICES: Service[] = [
  { slug:"new-extensions", title:"Extensions", description:"Thoughtfully designed additions that create more room and lasting value.", icon:"01" },
  { slug:"refurbishment", title:"Refurbishment", description:"Complete property transformations, carefully managed inside and out.", icon:"02" },
  { slug:"electrical-work", title:"Electrical", description:"Safe, certified installations, rewiring, lighting and fault finding.", icon:"03" },
  { slug:"plumbing-work", title:"Plumbing", description:"Reliable plumbing for kitchens, bathrooms, heating and new installations.", icon:"04" },
  { slug:"painting", title:"Painting", description:"Crisp interior and exterior finishes, prepared to look better for longer.", icon:"05" },
];
