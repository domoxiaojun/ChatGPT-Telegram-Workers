import app_iap from './app_iap';
import duckduckgo from './duckduckgo';
import google_buildin from './google_buildin';
import google_veo from './google_veo';
import image_gen from './image_gen';
import image_edit from './image_edit';
import xiaohongshu from './xiaohongshu';

export { default as tasks } from './scheduletask';

export default {
    duckduckgo,
    image_gen,
    image_edit,
    xiaohongshu,
    app_iap,
    google_veo,
    google_buildin,
};
