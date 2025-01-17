function Node(data, left = null, right = null) {
  return {
    data,
    left,
    right,
  };
}
function merge(left, right) {
  const sortedArray = [];
  const length = left.length + right.length;
  for (let i = 0; i < length; i += 1) {
    if (left[0] < right[0] || left[0] === right[0]) {
      sortedArray[i] = left.shift();
    } else if (right[0] < left[0]) {
      sortedArray[i] = right.shift();
    } else if (left.length === 0) {
      sortedArray.push(...right);
      break;
    } else if (right.length === 0) {
      sortedArray.push(...left);
      break;
    }
  }
  return sortedArray;
}
function sort(array) {
  if (array.length === 1) return array;
  const mid = Math.floor(array.length / 2);
  const leftHalf = array.slice(0, mid);
  const rightHalf = array.slice(mid, array.length);
  const sortedLeft = sort(leftHalf);
  const sortedRight = sort(rightHalf);
  return merge(sortedLeft, sortedRight);
}

function removeDuplicates(array) {
  let current = 0;
  for (let i = 0; i < array.length; i += 1) {
    current = i + 1;
    if (array[current] === array[i]) {
      array.splice(current, 1);
    }
  }
  return array;
}

function buildTree(array, start, end) {
  if (start > end) return null;

  const mid = start + Math.floor((end - start) / 2);
  const root = Node(array[mid]);
  root.left = buildTree(array, start, mid - 1);
  root.right = buildTree(array, mid + 1, end);

  return root;
}

class Tree {
  constructor(arr) {
    this.array = arr;
    const sortedArray = removeDuplicates(sort(arr));
    this.root = buildTree(sortedArray, 0, sortedArray.length - 1);
  }

  static findLeaf(value, root) {
    if (root.left === null && root.right === null) {
      return root;
    }
    if (value < root.data || value === root.data) {
      return (value, root.left);
    }
    if (value > root.data) {
      return (value, root.right);
    }
    return null;
  }

  insert(value, root = this.root) {
    const leafNode = Tree.findLeaf(value, root);
    const valueNode = Node(value);
    if (value > leafNode.data) {
      leafNode.right = valueNode;
    } else {
      leafNode.left = valueNode;
    }
  }

  static findPrev(root, node) {
    if (root.left === node) {
      return root;
    }
    if (root.right === node) {
      return root;
    }
    if (node.data > root.data) {
      return Tree.findPrev(root.right, node);
    }
    if (node.data < root.data || node.data === root.data) {
      return Tree.findPrev(root.left, node);
    }
    return null;
  }

  static findItem(value, root) {
    if (root.data === value) {
      return root;
    }
    if (value < root.data) {
      return Tree.findItem(value, root.left);
    }
    if (value > root.data) {
      return Tree.findItem(value, root.right);
    }
    return null;
  }

  deleteItem(value, root = this.root) {
    const foundItem = Tree.findItem(value, root);
    const prevNode = Tree.findPrev(root, foundItem);
    // Only deletes leaf nodes
    if (foundItem.left === null && foundItem.right === null) {
      if (foundItem.data > prevNode.data) {
        prevNode.right = null;
      } else {
        prevNode.left = null;
      }
      // Delete nodes with only one child
    } else if (foundItem.left && !foundItem.right) {
      if (foundItem.data < prevNode.data || foundItem.data === prevNode.data) {
        prevNode.left = foundItem.left;
      } else if (foundItem.data > prevNode.data) {
        prevNode.right = foundItem.left;
      }
    } else if (!foundItem.left && foundItem.right) {
      if (foundItem.data < prevNode.data || foundItem.data === prevNode.data) {
        prevNode.left = foundItem.right;
      } else if (foundItem.data > prevNode.data) {
        prevNode.right = foundItem.right;
      }
    }
  }
}

const test2 = [1, 2, 3, 4, 6];
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const newTree = new Tree(test2);

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

prettyPrint(newTree.root);
newTree.insert(0);
newTree.deleteItem(2);
newTree.deleteItem(1);
prettyPrint(newTree.root);
