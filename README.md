# Self Embedding Component

To use this library in order to create a self embedding Vue3 component, 2 files must be in the root of your src directory.  The library when in use assumes the target component is already published to a cdn based on it's package name.  Or the SCBD dev cdn.

This library is dependant on 
[js import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) in conjunction with [es-module-shims](https://www.npmjs.com/package/es-module-shims).   [es-module-shims](https://www.npmjs.com/package/es-module-shims) polyfills for old browsers and add the additional functionality of multiple external [js import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) per page.

You must build the widget and widget-mount separately. [@scbd/dist-builder](https://www.npmjs.com/package/@scbd/dist-builder) will automagically build the component and widget required files.

# widget.js

Is the entry point for building the widget.  

```

import WidgetBuilder from 'https://cdn.cbd.int/@scbd/self-embedding-component@3.1.0'// jsdeliver not working ?
import Package       from '../package.json'

// load external css for dependant components
const css = []

// ugly but required for context
const callingImportMetaUrl = import.meta.url

/*** DEV RELEASE */
const cdnUrl = 'https://scbd-components.s3.amazonaws.com'; // only required for releasing to dev

new WidgetBuilder({ Package, css, callingImportMetaUrl }, { cdnUrl }) 
/*** DEV RELEASE */

/*** PROD RELEASE */
//new WidgetBuilder({ Package, css, callingImportMetaUrl }) 
/*** PROD RELEASE */


```

# widget-mount.js

Required for context and global vue app uses's.

```

import            { createApp   } from 'vue-demi';
import            { createI18n  } from 'vue-i18n';
import            { createPinia } from 'pinia';
import component, { i18n: componentSourceI18nTranslations } from '@scbd/idb-views';

const { rootProps } = window?.chm?.scbdIdbViews || {};  // required to pass options from single line script tag, only one per page need to fix to use the mountId below as reference
const { search    } = new URL(import.meta.url);         // required to get current context, I hate this no other way
const   mountId     = search.replace("?", "#");         // extract unique mount id from self context url.  It will default to the package name, however, if needed you can add a search param key onto widget entry url ?some-unique which will turn into #package-name or #package-name-some-unique

createApp(component, rootProps)
.use(createI18n(componentSourceI18nTranslations))         //area for app's global use of some libraries if needed.
.use(createPinia())
.mount(mountId)


```

# After Building Hack
after build need to replace json5 ref  in dist/index.min.js with  //https://cdn.jsdelivr.net/npm/json5@2.2.0/dist/index.min.mjs