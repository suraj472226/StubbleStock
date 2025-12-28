// backend/src/utils/geocoder.ts
import axios from 'axios';

export const getDistrictFromCoords = async (lon: number, lat: number): Promise<string> => {
  try {
    // OpenStreetMap Nominatim API (Free)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      { headers: { 'User-Agent': 'StubbleStock-App' } }
    );

    const addr = response.data.address;
    
    // Logic: District (county) is best for 50km clusters. 
    // If not available, fallback to state_district or city.
    const region = addr.county || addr.state_district || addr.district || addr.city || 'Unknown';
    
    // Clean "District" out of the string if it exists to avoid "Chandrapur District District"
    return region.replace(' District', '').replace(' district', '');
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Unknown Region';
  }
};