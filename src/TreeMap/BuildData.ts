
import {find, forEach} from "lodash";


type ModuleItem = {module: string, alloc: number} | {module: string, time: number};

export default function buildNestedData(
  aggregate: Aggregate,
  modulesList: Array<ModuleItem>
) {
  const ret: Tree<TreeNode> = {
    name: "Top-level",
    value: 0,
    part: "",
    children: [],
  };

  for (const m of modulesList) {
    addModuleToTree(aggregate, m, ret);
  }
  forEach(ret.children, (x) => {
    ret.value += x.value;
  });

  console.log("Built nestedData", ret);

  return ret;
}


function addModuleToTree(aggregate: Aggregate, m: ModuleItem, ret: Tree<TreeNode>) {
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
        value: 0,
        children: [],
      };
      current.children.push(item);
    }
    current = item;

    // Add the value to the bottommost node
    if (i === parts.length - 1) {
      current.value += (aggregate === "time" ? m["time"]: m["alloc"]);
    }
  }
}

export function removeEmptyNodes(tree: Tree<TreeNode>): Tree<TreeNode> {
  for (let i = 0; i < tree.children.length; i += 1) {
    tree.children[i] = removeEmptyNodes(tree.children[i]);
  }

  if (tree.value === 0 && tree.children.length === 1) {
    return tree.children[0];
  } else {
    return tree;
  }
}
