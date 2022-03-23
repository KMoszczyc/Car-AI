class Utils {
    static linesIntersection(p0, p1, p2, p3) {
        let p4 = createVector(-100000, -100000);
        let s1_x, s1_y, s2_x, s2_y;
        s1_x = p1.x - p0.x;
        s1_y = p1.y - p0.y;
        s2_x = p3.x - p2.x;
        s2_y = p3.y - p2.y;

        let s, t;
        s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

        // Collision detected
        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            p4.x = p0.x + t * s1_x;
            p4.y = p0.y + t * s1_y;
        }
        return p4;
    }

    static drawNeuralNetwork(nn) {
        const neuron_size = 40;
        const max_neurons = max(nn.input_nodes, nn.hidden_nodes, nn.output_nodes);
        const start_y = 50;

        const layer_1_x = windowWidth / 2 - 200;
        const layer_2_x = windowWidth / 2;
        const layer_3_x = windowWidth / 2 + 200;

        // draw neurons
        const layer_1_ys = Utils.calculateYs(nn.input_nodes, max_neurons, neuron_size, start_y, layer_1_x);
        const layer_2_ys = Utils.calculateYs(nn.hidden_nodes, max_neurons, neuron_size, start_y, layer_2_x);
        const layer_3_ys = Utils.calculateYs(nn.output_nodes, max_neurons, neuron_size, start_y, layer_3_x);

        // lines
        Utils.drawWeights(nn.weights_ih, layer_1_x, layer_1_ys, layer_2_x, layer_2_ys);
        Utils.drawWeights(nn.weights_ho, layer_2_x, layer_2_ys, layer_3_x, layer_3_ys);

        Utils.drawNodes(layer_1_x, layer_1_ys, neuron_size, nn.inputs, false);
        Utils.drawNodes(layer_2_x, layer_2_ys, neuron_size, nn.hidden, false);
        Utils.drawNodes(layer_3_x, layer_3_ys, neuron_size, nn.outputs, true);

        Utils.drawLabels(
            layer_1_x,
            layer_1_ys,
            -30,
            ["left sensor", "middle-left sensor", "middle sensor", "middle-right sensor", "right sensor", "speed"],
            nn.inputs,
            false,
            RIGHT
        );
        Utils.drawLabels(layer_3_x, layer_3_ys, 30, ["left", "right", "gas", "brakes"], nn.outputs, true, LEFT);
    }

    static calculateYs(neurons_count, max_neurons, neuron_size, start_y, start_x) {
        const layer_ys = [];
        const offset_y = ((max_neurons - neurons_count) * neuron_size) / 2;

        for (let i = 0; i < neurons_count; i++) {
            // ellipse(start_x, i*40 + start_y + offset_y, neuron_size, neuron_size)
            layer_ys.push(offset_y + start_y + i * (neuron_size + 10));
        }
        return layer_ys;
    }

    static drawNodes(x, ys, neuron_size, values, highlightNeurons) {
        fill(0);
        strokeWeight(1);
        stroke(200);
        textAlign(CENTER, CENTER);
        for (let i = 0; i < ys.length; i++) {
            stroke(200);
            fill(0);
            strokeWeight(1);
            if (highlightNeurons && values[i] > 0.5) {
                stroke(0, 255, 0);
                strokeWeight(2);
            }

            ellipse(x, ys[i], neuron_size, neuron_size);

            stroke(0);
            if (highlightNeurons && values[i] > 0.5) fill(0, 255, 0);
            else fill(255);

            if (values.length > 0) text(values[i].toFixed(2).toString(), x, ys[i]);
        }
    }

    static drawLabels(x, ys, offsetX, labels, values, highlightText, textAlignment) {
        stroke(0);
        textAlign(textAlignment);
        for (let i = 0; i < ys.length; i++) {
            if (highlightText && values[i] > 0.5) fill(0, 255, 0);
            else fill(255);
            text(labels[i], x + offsetX, ys[i]);
        }
    }

    static drawWeights(weights, layer_1_x, layer_1_ys, layer_2_x, layer_2_ys) {
        for (let i = 0; i < weights.rows; i++) {
            for (let j = 0; j < weights.cols; j++) {
                if (weights.data[i][j] > 0) stroke(0, 255, 0);
                else stroke(255, 0, 0);
                strokeWeight(weights.data[i][j] * 5);
                line(layer_1_x, layer_1_ys[j], layer_2_x, layer_2_ys[i]);
            }
        }
    }

    static async loadJSON(path) {
        return new Promise((resolve, reject) => {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open("GET", path, true);
            xobj.onload = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    resolve(xobj.responseText);
                } else {
                    reject(xobj);
                }
            };
            xobj.send(null);
        });
    }
}
