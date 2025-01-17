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
      throw new Error('Please pass in a callback function')
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
}

const test = [4, 2, 6, 1, 3, 5, 7];
const test2 = [1, 2, 3, 4, 6];
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const newTree = new Tree(test);

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

function callbackFn(node) {
  console.log(`This node's value is: ${node.data}`);
}

// newTree.insert(2);
// newTree.insert(4);
// newTree.insert(7);
// newTree.insert(0);
// newTree.insert(5);
prettyPrint(newTree.root);
console.log('preorder traversal');
newTree.preOrder(callbackFn);
console.log('inorder traversal');
newTree.inOrder(callbackFn);
console.log('postorder traversal');
newTree.postOrder(callbackFn);
