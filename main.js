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
    this.queue = [];
  }

  static findLeaf(value, root) {
    if (root.left === null && root.right === null) {
      return root;
    }
    if (!root.left) {
      if (value === root.data) {
        return root;
      }
      if (value < root.data) {
        return root;
      }
      return Tree.findLeaf(value, root.right);
    }
    if (!root.right) {
      if (value > root.data) {
        return root;
      }
    }
    if (value < root.data || value === root.data) {
      return Tree.findLeaf(value, root.left);
    }
    if (value > root.data) {
      return Tree.findLeaf(value, root.right);
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
    if (root.data === node.data) {
      return root;
    }
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
    if (root === null) {
      return null;
    }
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
        return foundItem;
      }
      if (foundItem.data < prevNode.data
        || foundItem.data === prevNode.data) {
        prevNode.left = null;
        return foundItem;
      }
      // Delete nodes with only one child
    } else if (foundItem.left && !foundItem.right) {
      if (foundItem.data < prevNode.data || foundItem.data === prevNode.data) {
        prevNode.left = foundItem.left;
        return foundItem;
      }
      if (foundItem.data > prevNode.data) {
        prevNode.right = foundItem.left;
        return foundItem;
      }
    } else if (!foundItem.left && foundItem.right) {
      if (foundItem.data < prevNode.data || foundItem.data === prevNode.data) {
        prevNode.left = foundItem.right;
        return foundItem;
      }
      if (foundItem.data > prevNode.data) {
        prevNode.right = foundItem.right;
        return foundItem;
      }
      // Delete nodes with left and right child
    } else if (foundItem.left && foundItem.right) {
      const successor = Tree.getSuccessor(foundItem);
      // The successor replaces the deleted node
      this.deleteItem(successor.data);
      foundItem.data = successor.data;
    }
    return null;
  }

  static getSuccessor(root) {
    let node = root;
    node = node.right;
    while (node !== null && node.left !== null) {
      node = node.left;
    }
    return node;
  }

  find(value, root = this.root) {
    return Tree.findItem(value, root);
  }

  levelOrder(callback) {
    if (callback === undefined) {
      throw new Error('Please pass in a callback function');
    }
    const rootNode = this.root;
    function levelOrderRec(root = rootNode, queue = [root], arr = []) {
      if (root === null) {
        return arr;
      }
      if (queue.length === 0) {
        return arr;
      }
      if (root.left !== null) {
        queue.push(root.left);
      }
      if (root.right !== null) {
        queue.push(root.right);
      }
      const front = queue.shift();
      callback(front);
      return levelOrderRec(queue[0], queue, arr);
    }
    levelOrderRec();
  }

  levelOrderIterative(root = this.root) {
    if (root === null) return;
    this.queue.push(root);
    while (this.queue.length !== 0) {
      const front = this.queue.shift();
      console.log(front.data);
      if (front.left !== null) {
        this.queue.push(front.left);
      }
      if (front.right !== null) {
        this.queue.push(front.right);
      }
    }
  }

  // Depth first traversal
  preOrder(callback, node = this.root) {
    if (node === null) {
      return;
    }
    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  inOrder(callback, node = this.root) {
    if (node === null) {
      return;
    }
    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  postOrder(callback, node = this.root) {
    if (node === null) {
      return;
    }
    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  static findHeightUtil(node) {
    if (node === null) {
      return -1;
    }
    const leftHeight = Tree.findHeightUtil(node.left);
    const rightHeight = Tree.findHeightUtil(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  height(val) {
    const node = this.find(val);
    if (node === null) {
      return null;
    }
    const nodeHeight = Tree.findHeightUtil(node);
    return nodeHeight;
  }

  depth(val) {
    const nodeHeight = this.height(val);
    const treeHeight = this.height(this.root.data);

    return treeHeight - nodeHeight;
  }

  isBalanced(root = this.root) {
    const leftTree = Tree.findHeightUtil(root.left);
    const rightTree = Tree.findHeightUtil(root.right);

    if (leftTree - rightTree > 1 || leftTree - rightTree < -1) {
      return false;
    }

    return true;
  }

  rebalance() {
    const treeArray = [];
    function retrieveNodes(node) {
      treeArray.push(node.data);
    }
    this.inOrder(retrieveNodes, this.root);
    this.root = buildTree(treeArray, 0, treeArray.length - 1);
  }
}

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

// Driver script
function createArray() {
  const randomArr = [];
  for (let i = 0; i < 100; i += 1) {
    randomArr[i] = Math.floor(Math.random() * 100);
  }
  return randomArr;
}

function callbackFn(node) {
  console.log(node.data);
}

const randomArr = createArray();
const newTree = new Tree(randomArr);
prettyPrint(newTree.root);
// newTree.levelOrder(callbackFn);
// newTree.preOrder(callbackFn);
// newTree.inOrder(callbackFn);
// newTree.postOrder(callbackFn);

function unBalanceTree(tree) {
  for (let i = 0; i < 150; i += 1) {
    tree.insert(i);
  }
}

unBalanceTree(newTree);
console.log(newTree.isBalanced());
newTree.rebalance();
console.log(newTree.isBalanced());
newTree.levelOrder(callbackFn);
newTree.preOrder(callbackFn);
newTree.inOrder(callbackFn);
newTree.postOrder(callbackFn);
