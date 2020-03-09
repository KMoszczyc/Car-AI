
class Matrix {
  constructor(rows,cols) {
  this.rows=rows;
  this.cols=cols;
  this.data=[];

  for(let i=0;i<this.rows;i++) {
    this.data[i]=[];
    for(let j=0;j<this.cols;j++) {
      this.data[i][j]=0;
    }
  }
}

static fromArray(arr) {
  let m=new Matrix(arr.length,1);
  for(let i=0;i<arr.length;i++) {
    m.data[i][0]=arr[i];
  }
  return m;
}
toArray() {
  let arr=[];
  for(let i=0;i<this.rows;i++) {
    for(let j=0;j<this.cols;j++) {
      arr.push(this.data[i][j]);
    }
  }
  return arr;
}


randomize() {
  for(let i=0;i<this.rows;i++) {
    for(let j=0;j<this.cols;j++) {
      this.data[i][j]=Math.random()*2-1;
    }
  }
}
copy() {
  let m = new Matrix(this.rows, this.cols);
  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.cols; j++) {
      m.data[i][j] = this.data[i][j];
    }
  }
  return m;
}

static multiply(a,b) {
  if(a instanceof Matrix && b instanceof Matrix) {
    if(a.cols!=b.rows) {
      console.log('colums dont match the rows!')
      return undefined;
    }
    let result = new Matrix(a.rows,b.cols)
    for(let i=0;i<result.rows;i++) {
      for(let j=0;j<result.cols;j++) {
        let sum=0;
        for(let k=0;k<a.cols;k++) {
          sum +=a.data[i][k]*b.data[k][j];
        }
        result.data[i][j]=sum;
      }
    }
    return result;
  }
}

multiply(b) {
  if(this instanceof Matrix && b instanceof Matrix) {
    for(let i=0;i<this.rows;i++) {
      for(let j=0;j<b.cols;j++) {
        let sum=0;
        for(let k=0;k<this.cols;k++) {
          sum +=this.data[i][k]*b.data[k][j];
        }
        this.data[i][j]=sum;
      }
    }
  }
  else {
    for(let i=0;i<this.rows;i++) {
      for(let j=0;j<this.cols;j++) {
    this.data[i][j]*=b;
  }
}
}}

add(n) {
  for(let i=0;i<this.rows;i++) {
    for(let j=0;j<this.cols;j++) {
      if(n instanceof Matrix) this.data[i][j]+=n.data[i][j];
      else this.data[i][j]+=n;
    }
  }
}

 static subtract(a,b) {
   let result = new Matrix(a.rows,a.cols)
  for(let i=0;i<a.rows;i++) {
    for(let j=0;j<a.cols;j++) {
       result.data[i][j]=a.data[i][j]-b.data[i][j];
    }
  }
  return result;
}


static transpose(a) {
  let b = new Matrix(a.cols,a.rows)
  for(let i=0;i<a.rows;i++) {
    for(let j=0;j<a.cols;j++) {
      b.data[j][i]=a.data[i][j]
    }
  }
return b;
}

static map(a,func) {
  let result = new Matrix(a.rows,a.cols)
  for(let i=0;i<a.rows;i++) {
    for(let j=0;j<a.cols;j++) {
      let val = a.data[i][j];
    result.data[i][j]=func(val)
    }
  }
  return result
}
map(func) {
  for(let i=0;i<this.rows;i++) {
    for(let j=0;j<this.cols;j++) {
      let val = this.data[i][j];
    this.data[i][j]=func(val);
    }
  }
}
setElement(elem,row,col) {
  this.data[row][col]=elem;
}
print() {
  console.table(this.data)
}
serialize() {
   return JSON.stringify(this);
 }

 static deserialize(data) {
   if (typeof data == 'string') {
     data = JSON.parse(data);
   }
   let matrix = new Matrix(data.rows, data.cols);
   matrix.data = data.data;
   return matrix;
 }
}
