function Node(data, left = null, right = null) {
  return {
    data,
    left,
    right,
  }
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
    this.root = null;
  }
}

const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const test2 = [3, 4, 5];
console.log(buildTree(test2, 0, test2.length - 1));
