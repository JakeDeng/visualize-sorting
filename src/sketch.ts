import * as p5 from "p5";

let i = 0;
let w = 8;
let values = null;
//state array to indicate color
//0: nothing
//1: pivot Index
//2: sorting range
let states = [];

export const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, 400);
        p.background(50);
        values = new Array(Math.floor(p.width / w));
        for(let i =0; i < values.length; i++){
            values[i] = p.random(p.height);
        }
        drawArray(values, w, p.height);
        quickSort(values);
        
    }

    p.draw = () => {
      p.background(50);
      drawArray(values, w, p.height);
    }

    //util function to draw array
    function drawArray(arr, width, maxHeight){
      for(let i = 0; i < arr.length; i++){
        p.noStroke();
        //use state to decide color
        if(states[i] == 1){
          //pivot index
          p.fill(255,0,0);
        }else if(states[i] == 2){
          //sorting range index
          p.fill(0,255,0);
        }else{
          p.fill(255);
        }
        p.rect(i*width, maxHeight - arr[i], width, arr[i]);
      }
    }
}

export const myp5 = new p5(sketch, document.body);

//quick sort related functions

async function quickSort(arr, left = 0, right = arr.length-1){
  //base case: array is sorted when it has 0 or 1 element
  //console.log(`quick sort called with left ${left} and right ${right} index`);
  if(left < right){
      //call pivot
      let pivotIndex = await pivot(arr, left, right);
      states[pivotIndex] = 0;
      //call qucik sort on the left partition and right partition
      //both partitions can sort at the same time
      await Promise.all([
        quickSort(arr, left , pivotIndex-1),
        quickSort(arr, pivotIndex+1, right)
      ]);
  }
  return arr;
}

//designate an element as the pivot 
//rearranage elements in the array according to the pivot
//in-place function, return the index
//how to choose a pivot : first, last, or middle, median, random
//it is roughly the median value of the data set
async function pivot(arr, start = 0, end = arr.length-1){

  for(let i = start; i < end; i++){
    states[i] = 2;
  }

  let swapIndex = start;
  let pivot = arr[swapIndex];
  states[swapIndex] = 1;

  for(let i = start+1; i <= end; i++){
      if(pivot > arr[i]){
          //swap and increase index
          states[swapIndex] = 0;
          swapIndex++;
          states[swapIndex] = 1;
          await swap(arr, swapIndex, i);
          
      }
  }
  //swap pivot
  await swap(arr, start, swapIndex);

  for(let i = start; i < end; i++){
    if(i != swapIndex){
      states[i] = 0;
    }
  }
  return swapIndex;
}

//in-place swap
async function swap(arr, index1, index2){
  //checking index range
  if(index1 > arr.length || index2 > arr.length ){
      return;
  }
  //the main reason to async quick sort is to
  //put a sleep in swap function
  await sleep(10);
  var temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}

function sleep(ms){
  //in each sleep function, a new macrotask setTimeout 
  //will be queued up for the next render (draw function)
  return new Promise(resolve => setTimeout(resolve, ms));
}