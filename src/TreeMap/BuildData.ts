
import {find, forEach} from "lodash";


export default function buildNestedData(
  aggregate: Aggregate,
  modulesList: Array<{module: string, alloc: number}> | Array<{module: string, time: number}>
) {
  const ret: Tree<TreeNode> = {
    name: "Top-level",
    size: 0,
    part: "",
    children: [],
  };

  for (const m of modulesList) {
    let current = ret;
    let soFar = "";
    const parts = m.module.split(".");
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      soFar += (i === 0 ? part : "." + part);

      let item = find(current.children, (x) => x.part === part);
      if (!item) {
        item = {
          name: soFar,
          part,
          size: 0,
          children: [],
        };
        current.children.push(item);
      }
      current = item;
      current.size += (aggregate === "time" ? m["time"]: m["alloc"]);
    }
  }
  forEach(ret.children, (x) => {
    ret.size += x.size;
  });

  console.log("Built nestedData", ret);

  return ret;
}
