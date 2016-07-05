var composeFn = require('./utils/composeFn');
var rand = require('./utils/rand');
var shuffle = require('./utils/shuffle');
var sortDblArray = require('./utils/sortDblArray');

var SEARCH_VALUE = 987;
var INFINI = 999999999999;

function make_chromosome() {
  var value = '';

  for (var i = 0; i < 48; i++) {
    value += Math.round(Math.random()).toString();
  }

  return [null, value];
}

function make_population() {
  var population = [];

  for (var i = 0; i < 100; i++) {
    population.push(make_chromosome());
  }

  return population;
}

function chromosome_to_gene(chromosome) {
  return chromosome.match(/.{4}/g);
}

function gene_to_operand(gene) {
  switch(gene) {
    case "0000": return 0;
    case "0001": return 1;
    case "0010": return 2;
    case "0011": return 3;
    case "0100": return 4;
    case "0101": return 5;
    case "0110": return 6;
    case "0111": return 7;
    case "1000": return 8;
    case "1001": return 9;
    case "1010": return "+";
    case "1011": return "-";
    case "1100": return "/";
    case "1101": return "%";
  }
}

function genes_to_formula(genes) {
  var formula = [];

  genes.forEach(function(gene) {
    formula.push(gene_to_operand(gene));
  });

  return formula.join('');
}

function evaluation(genes) {
  var formula = genes_to_formula(genes);
  var result = null;

  try {
    result = Math.abs(SEARCH_VALUE - eval(formula));
  } catch (e) {
    result = INFINI;
  }

  return (result === parseInt(result, 10)) ? result : INFINI;
}

function score_population(population) {
  return population.map(function(individual) {
    var genes = chromosome_to_gene(individual[1]);
    individual[0] = evaluation(genes);
    return individual;
  });
}

function selection(population) {
  return population.slice(0, 80);
}

function crossover(parent1, parent2) {
  var point = rand(1, 47);
  var child1 = [null, parent1[1].slice(0, point) + parent2[1].slice(point, parent2[1].length)];
  var child2 = [null, parent2[1].slice(0, point) + parent1[1].slice(point, parent1[1].length)];

  return [child1, child2];
}

function next_generation(selection) {
  var population = [];

  for (var i = 0; i < 40; i++) {
    var parents = selection.slice(0, 2);
    var parent1 = parents[0];
    var parent2 = parents[1];
    var childs = crossover(parent1, parent2);

    [childs[0], childs[1]].forEach(function(child) {
      population.push(child);
    });

    selection.splice(0, 2);
  }

  for (var y = 0; y < 20; y++) {
    population.push(make_chromosome());
  }

  return population;
}

function mutate(chromosome) {
  var bit = rand(0, 48);
  var value = chromosome[chromosome.length - 1];

  value[bit] = (value[bit] == '0') ? '1' : '0';
  return value;
}

function mutation (population) {
  return population.map(function(individual) {
    if (rand(0, 1000) == 0) {
      individual[1] = individual[1];
    }
    return individual;
  });
}

var population = make_population();

for(var n = 0; n < 10000; n++) {
  population = score_population(population);
  population = population.sort(sortDblArray);
  var best = population[0][0];
  console.log('Generation: ' + n + ' Best: ' + best);

  if (best == 0) {
    var genes = chromosome_to_gene(population[0][1]);
    console.log('Formula: ' + genes_to_formula(genes));
    break;
  }

  population = composeFn([
    selection,
    shuffle,
    next_generation,
    mutation
  ], population);
}
