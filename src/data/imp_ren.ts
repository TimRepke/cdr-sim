import { ActorKey, ActorCompressed } from '../world/Actor';

const ScenarioData: Record<ActorKey, ActorCompressed> = {
  CO2_EMITTER: {
    name: { EN: 'Total annual CO2eq emissions' },
    info: {
      EN: 'Data by [Robbie Andrew](https://folk.universitetetioslo.no/roberan/t/global_mitigation_curves.shtml) '
        + 'as normalised by [OWID](https://github.com/owid/owid-datasets/tree/master/datasets/CO2%20mitigation%20curves%20for%201.5C%20(Andrews%20%26%20GCP%2C%202019)) for the 1.5°C pathway with mitigation starting in the year 2018.',
    },
    unit: { EN: 'tCO2eq', DE: 'tCO2eq' },
    factor: 1,
    emits: {
      CO2_ATMOSPHERE: {
        2000: 29379836000,
        2005: 33702877000,
        2010: 38265679000,
        2015: 41410120000,
        2020: 39237776000,
        2025: 22697546000,
        2030: 10587257000,
        2035: 4477285000,
        2040: 1789692000,
        2045: 689654000,
        2050: 259002000,
        2055: 95430000,
        2060: 34648000,
        2065: 12433000,
        2070: 4419000,
        2075: 1558000,
        2080: 546000,
        2085: 190000,
        2090: 66000,
        2095: 23000,
        2100: 8000,
      },
    },

  },
};

export default ScenarioData;
