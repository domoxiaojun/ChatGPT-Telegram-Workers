import app_iap from './app_iap';
import browser from './browser';
import delegate from './delegate';
import duckduckgo from './duckduckgo';
import google_buildin from './google_buildin';
import google_lyria from './google_lyria';
import google_veo from './google_veo';
import image_gen from './image_gen';
import xai_video from './xai_video';
import xiaohongshu from './xiaohongshu';

export { default as tasks } from './scheduletask';

export default {
    duckduckgo,
    image_gen,
    xiaohongshu,
    app_iap,
    google_veo,
    google_lyria,
    google_buildin,
    xai_video,
    delegate,
    browser_navigate: browser.navigate,
    browser_screenshot: browser.screenshot,
};
