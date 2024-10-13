import { duckduckgo_search } from './internal/duckduckgo.js';
import { jina_reader } from './external/jina.js';

export { default as tasks } from './scheduleTask.js';
export default { duckduckgo_search, jina_reader };
