import { BlueprintObject } from '../lib/factorio-blueprint';

export const testEncodedString =
  '0eNqVkt1qwzAMhd9F104h/kk2v8ooI01FZ3DkYLtjIfjd5yRQ0s5s3aWMznd0ZM1wslccvaEIegbTOwqg32YI5kKdXd7iNCJoMBEHYEDdsFbeUdV/YIiQGBg64xfoOrG/hRTQR/Q7GU9HBkjRRIOb+VpM73QdTrlT1z/VDEYXssDR4pQhlZAHxWAC3dYHleFn47HfGpplrgcmL0UpUMWeWuCIGycMnbUV2uzqTV+NzuKvY/IyUD4VVu0pd2Flgan+t0DxyOQFZvMUU9ylzf+8XoPeXR2DT/Rhs3mpZfvKW6WkVG2T0jel3dhm';
export const testDecodedObject: BlueprintObject = {
  blueprint: {
    icons: [
      {
        signal: {
          type: 'item',
          name: 'iron-chest',
        },
        index: 1,
      },
      {
        signal: {
          type: 'item',
          name: 'inserter',
        },
        index: 2,
      },
    ],
    entities: [
      {
        entity_number: 1,
        name: 'inserter',
        position: {
          x: -34.5,
          y: 71.5,
        },
        direction: 6,
      },
      {
        entity_number: 2,
        name: 'iron-chest',
        position: {
          x: -33.5,
          y: 71.5,
        },
      },
      {
        entity_number: 3,
        name: 'small-electric-pole',
        position: {
          x: -34.5,
          y: 72.5,
        },
      },
      {
        entity_number: 4,
        name: 'inserter',
        position: {
          x: -35.5,
          y: 72.5,
        },
        direction: 4,
      },
      {
        entity_number: 5,
        name: 'inserter',
        position: {
          x: -34.5,
          y: 73.5,
        },
        direction: 2,
      },
      {
        entity_number: 6,
        name: 'inserter',
        position: {
          x: -33.5,
          y: 72.5,
        },
      },
    ],
    item: 'blueprint',
    version: 281479275544576,
  },
};
