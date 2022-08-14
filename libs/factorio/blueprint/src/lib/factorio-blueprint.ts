import * as zlib from 'zlib';

export const decode = (encodedString: string) => {
  const buffer = zlib.inflateSync(
    Buffer.from(encodedString.slice(1), 'base64'),
    {
      level: 9,
    }
  );
  return JSON.parse(buffer.toString());
};

export const encode = (decodedString: BlueprintObject) => {
  const json = JSON.stringify(decodedString);
  const compressed = zlib.deflateSync(Buffer.from(json), {
    level: 9,
  });
  return '0'.concat(compressed.toString('base64'));
};

export type BlueprintObject =
  | { blueprint: Blueprint }
  | { blueprint_book: BlueprintBook };

interface Colour {
  r: number;
  b: number;
  g: number;
  a: number;
}

interface Tile {
  name: string;
  position: Position;
}

interface Position {
  x: number;
  y: number;
}

export interface BlueprintBook {
  blueprints: Blueprint[];
}

export interface Blueprint {
  item: string;
  label?: string;
  label_color?: Colour;
  entities: Entity[];
  tiles?: Tile[];
  icons: Icon[];
  'snap-to-grid'?: Position;
  version: number;
}

export enum Direction {
  North = 0,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
}

export interface Entity {
  entity_number: number;
  name: string;
  position: Position;
  direction?: number;
  connections?: Connections;
  control_behavior?: ControlBehavior;

  type?: EntityType;
  neighbours?: number[];
  recipe?: string;
  bar?: number;
  override_stack_size?: number;
  request_filters?: RequestFilter[];
}

export interface Connections {
  '1': The1;
}

export interface The1 {
  green: Green[];
}

export interface Green {
  entity_id: number;
}

export interface ControlBehavior {
  filters?: Filter[];
  read_logistics?: boolean;
  read_robot_stats?: boolean;
  circuit_enable_disable?: boolean;
  circuit_read_hand_contents?: boolean;
  circuit_contents_read_mode?: number;
  circuit_condition?: CircuitCondition;
}

export interface CircuitCondition {
  first_signal: Signal;
  constant: number;
  comparator: string;
}

export interface Signal {
  type: 'item' | 'fluid' | 'virtual';
  name: string;
}

export interface Filter {
  signal: Signal;
  count: number;
  index: number;
}

export interface RequestFilter {
  index: number;
  name: string;
  count: number;
}

export enum EntityType {
  Input = 'input',
  Output = 'output',
}

export interface Icon {
  signal: Signal;
  index: number;
}

const entities: Entity[] = new Array(2500).fill(1).map((_, index) => ({
  entity_number: index + 1,
  name: 'iron-chest',
  position: {
    x: index % 50,
    y: Math.floor(index / 50),
  },
}));

const blueprint: BlueprintObject = {
  blueprint: {
    entities,
    icons: [
      {
        signal: {
          type: 'item',
          name: 'iron-chest',
        },
        index: 1,
      },
    ],
    item: 'blueprint',
    label: 'Chests!',
    version: 281479275544576,
  },
};

import * as fs from 'fs';
import { resolve } from 'path';

const encoded = encode(blueprint);

const result = fs.writeFileSync(resolve('./blueprint.json'), encoded);

const test = '';
