var rand = require('./utils/rand');
var replaceAt = require('./utils/replaceAt');

var SEARCH_VALUE = 'Mon royaume pour un cheval';

/**
 * Create a new chromosome
 * @function make_chromosome
 * @param {String} genes
 * @return {Array}
 */
function make_chromosome(genes) {
  var value = '';
  var length = SEARCH_VALUE.length;

  for (var i = 0; i < length; i++) {
    value += random_gene(genes);
  }

  return [null, value];
}

/**
 * Get a random gene
 * @function random_gene
 * @param {String} genes
 * @return {String}
 */
function random_gene(genes) {
  return genes[rand(0, genes.length)];
}

/**
 * Generate a population
 * @function make_population
 * @param {String} genes
 * @param {Integer} size
 * @return {Array}
 */
function make_population(genes, size) {
  var population = [];

  for (var i = 0; i < size; i++) {
    population.push(make_chromosome(genes));
  }

  return population;
}

/**
 * Determine the score by chromosome
 * @function score_population
 * @param {Array} population
 * @param {Integer} size
 * @return {Array}
 */
function score_population(population, size) {
  population = evaluate_population(population);
  return normalize_population_score(population, size);
}

/**
 * Evaluate each chromosome in the population
 * @function evaluate_population
 * @param {Array} population
 * @return {Array}
 */
function evaluate_population(population) {
  return population.map(function(individual) {
    return [evaluate(individual[1]), individual[1]];
  });
}

/**
 * Evaluate a chromosome
 * @function evaluate
 * @param {String} phrase
 * @return {Integer}
 */
function evaluate(phrase) {
  var score = 0;

  phrase.split('').forEach(function(character, index) {
    if (SEARCH_VALUE[index] == character) score += 1;
  });

  return score;
}

/**
 * Normalize in percent the score
 * @function normalize_population_score
 * @param {Array} population
 * @param {Integer} size
 * @return {Array}
 */
function normalize_population_score(population, size) {
  var total = population.reduce(function(sum, val) {
    return sum + val[0];
  }, 0);

  return population.map(function(individual) {
    return [individual[0] / total * size, individual[1]];
  });
}

/**
 * Create a new population
 * @function next_generation
 * @param {Array} population
 * @param {Integer} size
 * @param {String} genes
 * @param {Integer} rate
 * @return {Array}
 */
function next_generation(population, size, genes, rate) {
  var mating_pool = create_mating_pool(population);
  var pool_length = mating_pool.length - 1;
  var newPopulation = [];

  for (var i = 0; i < size; i++) {
    var parent1 = mating_pool[rand(0, pool_length)];
    var parent2 = mating_pool[rand(0, pool_length)];

    newPopulation.push(crossover(parent1, parent2, genes, rate));
  }
  return newPopulation;
}

/**
 * Multiplicate each chromosomes by their scores
 * @function create_mating_pool
 * @param {Array} population
 * @return {Array}
 */
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

/**
 * Crossover two chromosomes
 * @function crossover
 * @param {Array} parent1
 * @param {Array} parent2
 * @param {String} genes
 * @param {Integer} rate
 * @return {Array}
 */
function crossover(parent1, parent2, genes, rate) {
  var point = rand(1, SEARCH_VALUE.length);
  var child = parent2[1].slice(0, point) + parent1[1].slice(point, parent2[1].length);

  return [null, mutate(child, genes, rate)];
}

/**
 * Mutate one character into a chromosome
 * @function mutate
 * @param {String} phrase
 * @param {String} genes
 * @param {Integer} rate
 * @return {String}
 */
function mutate(phrase, genes, rate) {
  for (var i = 0; i < SEARCH_VALUE.length; i++) {
    if (rand(0, 100) / 100 < rate) {
      phrase = replaceAt(phrase, i, random_gene(genes));
    }
  }

  return phrase;
}

/**
 * Test if it the solution
 * @function solution_found
 * @param {Array} population
 * @return {Binary}
 */
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
