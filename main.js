function Node(data, left = null, right = null) {
  return {
    data,
    left,
    right,
  }
}

class Tree {
  constructor(arr) {
    this.array = arr;
    this.root = null;
  }
}