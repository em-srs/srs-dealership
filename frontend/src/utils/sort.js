/**
 * Sorts an array of vehicle objects based on the selected sort key.
 * Supported options:
 *  - 'price_asc': Price: Low to High
 *  - 'price_desc': Price: High to Low
 *  - 'newest': Newest first (by year or created_at)
 *  - 'default' / any: Preserves original backend order
 *
 * @param {Array} vehicles 
 * @param {string} sortOption 
 * @returns {Array} New sorted array
 */
export function sortVehicles(vehicles, sortOption) {
  if (!vehicles || !Array.isArray(vehicles)) return [];
  const list = [...vehicles];

  switch (sortOption) {
    case 'price_asc':
      return list.sort((a, b) => Number(a.price) - Number(b.price));

    case 'price_desc':
      return list.sort((a, b) => Number(b.price) - Number(a.price));

    case 'newest':
      return list.sort((a, b) => {
        if (a.created_at && b.created_at) {
          const timeDiff = new Date(b.created_at) - new Date(a.created_at);
          if (timeDiff !== 0) return timeDiff;
        }
        if (b.year !== a.year) {
          return Number(b.year) - Number(a.year);
        }
        return Number(b.id) - Number(a.id);
      });

    default:
      return list;
  }
}
