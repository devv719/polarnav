/**
 * Antarctic Research Stations & Gateway Ports for Geographic Reference & Destination Planning
 * (MoES / NCPOR Indian & International Stations, Antarctic Gateways)
 */
export const ANTARCTIC_STATIONS = [
  {
    id: 'bharati',
    name: 'Bharati Station',
    operator: 'India (NCPOR / MoES)',
    coordinates: [-69.4069, 76.1908],
    sector: 'Larsemann Hills, Prydz Bay',
    established: 2012,
    status: 'Operational (Year-Round)',
    type: 'Research Base',
    currentTemp: -14.2,
    windSpeed: 28,
    iceCondition: 'Fast Ice (Moderate)'
  },
  {
    id: 'maitri',
    name: 'Maitri Station',
    operator: 'India (NCPOR / MoES)',
    coordinates: [-70.7667, 11.7333],
    sector: 'Schirmacher Oasis, Queen Maud Land',
    established: 1989,
    status: 'Operational (Year-Round)',
    type: 'Research Base',
    currentTemp: -18.6,
    windSpeed: 34,
    iceCondition: 'Inland Shelf Ice'
  },
  {
    id: 'mcmurdo',
    name: 'McMurdo Station',
    operator: 'United States (USAP)',
    coordinates: [-77.8419, 166.6863],
    sector: 'Ross Island, Ross Sea',
    established: 1955,
    status: 'Operational',
    type: 'Logistics Hub',
    currentTemp: -22.4,
    windSpeed: 19,
    iceCondition: 'Pack Ice'
  },
  {
    id: 'palmer',
    name: 'Palmer Station',
    operator: 'United States (USAP)',
    coordinates: [-64.7742, -64.0531],
    sector: 'Anvers Island, Antarctic Peninsula',
    established: 1968,
    status: 'Operational',
    type: 'Research Base',
    currentTemp: -3.4,
    windSpeed: 14,
    iceCondition: 'Drift Ice / Open Water'
  },
  {
    id: 'rothera',
    name: 'Rothera Research Station',
    operator: 'United Kingdom (BAS)',
    coordinates: [-67.5700, -68.1250],
    sector: 'Adelaide Island, Antarctic Peninsula',
    established: 1975,
    status: 'Operational',
    type: 'Research Base',
    currentTemp: -6.5,
    windSpeed: 15,
    iceCondition: 'Seasonal Open Water'
  },
  {
    id: 'casey',
    name: 'Casey Station',
    operator: 'Australia (AAD)',
    coordinates: [-66.2822, 110.5278],
    sector: 'Vincennes Bay, Wilkes Land',
    established: 1969,
    status: 'Operational',
    type: 'Research Base',
    currentTemp: -11.8,
    windSpeed: 22,
    iceCondition: 'Drift Ice'
  },
  {
    id: 'ushuaia',
    name: 'Port of Ushuaia',
    operator: 'Argentina (Polar Gateway)',
    coordinates: [-54.8019, -68.3030],
    sector: 'Beagle Channel, Tierra del Fuego',
    established: 1884,
    status: 'Operational Port',
    type: 'Gateway Port',
    currentTemp: 4.5,
    windSpeed: 18,
    iceCondition: 'Ice Free'
  },
  {
    id: 'punta_arenas',
    name: 'Port of Punta Arenas',
    operator: 'Chile (Polar Gateway)',
    coordinates: [-53.1638, -70.9171],
    sector: 'Strait of Magellan',
    established: 1848,
    status: 'Operational Port',
    type: 'Gateway Port',
    currentTemp: 5.2,
    windSpeed: 24,
    iceCondition: 'Ice Free'
  }
];
