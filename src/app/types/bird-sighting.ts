/**
 * Basic type containing information needed for a bird sighting.
 */
export interface BirdSighting {
  id?: string,
  name: string;
  date: string;   // Format: YYYY-MM-DD
  place: string;
}
