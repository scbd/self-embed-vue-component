
const cdnUrl = 'https://cdn.cbd.int'

const testWidgetMap = {
    cssDefaultUrl  : 'http://localhost:5000/style.css'                     ,
    importMapUrl   : 'http://localhost:5000/preview/widget/import-map.json',
    widgetMountUrl : 'http://localhost:5000/preview/widget/mount.js'       ,
    widgetUrl      : 'http://localhost:5000/preview/widget/index.js'
}

export const setPkg = (rawPackage, { buildWidgetTest, buildWidget, buildWidgetMount } ) => {
  const pkg = {}

  pkg.scopeLessName        = (rawPackage.name.replace(new RegExp('@|/', 'i'), '')).replace('/','-')
  pkg.pascalPkgName        = pascalCase(pkg.scopeLessName)
  pkg.pkgName              = paramCase(pkg.scopeLessName)
  pkg.buildWidgetTest      = buildWidgetTest
  pkg.buildWidget          = buildWidget
  pkg.buildWidgetMount     = buildWidgetMount

  for (const key in rawPackage)
    pkg[key] = rawPackage[key]

  return pkg
}

export function getEsShimsUrl(pkg){

  const { dependencies } = pkg
  const   version        = dependencies['es-module-shims'] || '1.4.4'

  return `https://cdn.jsdelivr.net/npm/es-module-shims@${version}/dist/es-module-shims.js`
}


export const getCssUrl = (pkg) => {
  const { name, buildWidgetTest, version } = pkg

  if(buildWidgetTest) return testWidgetMap['cssDefaultUrl']

  return `${cdnUrl}/${name}@${version || 'latest'}/dist/style.css`
}

export const getWidgetMountUrl = (pkg) => {
  const { name, buildWidgetTest, version } = pkg

  if(buildWidgetTest) return testWidgetMap['widgetMountUrl']

  return `${cdnUrl}/${name}@${version || 'latest'}/dist/widget/mount.js`
}

export const getWidgetElementId = (pkg) => {
  const { pkgName } = pkg

  return `widget-${pkgName}`
}

export const getImportMapUrl = (pkg) => {
  const { name, buildWidgetTest, version } = pkg

  if(buildWidgetTest) return testWidgetMap['importMapUrl']

  return `${cdnUrl}/${name}@${version || 'latest'}/dist/import-map.json`
}


export function camelCase(string) {
  return string.toLowerCase().trim().split(/[.\-_\s]/g).reduce((string, word) => string + word[0].toUpperCase() + word.slice(1));
}

export function pascalCase(string) {
  const cameledString = camelCase(string)

  return `${cameledString[0].toLowerCase()}${cameledString.substring(1)}`
}

function paramCase(str, sep = '-') {
  return str
    .replace(/[A-Z]/g, (letter, index) => {
      const lcLet = letter.toLowerCase();
      return index ? sep + lcLet : lcLet;
    })
    .replace(/([-_ ]){1,}/g, sep)
}