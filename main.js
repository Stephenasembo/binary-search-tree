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

function buildTree(array) {

}

class Tree {
  constructor(arr) {
    this.array = arr;
    this.root = null;
  }
}

const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
console.log(sort(testArr));
