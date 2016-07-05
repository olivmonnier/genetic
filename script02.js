var rand = require('./utils/rand');
var replaceAt = require('./utils/replaceAt');

var SEARCH_VALUE = 'Mon royaume pour un cheval';

function make_chromosome(genes) {
  var value = '';
  var length = SEARCH_VALUE.length;

  for (var i = 0; i < length; i++) {
    value += random_gene(genes);
  }

  return [null, value];
}

function random_gene(genes) {
  return genes[rand(0, genes.length)];
}

function make_population(genes, size) {
  var population = [];

  for (var i = 0; i < size; i++) {
    population.push(make_chromosome(genes));
  }

  return population;
}

function score_population(population, size) {
  population = evaluate_population(population);
  return normalize_population_score(population, size);
}

function evaluate_population(population) {
  return population.map(function(individual) {
    return [evaluate(individual[1]), individual[1]];
  });
}

function evaluate(phrase) {
  var score = 0;

  phrase.split('').forEach(function(character, index) {
    if (SEARCH_VALUE[index] == character) score += 1;
  });

  return score;
}

function normalize_population_score(population, size) {
  var total = population.reduce(function(sum, val) {
    return sum + val[0];
  }, 0);

  return population.map(function(individual) {
    return [individual[0] / total * size, individual[1]];
  });
}

function next_generation(population, size, genes, rate) {
  var mating_pool = create_mating_pool(population);
  var pool_length = mating_pool.length;
  var newPopulation = [];

  for (var i = 0; i < size; i++) {
    var parent1 = mating_pool[rand(0, pool_length - 1)];
    var parent2 = mating_pool[rand(0, pool_length - 1)];

    newPopulation.push(crossover(parent1, parent2, genes, rate));
  }
  return newPopulation;
}

function create_mating_pool(population) {
  var mating_pool = [];

  population.forEach(function(individual) {
    var integer_part = individual[0];
    var fractional_part = individual[0] - integer_part;
    for (var i = 0; i < integer_part; i++) {
      mating_pool.push(individual);
    }
    if (rand(0, 100) / 100 < fractional_part) mating_pool.push(individual);
  });

  return mating_pool;
}

function crossover(parent1, parent2, genes, rate) {
  var point = rand(1, SEARCH_VALUE.length - 1);
  var child = parent2[1].slice(0, point) + parent1[1].slice(point, parent2[1].length);

  return [null, mutate(child, genes, rate)];
}

function mutate(phrase, genes, rate) {
  for (var i = 0; i < SEARCH_VALUE.length; i++) {
    if (rand(0, 100) / 100 < rate) {
      phrase = replaceAt(phrase, i, random_gene(genes));
    }
  }

  return phrase;
}

function solution_found(population) {
  var found = false;

  population.forEach(function(individual) {
    if (individual[1] == SEARCH_VALUE) found = true;
  });

  return found;
}

var genes = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
var population_size = 100;
var mutation_rate = 0.01;
var population = make_population(genes, population_size);

for (var n = 0; n < 1000; n++) {
  population = score_population(population, population_size);
  console.log('Generation: ' + n);
  population.forEach(function(individual) {
    console.log(individual);
  });
  if (solution_found(population)) break;
  population = next_generation(population, population_size, genes, mutation_rate);
}
