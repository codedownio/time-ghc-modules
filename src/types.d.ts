
type Visualization = "bars" | "treemap";
type Aggregate = "time" | "alloc";

interface Event {
  module: string;
  phase: string;
  time: number;
  alloc: number;
}

interface ModuleData {
  phasesByAlloc: Array<{phase: string, alloc: number}>;
  phasesByTime: Array<{phase: string, time: number}>;
  modulesByAlloc: Array<{module: string, alloc: number}>;
  modulesByTime: Array<{module: string, time: number}>;
  modules: Array<{module: string;}>;
  data: Array<Event>;
}

type Tree<D> = D & {
  children?: Tree<D>[];
  id?: string;
}

interface TreeNode {
  name: string;
  color: string;
  size: number;
}
