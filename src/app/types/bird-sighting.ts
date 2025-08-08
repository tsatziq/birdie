/**
 * Basic type containing information needed for a bird sighting.
 */
export interface BirdSighting {
  id: number,
  name: string;
  date: string;   // Format: YYYY-MM-DD
  place: string;
}
