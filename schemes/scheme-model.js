const db = require('../data/db-config');

module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove,
  addStep,
};

/**
 * Resolves to an array of all schemes in the database
 */
function find() {
  return db('schemes');
}

/**
 * Resolves to a single scheme object
 * Invalid id resolves to null
 * 
 * @param id - scheme id
 */
async function findById(id) {
  const scheme = await db('schemes').where('id', id);
  if (scheme.length) {
    return scheme;
  } else {
    return null;
  }
}
/**
 * Resolves to an array of all correctly ordered step for the given scheme
 * The array should include the scheme_name not scheme_id
 * 
 * @param id - scheme id
 */
function findSteps(id) {
  return db('steps')
    .select('steps.id', 'steps.step_number', 'steps.instructions', 'schemes.scheme_name')
    .join('schemes', 'steps.scheme_id', 'schemes.id')
    .where('steps.scheme_id', id)
    .orderBy('steps.step_number');
}

/**
 * Inserts scheme into database
 * Resolves to the newly inserted scheme
 * 
 * @param scheme 
 */
async function add(scheme) {
  const [id] = await db('schemes').insert(scheme, 'id');
  return findById(id);
}

/**
 * Resolves to the newly updated scheme object
 * 
 * @param changes - scheme changes object
 * @param id - scheme id
 */
async function update(changes, id) {
  await db('schemes').update(changes).where('id', id);
  return findById(id);
}

/**
 * Resolves to the removed scheme
 * Invalid id resolves to null
 * 
 * @param id - scheme id
 */
async function remove(id) {
  const scheme = await findById(id);
  await db('schemes').del().where('id', id);
  return scheme;
}

/**
 * Inserts the new step, linking to scheme
 * 
 * @param step 
 */
async function addStep(step) {
  const [id] = await db('steps').insert(step, 'id');
  console.log(id);
  return db('steps').where('id', id);
}
