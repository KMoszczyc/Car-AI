function sigmoid(x) {
  return 1/(1 + Math.exp(-x));
}
function dsigmoid(y){
  //return sigmoid(x)*(1 - sigmoid(x));
  return y * (1-y);
}


class NeuralNetwork {
  constructor (input,hidden,output) {
    if (input instanceof NeuralNetwork) {
      let a = input;
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    }
    else {
    this.input_nodes=input;
    this.hidden_nodes=hidden;
    this.output_nodes=output

    this.weights_ih = new Matrix(this.hidden_nodes,this.input_nodes)
    this.weights_ho = new Matrix(this.output_nodes,this.hidden_nodes)
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes,1)
    this.bias_o = new Matrix(this.output_nodes,1)
    this.bias_h.randomize();
    this.bias_o.randomize();
  }
    this.lr=0.1;

  }

  feedforward(input_array) {
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih,inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.weights_ho,hidden);
    output.add(this.bias_o);
    output.map(sigmoid);

    return output.toArray();
  }
  train(input_array,target_array) {
    //feedforward
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih,inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    let outputs = Matrix.multiply(this.weights_ho,hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid)

    let targets = Matrix.fromArray(target_array);

    //output errors
    let output_errors = Matrix.subtract(targets,outputs);
  //  output_errors.print()
    //gradients
    let gradients =  Matrix.map(outputs,dsigmoid);
  //  gradients.print()
    gradients.multiply(output_errors);
  //  gradients.print()
    gradients.multiply(this.lr);
  //  gradients.print()

    //weights deltas ho
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients,hidden_T)

    this.weights_ho.add(weight_ho_deltas);
    this.bias_o.add(gradients);

    //hiden layers errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t,output_errors);

    //hidden gradient
    let hidden_gradient = Matrix.map(hidden,dsigmoid);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.lr);

    //weight deltas ih
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient,inputs_T);

    this.weights_ih.add(weight_ih_deltas);
    this.bias_h.add(hidden_gradient);

  }
mutate(rate,bound) {
    function mutate(val) {
      if(random(1)<rate) {
        return val+randomGaussian()*bound;
      }
      else {
        return val;
      }
    }

  this.weights_ih.map(mutate);
  this.weights_ho.map(mutate);
  this.bias_h.map(mutate);
  this.bias_o.map(mutate);

}
copy() {
  return new NeuralNetwork(this);
}
serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }
}
