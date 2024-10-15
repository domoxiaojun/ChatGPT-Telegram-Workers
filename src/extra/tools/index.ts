import { jina_reader } from './external/jina';
import { duckduckgo_search } from './internal/duckduckgo';

export { default as tasks } from './scheduletask';
export default { duckduckgo_search, jina_reader };
